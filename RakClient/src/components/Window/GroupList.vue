
<script setup lang="ts">
import { onMounted, ref } from "@vue/runtime-dom";
import { v4 } from "uuid";
import { SessionToken, socket } from "../../API/ws-api";
import { getInstance } from "../../window-manager";
import LoadingBar from "../LoadingBar.vue";
const props = defineProps<{ windowID: string }>();

let UpdateGroupsTimer: number;
let loading = ref(false);

socket.on("update_groups", UpdateGroupList);

interface GroupResponse
{
  id: string;
  name: string;
}

interface GetGroupsResponse
{
  groups: Array<GroupResponse>
}

async function UpdateGroupList(data: any)
{
  groupsList.value.splice(0, groupsList.value.length);

  const response = data as GetGroupsResponse;
  

  response.groups.forEach(group => {
    groupsList.value.push(new Group(group.id, group.name))
  })

  loading.value = false;
}

onMounted(() => {
  getInstance(props.windowID).title = "Groups";
  getInstance(props.windowID).closeable = false;

  groupsList.value.push(new Group(v4(), "SinasTeste"))
  groupsList.value.push(new Group(v4(), "TropineteAzul"))

  UpdateGroupsTimer = setInterval(RequestGroupList, 2000, null);

  RequestGroupList();
})

function RequestGroupList()
{
  loading.value = true;
  socket.emit("get_groups", SessionToken);
}

class Group
{
  id: string;
  name: string;

  constructor(id: string, name: string)
  {
    this.id = id;
    this.name = name;
  }
}

const groupsList = ref(new Array<Group>());

</script>

<template>
  <div class="wrapper">
    <LoadingBar :active="loading"></LoadingBar>

    <ul>
      <li v-for="group in groupsList" :key="group.id" class="group">
        <span class="group-icon"></span>
        
        <div class="groupname-box">
          <p>{{group.name}}</p>
          <i>Group</i>
        </div>

      </li>
    </ul>
  </div>

</template>

<style scoped>
.wrapper
{
  padding: .5rem;
}

ul
{
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.group span.group-icon
{
  width: 32px;
  height: 32px;
  min-width: 32px;
  background: rgb(80, 82, 88);
  border-radius: 100%;
}

.groupname-box
{
  display: flex;
  align-items: center;
  min-width: 50px;
  gap: .5rem;

  flex: 1;
}

i
{
  font-size: .7rem;
}


.groupname-box p
{
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.group
{
  display: flex;
  align-items: stretch;
  gap: .5rem;
  background: rgb(60, 62, 68);
  border-radius: 4px;
  padding: .4rem;
}

</style>