<script setup lang="ts">
import { onMounted, ref } from '@vue/runtime-dom';
import { getInstance } from '../../window-manager';
const props = defineProps<{ windowID: string }>();

let groupName = ref("")

onMounted(() => {
  const window = getInstance(props.windowID);
  if (window != undefined)
  {
    window.title = "New Group";
  }
})

</script>

<template>
  <div class="wrapper">
    <form>
      <label for="groupName">Group Name</label>
      <input id="groupName" type="text" v-model="groupName" />
    </form>
  </div>
</template>

<style scoped>
.wrapper
{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

form
{
  display: flex;
  flex-direction: column;
  gap: .5rem;
}

</style>