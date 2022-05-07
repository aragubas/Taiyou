<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "@vue/runtime-core";
import { Connect, Connected, socket } from "../../../API/ws-api";

const emit = defineEmits(["toggle_backbutton", "goto", "setup_complete"])
let loading = ref(true)
let credentialError = ref(false)

function handleLoginError()
{
  loading.value = false;
  credentialError.value = true;
}

watch(Connected, (newValue) => {
  if (newValue == true)
  {
    emit("setup_complete");
  }
})

onMounted(() => {
  emit("toggle_backbutton");

  socket.on("credential_error", handleLoginError)
  Connect();

});

onUnmounted(() => {
  socket.off("credential_error", handleLoginError)

})

const center_message = computed(() => {
  if (credentialError.value == true)
  {
    return "Login Error"
  }

  return "Logging in..."
})

</script>

<template>
  <div class="wrapper">
    <span class="loading-bar" :class="[loading ? 'loading' : '']"></span>
    <div class="center">
      <h1>{{center_message}}</h1>
      <p v-if="credentialError">Invalid credentials, please log in again</p>

      <button v-if="credentialError" class="button" @click="emit('goto', 1)">Log In</button>
    </div>

  </div>


</template>

<style scoped>
.wrapper
{
  display: flex;
  box-sizing: border-box;
  padding: .5rem;
  position: absolute;
  left: 0%;
  right: 0%;
  bottom: 0%;
  top: 0%;
  justify-content: center;
  align-items: center;
}

.center
{
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loading-bar
{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: .3rem;
  background: rgba(70, 72, 84, 0.3);
  opacity: 0;
  transform: scaleY(0%);
  transform-origin: top center;
  transition: opacity .3s linear, transform .2s cubic-bezier(0.21, 0.53, 0.74, 0.51), box-shadow .2s linear;
  overflow: hidden;
}

.loading-bar.loading
{
  opacity: 1;
  transform: scaleY(100%);
  box-shadow: 0px 0px 2px black;
}

.loading-bar.loading::before
{
  content: "";
  animation: loading-anim 3s linear infinite;
  background: rgb(90, 92, 98);
  position: absolute;
  width: 50%;
  height: 100%;
  left: -60%;
  top: 0;
}

@keyframes loading-anim
{
  from { left: -60%; transform: scaleX(100%); }
  to { left: 100%; transform: scaleX(50%); }
}

</style>