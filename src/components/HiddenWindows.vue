<script setup lang="ts">
import Sinas, { focusWindow, getInstance } from "../window-manager";

function _focusWindow(id: string) {
  getInstance(id).toggleMinimize();
}
</script>

<template>
  <div class="container">
    <ul>
      <li v-for="window in Sinas" :key="window.id">
        <a
          class="button"
          :minimized="window.minimized"
          @click="_focusWindow(window.id)"
          >{{ window.title }}</a
        >
      </li>
    </ul>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  transition: left 0.3s cubic-bezier(0.175, 0.885, 0.32, 1), opacity 0.25s ease;
  position: absolute;
  width: 12rem;
  padding: 0.3rem;
  bottom: 0px;
  top: 0px;
  background: rgba(60, 62, 68, 0.98);
  left: -12rem;
  top: 1.2rem;
  opacity: 0.3;
  overflow: hidden;
}

ul {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.container:hover {
  left: 0px;
  opacity: 1;
}

.button {
  transition: background-color 0.3s ease, color 0.3s ease;
  display: block;
  background-color: rgba(40, 42, 48, 0.5);
  padding: 0.5rem;
  user-select: none;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: 4px;
}

.button[minimized="true"] {
  background-color: rgba(20, 22, 34, 0.5);
  color: rgba(255, 255, 255, 0.5);
}
</style>
