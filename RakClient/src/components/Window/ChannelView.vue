<script setup lang="ts">
import { onActivated, onMounted, ref } from "@vue/runtime-core";
import { socket } from "../../API/ws-api";
import { getInstance } from "../../window-manager";

const props = defineProps<{ windowID: string }>();

onMounted(() => {
  getInstance(props.windowID).title = "Channel";

  socket.emit("get_channel", { id: "cfa495d3-ba1a-497e-8a6a-3ea35e4e1723" })
});

interface Message
{
  username: string;
  content: string;
  id: string;
}

const messages = ref(Array<Message>());
let message = ref("");

socket.on("update_channel", (data: Message) => {
  messages.value.push(data);
});

function sendMessage()
{

  message.value = "";
}

</script>

<template>
  <main>
    <div class="wrapper">
      <div class="grid">
        <ol>
          <li v-for="message in messages" :key="message.id" class="message">
            <h1>{{message.username}}</h1>
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
.message h1
{
  text-align: left;
  font-size: 1.2rem;
  font-weight: normal;
}

ol
{
  display: flex;
  flex-direction: column;
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
