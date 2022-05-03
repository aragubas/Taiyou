<script setup lang="ts">
import { onActivated, onMounted } from "@vue/runtime-core";
import { ContextMenuItem, ContextMenuItemType } from "../../ContextMenuItem";
import { GlobalMenuItem } from "../../global-menu";
import { getInstance } from "../../window-manager";

const props = defineProps<{ windowID: string }>();

function fileMenu() {
  alert("File Menu!");
}

onMounted(() => {
  getInstance(props.windowID).title = "Welcome to Taiyou";

  getInstance(props.windowID).globalMenu?.items.push(
    new GlobalMenuItem("File", fileMenu, new Array<ContextMenuItem>(new ContextMenuItem(ContextMenuItemType.Button, 'Test'), new ContextMenuItem(ContextMenuItemType.Separator), new ContextMenuItem(ContextMenuItemType.Button, 'Test2')))
  );
});
</script>

<template>
  <main>
    <div class="wrapper">
      <h1>Welcome to Taiyou</h1>
      <p>Windowed messaging app</p>
      <code>WindowCode: {{ props.windowID }}</code>
      <ul>
        <li>
          
        </li>
      </ul>
    </div>
  </main>
</template>

<style scoped>
.wrapper {
  padding: 1rem;
}

h1 {
  text-align: center;
}
</style>
