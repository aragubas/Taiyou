<script setup lang="ts">
import { onActivated, onMounted, onUnmounted, ref } from "@vue/runtime-core";
import { watch } from "vue";
import { socket } from "../../API/ws-api";
import { credentials } from "../../Credentials";
import { getInstance } from "../../window-manager";
import { VueEternalLoading, LoadAction } from '@ts-pro/vue-eternal-loading';
import LoadingBar from "../LoadingBar.vue";
import ErrorOverlay from "../Overlays/ErrorOverlay.vue";

const props = defineProps<{ windowID: string }>();
let channelID = "";
let firstMessageLoaded = ref(false);
let initialChannelRequestCompleted = ref(false);
let channelName = ref("");
let parentGroupName = ref("");
let lastMessageContent = "";
let lastMessageLoading = ref(false);
let olderMessagesLoading = ref(false)
let error = ref(false)
let error_message = ref("")

onMounted(() => {  
  const windowArguments = getInstance(props.windowID)!.arguments;
  channelID = windowArguments[0];
  channelName.value = windowArguments[1];
  parentGroupName.value = windowArguments[2];

  getInstance(props.windowID)!.title = `Channel ${channelName.value} in ${parentGroupName.value}`;

  socket.on(`new_message:${channelID}`, NewMessageCallback)

  socket.emit("get_channel", JSON.stringify({ channel_id: channelID }), UpdateChannelCallback)
});

onUnmounted(() => {
  socket.off(`new_message:${channelID}`, NewMessageCallback)
})

interface Message
{
  channelID: string;
  content: string;
  id: string;
  ownerUsername: string;
  date: string;
}

const messages = ref(Array<Message>());
let message = ref("");

// watch(messages, (newValue: Array<Message>) => {
//   if (newValue.length > 20) { newValue = newValue.splice(20) }
// })

function NewMessageCallback(data: Message)
{
  if (data.ownerUsername == credentials.value.username && data.content == lastMessageContent)
  {
    lastMessageLoading.value = false;
  }

  messages.value = [ data, ...messages.value ];
}

function UpdateChannelCallback(data: Array<Message> | string)
{
  if (data === "unauthorized")
  {
    error.value = true;
    error_message.value = "You are not authorized to view this channel."
    return;
  }

  if (data === "error")
  {
    error.value = true;
    error_message.value = "Internal server error."
    return;
  }

  (data as Array<Message>).forEach(message => {
    addMessage(message);
  })

  if (!initialChannelRequestCompleted.value) 
  { 
    initialChannelRequestCompleted.value = true; 
  }

}

function sendMessage()
{
  socket.emit("send_message", JSON.stringify({ channel_id: channelID, content: message.value }))
   
  lastMessageContent = message.value;
  lastMessageLoading.value = true;
  message.value = "";
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

function loadMoreMessages({loaded}: LoadAction)
{
  if (messages.value.length < 1 || firstMessageLoaded.value == true || olderMessagesLoading.value == true) { return; }

  olderMessagesLoading.value = true;

  socket.emit("get_channel_older", JSON.stringify({ channel_id: channelID, lastMessageID: messages.value[messages.value.length - 1].id }), (response: Array<Message> | null) => {
    let newlyloadedMessages = 0;
    
    if (response == null) { return; }

    response.forEach(message => {
      if (addMessage(message))
      {
        newlyloadedMessages++;
      }
    })

    console.log(`Loaded new messages ${newlyloadedMessages}`)
    
    firstMessageLoaded.value = newlyloadedMessages == 0;
    if (newlyloadedMessages == 0)
    { 
      console.log(`First message loaded`)
      setTimeout(() => { firstMessageLoaded.value = false }, 42000);
    }
 
    console.log(`Done loading`)
    loaded()
    olderMessagesLoading.value = false;    
  });
}

</script>

<template>
  <main>
    <div class="wrapper">
      <div class="grid" v-if="!error">
        <loading-bar :active="!initialChannelRequestCompleted || olderMessagesLoading || lastMessageLoading" :always_visible="true"></loading-bar>

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
          
          <vue-eternal-loading v-if="initialChannelRequestCompleted && !firstMessageLoaded" :load="loadMoreMessages">
            <template #loading>
              <div class="loading-dots">
                <span v-for="(char, i) in '...'" :key="i" :style="{ 'animation-delay': `${(i * 60).toString()}ms` }">
                  {{char}}
                </span>
              </div>
              <!-- <div class="loading-dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </div> -->
            </template>
          </vue-eternal-loading>
        </div>


        <div class="chat-controls">
          <input type="text" v-model="message" @keyup.enter="sendMessage" />
        </div>

      </div>

      <error-overlay :message="error_message" v-if="error"></error-overlay>
    </div>
  </main>
</template>

<style scoped>

@keyframes loading_dots_anim
{
  0% { opacity: 1; transform: translateY(10%); }
  50% { opacity: 0; transform: translateY(0%); }
  100% { opacity: 1; transform: translateY(10%); }
}

.channel-start
{
  display: flex;
  height: 1rem;
  width: 100%;
}

.loading-dots
{
  user-select: none;
  display: flex;
  justify-content: center;
}

.loading-dots span
{
  animation-name: loading_dots_anim;
  animation-iteration-count: infinite;
  animation-duration: 1s;
  animation-timing-function: linear;
  font-size: 1.5rem;
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
  background: rgb(60, 62, 68);
}

.first-message-header
{
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.first-message-header h1
{
  font-size: .8rem;
  font-weight: normal;
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

ol
{
  display: flex;
  flex-direction: column-reverse;
  gap: .5rem;
  padding: .3rem;
}

.scrollable
{
  overflow-y: scroll;
  display: flex;
  flex-direction: column-reverse;
}

.chat-controls
{
  padding: .2rem;
  display: flex;
}

.chat-controls input[type="text"]
{
  width: 100%;
}

.grid
{
  display: grid;
  grid-template-rows: auto 1fr 2rem;
  height: 100%;
}

.wrapper {
  box-sizing: border-box;
  height: 100%;
}

h1 {
  text-align: center;
}
</style>
