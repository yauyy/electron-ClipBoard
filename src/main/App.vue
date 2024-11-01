<script setup lang="ts">
import Clipboard from './views/clipboard/index.vue';
import { useSettingStore } from './store';
import { onMounted } from 'vue';

onMounted(() => {
  useSettingStore();
});
</script>

<template>
  <div>
    <clipboard />
  </div>
</template>

<style scoped></style>
