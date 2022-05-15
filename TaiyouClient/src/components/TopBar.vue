<script setup lang="ts">
import { Disconnect } from '../API/WsAPI';
import { UserCredentialsStore } from '../store/UserCredentialsStore';
const credentialsStore = UserCredentialsStore();

function LogOut()
{
  credentialsStore.LogOff();
  Disconnect();
}

</script>

<template>
  <div class="wrapper">
    <div class="user-area">
      <div class="settings">
        <img src="/settings.svg" class="icon icon-button" alt="Settings Icon" />
        <router-link :to="'/login'" v-on:click="LogOut">
          <img src="/logout.svg" class="icon icon-button" alt="Logout Icon" v-if="credentialsStore.IsLoggedIn" />
        </router-link>
      </div>

      <div class="user-account" v-if="credentialsStore.IsLoggedIn">
        <img src="/blank-circle.svg" class="icon icon-button" alt="Logout Icon" />
        <p>@{{ credentialsStore.Username }}</p>

      </div>

    </div>
  </div>
</template>

<style scoped>
.wrapper
{
  display: flex;
  justify-content: space-between;
  height: 2rem;
  background-color: var(--background-panel);
  box-shadow: 0px 1px 1px rgba(0, 0, 0, .25);
  z-index: 1;
}

.icon
{
  width: 1.5rem;
  height: 1.5rem;
}

.icon-button:hover
{
  cursor: pointer;
}

.settings
{
  background-color: var(--background-panel-elevation);
  display: flex;
  align-items: center;
  gap: var(--space-sl);
  height: 2rem;
  padding: var(--space-sm);
  box-sizing: border-box;
}

a
{
  display: flex;
  align-items: center;
}

.user-area
{
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  height: 2rem;
}

.user-account
{
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.user-account p
{
  display: flex;
  align-items: center;
  font-size: 1rem;
  line-height: 1rem;
}


</style>