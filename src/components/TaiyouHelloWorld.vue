<script setup lang="ts">
import { getCurrentInstance, getCurrentScope, onMounted, ref } from "vue";
import { createWindow, getInstance, WindowInstance } from "../window-manager";

const window = ref("");

function onClose() {}
function onMinimize() {}
function onRestore() {}
function windowInstance(): WindowInstance {
  return getInstance(window.value)!;
}

onMounted(() => {
  window.value = createWindow({
    title: "Welcome",
    onClose,
    onMinimize,
    onRestore,
  });
});
</script>

<template>
  <Teleport :to="'#' + window" v-if="window != ''">
    <main>
      <h1>Welcome to Taiyou</h1>
      <p>Cloud-Storage and cloud-computing with virtual desktop environment!</p>
    </main>
  </Teleport>
</template>

<style scoped>
main {
  padding: 0.5rem;
}

h1 {
  text-align: center;
}
</style>
