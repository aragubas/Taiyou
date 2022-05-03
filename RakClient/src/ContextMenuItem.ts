export enum ContextMenuItemType
{
  Button,
  Submenu,
  Separator
}
export class ContextMenuItem
{
  type: ContextMenuItemType;
  text: string;
  callback: (() => void) | null;
 
  constructor(type: ContextMenuItemType, text: string = "", callback = null)
  {
    this.type = type;
    this.text = text; 
    this.callback = callback;
  }
}
