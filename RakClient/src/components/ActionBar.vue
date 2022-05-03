<script setup lang="ts">
import { ref } from "vue";
import { NotificationList } from "../notifications-manager";
import Sinas, { focusWindow, getInstance } from "../window-manager";

let notificationsVisible = ref(false);
let autoHide = ref(true);

function _focusWindow(id: string) {
  getInstance(id).toggleMinimize();
}

function toggleAutohide() {
  if (notificationsVisible.value) {
    autoHide.value = false;
    return;
  }

  if (!notificationsVisible.value) {
    autoHide.value = !autoHide.value;
  }
}

function toggleNotifications() {
  notificationsVisible.value = !notificationsVisible.value;
  autoHide.value = !notificationsVisible.value;
}
</script>

<template>
  <div class="container" :class="autoHide ? 'autohide' : ''">
    <ul class="window-list">
      <li v-for="window in Sinas" :key="window.id">
        <a class="button" :minimized="window.minimized" @click="_focusWindow(window.id)">
          {{ window.title }}
        </a>
      </li>
    </ul>

    <div class="actions-panel">
      <span class="user-img"></span>

      <ul class="actions-controls">
        <li>
          <img
            class="button-icon"
            :src="autoHide ? 'hide.svg' : 'keep.svg'"
            @click="toggleAutohide()"
          />
        </li>

        <li>
          <img class="button-icon" src="gear.svg" />
        </li>

        <li>
          <img
            class="button-icon"
            src="bell.svg"
            @click="toggleNotifications()"
          />
        </li>
      </ul>
    </div>
  </div>

  <div class="notifications-container" :class="notificationsVisible ? 'notifications-show' : ''">
    <header>
      <div class="notifications-header">
        <p>Notifications</p>
      </div>
    </header>

    <ol class="notifications">
      <li v-for="notification in NotificationList" :key="notification.id" class="notification">
        <h1>{{ notification.title }}</h1>
        <p>{{ notification.message }}</p>
      </li>
    </ol>
  </div>

</template>

<style scoped>
.notifications-container {
  display: flex;
  flex-direction: column;
  position: absolute;
  background: rgb(50, 52, 58);
  width: 18rem;
  height: 14rem;
  left: 0;
  opacity: 0;
  transition: opacity 0.25s ease, left 0.25s ease;
  bottom: 0.5rem;
  box-shadow: 0px 0px 1px black;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  z-index: 0;
}

.notification {
  background: rgb(40, 42, 48);
  border-radius: 6px;
  padding: 0.3rem;
}

.notification h1 {
  font-size: 0.7rem;
  font-weight: bold;
}

.notifications {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: auto;
  list-style: none;
  padding: 0.5rem;
  margin: 0;
}

.notifications::-webkit-scrollbar {
  border-bottom-right-radius: 6px;
}

.notifications-show {
  left: 12.6rem;
  opacity: 1;
}

.notifications-header {
  background: rgb(60, 62, 68);
  border-top-right-radius: 6px;
  padding: 0.3rem;
}

.container {
  transition: left 0.3s cubic-bezier(0.1, 0.53, 0.03, 0.96), opacity 0.25s ease, background 0.25s ease;
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
  z-index: 1;
  box-shadow: 0px 0px 2px black;

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
  transition-delay: 0.5s;

  left: -12rem;
  opacity: 0.3;
}
.autohide:hover {
  transition-delay: 0.1s;
  left: 0px;
  background: rgb(50, 52, 58);
  opacity: 1;
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
  background-color: rgba(40, 42, 48, 1);
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
