import { ref, watch } from 'vue';
import { nanoid } from 'nanoid';
import { defineStore } from 'pinia';
import type { IClipboardItem, IClipboardParams, ICollectItem } from '@types';
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
      (item: ICollectItem) => item.id !== data.id
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
      (item: ICollectItem) => item.id !== data.id
    );
  }
  // 标记收藏
  function markCollect(data?: IClipboardItem, cb?: (val: IClipboardItem) => void) {
    if (!data) {
      clipboardList.value = clipboardList.value.map((item: IClipboardItem) => {
        item.isCollect = false;
        return item;
      });
      return;
    }

    clipboardList.value = clipboardList.value.map((item: IClipboardItem) => {
      if (item.id === data.id) {
        item.isCollect = !item.isCollect;
      }
      return item;
    });

    console.log(clipboardList.value, 'clipboardList.value');

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

export const useSettingStore = defineStore('setting', () => {
  const isAutoOpen = ref(window.localStorage.getItem('isAutoOpen') === 'true' || false);
  const fastKeyboard = ref(window.localStorage.getItem('fastKeyboard') || 'ctrl+shift+v');

  watch(() => isAutoOpen.value, (val) => {
    window.ipcRenderer.send('auto-open', val);
  });

  watch(() => fastKeyboard.value, (val) => {
    window.ipcRenderer.send('fastKeyboard', val);
  }, { immediate: true });

  window.addEventListener('storage', (event) => {
    switch (event.key) {
      case 'fastKeyboard':
        fastKeyboard.value = event.newValue || '';
        break;
      case 'isAutoOpen':
        isAutoOpen.value = event.newValue === 'true' ? true : false;
        break;
      default:
        break;
    }
  });

});