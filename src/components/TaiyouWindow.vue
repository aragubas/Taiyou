<script setup lang="ts">
import { onMounted, ref } from "vue";
import { focusedWindow, focusWindow, getInstance } from "../window-manager";

let left = ref(50);
let top = ref(50);
let width = ref(400);
let height = ref(300);
let minWidth = ref(200);
let minHeight = ref(150);

const props = defineProps<{ windowID: string }>();

let moveMouseCapture = ref(false);
let moveMouseInitialX = 0;
let moveMouseInitialY = 0;

let resizeMouseCapture = ref(false);
let resizeMouseInitialX = 0;
let resizeMouseInitialY = 0;

function getWindow() {
  return getInstance(props.windowID);
}

function moveMouseMove(event: MouseEvent) {
  if ((event.buttons || event.button) != 1) {
    moveEnd();
    return;
  }

  if (moveMouseCapture.value) {
    left.value = event.x - moveMouseInitialX;
    top.value = event.y - moveMouseInitialY;
  }
  constrainPosition(event);
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

  constrainPosition(event);
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

function constrainPosition(event: MouseEvent) {
  // Keep window inside viewport
  if (!resizeMouseCapture.value) {
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
  } else {
    // Keep window inside parent
    if (left.value + width.value > event.view!.innerWidth) {
      width.value = event.view!.innerWidth - left.value;
    }

    if (top.value + height.value > event.view!.innerHeight) {
      height.value = event.view!.innerHeight - top.value;
    }

    if (width.value < minWidth.value) {
      width.value = minWidth.value;
    }

    if (height.value < minHeight.value) {
      height.value = minHeight.value;
    }
  }
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
        <p>{{ getWindow().title }}</p>
        <div class="window-actions">
          <a
            class="window-button"
            name="close"
            @click="getWindow().onClose()"
          ></a>

          <a
            class="window-button"
            name="minimize"
            @click="getWindow().onMinimize()"
          ></a>
        </div>
      </div>
    </header>

    <main :id="'taiyouwindow-' + windowID">
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
  cursor: se-resize;
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
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 1.5rem;
  padding: 0 0.3rem;
  user-select: none;
  background: linear-gradient(rgba(70, 72, 82, 0.2) 0%, transparent);
}

.window-header p {
  position: absolute;
  left: 2.3rem;
  right: 0.3rem;
  text-align: center;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 98%;
}

.window-actions {
  display: flex;
  gap: 0.2rem;
}

.window-button {
  width: 0.8rem;
  height: 0.8rem;
  color: lightgray;
  border-radius: 100%;
  background: rgb(130, 132, 142);
}

.window-button[name="close"] {
  background: rgb(180, 132, 132);
}

.window-button[name="close"]:hover {
  background: rgb(210, 142, 148);
}

.window-button:hover {
  background: rgb(150, 152, 164);
}
</style>
