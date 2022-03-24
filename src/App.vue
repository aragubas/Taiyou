<script setup lang="ts">
import TaiyouWindow from "./components/TaiyouWindow.vue";
import GlobalMenu from "./components/GlobalMenu.vue";
import Sinas, { createWindow } from "./window-manager";
import HiddenWindows from "./components/HiddenWindows.vue";
import TaiyouHelloWorld from "./components/TaiyouHelloWorld.vue";

// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
</script>

<template>
  <GlobalMenu></GlobalMenu>
  <main>
    <TaiyouWindow
      v-for="window in Sinas"
      :key="window.id"
      :windowID="window.id"
    >
    </TaiyouWindow>
  </main>
  <TaiyouHelloWorld></TaiyouHelloWorld>
  <TaiyouHelloWorld></TaiyouHelloWorld>
  <HiddenWindows></HiddenWindows>
</template>

<style>
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}

body {
  background: rgb(40, 42, 52);
  color: rgb(200, 200, 200);
  font-family: Arial, Helvetica, sans-serif;
  margin: 0;
}

*::-webkit-scrollbar {
  width: 0.5rem;
  height: 0.5rem;
  background: rgb(30, 32, 38);
}
*::-webkit-scrollbar-thumb {
  background: rgb(50, 52, 62);
  background-clip: content-box;
  border-radius: 0.5rem;
  border: 0.15rem solid transparent;
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
