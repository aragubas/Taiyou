<script setup lang="ts">
import { ref } from "vue";
import Sinas, { focusWindow, getInstance } from "../window-manager";

function _focusWindow(id: string) {
  getInstance(id).toggleMinimize();
}
</script>

<template>
  <div class="container">
    <ul class="window-list">
      <li v-for="window in Sinas" :key="window.id">
        <a
          class="button"
          :minimized="window.minimized"
          @click="_focusWindow(window.id)"
          >{{ window.title }}</a
        >
      </li>
    </ul>

    <div class="actions-panel">
      <span class="user-img"></span>

      <ul class="actions-controls">
        <li>
          <img class="button-icon" src="gear.svg" />
        </li>

        <li>
          <img class="button-icon" src="bell.svg" />
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.3rem;
  position: absolute;
  width: 12rem;
  padding: 0.3rem;
  bottom: 0px;
  top: 0px;
  background: rgb(60, 62, 68);
  top: 1.4rem;
  overflow: hidden;
}

.button-icon {
  display: flex;
  align-items: center;
  width: 1.2rem;
  height: 1.2rem;
  padding: 0.5rem;
  background: rgb(80, 82, 88);
  border-radius: 4px;
}

.button-icon:hover {
  background: rgb(90, 92, 98);
}

.user-img {
  border-radius: 100%;
  width: 2rem;
  height: 2rem;
  background: gray;
}

.autohide {
  transition: left 0.3s cubic-bezier(0.1, 0.53, 0.03, 0.96), opacity 0.25s ease;
  transition-delay: 0.5s;

  left: -12rem;
  opacity: 0.3;
}
.autohide:hover {
  transition-delay: 0.1s;
  left: 0px;
  opacity: 0.95;
}

.window-list {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  overflow-y: auto;
  padding-bottom: 1rem;
  padding-right: 0.2rem;
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

.actions-panel {
  display: flex;
  justify-self: center;

  gap: 0.5rem;
  background: rgb(60, 62, 68);
}

.actions-controls {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.button[minimized="true"] {
  background-color: rgba(20, 22, 34, 0.5);
  color: rgba(255, 255, 255, 0.5);
}
</style>
