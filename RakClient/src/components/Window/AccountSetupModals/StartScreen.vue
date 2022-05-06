<script setup lang="ts">
const emit = defineEmits(["goto"])

</script>

<template>
  <div class="wrapper">
    <header>
      <h1>Welcome to Taiyou</h1>
      <p>Your account is not set up yet. Select one of the following options to get started.</p>
    </header>

    <ul>
      <li><a class="button" @click="emit('goto', 1)">Login</a></li>
      <li><a class="button" @click="emit('goto', 0)">Register</a></li>
    </ul>
  </div>
</template>

<style scoped>
.wrapper
{
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;

  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 1rem;
  gap: 1.5rem;

}

header
{
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .5rem;
}

ul
{
  display: flex;
  gap: .5rem;
  justify-content: center;
  width: 100%;
}


</style>