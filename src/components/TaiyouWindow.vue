<script setup lang="ts">
import { getCurrentInstance, Ref, ref } from "vue";
import { focusedWindow, focusWindow } from "../window-manager";

let title = ref("Sinas");
let left = ref(50);
let top = ref(50);
let width = ref(400);
let height = ref(300);

const props = defineProps<{ windowID: string }>();

let moveMouseCapture = ref(false);
let moveMouseInitialX = 0;
let moveMouseInitialY = 0;

let resizeMouseCapture = ref(false);
let resizeMouseInitialX = 0;
let resizeMouseInitialY = 0;

function moveMouseMove(event: MouseEvent) {
  if ((event.buttons || event.button) != 1) {
    moveEnd();
    return;
  }

  if (moveMouseCapture.value) {
    left.value = event.x - moveMouseInitialX;
    top.value = event.y - moveMouseInitialY;
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

function moveMouseDown(event: MouseEvent) {
  event.preventDefault();
  focus();
  moveMouseCapture.value = true;
  moveMouseInitialX = event.x - left.value;
  moveMouseInitialY = event.y - top.value;

  document.addEventListener("mousemove", moveMouseMove);
}

function moveMouseUp(event: MouseEvent) {
  event.preventDefault();
  moveEnd();
}

function moveEnd() {
  moveMouseCapture.value = false;
  moveMouseInitialX = 0;
  moveMouseInitialY = 0;

  document.removeEventListener("mousemove", moveMouseMove);
}

function resizeMouseMove(event: MouseEvent) {
  if ((event.buttons || event.button) != 1) {
    resizeEnd();
    return;
  }

  if (resizeMouseCapture.value) {
    width.value = event.x - left.value - resizeMouseInitialX;
    height.value = event.y - top.value - resizeMouseInitialY;
  }
}

function resizeMouseDown(event: MouseEvent) {
  event.preventDefault();
  focus();
  resizeMouseCapture.value = true;
  resizeMouseInitialX = event.x - (left.value + width.value);
  resizeMouseInitialY = event.y - (top.value + height.value);

  document.addEventListener("mousemove", resizeMouseMove);
}

function resizeMouseUp(event: MouseEvent) {
  event.preventDefault();
  resizeEnd();
}

function resizeEnd() {
  resizeMouseCapture.value = false;
  resizeMouseInitialX = 0;
  resizeMouseInitialY = 0;
  document.removeEventListener("mousemove", resizeMouseMove);
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
      moveMouseCapture ? 'grab' : '',
      focusedWindow == props.windowID ? 'focused' : '',
    ]"
    @click="focus"
  >
    <header>
      <div
        class="window-header"
        @mousedown="moveMouseDown"
        @mouseup="moveMouseUp"
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

    <span
      class="resize-handle"
      @mousedown="resizeMouseDown"
      @mouseup="resizeMouseUp"
      >...</span
    >
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
