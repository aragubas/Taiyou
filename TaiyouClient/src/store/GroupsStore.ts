import { defineStore } from "pinia";
import { socket } from "../API/WsAPI";
import { UserCredentialsStore } from "./UserCredentialsStore";
const fetchGroups = setInterval(fetchGroup, 2500);

socket.on("update_groups", updateGroups);

export class Group
{
  id: string;
  name: string;

  constructor(id: string, name: string)
  {
    this.id = id;
    this.name = name;
  }
}

export const GroupStore = defineStore("GroupStore", {
  state: () => 
  { 
    return {
      Groups: new Array<Group>()
    } 
  }
})

function fetchGroup()
{
  const userStore = UserCredentialsStore();
  if (userStore.IsLoggedIn)
  {
    socket.emit("get_groups");
  }
}




interface GroupResponse
{
  id: string;
  name: string;
}

interface GetGroupsResponse
{
  groups: Array<GroupResponse>
}

function updateGroups(data: any)
{
  const groupStore = GroupStore();
  
  groupStore.Groups.splice(0, groupStore.Groups.length);

  const response = data as GetGroupsResponse;

  response.groups.forEach(group => {
    groupStore.Groups.push(new Group(group.id, group.name))
  })
  
}
