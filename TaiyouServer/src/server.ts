import { Socket, Server } from 'socket.io';
import { v4 } from "uuid";

const server = new Server({ cors: { origin: "*", methods: ["GET", "POST"] } });

class Message
{
  username: string;
  content: string;
  id: string;

  constructor(username: string, content: string, id: string)
  {
    this.username = username;
    this.content = content;
    this.id = id;
  }
}

interface ReceivedMessage
{
  username: string;
  content: string;
}

server.on("connection", async (client: Socket) => {
  client.on("message", (data: any) =>{
    const message: ReceivedMessage = JSON.parse(data);
    server.emit("receive-message", JSON.stringify(new Message(message.username, message.content, v4())));
  })
  
});

server.listen(3313);
