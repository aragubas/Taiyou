import { v4 } from "uuid";

class NotificationMessage {
  message: string;
  title: string;
  id = v4();
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
