<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { ContextMenuItem, ContextMenuItemType } from "../ContextMenuItem";

const props = defineProps<{ items: Array<ContextMenuItem>, x: number, y: number }>();
const event = defineEmits(['onClose'])

var mouseOut = ref(false);

onMounted(() => {
  document.addEventListener("click", testClose);
});

onUnmounted(() => {
  document.removeEventListener("click", testClose);
});

function testClose()
{
  console.log(mouseOut.value);
  if (!mouseOut.value) { return; }
  event('onClose', {});
}

</script>

<template>
  <ol :style="{'left': `${x}px`, 'top': `${y}px`}" id="context-menu" @mouseenter="mouseOut = false" @mouseleave="mouseOut = true">
    <li v-for="item in items">
      <a v-if="item.type == ContextMenuItemType.Button" @click="item.callback">{{ item.text }}</a>
      <span class="separator" v-if="item.type == ContextMenuItemType.Separator"></span>
    </li>
  </ol>  
</template>

<style scoped>
ol {
  list-style-type: none;
  background: linear-gradient(rgb(60, 62, 68), rgb(50, 52, 58));
  position: fixed;
  margin: 0;
  padding: .5rem;
  z-index: 4;
  display: flex;
  flex-flow: column;
  gap: .2rem;
  border-radius: .2rem;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, .5);
  font-size: 0.8rem;

}

a {
  display: block;
  padding: .2rem;
  border-radius: .2rem;
}

a:hover {
  background: rgb(80, 82, 88);
  cursor: pointer;
}

.separator {
  display: block;
  height: 1px;
  width: 100%;
  background: rgba(240, 240, 255, 0.1);
}

</style>