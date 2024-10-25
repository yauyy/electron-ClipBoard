import { globalShortcut, type BrowserWindow } from 'electron'

import { setWinPosition } from '../tools/index';


export function globalShortcutRegister(win: BrowserWindow) {
  // 注册全局快捷键
  globalShortcut.register('ctrl+shift+v', () => {
    if (win) {
      setWinPosition(win);
      win.show();
    }
  });
}