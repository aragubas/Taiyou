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

interface ChannelInfos
{
  id: string;
  channelName: string;
}

class GetGroupInfoResponse
{
  id: string;
  name: string;
  channels: Array<ChannelInfos>

  constructor(id: string, name: string, channels: Array<ChannelInfos>)
  {
    this.id = id;
    this.name = name;
    this.channels = channels;
  }
}

interface WsClientAuthenticationData
{
  session_token: string;
}

interface WsClientGetChannelMessages
{
  session_token: string;
  channel_id: string;
}

interface WsClientGetChannelOlderMessages
{
  session_token: string;
  channel_id: string;
  lastMessageID: string;
}

interface WsClientSendMessage
{
  session_token: string;
  channel_id: string;
  content: string;
}

interface WsClientGetGroupInfo
{
  session_token: string;
  group_id: string;
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

  // return all channel messages
  client.on("get_channel", async (data: any) => {
    const request = JSON.parse(data) as WsClientGetChannelMessages;

    const channelMessages = await prisma.message.findMany({ where: { channelID: request.channel_id }, orderBy: { date: "desc" }, take: 20 });

    client.emit("update_channel", channelMessages);
  })

  client.on("get_channel_older", async (data: any) => {
    const request = JSON.parse(data) as WsClientGetChannelOlderMessages;

    console.log(request.lastMessageID)
    const lastMessage = await prisma.message.findFirst({ 
      where: { channelID: request.channel_id, id: request.lastMessageID },
      orderBy: { date: "desc" }
      
    
    })

    const channelMessages = await prisma.message.findMany({ where: { channelID: request.channel_id }, orderBy: { date: "desc" }, take: 20, cursor: { id: request.lastMessageID } });
    
    client.emit("update_channel", channelMessages);
  })

  client.on("send_message", async (data: any) => {
    const request = JSON.parse(data) as WsClientSendMessage;

    if (request.content.trim().length == 0) { return; }

    // Get UserID from token and check if session token is still valid
    const userID = await WsUserIDFromSessionToken(request.session_token);
    if (userID == null) { client.emit("credential_error"); client.disconnect(); return; }

    const user = await prisma.user.findUnique({ where: { id: userID } })
    if (user == null) { client.emit("credential_error"); client.disconnect(); return; }
    
    const newMessage = await prisma.message.create({ data: { channelID: request.channel_id, content: request.content, ownerUsername: user.username } })
    
    socketApp.emit(`new_message:${request.channel_id}`, newMessage);
  })

  client.on("get_group_info", async (data: any) =>{
    const request = JSON.parse(data) as WsClientGetGroupInfo; 
    
    const groupInfo = await prisma.group.findUnique({ where: { id: request.group_id } });
    
    if (groupInfo == null) { client.emit("group_not_found"); return; }

    const groupChannels = await prisma.channel.findMany( { where: { groupID: groupInfo.id }  } )

    client.emit(`update_group:${request.group_id}`, new GetGroupInfoResponse(groupInfo.id, groupInfo.name, groupChannels));
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