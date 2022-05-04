<script setup lang="ts">
import { getInstance } from "../../window-manager";

import { onMounted, ref } from "vue";
import { LoadCredentials, SaveCredentials } from "../../Credentials";

const props = defineProps<{ windowID: string }>();

let username = ref("")

onMounted(() => {
  getInstance(props.windowID).title = "Account Setup";
});

function login()
{
  SaveCredentials(username.value);
  window.location.reload();
}
 
</script>

<template>
  <div class="wrapper">
    <h1>Welcome to Taiyou</h1>
    <p>Your account is not set up yet, fill all the boxes below to continue.</p>

    <form class="userpanel-form" v-on:submit.prevent="login">
      <label for="username">Username</label>
      <input required type="text" v-model="username" id="username" />
      <input type="submit" value="Submit" />
    </form>
  </div>
  
</template>

<style scoped>
form
{
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input[type="submit"]
{
  border: none;
  background: rgb(60, 62, 68);
  padding: .3rem;
  color: white;
  border-radius: 4px;
}

input[type="submit"]:active
{
  background: rgb(80, 82, 88);
}


.wrapper
{
  box-sizing: border-box;
  padding: .5rem;
}

h1
{
  text-align: center;
}

p
{
  margin: 1rem;
  text-align: center;
}
</style>