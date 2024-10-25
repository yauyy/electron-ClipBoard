import { screen, type BrowserWindow } from 'electron';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { uIOhook } = require('uiohook-napi');

export function setWinPosition(win: BrowserWindow) {
   const cursorPosition = screen.getCursorScreenPoint();
   const display = screen.getDisplayNearestPoint(cursorPosition);
   const { x, y, width, height } = display.workArea;

   // 确保窗口在可视区域内
   const newX = Math.min(
     Math.max(cursorPosition.x, x),
     x + width - win.getBounds().width
   );
   const newY = Math.min(
     Math.max(cursorPosition.y, y),
     y + height - win.getBounds().height
   );

   win.setPosition(newX, newY);
}
// 监听鼠标点击事件
export function listenInWindow(win: BrowserWindow) {
  showWindow();
  win.on('show', showWindow);
  win.on('hide', () => {
    uIOhook.stop();
  });

  function showWindow() {
    uIOhook.start();
    uIOhook.on('click', () => {
      if (!win.isVisible()) {
        return;
      }
      // 判断是否在窗口内
      const cursorPosition = screen.getCursorScreenPoint();
      const winBounds = win.getBounds();
      const { x, y, width, height } = winBounds;
      const isInWindow =
        cursorPosition.x >= x &&
        cursorPosition.x <= x + width &&
        cursorPosition.y >= y &&
        cursorPosition.y <= y + height;
      if (isInWindow) {
        return;
      }
      win.hide();
    });
  }

}
