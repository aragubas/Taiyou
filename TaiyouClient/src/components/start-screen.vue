<script setup lang="ts">
import { ref } from '@vue/runtime-dom';
import { UserCredentialsStore } from '../store/UserCredentialsStore';
import { router } from '../main'
import { Connect } from '../API/WsAPI';
import { Login } from '../API/HttpAPI';

const userStore = UserCredentialsStore();
const email = ref("ceira@sinas.com")
const password = ref("12345")
const loading = ref(false)
const errorMessage = ref("")

async function login()
{
  const response = await Login(email.value, password.value);

  if (response == undefined)
  {
    errorMessage.value = "Unknown error bruh";

  }else
  {
    // Successfully logged in
    if (response.success)
    {
      console.log("Successfully logged in");
      Connect();

      router.push('/');

      loading.value = false;
      return;

    }else
    {
      errorMessage.value = response.message;
    }

  }

  loading.value = false;
}

function submitLogin()
{
  if (loading.value) { return; }
  loading.value = true;
  errorMessage.value = "";

  login();

  userStore.Username = "ceira"
}

</script>

<template>
  <div class="wrapper">
    <form @submit.prevent="submitLogin" :class="[loading ? 'loading' : '']">
      <label for="email">Email</label>
      <input type="email" id="email" autocomplete="email" required v-model="email" tabindex="0" :disabled="loading">

      <label for="password">Password</label>
      <input type="password" autocomplete="current-password" required v-model="password" tabindex="0" id="password" :disabled="loading">      

      <p class="error">{{errorMessage}}</p>

      <div class="submit-area">
        <input type="submit" tabindex="0" value="Login" :disabled="loading">
      </div>
    </form>
  </div>
</template>

<style scoped>
.wrapper
{
  display: flex;
  align-items: center;
  justify-content: center;
}

form
{
  min-width: 20rem;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-m);
  background-color: var(--background-panel);
  border-radius: var(--border-m);
  transition: opacity 0.3s ease;
}

form.loading
{
  opacity: 0.5;
}

p.error
{
  color: rgb(255, 100, 100);
  text-align: center;
}

.submit-area
{
  margin-top: var(--space-m);
  display: flex;
  justify-content: center;
}
</style>