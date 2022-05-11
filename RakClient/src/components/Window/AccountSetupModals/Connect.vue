<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "@vue/runtime-core";
import { Connect, Connected, socket } from "../../../API/ws-api";
import LoadingBar from "../../LoadingBar.vue";

const emit = defineEmits(["toggle_backbutton", "goto", "setup_complete"])
let loading = ref(true)
let error = ref(false)
let errorTitle = ref("")
let errorMessage = ref("")
let isConnectionError = ref(false)

function setError()
{
  loading.value = false;
  error.value = true;
}

function connectionError()
{
  setError();
  isConnectionError.value = true;
  errorTitle.value = "Connection Failed";
  errorMessage.value = "Could not connect to the server. Please check your internet connection and try again.";
}

function connectError(data?: any)
{
  if (data instanceof Error)
  {
    const message = (data as Error).message;

    switch (message)
    {
      case "credential_error":
        credentialError();
        return;
    }
  }

  connectionError();
}

function credentialError()
{
  setError();
  isConnectionError.value = false;
  errorTitle.value = "Authentication Failed";
  errorMessage.value = "Could not log in. Please log-in again.";
}

// Register events to main socket
socket.on("connect_error", connectError)
socket.on("connect_failed", connectionError)
socket.on("credential_error", credentialError)
socket.on("disconnect", connectionError)

// Calls setup_complete when successfully connected
watch(Connected, (newValue) => {
  if (newValue == true)
  {
    emit("setup_complete");
  }
})

onMounted(() => {
  emit("toggle_backbutton");

  Connect();
});

onUnmounted(() => {
  socket.off("credential_error", credentialError)
  socket.off("connect_error", connectionError)
  socket.off("connect_failed", connectionError)
})

function TryReconnect()
{
  loading.value = true;
  error.value = false;
  isConnectionError.value = false;

  Connect();
}

const center_message = computed(() => {
  if (error.value == true)
  {
    return errorTitle.value
  }

  return "Logging in..."
})

</script>

<template>
  <div class="wrapper">
    <LoadingBar :active="loading"></LoadingBar>

    <div class="center">
      <h1>{{center_message}}</h1>
      <p v-if="error">{{errorMessage}}</p>

      <button v-if="error && !isConnectionError" class="button" @click="emit('goto', 0)">Back</button>
      <button v-if="error && isConnectionError" class="button" @click="TryReconnect()">Try Again</button>
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
  text-align: center;
}
</style>