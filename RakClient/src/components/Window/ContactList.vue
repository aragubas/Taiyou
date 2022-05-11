<script setup lang="ts">
import { createWindow, getInstance } from "../../window-manager";
import { defineProps, onMounted, onUnmounted, ref, Ref } from "@vue/runtime-core";
import { v4 } from "uuid";
import { socket, Connected } from "../../API/ws-api";
import LoadingBar from "../LoadingBar.vue";
import ErrorOverlay from "../Overlays/ErrorOverlay.vue";
const props = defineProps<{ windowID: string }>();

let UpdateUsersTimer: number;
let loading = ref(false);
let requested = false;
let requestedLoadingBar: number;

interface UpdateContactResponse
{
  usernames: Array<string>
}

socket.on("disconnect", onDisconnected)
socket.on("connected", () => { loading.value = true; })

function onDisconnected()
{
  contacts.value.splice(0, contacts.value.length);  
}

socket.on("update_friend_list", UpdateContactList)
async function UpdateContactList(data: any)
{
  const response = data as UpdateContactResponse

  const newContactList = Array<Contact>();

  response.usernames.forEach(user => {
    newContactList.push(new Contact(user, "Unknown"))  
  });

  if (JSON.stringify(newContactList) != JSON.stringify(contacts.value)) {
    contacts.value = newContactList;
  }

  loading.value = false;

  clearTimeout(requestedLoadingBar);

  requested = false;
}

class Contact
{
  username: string;
  status: string;
  id: string;

  constructor(username: string, status: string)
  {
    this.username = username;
    this.status = status;
    this.id = v4();
  }
}

const contacts: Ref<Array<Contact>> = ref(new Array<Contact>());

onMounted(() => {
  getInstance(props.windowID).title = "Contacts";
  getInstance(props.windowID).closeable = false;
  
  UpdateUsersTimer = setInterval(RequestContactList, 2000, null);
  RequestContactList();

  createWindow({componentPath: "GroupList.vue", width: 200, height: 300});
})

onUnmounted(() => {
  clearInterval(UpdateUsersTimer);
  socket.off("update_friend_list", UpdateContactList)
  socket.off("disconnected", onDisconnected)
})

function RequestContactList()
{
  if (Connected.value == false) { requested = false; return; }
  if (requested == true) { return; }

  socket.emit("get_friend_list");

  requestedLoadingBar = setTimeout(() => { if(!requested) { return; } loading.value = true; }, 500, null);
 
  loading.value = true;
  requested = true;
}

</script>

<template>
  <div class="wrapper">
    <LoadingBar :active="loading" :always_visible="true" v-if="Connected"></LoadingBar>

    <ErrorOverlay v-if="!Connected" :message="'Disconnected'"></ErrorOverlay>

    <ol v-if="Connected">
      <li v-for="contact in contacts" :key="contact.id" class="contact">
        <span class="profilepicture"></span>

        <div class="username-box">
          <p>{{contact.username}}</p>
          <i>{{contact.status}}</i>
        </div>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.wrapper
{
  display: flex;
  flex-direction: column;
  height: 100%;
}


ol
{
  display: flex;
  flex-direction: column;
  gap: .5rem;
  overflow-y: auto;
  padding: .5rem;
}

i
{
  font-size: .7rem;
}

.username-box
{
  display: flex;
  align-items: center;
  min-width: 50px;
  gap: .5rem;

  flex: 1;
}

.contact span.profilepicture
{
  width: 32px;
  height: 32px;
  min-width: 32px;
  background: rgb(80, 82, 88);
  border-radius: 100%;
}

.username-box p
{
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.contact
{
  display: flex;
  align-items: stretch;
  gap: .5rem;
  background: rgb(60, 62, 68);
  border-radius: 4px;
  padding: .4rem;
}
</style>
