import { v4 } from "uuid";
import { ComponentPublicInstance, ref, Ref } from "vue";
export let focusedWindow = ref("");

class WindowInstance {
  id: string = "";
  title: string = "";
  onClose: () => void = () => {};
  onMinimize: () => void = () => {};
}

interface WindowFactoryProperties {
  title: string;
  onClose: () => void;
  onMinimize: () => void;
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
  Sinas.value.push(newWindow);

  // Focus newly created window
  focusWindow(newWindowId);

  return `taiyouwindow-${newWindowId}`;
}

export function minimizeWindow(id: string) {
  const instance = Sinas.value.find((item) => item.id === id);
  if (!instance) {
    return;
  }
  instance.onClose?.call(null);
}

export function focusWindow(id: string) {
  // Move item with id to start of array
  const index = Sinas.value.findIndex((item) => item.id === id);
  const instance = Sinas.value.find((item) => item.id === id);

  if (!instance) {
    return;
  }

  Sinas.value.splice(index, 1);
  Sinas.value.push(instance);
  focusedWindow.value = id;
}

export default Sinas;
