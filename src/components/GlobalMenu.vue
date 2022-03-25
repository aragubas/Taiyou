<script setup lang="ts">
import { reactive } from "@vue/reactivity";
import { GlobalMenuInstance } from "../global-menu";
import { focusedWindow, getInstance, WindowInstance } from "../window-manager";

function getFocusedWindow(): WindowInstance | undefined {
  return getInstance(focusedWindow.value);
}
</script>

<template>
  <div class="container">
    <div>
      <ul v-if="!getFocusedWindow()?.minimized">
        <li
          v-for="item in getFocusedWindow()?.globalMenu?.items"
          :key="item.id"
        >
          <a @click="item.callback">{{ item.text }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
  height: 1.4rem;
  width: 100%;
  box-sizing: border-box;
  font-size: 0.8rem;
  padding: 0 0.5rem;

  background: rgb(60, 62, 68);
  box-shadow: 0px 0px 1px black;
}

a {
  user-select: none;
}

a:hover {
  color: white;
}

ul {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0px;
  list-style: none;
  /* height: 1.2rem; */
}
</style>
