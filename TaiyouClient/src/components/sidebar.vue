<script setup lang="ts">
import { onUnmounted, ref } from '@vue/runtime-core';
import { socket } from '../API/WsAPI';
import { GroupStore } from '../store/GroupsStore';
import { router } from '../main';

const groupStore = GroupStore();

function gotoGroup(groupID: string)
{
  router.push(`/group/${groupID}`);
}

</script>

<template>
  <div class="wrapper">
    <ol>
      <li class="round tooltip" v-for="group in groupStore.Groups" :key="group.id" @click="gotoGroup(group.id)">
        <span class="tooltip-text">{{group.name}}</span>
      </li>      
    </ol>
  </div>  
</template>

<style scoped>
.wrapper
{
  background: var(--background-panel-elevation);
}

ol
{
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) 0 var(--space-sm) 0;
}

.round
{
  min-width: 2rem;
  min-height: 2rem;
  width: 2rem;
  height: 2rem;
  background-color: var(--background-control);
  border-radius: 100%;
  transition: border-radius .25s ease, background .25s ease;
}
.round:hover
{
  cursor: pointer;
}

.tooltip
{
  position: relative;
  display: inline-block;
}

.tooltip .tooltip-text
{
  visibility: hidden;
  background-color: var(--background-panel-elevation);
  color: var(--text-normal);
  text-align: center;
  padding: var(--space-sm);
  border-radius: var(--border-m);
  max-width: 7rem;

  transform: translateX(2rem) scale(90%);
  transform-origin: left;

  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  position: absolute;
  z-index: 1;
  opacity: 0;

  transition: opacity .25s ease, transform .3s ease;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, .5);
  user-select: none;
}

.round:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
  transform: translateX(2.5rem) scale(100%);
}

.round:active,
.round.selected
{
  background-color: var(--background-control-active);
  border-radius: var(--border-m);
}

</style>