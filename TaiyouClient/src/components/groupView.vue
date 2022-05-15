<script setup lang="ts">
import { onBeforeMount, onMounted, onUnmounted, ref } from "@vue/runtime-dom";
import { useRoute, useRouter } from "vue-router";
import { socket } from "../API/WsAPI";

const route = useRoute();
const router = useRouter();
let groupID = route.params.groupID;
const channelsView = ref(true)
const groupName = ref("Loading...")
const channelCount = ref(0)
const memberCount = ref(0)
let channels = ref(Array<GroupChannel>());

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
  membersCount: number;
}
function updateGroup(data: GetGroupInfoResponse)
{
  groupName.value = data.name;
  channels.value = data.channels;
  memberCount.value = data.membersCount;

  channelCount.value = channels.value.length;
}

function requestGroupInfo()
{
  socket.emit("get_group_info", JSON.stringify({ group_id: groupID }));
  console.log("Request group info...")
}

onMounted(() => {
  socket.on(`update_group:${groupID}`, updateGroup);
  
  requestGroupInfo();
})

onUnmounted(() => {
  socket.off(`update_group:${groupID}`, updateGroup);
})

function gotoChannel(channelID: string)
{
  router.push({ name: "channel", params: { channelID: channelID } });
}
</script>

<template>
  <div class="wrapper">
    <div class="side">
      <header>
        <h2>{{groupName}}</h2>
        
        <div class="infos-box">
          <div class="icon-info-box">
            <img src="/user.svg" class="icon icon-button" alt="User Icon" />
            <p>{{memberCount}}</p>
          </div>

          <div class="icon-info-box">
            <img src="/channels.svg" class="icon icon-button" alt="User Icon" />
            <p>{{channelCount}}</p>
          </div>          
        </div>

        <div class="channels-view-toggle">
          <button :class="channelsView ? 'active' : ''" @click="channelsView = true">CHANNELS</button>
          <button :class="!channelsView ? 'active' : ''" @click="channelsView = false">POSTS</button>
        </div>

      </header>

      <ol class="channels">
        <li v-for="channel in channels" :key="channel.id">
          <button @click="gotoChannel(channel.id)">{{channel.channelName}}</button>
        </li>
      </ol>
    </div>

    <router-view :key="route.params.channelID"></router-view>
  </div>  
</template>

<style scoped>
.side
{
  background: var(--background-panel);
}
.wrapper
{
  display: grid;
  grid-template-columns: 12rem 1fr;
}

.channels
{
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-sm);
}

.channels button
{
  width: 100%;
  text-align: left;
}


header
{
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  background: var(--background-control);
}

header h2
{
  padding-top: var(--space-sm);
  font-size: 1.3rem;
  font-weight: normal;
  text-align: center;
}


header .infos-box
{
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.icon-info-box
{
  display: flex;
  gap: var(--space-sm);
}

.channels-view-toggle
{
  display: flex;
}

.channels-view-toggle button
{
  width: 100%;
  color: var(--text-disabled);
  background-color: var(--background-control-lower);
  border-radius: 0px;
  transition: background-color .3s ease;
}

.channels-view-toggle button.active
{
  background-color: var(--background-control);
  color: var(--text-normal);
}

.channels-view-toggle button:focus
{
  box-shadow: none;
  color: white;
}


</style>