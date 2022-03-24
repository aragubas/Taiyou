<script setup lang="ts">
import Sinas, { focusWindow, getInstance } from "../window-manager";

function _focusWindow(id: string) {
  getInstance(id).toggleMinimize();
}
</script>

<template>
  <ul>
    <li v-for="window in Sinas" :key="window.id">
      <a class="button" @click="_focusWindow(window.id)">{{ window.title }}</a>
    </li>
  </ul>
</template>

<style scoped>
ul {
  transition: left 0.3s cubic-bezier(0.175, 0.885, 0.32, 1), opacity 0.25s ease;
  position: absolute;
  width: 8rem;
  padding: 0;
  bottom: 0px;
  top: 0px;
  background: rgba(60, 62, 68, 0.98);
  left: -7.5rem;
  top: 1.2rem;
  opacity: 0.3;
}

ul:hover {
  left: 0px;
  opacity: 1;
}

.button {
  background-color: rgba(40, 42, 48, 0.5);
  padding: 0.5rem;
  display: block;
  user-select: none;
}
</style>
