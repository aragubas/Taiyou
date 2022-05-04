export enum ContextMenuItemType
{
  Button,
  Submenu,
  Separator
}
export class ContextMenuItem
{
  type: ContextMenuItemType;
  text: string | undefined;
  callback: (() => void) | undefined;
 
  constructor(type: ContextMenuItemType, text: string | undefined = undefined, callback: (() => void) | undefined = undefined)
  {
    this.type = type;
    this.text = text; 
    this.callback = callback;
  }
}
