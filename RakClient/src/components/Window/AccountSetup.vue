<script setup lang="ts">
import { computed, onMounted,  ref,  shallowRef, watch } from "@vue/runtime-dom";
import { GlobalMenuItem } from "../../global-menu";
import { createWindow, destroyWindow, getInstance } from "../../window-manager";
import Login from "./AccountSetupModals/Login.vue";
import Register from "./AccountSetupModals/Register.vue";
import StartScreen from "./AccountSetupModals/StartScreen.vue";
const props = defineProps<{ windowID: string }>();

let screenID = ref(0);
let backbutton_hidden = ref(true);

watch(screenID, () =>{
  if (screenID.value == 0) 
  { 
    backbutton_hidden.value = true; 
  
  }else {
    backbutton_hidden.value = false;
  }

})

watch(backbutton_hidden, (newValue: boolean) =>{
  if (!newValue)
  {
    getInstance(props.windowID).globalMenu?.items.push(new GlobalMenuItem("Back to Start Screen", () => { screenID.value = 0; }));

  }else
  {
    getInstance(props.windowID).globalMenu?.items.splice(0, getInstance(props.windowID).globalMenu?.items.length);
  }
})

onMounted(() => {
  getInstance(props.windowID).title = "Account Setup";
  getInstance(props.windowID).resizable = false;
  getInstance(props.windowID).width = 300;
  getInstance(props.windowID).width = 400;
});

function goto(screenid: number)
{
  screenID.value = screenid;
}

function toggle_backbutton()
{
  backbutton_hidden.value = !backbutton_hidden.value;
}

function account_setup_complete()
{
  destroyWindow(props.windowID);
  createWindow({componentPath: "ContactList.vue", width: 800, height: 600});
}

const currentView = (id: number): any =>
{
  switch (id)
  {
    case 0:
      return StartScreen;

    case 1:
      return Login;

    case 2:
      return Register;

    default:
      return StartScreen;
  }
}

</script>

<template>
  <div class="wrapper">
    <Transition>
      <component :is="currentView(screenID)" @goto="goto" @toggle_backbutton="toggle_backbutton"></component>
    </Transition>
  </div>
</template>

<style scoped>
.wrapper
{
  overflow: hidden;
}

@keyframes header_animation
{
  from { opacity: 1; transform: translateY(0%); }
  to { opacity: 0; transform: translateY(-100%); }
}

.v-enter-active,
.v-leave-active {
  transition: transform .5s ease, opacity .5s ease;
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