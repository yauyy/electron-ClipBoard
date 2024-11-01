import { ipcMain, globalShortcut, type BrowserWindow } from 'electron'

import { setWinPosition } from '../tools/index';


export function globalShortcutRegister(win: BrowserWindow) {
  ipcMain.on('fastKeyboard', (_event, val) => {
    // 暴力解绑所有快捷键
    globalShortcut.unregisterAll();
    if (val) {
      globalShortcut.unregisterAll();
      globalShortcut.register(val, () => {
        if (win) {
          setWinPosition(win);
          win.show();
        }
      });
    }
  });
}