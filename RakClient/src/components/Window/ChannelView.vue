<script setup lang="ts">
import { onActivated, onMounted, ref } from "@vue/runtime-core";
import { watch } from "vue";
import { socket } from "../../API/ws-api";
import { credentials } from "../../Credentials";
import { getInstance } from "../../window-manager";

const props = defineProps<{ windowID: string }>();
let channelID = ref("");

onMounted(() => {
  getInstance(props.windowID).title = "Channel";
  channelID.value = getInstance(props.windowID).arguments[0]

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
    messages.value.push(message);
  })

});

function sendMessage()
{
  socket.emit("send_message", JSON.stringify({ session_token: credentials.value.session_token, channel_id: channelID.value, content: message.value }))
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

function handleScroll(event: Event)
{
  const element = event.target as HTMLElement;
  // console.log(element.scrollHeight);
  // console.log(element.getBoundingClientRect());
  const isOnTop = element.clientHeight / element.getBoundingClientRect().bottom <= Math.abs(element.scrollTop / (element.scrollHeight - element.clientHeight));
  const isOnBottom = Math.abs(element.scrollTop) <= 16;
  const firstMessage = messages.value[0];
  const lastMessage = messages.value[messages.value.length - 1];

  if (isOnTop && firstMessage != undefined)
  {
    socket.emit("get_channel_older", JSON.stringify({ channel_id: channelID.value, lastMessageID: lastMessage.id }));
  }

}

</script>

<template>
  <main>
    <div class="wrapper">
      <div class="grid">
        <ol :id="`channelview-${channelID}`" @scroll="handleScroll">
          <li v-for="message in messages" :key="message.id" class="message">
            <header>
              <h1>{{ message.ownerUsername }}</h1>
              <p>{{ formatDate(message.date) }}</p>
            </header>
            <p>{{message.content}}</p>
          </li>
        </ol>

        <div class="chat-controls">
          <input type="text" v-model="message" @keyup.enter="sendMessage" />
        </div>

      </div>
    </div>
  </main>
</template>

<style scoped>

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
  overflow-y: scroll;
  margin-bottom: .5rem;
  gap: .5rem;
  padding: .3rem;
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
