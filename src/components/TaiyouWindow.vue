<script setup lang="ts">
import { getCurrentInstance, Ref, ref } from "vue";
import { focusWindow } from "../window-manager";

let title = ref("Sinas");
let left = ref(50);
let top = ref(50);
let width = ref(400);
let height = ref(300);
let focused = ref(true);
let parent = getCurrentInstance();

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

  mouseCapture.value = true;
  mouseInitialX = event.x - left.value;
  mouseInitialY = event.y - top.value;
}

function mouseUp(event: MouseEvent) {
  event.preventDefault();
  focusWindow(props.windowID);
  dragEnd();
}

function dragEnd() {
  mouseCapture.value = false;
  mouseInitialX = 0;
  mouseInitialY = 0;
}

function focus() {
  // console.log(windowID.value);
  // focusWindow(windowID.value);
  focused.value = true;
}

function unfocus() {
  focused.value = false;
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
    :class="[mouseCapture ? 'grab' : '', focused ? 'focused' : '']"
    v-on:mouseleave="unfocus()"
    v-on:mouseenter="focus()"
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
  transition: box-shadow 0.25s ease, border-radius 0.25s ease,
    background 0.25s ease;
  position: absolute;
  background: rgb(48, 50, 56);
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.4);
}

.grab {
  will-change: top, left, width, height, transform;
}

.focused {
  box-shadow: 0px 0px 1px black;
  border-radius: 5px;
  background: rgb(50, 52, 58);
}

main {
  position: relative;
  background: inherit;
  width: 100%;
  height: calc(100% - 1.5rem);
  overflow: auto;
}

.window-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
