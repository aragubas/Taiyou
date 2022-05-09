<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "@vue/runtime-core";
import { Connect, Connected, socket } from "../../../API/ws-api";
import LoadingBar from "../../LoadingBar.vue";

const emit = defineEmits(["toggle_backbutton", "goto", "setup_complete"])
let loading = ref(true)
let Error = ref(false)
let ErrorTitle = ref("")
let ErrorMessage = ref("")
let IsConnectionError = ref(false)

function setError()
{
  loading.value = false;
  Error.value = true;
}

function connectionError()
{
  setError();
  IsConnectionError.value = true;
  ErrorTitle.value = "Connection Failed";
  ErrorMessage.value = "Could not connect to the server. Please check your internet connection and try again.";
}

socket.on("connect_error", connectionError)
socket.on("connect_failed", connectionError)


watch(Connected, (newValue) => {
  if (newValue == true)
  {
    emit("setup_complete");
  }
})

onMounted(() => {
  emit("toggle_backbutton");

  socket.on("credential_error", setError)
  Connect();

});

onUnmounted(() => {
  socket.off("credential_error", setError)
  socket.off("connect_error", connectionError)
  socket.off("connect_failed", connectionError)
})

function TryReconnect()
{
  loading.value = true;
  Error.value = false;
  IsConnectionError.value = false;

  Connect();
}

const center_message = computed(() => {
  if (Error.value == true)
  {
    return ErrorTitle.value
  }

  return "Logging in..."
})

</script>

<template>
  <div class="wrapper">
    <LoadingBar :active="loading"></LoadingBar>

    <div class="center">
      <h1>{{center_message}}</h1>
      <p v-if="Error">{{ErrorMessage}}</p>

      <button v-if="Error && !IsConnectionError" class="button" @click="emit('goto', 0)">Back</button>
      <button v-if="Error && IsConnectionError" class="button" @click="TryReconnect()">Try Again</button>
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