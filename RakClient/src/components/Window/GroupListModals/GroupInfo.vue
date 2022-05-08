<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "@vue/runtime-core";
import { Connected, SessionToken, socket } from "../../../API/ws-api";
import { credentials } from "../../../Credentials";
import LoadingBar from "../../LoadingBar.vue";

const props = defineProps<{ groupID: string }>();
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

onUnmounted(() =>{
  socket.off(`update_group:${props.groupID}`, UpdateGroup);
  clearInterval(UpdateGroupInfoTimer);
})

function RequestGroupInfo()
{
  if (Connected.value == false) { requested = false; return; }
  if (requested == true) { return; }
  
  socket.emit("get_group_info", JSON.stringify({ session_token: credentials.value.session_token, group_id: props.groupID }));

  // Wait 500ms after showing the loading bar
  requestedLoadingBar = setTimeout(() => { if(!requested) { return; } loading.value = true; }, 500, null);
  
  requested = true;
}

</script>

<template>
  <div class="wrapper">
    <header>
      <h1>{{GroupName}}</h1>
    </header>
    <LoadingBar :active="loading" :always_visible="true"></LoadingBar>

    <ol>
      <li v-for="channel in Channels" :key="channel.id" class="channel">
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

ol
{
  display: flex;
  flex-direction: column;
  padding: .3rem;
}

.channel
{
  display: flex;
  background: rgb(60, 62, 68);
  padding: .3rem;
  border-radius: 4px;
  font-size: .8rem;
}

header
{
  display: flex;
  padding: .3rem;
  font-size: .6rem;
  background: rgba(56, 57, 66);
  z-index: 1;
}

h1
{
  font-weight: normal;
}

</style>