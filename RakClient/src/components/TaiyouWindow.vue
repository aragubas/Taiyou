<script setup lang="ts">
import { computed, defineAsyncComponent, defineComponent, onMounted, onUnmounted, ref } from "vue";
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
let resizeMouseCapture = false;
let resizeMouseInitialX = 0;
let resizeMouseInitialY = 0;
let component = defineAsyncComponent(() => import( /* @vite-ignore */ getInstance(props.windowID)!.componentPath));

onUnmounted(() => {
  window.removeEventListener("resize", constraintGeometry);
});

onMounted(() => {
  CenterWindow();

  window.addEventListener("resize", constraintGeometry);
});

// Center the window on the screen
function CenterWindow()
{
  const instance = getInstance(props.windowID)!;

  instance.left = window.innerWidth / 2 - instance.width / 2;
  instance.top = window.innerHeight / 2 - instance.height / 2;
}

function moveMouseMove(event: MouseEvent) {
  event.preventDefault();
  if ((event.buttons || event.button) != 1) {
    moveEnd();
    return;
  }

  if (moveMouseCapture) {
    const instance = getInstance(props.windowID)!;
    instance.left = event.x - moveMouseInitialX;
    instance.top = event.y - moveMouseInitialY;
  }
  constraintGeometry();
}

function moveMouseDown(event: MouseEvent) {
  event.preventDefault();
  focus();

  moveMouseCapture = true;
 
  const instance = getInstance(props.windowID)!;
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
  event.preventDefault();
  if ((event.buttons || event.button) != 1) {
    resizeEnd();
    return;
  }

  if (resizeMouseCapture) {
    const instance = getInstance(props.windowID)!;

    instance.width = event.x - instance.left - resizeMouseInitialX;
    instance.height = event.y - instance.top - resizeMouseInitialY;
  }

  constraintGeometry();
}

function resizeMouseDown(event: MouseEvent) {
  event.preventDefault();
  focus();
  const instance = getInstance(props.windowID)!;
  resizeMouseCapture = true;
  resizeMouseInitialX = event.x - (instance.left + instance.width);
  resizeMouseInitialY = event.y - (instance.top + instance.height);

  document.addEventListener("mousemove", resizeMouseMove);
}

function resizeMouseUp(event: MouseEvent) {
  event.preventDefault();
  resizeEnd();
}

function constraintGeometry() {
  const instance = getInstance(props.windowID)!;

  // Keep window inside viewport
  if (!resizeMouseCapture) {
    if (instance.left < 0) {
      instance.left = 0;
    }

    if (instance.left + instance.width >= window.innerWidth) {
      instance.left = window.innerWidth - instance.width;
    }

    if (instance.top < 0) {
      instance.top = 0;
    }
    
    if (instance.top + instance.height >= window.innerHeight) {
      instance.top = window.innerHeight - instance.height;
    }

  } else {
    // Keep window inside parent
    if (instance.left + instance.width > window.innerWidth) {
      instance.width = window.innerWidth - instance.left;
    }

    if (instance.top + instance.height > window.innerHeight) {
      instance.height = window.innerHeight - instance.top;
    }

    if (instance.width < instance.minWidth) {
      instance.width = instance.minWidth;
    }

    if (instance.height < instance.minHeight) {
      instance.height = instance.minHeight;
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

const windowInstance = computed(() => {
  return getInstance(props.windowID)!;
})
</script>

<template>
  <div
    v-bind:style="{
      left: windowInstance.left + 'px',
      top: windowInstance.top + 'px',
      width: windowInstance.width + 'px',
      height: windowInstance.height + 'px',
    }"
    class="window-container"
    :class="[
      focusedWindow == props.windowID ? 'focused' : '',
      windowInstance.minimized ? 'minimized' : '',
    ]"
    @mousedown="focus"
  >
    <header>
      <div class="window-header" @mousedown="moveMouseDown" @mouseup="moveMouseUp" >
        <div class="window-actions">
          <a class="window-button" name="close" @click="destroyWindow(props.windowID)" v-if="windowInstance.closeable"></a>

          <a class="window-button" name="minimize" @click="windowInstance.minimize()"></a>
        </div>
        <p>{{ windowInstance.title }}</p>
      </div>
    </header>

    <main>
      <component :is="component" :windowID="windowID" />
    </main>

    <span class="resize-handle" @mousedown="resizeMouseDown" @mouseup="resizeMouseUp" v-if="windowInstance.resizable">
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
  background: rgba(70, 72, 84, .3);
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
