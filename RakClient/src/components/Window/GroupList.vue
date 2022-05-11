
<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "@vue/runtime-dom";
import { destroyWindow, getInstance } from "../../window-manager";
import GroupList from "./GroupListModals/GroupList.vue";
import GroupInfo from "./GroupListModals/GroupInfo.vue";
const props = defineProps<{ windowID: string }>();
let screenID = ref(0);
let groupViewID = ref("")

onMounted(() => {
  getInstance(props.windowID).title = "Groups";
  getInstance(props.windowID).closeable = false;
})

function currentView(id: number): any
{
  switch(screenID.value)
  {
    case 0:
      getInstance(props.windowID).title = "Groups";
      return GroupList

    case 1:
      getInstance(props.windowID).title = "Group Info";
      return GroupInfo

    default:
      return GroupList
  }
}

function setGroupViewID(groupID: string)
{
  groupViewID.value = groupID;
}

function goto(newScreenID: number)
{
  screenID.value = newScreenID;
}

</script>

<template>
  <div class="wrapper">
    <Transition>
      <component :is="currentView(screenID)" @goto="goto" @setGroupViewID="setGroupViewID" :groupID="groupViewID"></component>
    </Transition>
  </div>

</template>

<style scoped>
.wrapper
{
  display: flex;
  flex-direction: column;
  height: 100%;
}

.v-enter-active,
.v-leave-active {
  transition: transform .3s ease, opacity .3s ease;
  will-change: transform, opacity;
}
 
.v-leave-from {
  transform: translateX(0%);
  opacity: 100%;
}

.v-leave-to {
  transform: translateX(-100%);
  opacity: 0%;
}

.v-enter-from {
  transform: translateX(-100%);
  opacity: 0%;
}

.v-enter-to {
  transform: translateX(0%);
  opacity: 100%;
}
</style>