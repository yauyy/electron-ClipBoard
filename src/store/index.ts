import { ref } from 'vue';
import { nanoid } from 'nanoid';
import { defineStore } from 'pinia';
import type { IClipboardItem, IClipboardParams, ICollectItem } from '@/types';
import localforageStore from './localforage';

export const useCollectStore = defineStore('collect', () => {
  const collectDataList = ref<ICollectItem[]>([]);

  localforageStore.getItem<ICollectItem[]>('collect').then((res) => {
    collectDataList.value = res || [];
  })
  // 添加收藏
  function addCollect(data: IClipboardItem) {
    collectDataList.value.unshift({
      ...data,
    });
    localforageStore.setItem(
      'collect',
      JSON.parse(JSON.stringify(collectDataList.value))
    );
  }

  // 取消收藏
  function removeCollect(data: ICollectItem) {
    collectDataList.value = collectDataList.value.filter(
      (item) => item.id !== data.id
    );
    useClipboardStore().markCollect(data);
    localforageStore.setItem(
      'collect',
      JSON.parse(JSON.stringify(collectDataList.value))
    );
  }

  // 清空收藏
  function clearCollect() {
    collectDataList.value = [];
    useClipboardStore().markCollect();
    localforageStore.setItem('collect', []);
  }

  return {
    collectDataList,
    addCollect,
    removeCollect,
    clearCollect,
  };
});


export const useClipboardStore = defineStore('clipboard', () => {
  const clipboardList = ref<IClipboardItem[]>([]);

  // 添加剪贴板
  function addClipboard(data: IClipboardParams) {
    clipboardList.value.unshift({
      ...data,
      id: nanoid(),
    });
  }
  // 删除剪贴板
  function removeClipboard(data: IClipboardItem) {
    clipboardList.value = clipboardList.value.filter(
      (item) => item.id !== data.id
    );
  }
  // 标记收藏
  function markCollect(data?: IClipboardItem, cb?: (val: IClipboardItem) => void) {
    if (!data) {
      clipboardList.value = clipboardList.value.map((item) => {
        item.isCollect = false;
        return item;
      });
      return;
    }
    clipboardList.value = clipboardList.value.map((item) => {
      if (item.id === data.id) {
        item.isCollect = !item.isCollect;
      }
      return item;
    });
    cb?.(data);
  }

  // 清空剪贴板
  function clearClipboard() {
    clipboardList.value = [];
  }

  return {
    clipboardList,
    removeClipboard,
    clearClipboard,
    addClipboard,
    markCollect,
  };
});