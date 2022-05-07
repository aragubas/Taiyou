<script setup lang="ts">
import { getInstance } from "../../window-manager";
import { defineProps, onMounted, onUnmounted, ref, Ref } from "@vue/runtime-core";
import { v4 } from "uuid";
import { SessionToken, socket } from "../../API/ws-api";
const props = defineProps<{ windowID: string }>();

let UpdateUsersTimer: number;

interface UpdateContactResponse
{
  usernames: Array<string>
}

socket.on("update_friend_list", UpdateContactList)
function UpdateContactList(data: any)
{
  const response = data as UpdateContactResponse

  contact_examples.value.splice(0, contact_examples.value.length);

  response.usernames.forEach(user => {
    contact_examples.value.push(new Contact(user, "Unknown"))  
  });
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

const contact_examples: Ref<Array<Contact>> = ref(new Array<Contact>());

onMounted(() => {
  getInstance(props.windowID).title = "Contacts";
  getInstance(props.windowID).closeable = false;
  
  UpdateUsersTimer = setInterval(RequestContactList, 2000, null);
})

onUnmounted(() => {
  clearInterval(UpdateUsersTimer);
})

function RequestContactList()
{
  socket.emit("get_friend_list", SessionToken);

}

</script>

<template>
  <div class="wrapper">
    <ol>
      <li v-for="contact in contact_examples" :key="contact.id" class="contact">
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
  padding: .5rem;
}

ol
{
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
