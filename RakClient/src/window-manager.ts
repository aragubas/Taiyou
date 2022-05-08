import { stringify } from "querystring";
import { v4 } from "uuid";
import { ComponentPublicInstance, ref, Ref } from "vue";
import { GlobalMenuInstance, GlobalMenuItem } from "./global-menu";
export let focusedWindow = ref("");

export class WindowInstance {
  id: string = "";
  title: string = "";
  componentPath: string = "";
  minimized: boolean = false;
  resizable: boolean = true;
  closeable: boolean = true;
  arguments: any[] = [];
  width: number = 400;
  height: number = 320;
  minWidth: number = 200;
  minHeight: number = 150;
  left: number = 0;
  top: number = 0;
  globalMenu: GlobalMenuInstance | undefined = undefined;
  onClose: () => void | undefined = () => {};
  onMinimize: () => void | undefined = () => {};
  onRestore: () => void | undefined = () => {};

  minimize() {
    this.minimized = true;
    this.onMinimize();
    focusedWindow.value = "";
  }

  restore() {
    this.minimized = false;
    focusWindow(this.id);
    this.onRestore();
  }

  toggleMinimize() {
    if (!this.minimized) {
      this.minimize();

    } else {
      this.restore();

    }
  }
}

interface WindowFactoryProperties {
  /** Path of component (inside window folder) */
  componentPath: string;

  /** Initial title of window (may be changed by window modal) */
  title?: string;

  /** Enables/Disable resize handle */
  resizable?: boolean;
  
  /** Enables/Disable close button */
  closeable?: boolean;
  
  /** Initial width of the window (may be changed by window modal) */
  width?: number;
  
  /** Initial height of the window (may be changed by window modal) */
  height?: number;
  
  /** Initial minimum width of the window (may be changed by window modal) */
  minWidth?: number;
  
  /** Initial minimum height of the window (may be changed by window modal) */
  minHeight?: number;
  
  /** Optional arguments (accessible via getInstance().arguments) */
  arguments?: any[];
  
  /** Event when closing the window */
  onClose?: () => void;
  
  /** Event when minimizing the window */
  onMinimize?: () => void;
  
  /** Event when restoring the window */
  onRestore?: () => void;
}

let WindowInstances: Ref<Array<WindowInstance>> = ref(Array<WindowInstance>());

export function getInstance(id: string): WindowInstance {
  return WindowInstances.value.find((window) => window.id === id)!;
}

export function createWindow(properties: WindowFactoryProperties): string {
  let newWindow: WindowInstance = new WindowInstance();
  let newWindowId = v4();
  newWindow.id = newWindowId;

  if (properties.title)
  {
    newWindow.title = properties.title;
  }

  if (properties.onClose) {
    newWindow.onClose = properties.onClose;
  }

  if (properties.onMinimize) {
    newWindow.onMinimize = properties.onMinimize;
  }

  if (properties.onRestore) {
    newWindow.onRestore = properties.onRestore;
  }

  if (properties.width) {
    newWindow.width = properties.width;
  }

  if (properties.height) {
    newWindow.height = properties.height;
  }

  if (properties.resizable != undefined) {
    newWindow.resizable = properties.resizable;
  }

  if (properties.closeable != undefined) {
    newWindow.closeable = properties.closeable;
  }

  if (properties.arguments != undefined)
  {
    newWindow.arguments = properties.arguments;
  }

  newWindow.componentPath = `./Window/${properties.componentPath}`;

  // Create global menu instance
  newWindow.globalMenu = new GlobalMenuInstance(newWindowId);

  WindowInstances.value.push(newWindow);

  // Focus newly created window
  focusWindow(newWindowId);

  return newWindowId;
}

export function destroyWindow(id: string) {
  let windowToDestroy = WindowInstances.value.find((window) => window.id === id);
  if (windowToDestroy) {
    windowToDestroy.onClose();
    WindowInstances.value.splice(WindowInstances.value.indexOf(windowToDestroy), 1);
  }
}

export function CloseAllWindows()
{
  WindowInstances.value.forEach((window) => {
    destroyWindow(window.id)
  })
}

export function focusWindow(id: string, unminimize: boolean = false) {
  if (id == "") { focusedWindow.value = ""; }
  if (id === focusedWindow.value) { return; }
  // Move item with id to start of array
  const index = WindowInstances.value.findIndex((item) => item.id === id);
  const instance = WindowInstances.value.find((item) => item.id === id);

  if (!instance) {
    console.error("Cannot focus in inexistent window");
    return;
  }
  if (unminimize) {
    instance.minimized = false;
  }

  WindowInstances.value.splice(index, 1);
  WindowInstances.value.push(instance);
  focusedWindow.value = id;
}

export default WindowInstances;
