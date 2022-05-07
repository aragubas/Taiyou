<script setup lang="ts">
import { getInstance } from "../../window-manager";
import { defineProps, onMounted } from "@vue/runtime-core";
const props = defineProps<{ windowID: string }>();

onMounted(() => {
  getInstance(props.windowID).title = "Contacts";
  getInstance(props.windowID).closeable = false;
})

</script>

<template>
  <div class="wrapper">

  </div>
</template>

<style scoped>

</style>
