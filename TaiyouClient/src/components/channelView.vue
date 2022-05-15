<script setup lang="ts">
import { onBeforeMount, onUnmounted, ref } from '@vue/runtime-dom';
import { useRoute } from 'vue-router';
import { socket } from '../API/WsAPI';


const route = useRoute();
const channelID = route.params.channelID as string;
const channelName = ref("Loading...")

interface Message
{
  channelID: string;
  content: string;
  id: string;
  ownerUsername: string;
  date: string;
}
interface UpdateChannelResponse
{
  messages: Array<Message>
  name: string
}

function updateChannel(data: UpdateChannelResponse)
{
  console.log(data)

  channelName.value = data.name;
}

onBeforeMount(() => {
  // console.log(channelID)
  socket.emit("get_channel", JSON.stringify({ channel_id: channelID }), updateChannel)
})

onUnmounted(() =>
{

})

</script>

<template>
  <div class="wrapper">
    <header>
      <div class="info-box">
        <img src="/channels.svg">
        <p>{{channelName}}</p>
      </div>
    </header>
  </div>
</template>

<style scoped>
.wrapper
{
  display: flex;
  flex-direction: column;
}

.info-box
{
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: .9rem;
}

header
{
  display: flex;
  padding: var(--space-sm);
  height: 1.5rem;
  background: var(--background-panel);
}
</style>