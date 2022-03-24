<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  focusedWindow,
  destroyWindow,
  focusWindow,
  getInstance,
} from "../window-manager";

let left = ref(50);
let top = ref(50);

const props = defineProps<{ windowID: string }>();

let moveMouseCapture = ref(false);
let moveMouseInitialX = 0;
let moveMouseInitialY = 0;

let resizeMouseCapture = ref(false);
let resizeMouseInitialX = 0;
let resizeMouseInitialY = 0;

onMounted(() => {
  left.value = window.innerWidth / 2 - getWindow().width / 2;
  top.value = window.innerHeight / 2 - getWindow().height / 2;
});

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
    getWindow().width = event.x - left.value - resizeMouseInitialX;
    getWindow().height = event.y - top.value - resizeMouseInitialY;
  }

  constrainPosition(event);
}

function resizeMouseDown(event: MouseEvent) {
  event.preventDefault();
  focus();
  resizeMouseCapture.value = true;
  resizeMouseInitialX = event.x - (left.value + getWindow().width);
  resizeMouseInitialY = event.y - (top.value + getWindow().height);

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

    if (left.value + getWindow().width >= event.view!.innerWidth) {
      left.value = event.view!.innerWidth - getWindow().width;
    }

    if (top.value < 0) {
      top.value = 0;
    }

    if (top.value + getWindow().height >= event.view!.innerHeight) {
      top.value = event.view!.innerHeight - getWindow().height;
    }
  } else {
    // Keep window inside parent
    if (left.value + getWindow().width > event.view!.innerWidth) {
      getWindow().width = event.view!.innerWidth - left.value;
    }

    if (top.value + getWindow().height > event.view!.innerHeight) {
      getWindow().height = event.view!.innerHeight - top.value;
    }

    if (getWindow().width < getWindow().minWidth) {
      getWindow().width = getWindow().minWidth;
    }

    if (getWindow().height < getWindow().minHeight) {
      getWindow().height = getWindow().minHeight;
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
      width: getWindow().width + 'px',
      height: getWindow().height + 'px',
    }"
    class="window-container"
    :class="[
      focusedWindow == props.windowID ? 'focused' : '',
      getWindow().minimized ? 'minimized' : '',
    ]"
    @click="focus"
  >
    <header>
      <div
        class="window-header"
        @mousedown="moveMouseDown"
        @mouseup="moveMouseUp"
      >
        <div class="window-actions">
          <a
            class="window-button"
            name="close"
            @click="destroyWindow(props.windowID)"
          ></a>

          <a
            class="window-button"
            name="minimize"
            @click="getWindow().minimize()"
          ></a>
        </div>
        <p>{{ getWindow().title }}</p>
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
  transition: border-radius 0.25s ease, transform 0.25s ease, opacity 0.25s ease;
  position: absolute;
  background: rgb(48, 50, 56);
  box-shadow: 0px 0px 1px black;
  border-radius: 2px;
  color: lightgray;
  /* opacity: 1; */
}

@keyframes minimize {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.minimized {
  /* animation: minimize 0.3s ease; */
  opacity: 0;
  transform: scale(50%);
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
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-left: 0.4rem;
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
  background: rgb(130, 132, 148);
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
