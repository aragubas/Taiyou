<script setup lang="ts">
import { Axios } from "axios";
import { onMounted, ref } from "vue";
import { LoadCredentials, SaveCredentials } from "../../../Credentials";

let email = ref("")
let password = ref("")
let loading = ref(false)
let errorMessage = ref("");

const emit = defineEmits(["goto"])

interface ErrorResponse
{
  message: string;
}

interface SuccessfulResponse
{
  access_token: string;
  user_id: string;
  username: string;
}

async function login()
{  
  errorMessage.value = "";
  
  const request = new Axios({
    baseURL: "http://localhost:3314",
    headers: {
      "Content-Type": "application/json",
    }
  });

  const thing = await request.get("/user", { auth: { username: email.value, password: password.value } });

  if (thing.status == 401)
  {
    const response = JSON.parse(thing.data) as ErrorResponse;

    switch(response.message)
    {
      case "invalid_credentials":
        errorMessage.value = "Invalid username or password.";
        break;
      
      default:
        errorMessage.value = "Unknown error.";
        break;
    }
  } else if (thing.status == 200)
  {
    const response = JSON.parse(thing.data) as SuccessfulResponse;

    SaveCredentials(response.access_token, response.user_id, response.username);

  }

  loading.value = false;
}

function formPayload()
{
  // Prevent calling login twice if already loading
  if (loading.value) { return; }

  loading.value = true;
  login();
}
 
</script>

<template>
  <div class="wrapper" :class="[loading ? 'loading' : '']">
    <span class="loading-bar" :class="[loading ? 'loading' : '']"></span>
    
    <form class="userpanel-form" :class="[loading ? 'loading' : '', errorMessage != '' ? 'error' : '']" v-on:submit.prevent="formPayload">
      <header>
        <h1>Login</h1>
        <p>Fill all boxes below to get started.</p>
      </header>

      <label for="email">Email {{errorMessage != '' ? ` - ${errorMessage}` : ''}}</label>
      <input required type="email" v-model="email" id="email" autocomplete="email" :tabindex="loading ? '-1' : ''" />

      <label for="password">Password {{errorMessage != '' ? ` - ${errorMessage}` : ''}}</label>
      <input required type="password" v-model="password" id="password" autocomplete="current-password" :tabindex="loading ? '-1' : ''" />

      <input type="submit" value="Login" :tabindex="loading ? '-1' : ''" />
    </form>
  </div>
  
</template>

<style scoped>
.userpanel-form
{
  display: flex;
  flex-direction: column;
  gap: .5rem;
  transition: opacity .3s linear;
}

.userpanel-form.loading
{
  opacity: 0.5;
  pointer-events: none;
}

.userpanel-form.loading input
{
  pointer-events: none;
}

.userpanel-form.error label
{
  color: red;
}

label
{
  font-size: .8rem;
}

.back-button
{
  position: absolute;
  top: 0;
  left: 0;
}

input[type="submit"]
{
  margin-top: 1rem;
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
  position: absolute;
  left: 0%;
  right: 0%;
}


.loading-bar
{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 4px;
  background: rgb(60, 62, 68);
  opacity: 0;
  transform: scaleY(0%);
  transform-origin: top center;
  transition: opacity .3s linear, transform .2s cubic-bezier(0.21, 0.53, 0.74, 0.51), box-shadow .2s linear;
  overflow: hidden;
}

.loading-bar.loading
{
  opacity: 1;
  transform: scaleY(100%);
  box-shadow: 0px 0px 2px black;
}

@keyframes loading-anim
{
  from { left: -60%; transform: scaleX(100%); }
  to { left: 100%; transform: scaleX(50%); }
}

.loading-bar.loading::before
{
  content: "";
  animation: loading-anim 3s linear infinite;
  background: rgb(90, 92, 98);
  position: absolute;
  width: 50%;
  height: 100%;
  left: -60%;
  top: 0;
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