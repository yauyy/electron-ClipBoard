import { app, BrowserWindow, Menu } from 'electron';
import path from 'node:path';

let settingsWindow: BrowserWindow | null = null;

export async function createSettingWindow() {
  await app.whenReady()
  if (settingsWindow) {
    settingsWindow.show();
    return;
  }

  const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
  const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

  settingsWindow = new BrowserWindow({
    width: 450,
    height: 600,
    icon: path.join(process.env.VITE_PUBLIC, 'cv-1024.ico'),
    webPreferences: {
      nodeIntegration: true,
    },

    resizable: false, // 禁止调整窗口大小
    alwaysOnTop: true, // 窗口置顶
    maximizable: false, // 禁止最大化
  });

  if (process.env.NODE_ENV === 'development') {
    // 开启开发者工具
    settingsWindow.webContents.openDevTools();
  }
  Menu.setApplicationMenu(null);
  if (VITE_DEV_SERVER_URL) {
    settingsWindow.loadURL(VITE_DEV_SERVER_URL + 'setting.html');
  } else {
    settingsWindow.loadFile(path.join(RENDERER_DIST, 'setting.html'));
  }

  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    settingsWindow = null;
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createSettingWindow();
  }
});
