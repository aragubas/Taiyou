<script setup lang="ts">
import { onBeforeMount, onUnmounted, ref } from '@vue/runtime-dom';
import { useRoute } from 'vue-router';
import { socket } from '../API/WsAPI';


const route = useRoute();
const channelID = route.params.channelID as string;
const channelName = ref("Loading...")
let firstMessageLoaded = ref(false);
const messages = ref(Array<Message>());

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
  channelName.value = data.name;

  (data.messages as Array<Message>).forEach(message => {
    addMessage(message);
  })

}

function newMessageCallback(data: Message)
{
  messages.value = [ data, ...messages.value ];
}

onBeforeMount(() => {
  // console.log(channelID)
  socket.emit("get_channel", JSON.stringify({ channel_id: channelID }), updateChannel)
  socket.on(`new_message:${channelID}`, newMessageCallback)
})

onUnmounted(() =>
{
  socket.off(`new_message:${channelID}`, newMessageCallback)
})

function addMessage(message: Message): boolean
{
  if (messages.value.filter(msg => msg.id == message.id).length >= 1)
  {
    console.log("Message already exists");
    return false;
  }

  messages.value.push(message);
  return true;
}

function formatDate(dateString: string)
{
  const date = new Date(dateString);
  let returnString = "";

  // Date
  if (date.getDay() === new Date().getDay())
  {
    returnString += "Today at";

  } else if (date.getDay() == new Date().getDay() - 1) {
    returnString += "Yesterday at";

  } else {
    returnString += `${date.toLocaleDateString()} at`
  }

  return `${returnString} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}
</script>

<template>
  <div class="wrapper">
    <header>
      <div class="info-box">
        <img src="/channels.svg">
        <p>{{channelName}}</p>
      </div>
    </header>

    <div class="scrollable">
      <ol :id="`channelview-${channelID}`">
      <li v-for="message in messages" :key="message.id" class="message">
        <header>
          <h1>{{ message.ownerUsername }}</h1>
          <p>{{ formatDate(message.date) }}</p>
        </header>
        <p>{{message.content}}</p>
      </li>

      <div v-if="firstMessageLoaded" class="first-message-header">
        <h1>-- This is the start of this channel --</h1>
      </div>
    </ol>
  </div>

    <div class="user-controls">
      <input type="text" :placeholder="`Message in ${channelName}`">
    </div>
  </div>
</template>

<style scoped>
.wrapper
{
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 2rem 1fr 2rem;
  height: 100%;
}

ol
{
  display: flex;
  flex-direction: column-reverse;
  gap: .5rem;
  padding: .3rem;
  height: 0px;
}

.scrollable
{
  overflow-y: scroll;
  display: flex;
  flex-direction: column-reverse;
}

.user-controls
{
  height: 2rem;
  box-sizing: border-box;
  padding: var(--space-sm);
}

.user-controls input[type="text"]
{
  width: 100%;
}

.info-box
{
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: .9rem;
}

.wrapper > header
{
  display: flex;
  padding: var(--space-sm);
  box-sizing: border-box;
  height: 2rem;
  background: var(--background-panel);
}

.message
{
  display: flex;
  flex-direction: column;
  gap: .1rem;
  padding: .3rem;
  border-radius: 4px;
}

.message:hover
{
  background: var(--background-panel);
}

.message h1
{
  text-align: left;
  font-size: 1rem;
  font-weight: normal;
}

.message header
{
  display: flex;
  align-items: center;
  gap: .3rem;
  color: rgb(190, 190, 190);
}

.message header p
{
  color: rgb(150, 150, 150);
  font-size: .7rem;
}
</style>