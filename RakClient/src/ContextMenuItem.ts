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
  callback: ((event: MouseEvent) => void);
 
  constructor(type: ContextMenuItemType, text: string = "", callback: ((event: MouseEvent) => void))
  {
    this.type = type;
    this.text = text; 
    this.callback = callback;
  }
}
