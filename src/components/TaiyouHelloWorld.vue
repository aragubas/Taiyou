<script setup lang="ts">
import { onMounted, ref } from "vue";
import { createWindow } from "../window-manager";

const window = ref("");

function onClose() {}
function onMinimize() {}

onMounted(() => {
  window.value = createWindow({ title: "Hello World", onClose, onMinimize });
});
</script>

<template>
  <Teleport :to="'#' + window" v-if="window != ''">
    <h1>Hello World</h1>
  </Teleport>
</template>

<style scoped></style>
