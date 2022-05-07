import { Socket, Server, Namespace } from 'socket.io';
import { v4 } from "uuid";
import express from 'express';
import Cors from './Middleware/Express/Cors';
import { PrismaClient } from '@prisma/client';
import UserRouter from './ExpressRoutes/User';
import GetFriends from './HybridRoutes/User';

class User
{
  public Username: string;

  constructor (username: string) {
    this.Username = username;
  }
}

const expressApp = express();
const socketApp = new Server({ cors: { origin: "*", methods: ["GET", "POST"] } });
const prisma = new PrismaClient();

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

class ConnectedClient
{
  session_token: string | null = null;
  userID: string | null = null;
  socket: Socket

  constructor(socket: Socket)
  {
    this.socket = socket;
  }
}

interface WsClientAuthenticationData
{
  session_token: string;
}

async function WsUserIDFromSessionToken(session_token: string): Promise<string | null>
{
  const sessionToken = await prisma.sessionToken.findFirst({ where: { token: session_token } })
  if (!sessionToken)
  {
    return null;
  }

  return sessionToken.ownerID;
}

const clients = new Map<string, ConnectedClient>();
socketApp.on("connection", async (client: Socket) => {
  client.on("disconnect", () => {
    clients.delete(client.id);
  })
  
  // Authenticates user
  client.on("authenticate", async (data: any) =>{
    const authRequest = data as WsClientAuthenticationData;
    
    if (authRequest == null || !authRequest.session_token == null) { client.emit("credential_error"); client.disconnect(); return; }
    
    // Get UserID from token
    const userID = await WsUserIDFromSessionToken(authRequest.session_token);
    if (userID == null) { client.emit("credential_error"); client.disconnect(); return; }
    
    clients.set(client.id, new ConnectedClient(client));
    clients.get(client.id)!.session_token = authRequest.session_token
    clients.get(client.id)!.userID = userID;

    client.emit("auth_success")
    
  })

  // Returns updated friend list
  client.on("get_friend_list", async (data: any) => {
    const authData = data as WsClientAuthenticationData;
    
    const session = clients.get(client.id)!;
    if (authData.session_token != clients.get(client.id)?.session_token || authData.session_token == null || session == null) { client.emit("credential_error"); client.disconnect(); return; }
    
    const user = await prisma.user.findUnique({where: { id: session.userID! }});
    
    if (user == null) { client.emit("credential_error"); client.disconnect(); return; }

    const friends = await GetFriends(user.username);

    client.emit("update_friend_list", friends)
  })
});

async function bootstrap(socketPort: number, expressPort: number)
{
  await prisma.$connect();
  console.log("Prisma connected to DB");
  
  socketApp.listen(socketPort);
  console.log(`Websocket Server started on port ${socketPort}`);

  expressApp.listen(3314);
  console.log(`Express started on port ${expressPort}`);
    
}
 
bootstrap(3313, 3314);