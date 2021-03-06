import { Socket, Server } from 'socket.io';
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

interface BasicChannelInfo
{
  id: string;
  channelName: string;
}

class GetMeResponse
{
  id: string;
  username: string;
  full_name: string;

  constructor (id: string, username: string, full_name: string) {
    this.id = id;
    this.username = username;
    this.full_name = full_name;
  }
}

class GetGroupInfoResponse
{
  id: string;
  name: string;
  channels: Array<BasicChannelInfo>
  permissionString: string;
  membersCount: number;

  constructor(id: string, name: string, channels: Array<BasicChannelInfo>, permissionString: string, membersCount: number)
  {
    this.id = id;
    this.name = name;
    this.channels = channels;
    this.permissionString = permissionString;
    this.membersCount = membersCount;
  }
}

interface WsClientGetChannelMessages
{
  channel_id: string;
}

interface WsClientGetChannelOlderMessages
{
  channel_id: string;
  lastMessageID: string;
}

interface WsClientSendMessage
{
  channel_id: string;
  content: string;
}

interface WsClientGetGroupInfo
{
  group_id: string;
}

function disconnectAuthError(socket: Socket)
{
  socket.emit("credential_error"); 
  socket.disconnect();
}

async function WsUserIDFromSessionToken(socket: Socket): Promise<string | undefined>
{ 
  const sessionToken = getSessionToken(socket);
  if (!sessionToken) 
  { 
    disconnectAuthError(socket);
    return; 
  }

  const storedToken = await prisma.sessionToken.findUnique({ where: { token: sessionToken } })

  if (!storedToken) 
  { 
    disconnectAuthError(socket);
    return; 
  }

  return storedToken.ownerID;
}

function getSessionToken(socket: Socket): string | undefined
{
  // Check if sessionToken is valid
  const sessionToken = socket.request.headers["x-auth-token"];

  if (!sessionToken) { return; }
  const valid =  sessionToken.length > 1 && sessionToken.length < 128 && typeof(sessionToken) == "string" && sessionToken != "" && sessionToken != null && typeof sessionToken == "string"
  if (!valid) { return; }

  return sessionToken;
}

// Authentication middleware
socketApp.use((socket, next) => {
  if (!getSessionToken(socket))
  {
    next(new Error("credential_error"));
    return;
  }

  next()
})

socketApp.on("connection", async (client: Socket) => {
  // Check Authentication Request
  client.on("check_auth", async (data: any) =>{    
    // Get UserID from token and check if session token is still valid
    const userID = await WsUserIDFromSessionToken(client);
    if (userID == null) { return; }

    const user = await prisma.user.findUnique({ where: { id: userID } });

    client.emit("auth_success", new GetMeResponse(user.id, user.username, user.full_name));
  })
  
  // Returns updated friend list
  client.on("get_friend_list", async (data: any) => {
    // Get UserID from token and check if session token is still valid
    const userID = await WsUserIDFromSessionToken(client);
    if (userID == null) { return; }
    
    const user = await prisma.user.findUnique({where: { id: userID }});
    
    if (user == null) { disconnectAuthError(client); return; }

    const friends = await GetFriends(user.username);

    client.emit("update_friend_list", friends)
  })  
  
  // return last 20 messages in channel
  client.on("get_channel", async (data: any, callback: any) => {
    const request = JSON.parse(data) as WsClientGetChannelMessages;

    // Get UserID from token and check if session token is still valid
    const userID = await WsUserIDFromSessionToken(client);
    if (userID == null)  { return; }
      
    const channel = await prisma.channel.findUnique({ where: { id: request.channel_id } });
    if (channel == null) { callback("not_found"); return; }
     
    const memberProperties = await prisma.groupMemberProperties.findFirst( { where: { userID: userID, groupID: channel.groupID } } )
    if (memberProperties == null || memberProperties.isBanned) { callback("unauthorized"); return;  }

    const channelMessages = await prisma.message.findMany({ where: { channelID: request.channel_id }, orderBy: { date: "desc" }, take: 20 });

    callback({ messages: channelMessages, name: channel.channelName });
  })

  client.on("get_channel_older", async (data: any, callback: any) => {
    const request = JSON.parse(data) as WsClientGetChannelOlderMessages;
    
    const channelMessages = await prisma.message.findMany({ 
      where: { channelID: request.channel_id }, 
      orderBy: { date: "desc" }, 
      take: 20, 
      skip: 1,
      cursor: { id: request.lastMessageID } 
    });
    
    callback(channelMessages);
  })

  client.on("send_message", async (data: any) => {
    const request = JSON.parse(data) as WsClientSendMessage;

    if (request.content.trim().length == 0) { return; }

    // Get UserID from token and check if session token is still valid
    const userID = await WsUserIDFromSessionToken(client);
    if (userID == null) { return; }

    const user = await prisma.user.findUnique({ where: { id: userID } })
    if (user == null) { client.emit("credential_error"); client.disconnect(); return; }
    
    const newMessage = await prisma.message.create({ data: { channelID: request.channel_id, content: request.content, ownerUsername: user.username } })
    
    socketApp.emit(`new_message:${request.channel_id}`, newMessage);
  })

  client.on("get_group_info", async (data: any) =>{
    // Prevents request without required data
    if (data == null || data == "") { client.emit("bad_request"); return; }

    const request = JSON.parse(data) as WsClientGetGroupInfo; 
    
    // Get UserID from token and check if session token is still valid
    const userID = await WsUserIDFromSessionToken(client);
    if (userID == null)  { return; }

    if (request.group_id == null || request.group_id == undefined || request.group_id == "")
    {
      console.log("Group undefined error")
      client.emit("group_not_found"); 
      return;
    }

    const groupInfo = await prisma.group.findUnique({ where: { id: request.group_id } });
    if (groupInfo == null) { client.emit("group_not_found"); return; }

    const memberProperties = await prisma.groupMemberProperties.findFirst( { where: { groupID: groupInfo.id, userID: userID } } )
    if (memberProperties == null || memberProperties.isBanned) { client.emit(`update_group:${request.group_id}`, "unauthorized"); return;  }
     
    const channelMembers = await prisma.user.count({ where: { MyGroups: { some: { id: groupInfo.id } } } })

    const groupChannels = await prisma.channel.findMany( { where: { groupID: groupInfo.id }  } )

    client.emit(`update_group:${request.group_id}`, new GetGroupInfoResponse(groupInfo.id, groupInfo.name, groupChannels, memberProperties.permissionString, channelMembers));
  })
 
  // Returns updated group list
  client.on("get_groups", async (data: any) => {
    // Get UserID from token and check if session token is still valid
    const userID = await WsUserIDFromSessionToken(client);
    if (userID == null) { disconnectAuthError(client); return; }

    const groups = await prisma.group.findMany({ where: { users: { some: { id: userID } } } })
    
    const newGetGroupResponse = new GetGroupsResponse(new Array<BasicGroupInfo>());

    for (const group of groups)
    {
      newGetGroupResponse.groups.push(new BasicGroupInfo(group.id, group.name));
    }

    client.emit("update_groups", newGetGroupResponse)
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