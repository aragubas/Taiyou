<script setup lang="ts">
import { reactive } from "@vue/reactivity";
import { Ref, ref } from "vue";
import { ContextMenuItem, ContextMenuItemType } from "../ContextMenuItem";
import { GlobalMenuInstance, GlobalMenuItem } from "../global-menu";
import { focusedWindow, getInstance, WindowInstance } from "../window-manager";
import ContextMenu from "./ContextMenu.vue";

let items: Ref<Array<ContextMenuItem>> = ref([]);

let x = ref(0);
let y = ref(0);

let contextMenuActive = ref(false);

function getFocusedWindow(): WindowInstance | undefined {
  return getInstance(focusedWindow.value);
}

function menuItemClick(item: GlobalMenuItem)
{
  if (item.context_menu)
  {
      contextMenuActive.value = true;
      
      if (item.context_menu != undefined)
      {
        items.value = item.context_menu
      } 
  }else
  {
    if (item.callback) { item.callback(); }
  }
}

function mouseMove(event: MouseEvent)
{
  if (contextMenuActive.value) { return; }
  x.value = event.x;
  y.value = event.y;
}

function contextMenuClose()
{
  contextMenuActive.value = false;
}

</script>

<template>
  <div class="container" @mousemove="mouseMove">
    <!-- <v-contextmenu-item></v-contextmenu-item> -->

    <div>
      <ul v-if="!getFocusedWindow()?.minimized">
        <li
          v-for="item in getFocusedWindow()?.globalMenu?.items" :key="item.id">
          <a @click="menuItemClick(item)">{{ item.text }}</a>
        </li>
      </ul>
    </div>
  
    <ContextMenu :items="items" :x="x" :y="y" v-if="contextMenuActive" @on-close="contextMenuClose"></ContextMenu>
  </div>

</template>

<style scoped>
.container {
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
  height: 1.4rem;
  width: 100%;
  box-sizing: border-box;
  font-size: 0.8rem;
  padding: 0 0.5rem;

  background: rgb(60, 62, 68);
  box-shadow: 0px 0px 1px black;
}

a {
  user-select: none;
}

a:hover {
  color: white;
}

ul {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0px;
  list-style: none;
  /* height: 1.2rem; */
}
</style>
