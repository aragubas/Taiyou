<script setup lang="ts">
import TaiyouWindow from "./components/TaiyouWindow.vue";
import GlobalMenu from "./components/GlobalMenu.vue";
import Sinas, { createWindow } from "./window-manager";

createWindow();
createWindow();

// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
</script>

<template>
  <main id="windows-container">
    <GlobalMenu></GlobalMenu>
    <TaiyouWindow
      v-for="window in Sinas"
      :key="window.id"
      :windowID="window.id"
    >
      {{ window.id }}
    </TaiyouWindow>
  </main>
</template>

<style>
body {
  background: rgb(40, 42, 52);
  color: rgb(200, 200, 200);
  font-family: Arial, Helvetica, sans-serif;
  margin: 0;
}

a {
  text-decoration: none;
  color: inherit;
}
</style>
