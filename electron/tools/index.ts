import { screen, type BrowserWindow } from 'electron';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { uIOhook, UiohookKey } = require('uiohook-napi');

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
    uIOhook.on('keydown', (e: any) => {
      if (e.keycode === UiohookKey.Escape) {
        if (win) {
          win.hide(); // 示例：隐藏窗口
        }
      }
    });
    // 点击非app窗口区域隐藏窗口 双击托盘图标或者自己的图标显示窗口有bug
    // uIOhook.on('click', () => {
    //   if (!win.isVisible()) {
    //     return;
    //   }
    //   // 判断是否在窗口内
    //   const cursorPosition = screen.getCursorScreenPoint();
    //   const winBounds = win.getBounds();
    //   const { x, y, width, height } = winBounds;
    //   const isInWindow =
    //     cursorPosition.x >= x &&
    //     cursorPosition.x <= x + width &&
    //     cursorPosition.y >= y &&
    //     cursorPosition.y <= y + height;
    //   if (isInWindow) {
    //     return;
    //   }
    //   win.hide();
    // });
  }

}
