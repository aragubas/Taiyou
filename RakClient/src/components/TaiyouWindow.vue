<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, onUnmounted } from "vue";
import {
  focusWindow,
  getInstance,
  focusedWindow,
  destroyWindow
} from "../window-manager";

const props = defineProps<{ windowID: string }>();

let moveMouseCapture = false;
let moveMouseInitialX = 0;
let moveMouseInitialY = 0;
let component = defineAsyncComponent(() => import( /* @vite-ignore */ getWindow.value.componentPath));

let resizeMouseCapture = false;
let resizeMouseInitialX = 0;
let resizeMouseInitialY = 0;

onUnmounted(() => {
  window.removeEventListener("resize", constraintGeometry);
});

onMounted(() => {
  CenterWindow();

  window.addEventListener("resize", constraintGeometry)
});

function CenterWindow()
{
  getInstance(props.windowID).left = window.innerWidth / 2 - getWindow.value.width / 2;
  getInstance(props.windowID).top = window.innerHeight / 2 - getWindow.value.height / 2;
}

const getWindow = computed(() => {
  return getInstance(props.windowID);
})

function moveMouseMove(event: MouseEvent) {
  if ((event.buttons || event.button) != 1) {
    moveEnd();
    return;
  }

  if (moveMouseCapture) {
    getInstance(props.windowID).left = event.x - moveMouseInitialX;
    getInstance(props.windowID).top = event.y - moveMouseInitialY;
  }
  constraintGeometry();
}

function moveMouseDown(event: MouseEvent) {
  event.preventDefault();
  focus();

  moveMouseCapture = true;
 
  const instance = getInstance(props.windowID);
  moveMouseInitialX = event.x - instance.left;
  moveMouseInitialY = event.y - instance.top;

  document.addEventListener("mousemove", moveMouseMove);
}

function moveMouseUp(event: MouseEvent) {
  event.preventDefault();
  moveEnd();
}

function moveEnd() {
  moveMouseCapture = false;
  moveMouseInitialX = 0;
  moveMouseInitialY = 0;

  document.removeEventListener("mousemove", moveMouseMove);
}

function resizeMouseMove(event: MouseEvent) {
  if ((event.buttons || event.button) != 1) {
    resizeEnd();
    return;
  }

  if (resizeMouseCapture) {
    getWindow.value.width = event.x - getInstance(props.windowID).left - resizeMouseInitialX;
    getWindow.value.height = event.y - getInstance(props.windowID).top - resizeMouseInitialY;
  }

  constraintGeometry();
}

function resizeMouseDown(event: MouseEvent) {
  event.preventDefault();
  focus();
  resizeMouseCapture = true;
  resizeMouseInitialX = event.x - (getInstance(props.windowID).left + getWindow.value.width);
  resizeMouseInitialY = event.y - (getInstance(props.windowID).top + getWindow.value.height);

  document.addEventListener("mousemove", resizeMouseMove);
}

function resizeMouseUp(event: MouseEvent) {
  event.preventDefault();
  resizeEnd();
}

function constraintGeometry() {
  // Keep window inside viewport
  if (!resizeMouseCapture) {
    if (getInstance(props.windowID).left < 0) {
      getInstance(props.windowID).left = 0;
    }

    if (getInstance(props.windowID).left + getWindow.value.width >= window.innerWidth) {
      getInstance(props.windowID).left = window.innerWidth - getWindow.value.width;
    }

    if (getInstance(props.windowID).top < 0) {
      getInstance(props.windowID).top = 0;
    }
    
    if (getInstance(props.windowID).top + getWindow.value.height >= window.innerHeight) {
      getInstance(props.windowID).top = window.innerHeight - getWindow.value.height;
    }

  } else {
    // Keep window inside parent
    if (getInstance(props.windowID).left + getWindow.value.width > window.innerWidth) {
      getWindow.value.width = window.innerWidth - getInstance(props.windowID).left;
    }

    if (getInstance(props.windowID).top + getWindow.value.height > window.innerHeight) {
      getWindow.value.height = window.innerHeight - getInstance(props.windowID).top;
    }

    if (getWindow.value.width < getWindow.value.minWidth) {
      getWindow.value.width = getWindow.value.minWidth;
    }

    if (getWindow.value.height < getWindow.value.minHeight) {
      getWindow.value.height = getWindow.value.minHeight;
    }
  }
}

function resizeEnd() {
  resizeMouseCapture = false;
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
      left: getWindow.left + 'px',
      top: getWindow.top + 'px',
      width: getWindow.width + 'px',
      height: getWindow.height + 'px',
    }"
    class="window-container"
    :class="[
      focusedWindow == props.windowID ? 'focused' : '',
      getWindow.minimized ? 'minimized' : '',
    ]"
    @mousedown="focus"
  >
    <header>
      <div class="window-header" @mousedown="moveMouseDown" @mouseup="moveMouseUp" >
        <div class="window-actions">
          <a class="window-button" name="close" @click="destroyWindow(props.windowID)"></a>

          <a class="window-button" name="minimize" @click="getWindow.minimize()"></a>
        </div>
        <p>{{ getWindow.title }}</p>
      </div>
    </header>

    <main>
      <component :is="component" :windowID="windowID" />
    </main>

    <span class="resize-handle" @mousedown="resizeMouseDown" @mouseup="resizeMouseUp" v-if="getWindow.resizable">
      ...
    </span>


  </div>
</template>

<style scoped>
.window-container {
  display: flex;
  flex-direction: column;
  transition: transform 0.25s ease, opacity 0.25s ease;
  position: absolute;
  background: rgb(48, 50, 56);
  box-shadow: 0px 0px 1px black;
  border-radius: 6px;
  color: lightgray;
  /* opacity: 1; */
  overflow: hidden;
}
.focused {
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.8);
  background: rgb(50, 52, 58);
  color: white;
}

.minimized {
  opacity: 0;
  transform: scale(95%);
  pointer-events: none;
}

.resize-handle {
  position: absolute;
  bottom: 0px;
  right: 1px;
  font-size: 0.7rem;
  user-select: none;
  color: rgba(255, 255, 255, 0.3);
  cursor: se-resize;
}

main {
  position: relative;
  background: inherit;
  width: 100%;
  height: 100%;
  overflow: auto;
  user-select: initial;
  border-bottom-right-radius: 6px;
  border-bottom-left-radius: 6px;
  padding: 0 !important;
}

main::-webkit-scrollbar {
  border-bottom-right-radius: 5px;
}

.window-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 1.5rem;
  padding: 0 0.3rem;
  user-select: none;
  background: rgba(70, 72, 84, 0.3);
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
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

.window-button[name="close"]:hover::before {
  content: "🗙";
  font-size: .6rem;
  display: flex;
  justify-content: center;
  line-height: .8rem;
}

.window-button:hover {
  background: rgb(150, 152, 164);
}

.window-button[name="minimize"]:hover::before {
  content: "🗕";
  font-size: .7rem;
  display: flex;
  justify-content: center;
  line-height: .5rem;
}
</style>
