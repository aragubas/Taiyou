import { v4 } from "uuid";
import { ContextMenuItem } from "./ContextMenuItem";

export class GlobalMenuItem {
  id: string = v4();
  text: string;
  callback: (() => void) | undefined;
  context_menu: Array<ContextMenuItem> | undefined;

  constructor(text: string, callback: (() => void) | undefined, context_menu: Array<ContextMenuItem> | undefined = undefined) {
    this.text = text;
    this.callback = callback;
    this.context_menu = context_menu;
  }
}

export class GlobalMenuInstance {
  id: string;
  items: GlobalMenuItem[] = [];

  constructor() {
    this.id = v4();
  }
}
