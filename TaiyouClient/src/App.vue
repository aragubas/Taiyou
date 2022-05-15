<script setup lang="ts">
import TopBar from './components/TopBar.vue';
import { RouterView } from 'vue-router';
import { UserCredentialsStore } from './store/UserCredentialsStore';
import { Connect } from './API/WsAPI';

const userStore = UserCredentialsStore();

userStore.LoadCredentials();
if (userStore.SessionToken != "")
{
  Connect();
}

</script>

<template>
  <TopBar></TopBar>
  <router-view></router-view>
</template>

<style>
#app
{
  display: grid;
  grid-template-rows: 2rem 1fr;
  height: 100vh;
}
</style>
