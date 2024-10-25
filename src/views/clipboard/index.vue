<template>
  <WinHeader />
  <main class="h-550 overflow-x-hidden overflow-y-auto select-none main">
    <div class="flex justify-between items-center">
      <clipboard-tabs v-model="tab" :option="opt" />
      <button
        class="h-full bg-#ebebeb border-none p-5 rounded-5 cursor-pointer hover:bg-#f4f4f4"
        @click="clearAll"
      >
        全部清空
      </button>
    </div>
    <div>
      <ClipboardList v-if="tab === ClipboardType.Clipboard" />
      <CollectList v-else />
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ClipboardType } from '@types';
import WinHeader from '../../components/win-header.vue';
import ClipboardTabs from './components/clipboard-tabs.vue';
import ClipboardList from './components/clipboard-list.vue';
import CollectList from './components/collect-list.vue';
import { useListenClipboard } from './hooks';
import { useCollectStore, useClipboardStore } from '@/store/index';
useListenClipboard();

const { clearCollect } = useCollectStore();
const { clearClipboard } = useClipboardStore();

const tab = ref(ClipboardType.Clipboard);
const opt = [
  {
    label: 'icon-dingdan',
    value: ClipboardType.Clipboard,
  },
  {
    label: 'icon-xihuan',
    value: ClipboardType.Collection,
  },
];

const clearAll = () => {
  console.log('clearAll', tab.value);

  if (tab.value === ClipboardType.Clipboard) {
    clearClipboard();
  } else {
    clearCollect();
  }
};
</script>

<style lang="scss" scoped>
.main::-webkit-scrollbar {
  display: none;
}
</style>
