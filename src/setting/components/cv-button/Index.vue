<template>
  <button class="px10 py-8 text-14 rounded-8 cv-button">
    <slot>按 钮</slot>
  </button>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.cv-button {
  outline: none;
  border-color: #5ca1ff;
  color: #fff;
  background-color: #5ca1ff;
  border: 1px solid #5ca1ff;
  cursor: pointer;
  &:hover {
    background-color: #9ec6fd;
    border-color: #9ec6fd;
  }
}
</style>
