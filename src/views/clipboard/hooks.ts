import { onMounted, onUnmounted } from 'vue';
import type { IClipboardParams } from "@types";
import { useClipboardStore } from '@/store';


// 监听剪贴板的变化
export function useListenClipboard() {
  const { addClipboard } = useClipboardStore();
  // 监听剪贴板
  function onClipboard(
    _event: Electron.IpcRendererEvent,
    result: IClipboardParams
  ) {
    console.log(result, 'result');

    addClipboard(result);
  }

  onMounted(() => {
    console.log('useListenClipboard');

    window.ipcRenderer.off('onClipboard', onClipboard);
    window.ipcRenderer.on('onClipboard', onClipboard);

  });

  onUnmounted(() => {
    window.ipcRenderer.off('onClipboard', onClipboard);
  });

}
