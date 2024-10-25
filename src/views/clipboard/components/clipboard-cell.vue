<template>
  <div
    class="mx-4 rounded-10 mb-10 overflow-hidden select-none cursor-pointer shadow-def cell-border relative"
  >
    <div
      class="w-full flex h-94 p-10 justify-between overflow-hidden box-border bg-white slide-fade-enter-active { transition: all 0.3s ease-out; } .slide-fade-leave-active { transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1); } .slide-fade-enter-from, .slide-fade-leave-to { transform: translateX(20px); opacity: 0; } item"
      :class="{ 'del-item': isShowDelAction }"
    >
      <div class="h-full flex-1 overflow-hidden">
        <pre
          v-if="item.type === 'text'"
          class="flex-1 overflow-hidden whitespace-break-spaces m-0"
          @click="copy(item.value, 'text')"
          >{{ item.value }}</pre
        >
        <img
          v-else-if="item.type === 'image'"
          :src="item.value"
          loading="lazy"
          alt="clipboard-image"
          class="w-auto h-full object-fit-contain rounded-4"
          @click="copy(item.value, 'image')"
        />
      </div>
      <div class="flex flex-col justify-between">
        <i
          class="iconfont icon-gengduo hover:bg-gray-2 rounded-3 p-3"
          @click="handleClick(item.id)"
        ></i>
        <i
          v-if="isCollect"
          class="iconfont hover:bg-gray-2 rounded-3 p-3"
          :class="item.isCollect ? 'icon-xihuan1' : 'icon-xihuan'"
          @click="markCollect(item)"
        ></i>
      </div>
    </div>
    <Transition name="slide-fade">
      <div
        v-if="isShowDelAction"
        class="size-94 flex items-center justify-center bg-#d9dfe4 absolute top-0 right-0 h-full z-0"
      >
        <i
          class="iconfont icon-shanchu hover:bg-red rounded-3 p-3 text-white text-18"
          @click="handleClickDel(item)"
        ></i>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, Ref, ref } from 'vue';
import { IClipboardItem } from '@types';

const { sign, toggle } = inject<{
  sign: Ref<string>;
  toggle: (id: string) => void;
}>('changeAction', { sign: ref(''), toggle: () => {} });

const props = withDefaults(
  defineProps<{
    item: IClipboardItem;
    isCollect?: boolean;
  }>(),
  {
    isCollect: false,
  }
);

const $emit = defineEmits<{
  markCollect: [item: IClipboardItem];
  del: [item: IClipboardItem];
}>();

const isShowDelAction = computed(() => sign.value === props.item.id);

function markCollect(item: IClipboardItem) {
  $emit('markCollect', item);
}

const handleClick = (id: string) => {
  toggle(id);
};

const handleClickDel = (item: IClipboardItem) => {
  console.log('del, item', item);

  $emit('del', item);
};

function copy(value: string, type: 'text' | 'image' = 'text') {
  window.ipcRenderer.send('write-clipboard', { value, type });
}
</script>

<style lang="scss" scoped>
.item {
  transform: translateX(0);
  transition: transform 0.3s;
}
.del-item {
  transform: translateX(-94px);
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(94px);
}
</style>
