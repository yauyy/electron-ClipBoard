<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue';

const sign = ref('');

const toggle = (id: string) => {
  console.log('changeAction', id);

  if (sign.value === id) {
    sign.value = '';
    return;
  }
  sign.value = id;
};

provide('changeAction', {
  sign,
  toggle,
});
</script>

<style lang="scss" scoped></style>
