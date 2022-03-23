<script setup lang="ts">
import { Ref, ref } from "vue";

let title = ref("Sinas");
let left = ref(50);
let top = ref(50);
let width = ref(400);
let height = ref(300);

let mouseCapture = false;
let mouseInitialX = 0;
let mouseInitialY = 0;

function mouseMove(event: MouseEvent) {
  event.preventDefault();

  if (mouseCapture) {
    left.value = event.x - mouseInitialX;
    top.value = event.y - mouseInitialY;
  }
}

function mouseDown(event: MouseEvent) {
  event.preventDefault();

  mouseCapture = true;
  mouseInitialX = event.x - left.value;
  mouseInitialY = event.y - top.value;
}

function mouseUp(event: MouseEvent) {
  event.preventDefault();

  mouseCapture = false;
  mouseInitialX = 0;
  mouseInitialY = 0;
}
</script>

<template>
  <div
    v-bind:style="{
      left: left + 'px',
      top: top + 'px',
      width: width + 'px',
      height: height + 'px',
    }"
    class="window-container"
  >
    <header>
      <div
        class="window-header"
        @mousemove="mouseMove"
        @mousedown="mouseDown"
        @mouseup="mouseUp"
      >
        <p>{{ title }}</p>
        <div class="window-actions">
          <a href="#" class="window-button">🗙</a>
          <a href="#" class="window-button">🗗</a>
          <a href="#" class="window-button">🗕</a>
        </div>
      </div>
    </header>

    <main>
      <slot />
    </main>
  </div>
</template>

<style scoped>
.window-container {
  position: absolute;
  box-shadow: 0px 0px 1px black;
}

main {
  position: relative;
  background: black;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.window-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgb(50, 52, 58);
  height: 1.5rem;
  padding: 0 0.3rem;
}

.window-actions {
  display: flex;
  gap: 0.2rem;
}

.window-button {
  display: flex;
  align-items: center;
  width: 1rem;
  height: 1rem;
  color: rgb(220, 220, 220);
}

.window-button:hover {
  color: white;
}
</style>
