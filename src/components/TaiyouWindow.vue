<script setup lang="ts">
import { getCurrentInstance, Ref, ref } from "vue";
import { focusedWindow, focusWindow } from "../window-manager";

let title = ref("Sinas");
let left = ref(50);
let top = ref(50);
let width = ref(400);
let height = ref(300);

const props = defineProps<{ windowID: string }>();

let mouseCapture = ref(false);
let mouseInitialX = 0;
let mouseInitialY = 0;

function mouseMove(event: MouseEvent) {
  if ((event.buttons || event.button) != 1) {
    dragEnd();
    return;
  }

  if (mouseCapture.value) {
    left.value = event.x - mouseInitialX;
    top.value = event.y - mouseInitialY;
  }

  // Keep window inside viewport
  if (left.value < 0) {
    left.value = 0;
  }

  if (left.value + width.value >= event.view!.innerWidth) {
    left.value = event.view!.innerWidth - width.value;
  }

  if (top.value < 0) {
    top.value = 0;
  }

  if (top.value + height.value >= event.view!.innerHeight) {
    top.value = event.view!.innerHeight - height.value;
  }
}

function mouseDown(event: MouseEvent) {
  event.preventDefault();
  focus();
  mouseCapture.value = true;
  mouseInitialX = event.x - left.value;
  mouseInitialY = event.y - top.value;
}

function mouseUp(event: MouseEvent) {
  event.preventDefault();
  dragEnd();
}

function dragEnd() {
  mouseCapture.value = false;
  mouseInitialX = 0;
  mouseInitialY = 0;
}

function focus() {
  focusWindow(props.windowID);
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
    :class="[
      mouseCapture ? 'grab' : '',
      focusedWindow == props.windowID ? 'focused' : '',
    ]"
    @click="focus"
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

    <span class="resize-handle">...</span>
  </div>
</template>

<style scoped>
.window-container {
  display: flex;
  flex-direction: column;
  transition: border-radius 0.25s ease;
  position: absolute;
  background: rgb(48, 50, 56);
  box-shadow: 0px 0px 1px black;
  border-radius: 2px;
  color: lightgray;
}

.grab {
  will-change: top, left, width, height, transform;
}

.resize-handle {
  position: absolute;
  bottom: 0px;
  right: 0px;
  font-size: 0.7rem;
  user-select: none;
  color: rgba(255, 255, 255, 0.5);
}

.focused {
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.8);
  border-radius: 5px;
  background: rgb(50, 52, 58);
  color: white;
}

main {
  position: relative;
  background: inherit;
  width: 100%;
  height: calc(100% - 1.5rem);
  overflow: auto;
  user-select: initial;
}

.window-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 1.5rem;
  padding: 0 0.3rem;
  user-select: none;
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
  color: lightgray;
}

.window-button:hover {
  color: white;
}
</style>
