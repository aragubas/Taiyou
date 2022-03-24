import { v4 } from "uuid";
import { ComponentPublicInstance, ref, Ref } from "vue";
import { GlobalMenuInstance, GlobalMenuItem } from "./global-menu";
export let focusedWindow = ref("");

export class WindowInstance {
  id: string = "";
  title: string = "";
  minimized: boolean = false;
  width: number = 400;
  height: number = 320;
  minWidth: number = 200;
  minHeight: number = 150;
  globalMenu: GlobalMenuInstance | undefined = undefined;
  onClose: () => void = () => {};
  onMinimize: () => void = () => {};
  onRestore: () => void = () => {};

  minimize() {
    this.minimized = true;
    this.onMinimize();
    focusedWindow.value = "";
  }

  restore() {
    this.minimized = false;
    focusedWindow.value = this.id;
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
  title: string;
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  onClose: () => void;
  onMinimize: () => void;
  onRestore: () => void;
}

let Sinas: Ref<Array<WindowInstance>> = ref(Array<WindowInstance>());

export function getInstance(id: string): WindowInstance {
  return Sinas.value.find((window) => window.id === id)!;
}

export function createWindow(properties: WindowFactoryProperties): string {
  let newWindow: WindowInstance = new WindowInstance();
  let newWindowId = v4();
  newWindow.id = newWindowId;
  newWindow.title = properties.title;
  newWindow.onClose = properties.onClose;
  newWindow.onMinimize = properties.onMinimize;
  newWindow.onRestore = properties.onRestore;
  if (properties.width) {
    newWindow.width = properties.width;
  }

  newWindow.globalMenu = new GlobalMenuInstance();
  newWindow.globalMenu.id = newWindowId;
  newWindow.globalMenu.items = [new GlobalMenuItem()];

  Sinas.value.push(newWindow);
  // Focus newly created window
  focusWindow(newWindowId);

  return `taiyouwindow-${newWindowId}`;
}

export function destroyWindow(id: string) {
  let windowToDestroy = Sinas.value.find((window) => window.id === id);
  if (windowToDestroy) {
    windowToDestroy.onClose();
    Sinas.value.splice(Sinas.value.indexOf(windowToDestroy), 1);
  }
}

export function focusWindow(id: string, unminimize: boolean = false) {
  // Move item with id to start of array
  const index = Sinas.value.findIndex((item) => item.id === id);
  const instance = Sinas.value.find((item) => item.id === id);

  if (!instance) {
    return;
  }
  if (unminimize) {
    instance.minimized = false;
  }

  Sinas.value.splice(index, 1);
  Sinas.value.push(instance);
  focusedWindow.value = id;
}

export default Sinas;
