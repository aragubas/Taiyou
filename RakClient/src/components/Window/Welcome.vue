<script setup lang="ts">
import { onActivated, onMounted, ref } from "@vue/runtime-core";
import { v4 } from "uuid";
import { ContextMenuItem, ContextMenuItemType } from "../../ContextMenuItem";
import { GlobalMenuItem } from "../../global-menu";
import { getInstance } from "../../window-manager";
import { Manager } from "socket.io-client";
import { credentials } from "../../Credentials"

function fileMenu() {
  alert("File Menu!");
}

function thingMenu()
{
  alert("thing");
}

const props = defineProps<{ windowID: string }>();

onMounted(() => {
  getInstance(props.windowID).title = "Chat Test";

  // Global Menu test items
  getInstance(props.windowID).globalMenu?.items.push(new GlobalMenuItem("File", undefined, new Array<ContextMenuItem>(new ContextMenuItem(ContextMenuItemType.Button, 'Test', fileMenu), new ContextMenuItem(ContextMenuItemType.Separator), new ContextMenuItem(ContextMenuItemType.Button, "Thing", thingMenu))));
  getInstance(props.windowID).globalMenu?.items.push(new GlobalMenuItem("Thing", thingMenu))
});


interface Message
{
  username: string;
  content: string;
  id: string;
}

const messages = ref(Array<Message>());
const manager = new Manager("http://localhost:3313");
const socket = manager.socket("/");
let message = ref("");

socket.on("receive-message", async (data) => {
  messages.value.push(JSON.parse(data) as Message);
})

function sendMessage()
{
  socket.emit("message", JSON.stringify({ content: message.value, username: credentials!.value.username }));

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
}

.chat-controls
{
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
  padding: .5rem;
  height: 100%;
}

h1 {
  text-align: center;
}
</style>
