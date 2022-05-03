import { v4 } from "uuid";

class NotificationMessage {
  id = v4();
  message: string;
  title: string;
  constructor(message: string, title: string) {
    this.message = message;
    this.title = title;
  }
}

export const NotificationList: Array<NotificationMessage> = [
  new NotificationMessage("ceira", "Welcome Window"),
  new NotificationMessage("ceira", "Welcome Window"),
  new NotificationMessage("ceira", "Welcome Window"),
  new NotificationMessage("ceira", "Welcome Window"),
  new NotificationMessage("ceira", "Welcome Window"),
  new NotificationMessage("ceira", "Welcome Window"),
  new NotificationMessage("ceira", "Welcome Window"),
  new NotificationMessage("ceira", "Welcome Window"),
  new NotificationMessage("ceira", "Welcome Window"),
  new NotificationMessage("ceira", "Welcome Window"),
  new NotificationMessage("ceira", "Welcome Window"),
  new NotificationMessage("ceira", "Welcome Window"),
  new NotificationMessage("ceira", "Welcome Window"),
  new NotificationMessage("ceira", "Welcome Window"),
  new NotificationMessage("ceira", "Welcome Window"),
];
