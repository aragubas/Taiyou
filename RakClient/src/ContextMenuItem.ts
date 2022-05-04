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
  callback: ((event: MouseEvent) => void) | undefined;
 
  constructor(type: ContextMenuItemType, text: string | undefined = undefined, callback: ((event: MouseEvent) => void) | undefined = undefined)
  {
    this.type = type;
    this.text = text; 
    this.callback = callback;
  }
}
