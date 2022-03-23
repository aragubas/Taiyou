import { v4 } from "uuid";
import { ref, Ref } from "vue";
export let focusedWindow = ref("");

class WindowInstance {
  id: string = "";
}

let Sinas: Ref<Array<WindowInstance>> = ref(Array<WindowInstance>());

export function createWindow() {
  let sinas: WindowInstance = new WindowInstance();
  let newWindowId = v4();
  sinas.id = newWindowId;
  Sinas.value.push(sinas);

  focusWindow(newWindowId);
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
