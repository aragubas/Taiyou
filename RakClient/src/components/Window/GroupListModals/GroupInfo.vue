<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "@vue/runtime-core";
import { Connected, socket } from "../../../API/ws-api";
import { credentials } from "../../../Credentials";
import { createWindow } from "../../../window-manager";
import LoadingBar from "../../LoadingBar.vue";

const props = defineProps<{ groupID: string }>();
const emit = defineEmits(["goto"])
let UpdateGroupInfoTimer: number;
let loading = ref(false);
let requested = false;
let requestedLoadingBar: number;
let GroupName = ref("Loading...")
let Channels = ref(Array<GroupChannel>());

socket.on(`update_group:${props.groupID}`, UpdateGroup);

interface GroupChannel
{
  channelName: string;
  id: string;
}

interface GetGroupInfoResponse
{
  id: string;
  name: string;
  channels: Array<GroupChannel>;
}

function UpdateGroup(data: GetGroupInfoResponse)
{
  GroupName.value = data.name;
  Channels.value = data.channels;

  loading.value = false;
  clearTimeout(requestedLoadingBar);
  requested = false;  
}

onMounted(() =>{
  UpdateGroupInfoTimer = setInterval(RequestGroupInfo, 2500, null);
  RequestGroupInfo();

})

watch(Connected, (newValue) =>{
  if (!newValue) { emit("goto", 0) }
})

onUnmounted(() =>{
  socket.off(`update_group:${props.groupID}`, UpdateGroup);
  clearInterval(UpdateGroupInfoTimer);
})

function RequestGroupInfo()
{
  if (Connected.value == false) { requested = false; return; }
  if (requested == true) { return; }
  
  socket.emit("get_group_info", JSON.stringify({ group_id: props.groupID }));

  // Wait 500ms after showing the loading bar
  requestedLoadingBar = setTimeout(() => { if(!requested) { return; } loading.value = true; }, 500, null);
  
  requested = true;
}

function openChannel(channelID: string)
{
  createWindow({componentPath: "ChannelView.vue", width: 420, height: 300, arguments: 
  [ 
    channelID, 
    Channels.value.find(channel => channel.id == channelID)?.channelName, 
    GroupName.value
  ]});
}

</script>

<template>
  <div class="wrapper">
    <LoadingBar :active="loading" :always_visible="true"></LoadingBar>
    <header>
      <a class="back-arrow" @click="emit('goto', 0)"></a>
      <h1>{{GroupName}}</h1>
    </header>

    <ol>
      <li v-for="channel in Channels" :key="channel.id" class="channel" @click="openChannel(channel.id)">
        <p>{{channel.channelName}}</p>
      </li>
    </ol>
  </div>

</template>

<style scoped>
.wrapper
{
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.back-arrow
{
  --arrow-size: .2rem;
  display: inline-block;
  width: var(--arrow-size);
  height: var(--arrow-size);
  border: solid rgb(190, 190, 190);
  border-width: 0 var(--arrow-size) var(--arrow-size) 0;
  padding: var(--arrow-size);
  box-sizing: border-box;
  margin-left: 2px;
  transform: rotate(135deg);
}

.back-arrow:hover
{
  border-color: white;
}


ol
{
  display: flex;
  flex-direction: column;
  padding: .3rem;
  gap: .3rem;
  height: 100%;
  overflow-y: auto;
}

.channel
{
  display: flex;
  background: rgb(60, 62, 68);
  padding: .3rem;
  border-radius: 4px;
  font-size: .8rem;
}

.channel:hover
{
  background: rgb(70, 72, 78);
  cursor: pointer;
}

header
{
  display: flex;
  gap: .3rem;
  padding: .3rem;
  font-size: .6rem;
  background: rgba(56, 57, 66);
  align-items: center;
}

.loading-bar
{
  z-index: 0.5;
}

h1
{
  font-weight: normal;
}

</style>