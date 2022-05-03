<script setup lang="ts">
import TaiyouWindow from "./components/TaiyouWindow.vue";
import GlobalMenu from "./components/GlobalMenu.vue";
import Sinas, { createWindow } from "./window-manager";
import ActionBar from "./components/ActionBar.vue";

// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup

createWindow({componentPath: "TaiyouHelloWorld.vue"});

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

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

a {
  text-decoration: none;
  color: inherit;
}
</style>
