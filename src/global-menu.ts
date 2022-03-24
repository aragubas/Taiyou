import { v4 } from "uuid";

export class GlobalMenuItem {
  id: string = v4();
  text: string;

  constructor(text: string) {
    this.text = text;
  }
}

export class GlobalMenuInstance {
  id: string;
  items: GlobalMenuItem[] = [];

  constructor(id: string) {
    this.id = id;
  }
}
