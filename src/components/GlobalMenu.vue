<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  props: {
    title: { default: "sinas" },
    left: { default: 50 },
    top: { default: 50 },
    width: { default: 400 },
    height: { default: 300 },
  },
});
</script>

<template>
  <nav>
    <ul>
      <li><a href="#">File</a></li>
      <li>Edit</li>
      <li>Selection</li>
      <li>View</li>
      <li>Go</li>
      <li>Run</li>
      <li>Terminal</li>
      <li>Help</li>
    </ul>
  </nav>
  skskskskskskskskskskskskskksskskskskksksksksksksksksksksksksksksksksksk
  skskskskskskskskskskskskskksskskskskksksksksksksksksksksksksksksksksksk
  skskskskskskskskskskskskskksskskskskksksksksksksksksksksksksksksksksksk
  skskskskskskskskskskskskskksskskskskksksksksksksksksksksksksksksksksksk
  skskskskskskskskskskskskskksskskskskksksksksksksksksksksksksksksksksksk
  skskskskskskskskskskskskskksskskskskksksksksksksksksksksksksksksksksksk
  skskskskskskskskskskskskskksskskskskksksksksksksksksksksksksksksksksksk
  skskskskskskskskskskskskskksskskskskksksksksksksksksksksksksksksksksksk
</template>

<style scoped>
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 1.2rem;
  font-size: 0.8rem;
  padding: 0 0.5rem;

  background: rgb(60, 62, 68);
  box-shadow: 0px 0px 1px black;
}

ul {
  display: flex;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
}
</style>
