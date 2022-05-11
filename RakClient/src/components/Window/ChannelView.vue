<script setup lang="ts">
import { onActivated, onMounted, ref } from "@vue/runtime-core";
import { watch } from "vue";
import { socket } from "../../API/ws-api";
import { credentials } from "../../Credentials";
import { getInstance } from "../../window-manager";
import { VueEternalLoading, LoadAction } from '@ts-pro/vue-eternal-loading';

const props = defineProps<{ windowID: string }>();
let channelID = ref("");
let firstMessageLoaded = ref(false);
let initialChannelRequest = ref(false);
let channelName = ref("");
let parentGroupName = ref("");


onMounted(() => {  
  const windowArguments = getInstance(props.windowID)!.arguments;
  channelID.value = windowArguments[0];
  channelName.value = windowArguments[1];
  parentGroupName.value = windowArguments[2];

  getInstance(props.windowID)!.title = `Channel ${channelName.value} in ${parentGroupName.value}`;

  socket.on(`new_message:${channelID.value}`, (data: Message) => {
    messages.value = [ data, ...messages.value ];
  })


  socket.emit("get_channel", JSON.stringify({ channel_id: channelID.value }))
});

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

watch(messages, (newValue: Array<Message>) => {
  if (newValue.length > 20) { newValue = newValue.splice(20) }
})

socket.on("update_channel", (data: Array<Message>) => {
  data.forEach(message => {
    addMessage(message);
  })

  if (!initialChannelRequest.value) { initialChannelRequest.value = true; }
});

function sendMessage()
{
  socket.emit("send_message", JSON.stringify({ channel_id: channelID.value, content: message.value }))
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

function ceira({loaded}: LoadAction)
{
  if (messages.value.length < 1 || firstMessageLoaded.value == true) { return; }

  let newlyloadedMessages = 0;
  socket.emit("get_channel_older", JSON.stringify({ channel_id: channelID.value, lastMessageID: messages.value[messages.value.length -1].id }), (response: Array<Message> | null) => {
    if (response == null) { return; }
    response.forEach(message => {
      if (addMessage(message))
      {
        newlyloadedMessages++;
      }
    })

    console.log(`Loading new messages ${newlyloadedMessages}`)
    if (newlyloadedMessages == 0) 
    { 
      console.log(`First message loaded`)
      firstMessageLoaded.value = true; 
      setTimeout(() => { firstMessageLoaded.value = false }, 42000);
    }

    loaded()
  });
}

</script>

<template>
  <main>
    <div class="wrapper">
      <div class="grid">
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
          
          <vue-eternal-loading v-if="initialChannelRequest && !firstMessageLoaded" :load="ceira">
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
  margin-bottom: .5rem;
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
  grid-template-rows: 1fr 2rem;
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
