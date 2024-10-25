import { watchEffect } from 'vue';
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
    addClipboard(result);
  }
  watchEffect((onCleanup) => {
    window.ipcRenderer.on('onClipboard', onClipboard);
    onCleanup(() => {
      window.ipcRenderer.removeAllListeners('onClipboard');
    });
  });
}
