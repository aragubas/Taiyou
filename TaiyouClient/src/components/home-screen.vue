<script setup lang="ts">
import { useRoute } from "vue-router";
import sidebar from "./sidebar.vue";
const route = useRoute();

</script>

<template>
  <div class="wrapper">
    <sidebar></sidebar>
    <router-view :key="route.params.groupID"></router-view>
  </div>  
</template>

<style scoped>
.wrapper
{
  display: grid;
  grid-template-columns: 2.375rem 1fr;
}
</style>