<script setup lang="ts">
import { GlobalMenuInstance } from "../global-menu";
import { focusedWindow, getInstance, WindowInstance } from "../window-manager";

function getFocusedWindow(): GlobalMenuInstance | undefined {
  return getInstance(focusedWindow.value).globalMenu;
}
</script>

<template>
  <div v-if="getInstance(focusedWindow) != undefined">
    <nav v-for="item in getFocusedWindow()?.items" :key="item.id">
      <p>{{ item.text }}</p>
    </nav>
  </div>
</template>

<style scoped>
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 1.2rem;
  font-size: 0.8rem;
  padding: 0 0.5rem;

  background: rgb(60, 62, 68);
  box-shadow: 0px 0px 1px black;
}

ul {
  display: flex;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
}
</style>
