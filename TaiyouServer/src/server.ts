import { Socket, Server } from 'socket.io';
import { v4 } from "uuid";

class User
{
  public Username: string;

  constructor (username: string) {
    this.Username = username;
  }
}

const server = new Server({ cors: { origin: "*", methods: ["GET", "POST"] } });
const clients = new Map<string, User>();

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
  token: string;
  content: string;
}

server.on("connection", async (client: Socket) => {
  client.on("message", (data: any) =>{
    const message: ReceivedMessage = JSON.parse(data);
    if (clients.has(message.token))
    {
      const user = clients.get(message.token);
    }
    //server.emit("receive-message", JSON.stringify(new Message(message.username, message.content, v4())));
  })
  
});

server.listen(3313);
console.log("Server started on port 3313");