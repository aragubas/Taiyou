<script setup lang="ts">
import { computed, onMounted,  ref,  shallowRef } from "@vue/runtime-dom";
import { createWindow, destroyWindow, getInstance } from "../../window-manager";
import Login from "./AccountSetupModals/Login.vue";
import StartScreen from "./AccountSetupModals/StartScreen.vue";
const props = defineProps<{ windowID: string }>();


let screenID = ref(0);


onMounted(() => {
  getInstance(props.windowID).title = "Account Setup";
  getInstance(props.windowID).resizable = false;
});

function goto(screenid: number)
{
  screenID.value = screenid;
}

const currentView = (id: number): any =>
{
  switch (id)
  {
    case 0:
      return StartScreen;

    case 1:
      return Login;

    default:
      return StartScreen;
  }
}

</script>

<template>
  <div class="wrapper">
    <header :class="screenID == 0 ? 'hide' : ''">
      <a class="button" @click="screenID = 0">Back</a>
    </header>

    <Transition>
      <component :is="currentView(screenID)" @goto="goto"></component>
    </Transition>
  </div>
</template>

<style scoped>
.wrapper
{
  overflow: hidden;
}

header
{
  font-size: .7rem;
  transition: transform .5s ease, opacity .5s linear;
  opacity: 1;
}

header.hide
{
  transform: translateY(-100%);
  opacity: 0;
}

.v-enter-active,
.v-leave-active {
  transition: transform .5s ease, opacity .5s linear;
  will-change: transform, opacity;
}

.v-leave-from {
  transform: translateY(0%);
  opacity: 100%;
}

.v-leave-to {
  transform: translateY(-100%);
  opacity: 0%;
}

.v-enter-from {
  transform: translateY(-100%);
  opacity: 0%;
}

.v-enter-to {
  transform: translateY(0%);
  opacity: 100%;
}


</style>