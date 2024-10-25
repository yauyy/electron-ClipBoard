import {
  app,
  BrowserWindow,
  ipcMain,
} from 'electron';
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import createAutoClipboard from './clipboard/index';
import { globalShortcutRegister } from './shortcut';
import { createTray } from './tray';
import { listenInWindow } from './tools';

const __dirname = path.dirname(fileURLToPath(import.meta.url))




process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null
const autoClipboard = createAutoClipboard();
// 创建浏览器窗口
function createWindow() {
  win = new BrowserWindow({
    width: 390,
    height: 600,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: true,
    },
    frame: false, // 无边框窗口
    resizable: false, // 禁止调整窗口大小
    focusable: false, // 禁止窗口获取焦点
    alwaysOnTop: true, // 窗口置顶
    maximizable: false, // 禁止最大化
  });

  // 开启开发者工具
  // win.webContents.openDevTools();

  ipcMain.on('minimize-window', () => {
    if (win) {
      win.minimize();
      win.hide();
    }
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }
  autoClipboard.stop();
  autoClipboard.start(win);
}


// 启动了无边框窗口，所以不需要手动再关闭菜单栏
// 关闭菜单栏
// Menu.setApplicationMenu(null);



// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
    autoClipboard.stop();
  }
})


app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  createWindow();
  if (win) {
    globalShortcutRegister(win);
    createTray(win);
    listenInWindow(win);
  }
})
