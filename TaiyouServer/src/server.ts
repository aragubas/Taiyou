import { Socket, Server } from 'socket.io';
import { v4 } from "uuid";
import express from 'express';
import Cors from './Middleware/Express/Cors';
import { PrismaClient } from '@prisma/client';
import UserRouter from './ExpressRoutes/User';

class User
{
  public Username: string;

  constructor (username: string) {
    this.Username = username;
  }
}

const expressApp = express();
const socketApp = new Server({ cors: { origin: "*", methods: ["GET", "POST"] } });
const clients = new Map<string, User>();
const prismaClient = new PrismaClient();

expressApp.use(express.json());
expressApp.use(Cors);

// User Router
expressApp.use("/user", UserRouter);

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

socketApp.on("connection", async (client: Socket) => {
  client.on("message", (data: any) =>{
    const message: ReceivedMessage = JSON.parse(data);
    if (clients.has(message.token))
    {
      const user = clients.get(message.token);
    }
    //server.emit("receive-message", JSON.stringify(new Message(message.username, message.content, v4())));
  })
  
});

async function bootstrap(socketPort: number, expressPort: number)
{
  await prismaClient.$connect();
  console.log("Prisma connected to DB");
  
  socketApp.listen(socketPort);
  console.log(`Websocket Server started on port ${socketPort}`);

  expressApp.listen(3314);
  console.log(`Express started on port ${expressPort}`);
    
}
 
bootstrap(3313, 3314);