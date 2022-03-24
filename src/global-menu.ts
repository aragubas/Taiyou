import { v4 } from "uuid";

export class GlobalMenuItem {
  id: string = v4();
  text: string = `undefined ${this.id}`;
}

export class GlobalMenuInstance {
  id: string = "";
  items: GlobalMenuItem[] = [];
}
