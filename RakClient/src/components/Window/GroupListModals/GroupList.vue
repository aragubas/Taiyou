<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "@vue/runtime-dom";
import { socket, Connected } from "../../../API/ws-api";
import LoadingBar from "../../LoadingBar.vue";
import ErrorOverlay from "../../Overlays/ErrorOverlay.vue";

let UpdateGroupsTimer: number;
let loading = ref(false);
let requested = false;
let requestedLoadingBar: number;
const emit = defineEmits(["goto", "setGroupViewID"])

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
  groups.value.splice(0, groups.value.length);

  const response = data as GetGroupsResponse;
  
  response.groups.forEach(group => {
    groups.value.push(new Group(group.id, group.name))
  })

  loading.value = false;
  
  clearTimeout(requestedLoadingBar);

  requested = false;  
}

socket.on("disconnect", onDisconnected)
socket.on("connected", () => { loading.value = true; })

function onDisconnected()
{
  groups.value.splice(0, groups.value.length);  
}

onMounted(() => {
  UpdateGroupsTimer = setInterval(RequestGroupList, 2500, null);

  RequestGroupList();
})

onUnmounted(() => {
  socket.off("disconnected", onDisconnected)
  socket.off("update_groups", UpdateGroupList)
  clearInterval(UpdateGroupsTimer);
})

function RequestGroupList()
{
  if (Connected.value == false) { requested = false; return; }
  if (requested == true) { return; }
  
  socket.emit("get_groups");

  // Wait 500ms after showing the loading bar
  requestedLoadingBar = setTimeout(() => { if(!requested) { return; } loading.value = true; }, 500, null);
  
  requested = true;
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

const groups = ref(new Array<Group>());

function viewGroup(groupID: string)
{
  emit("setGroupViewID", groupID);
  emit("goto", 1);
}

</script>

<template>
  <div class="wrapper">
      <LoadingBar :active="loading" :always_visible="true" v-if="Connected"></LoadingBar>

      <ErrorOverlay v-if="!Connected" :message="'Disconnected'"></ErrorOverlay>

      <ul v-if="Connected">
        <li v-for="group in groups" :key="group.id" class="group" @click="viewGroup(group.id)">
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
  display: flex;
  flex-direction: column;
  height: 100%;
}

ul
{
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  padding: .5rem;
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

.group:hover
{
  background: rgb(70, 72, 78);
  cursor: pointer;
}

</style>