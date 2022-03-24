<script setup lang="ts">
import { onActivated, onMounted } from "@vue/runtime-core";
import { getInstance } from "../window-manager";

const props = defineProps<{ windowID: string }>();

onMounted(() => {
  getInstance(props.windowID).title = "sinas do caldo de pilha";
});
</script>

<template>
  <main>
    <h1>Welcome to Taiyou</h1>
    <p>Cloud-Storage and cloud-computing with virtual desktop environment!</p>
    <code>{{ props.windowID }}</code>
  </main>
</template>

<style scoped>
main {
  padding: 0.5rem;
}

h1 {
  text-align: center;
}
</style>
