<script setup lang="ts">
import { onActivated, onMounted, ref } from "@vue/runtime-core";
import { socket } from "../../API/ws-api";
import { credentials } from "../../Credentials";
import { getInstance } from "../../window-manager";

const props = defineProps<{ windowID: string }>();
let channelID = "";

onMounted(() => {
  getInstance(props.windowID).title = "Channel";
  channelID = getInstance(props.windowID).arguments[0]

  socket.on(`new_message:${channelID}`, (data: Message) => {
    messages.value = [ data, ...messages.value ];
  })


  socket.emit("get_channel", JSON.stringify({ channel_id: channelID }))
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

socket.on("update_channel", (data: Array<Message>) => {
  data.forEach(message => {
    messages.value.push(message);
  })

});

function sendMessage()
{
  socket.emit("send_message", JSON.stringify({ session_token: credentials.value.session_token, channel_id: channelID, content: message.value }))
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

</script>

<template>
  <main>
    <div class="wrapper">
      <div class="grid">
        <ol>
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
