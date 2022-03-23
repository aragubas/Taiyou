import { v4 } from "uuid";
import { ref, Ref } from "vue";

class WindowInstance {
  id: string = "";
}

let Sinas: Ref<Array<WindowInstance>> = ref(Array<WindowInstance>());

export function createWindow() {
  let sinas: WindowInstance = new WindowInstance();
  sinas.id = v4();
  Sinas.value.push(sinas);
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
}

export default Sinas;
