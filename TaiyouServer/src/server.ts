import { Socket, Server, Namespace } from 'socket.io';
import { v4 } from "uuid";
import express from 'express';
import Cors from './Middleware/Express/Cors';
import { PrismaClient } from '@prisma/client';
import UserRouter from './ExpressRoutes/User';
import GetFriends from './HybridRoutes/User';
import BasicGroupInfo from './Models/GetGroups/BasicGroupInfo';
import GetGroupsResponse from './Models/GetGroups/GetGroupsResponse';

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


class ConnectedClient
{
  session_token: string | null = null;
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

interface WsClientGetChannelMessages extends WsClientAuthenticationData
{
  channel_id: string;
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
    
    // Get UserID from token and check if session token is still valid
    const userID = await WsUserIDFromSessionToken(authRequest.session_token);
    if (userID == null) { client.emit("credential_error"); client.disconnect(); return; }
    
    clients.set(client.id, new ConnectedClient(client));
    clients.get(client.id)!.session_token = authRequest.session_token

    client.emit("auth_success")
    
  })

  // Returns updated friend list
  client.on("get_friend_list", async (data: any) => {
    const authData = data as WsClientAuthenticationData;
    
    const session = clients.get(client.id)!;
    if (authData.session_token != clients.get(client.id)?.session_token || authData.session_token == null || session == null || session.session_token == null) 
    { 
      client.emit("credential_error"); 
      client.disconnect(); 
      return; 
    }
    
    // Get UserID from token and check if session token is still valid
    const userID = await WsUserIDFromSessionToken(session.session_token);
    if (userID == null) { client.emit("credential_error"); client.disconnect(); return; }
    
    const user = await prisma.user.findUnique({where: { id: userID }});
    
    if (user == null) { client.emit("credential_error"); client.disconnect(); return; }

    const friends = await GetFriends(user.username);

    client.emit("update_friend_list", friends)
  })  

  client.on("get_channel", async (data: any) => {
    const request = data as WsClientGetChannelMessages;

    console.log(request.channel_id)

    const channelMessages = await prisma.channel.findUnique({ where: { id: request.channel_id } })

    client.emit("update_channel", channelMessages);
  })

  // Returns updated group list
  client.on("get_groups", async (data: any) => {
    const authData = data as WsClientAuthenticationData;

    const session = clients.get(client.id)!;
    if (authData.session_token != clients.get(client.id)?.session_token || authData.session_token == null || session == null || session.session_token == null) 
    { 
      client.emit("credential_error"); 
      client.disconnect(); 
      return; 
    }
    
    // Get UserID from token and check if session token is still valid
    const userID = await WsUserIDFromSessionToken(session.session_token);
    if (userID == null) { client.emit("credential_error"); client.disconnect(); return; }

    const groups = await prisma.group.findMany({ where: { users: { some: { id: userID } } } })
    
    const newGroupResponse = new GetGroupsResponse(new Array<BasicGroupInfo>());

    for (const group of groups)
    {
      newGroupResponse.groups.push(new BasicGroupInfo(group.id, group.name));
    }

    client.emit("update_groups", newGroupResponse)
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