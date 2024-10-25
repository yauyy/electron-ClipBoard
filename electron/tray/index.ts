import path from 'node:path';
import { Menu, Tray, type BrowserWindow } from 'electron';
import { setWinPosition } from '../tools/index';

// 托盘
export function createTray(win: BrowserWindow) {
  let tray = new Tray(path.join(process.env.VITE_PUBLIC, 'favicon.ico'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示窗口',
      click: () => {
        if (win) {
          win.show();
        }
      },
    },
    {
      label: '设置',
      click: () => {
        if (win) {
          setWinPosition(win);
          win.show();
        }
      },
    },
    {
      label: '关闭程序',
      role: 'quit', // 使用 role 字段配置退出操作
    },
  ]);
  tray.setToolTip('剪切板');
  tray.setContextMenu(contextMenu);
  tray.on('double-click', () => {
    if (win) {
      if (!win.isVisible()) {
        win.show();
      } else {
        win.hide();
      }
    }
  });
}