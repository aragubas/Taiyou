import { PrismaClient } from "@prisma/client";
import GetFriendsResponse from "../Models/HybridRoute/GetFriendsResponse";

const prisma = new PrismaClient();

export default async function GetFriends(username: string): Promise<GetFriendsResponse>
{
  const friends = await prisma.friends.findMany({ where: { friendAUsername: username } })
  return new GetFriendsResponse(friends.map(friend => friend.friendBUsername));
}