<script setup lang="ts">
const properties = defineProps<{ message: string }>();
</script>

<template>
  <div class="wrapper">
    <h1>&#128473;</h1>
    <p>{{ properties.message }}</p>
  </div>
</template>

<style scoped>
.wrapper
{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>