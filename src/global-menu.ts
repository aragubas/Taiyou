import { v4 } from "uuid";

export class GlobalMenuItem {
  id: string = v4();
  text: string;
  callback: () => void;

  constructor(text: string, callback: () => void) {
    this.text = text;
    this.callback = callback;
  }
}

export class GlobalMenuInstance {
  id: string;
  items: GlobalMenuItem[] = [];

  constructor(id: string) {
    this.id = id;
  }
}
