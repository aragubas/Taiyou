<script setup lang="ts">
import TaiyouWindow from "./components/TaiyouWindow.vue";
import GlobalMenu from "./components/GlobalMenu.vue";
import Sinas, { createWindow } from "./window-manager";
import ActionBar from "./components/ActionBar.vue";
import { LoadCredentials } from "./Credentials";

// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup

// Create account window if no credentials are found
if (localStorage.getItem("credentials") == null)
{
  createWindow({componentPath: "AccountSetup.vue", width: 440, height: 320, closeable: false});
}else
{
  LoadCredentials();
  createWindow({componentPath: "Welcome.vue", width: 800, height: 600});
}

</script>

<template>
  <GlobalMenu></GlobalMenu>
  <main>
    <TaiyouWindow v-for="window in Sinas" :key="window.id" :windowID="window.id">
    </TaiyouWindow>
  </main>
  <ActionBar></ActionBar>
</template>

<style>
body {
  background: linear-gradient(90deg, rgb(30, 40, 48), rgb(40, 42, 58));
  color: rgb(200, 200, 200);
  font-family: Arial, Helvetica, sans-serif;
  margin: 0;
}

*::-webkit-scrollbar {
  width: 0.5rem;
  height: 0.5rem;
  background: rgb(40, 42, 48);
}
*::-webkit-scrollbar-thumb {
  background: rgba(50, 52, 62, 0.9);
  background-clip: content-box;
  border-radius: 0.5rem;
  border: 0.15rem solid transparent;
}

*::-webkit-scrollbar-corner {
  background: transparent;
}

p,
h1 {
  margin: 0;
}

ul, ol {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

a {
  text-decoration: none;
  color: inherit;
}

input[type="text"], input[type="email"], input[type="password"]
{
  background: rgb(60, 62, 68);
  border: none;
  padding: .2rem;
  border-radius: 4px;
  color: white;
}

input[type="password"]
{
  font-family: monospace;
}

*:focus
{
  outline: none;
  box-shadow: 0px 0px 2px rgb(230, 232, 238);
}

.button
{
  display: inline-block;
  border: none;
  background: rgb(60, 62, 68);
  padding: .3rem;
  color: white;
  border-radius: 4px;
  user-select: none;
}
 
.button:active
{
  background: rgb(90, 92, 98);
}

.button:hover
{
  background: rgb(70, 72, 78);
  cursor: pointer;
}


</style>
