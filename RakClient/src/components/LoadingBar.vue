<script setup lang="ts">

const props = defineProps({ active: { type: Boolean, required: true }, always_visible: { type: Boolean, required: false } });

</script>

<template>
  <span class="loading-bar" :class="[active ? 'active' : '', always_visible == true ? 'force-visible' : '']"></span>
</template>

<style scoped>
@keyframes loading-anim
{
  from { left: -60%; transform: scaleX(100%); }
  to { left: 120%; transform: scaleX(50%); }
}


.loading-bar
{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 0.3rem;
  background: rgba(56, 57, 66);
  opacity: 0;
  transform: scaleY(0%);
  transform-origin: top center;
  transition: opacity .3s linear, transform .2s cubic-bezier(0.21, 0.53, 0.74, 0.51), box-shadow .2s linear;
  overflow: hidden;
}

.force-visible
{
  position: relative;
  opacity: 1;
  transform: scaleY(100%);
}

.loading-bar.active
{
  opacity: 1;
  transform: scaleY(100%);
  box-shadow: 0px 0px 2px black;
}

.loading-bar.active::before
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

</style>