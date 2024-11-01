var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { clipboard, ipcMain, nativeImage, screen, globalShortcut, app, BrowserWindow, Menu, Tray } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createRequire } from "node:module";
const require$1 = createRequire(import.meta.url);
const { keyboard, Key } = require$1("@nut-tree-fork/nut-js");
class AutoClipboard {
  constructor(timestamp = 500) {
    __publicField(this, "timer", null);
    __publicField(this, "preValue", "");
    __publicField(this, "preImage", "");
    __publicField(this, "win", null);
    this.timestamp = timestamp;
  }
  start(w) {
    this.win = w;
    this.timer = setInterval(() => {
      var _a, _b;
      const text = clipboard.readText();
      const img = clipboard.readImage();
      if (text && this.preValue !== text) {
        this.preValue = text;
        (_a = this.win) == null ? void 0 : _a.webContents.send("onClipboard", {
          type: "text",
          value: text
        });
      } else if (img && !img.isEmpty() && this.preImage !== img.toDataURL()) {
        this.preImage = img.toDataURL();
        (_b = this.win) == null ? void 0 : _b.webContents.send("onClipboard", {
          type: "image",
          value: this.preImage
        });
      }
    }, this.timestamp);
    this.paste();
  }
  async pasteToExternalApp() {
    if (process.platform === "darwin") {
      await keyboard.type(Key.LeftSuper, Key.V);
    } else {
      await keyboard.type(Key.LeftControl, Key.V);
    }
  }
  paste() {
    ipcMain.on("write-clipboard", (_event, { type, value }) => {
      this.preValue = value;
      if (type === "text") {
        clipboard.writeText(value);
        const clipboardText = clipboard.readText();
        if (clipboardText) {
          this.pasteToExternalApp();
        }
      } else if (type === "image") {
        const image = nativeImage.createFromDataURL(value);
        clipboard.writeImage(image);
        const clipboardImage = clipboard.readImage();
        if (clipboardImage && !clipboardImage.isEmpty()) {
          this.pasteToExternalApp();
        }
      } else {
        throw new Error(`Unsupported clipboard type: ${type}`);
      }
    });
  }
  stop() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    clipboard.clear();
  }
}
let autoClipboard$1 = null;
function createAutoClipboard() {
  if (!autoClipboard$1) {
    autoClipboard$1 = new AutoClipboard();
  }
  return autoClipboard$1;
}
const require2 = createRequire(import.meta.url);
const { uIOhook, UiohookKey } = require2("uiohook-napi");
function setWinPosition(win2) {
  const cursorPosition = screen.getCursorScreenPoint();
  const display = screen.getDisplayNearestPoint(cursorPosition);
  const { x, y, width, height } = display.workArea;
  const newX = Math.min(
    Math.max(cursorPosition.x, x),
    x + width - win2.getBounds().width
  );
  const newY = Math.min(
    Math.max(cursorPosition.y, y),
    y + height - win2.getBounds().height
  );
  win2.setPosition(newX, newY);
}
function listenInWindow(win2) {
  showWindow();
  win2.on("show", showWindow);
  win2.on("hide", () => {
    uIOhook.stop();
  });
  function showWindow() {
    uIOhook.start();
    uIOhook.on("keydown", (e) => {
      if (e.keycode === UiohookKey.Escape) {
        if (win2) {
          win2.hide();
        }
      }
    });
  }
}
function globalShortcutRegister(win2) {
  ipcMain.on("fastKeyboard", (_event, val) => {
    globalShortcut.unregisterAll();
    if (val) {
      globalShortcut.unregisterAll();
      globalShortcut.register(val, () => {
        if (win2) {
          setWinPosition(win2);
          win2.show();
        }
      });
    }
  });
}
let settingsWindow = null;
async function createSettingWindow() {
  await app.whenReady();
  if (settingsWindow) {
    settingsWindow.show();
    return;
  }
  const VITE_DEV_SERVER_URL2 = process.env["VITE_DEV_SERVER_URL"];
  const RENDERER_DIST2 = path.join(process.env.APP_ROOT, "dist");
  settingsWindow = new BrowserWindow({
    width: 450,
    height: 600,
    icon: path.join(process.env.VITE_PUBLIC, "cv-1024.ico"),
    webPreferences: {
      nodeIntegration: true
    },
    resizable: false,
    // 禁止调整窗口大小
    alwaysOnTop: true,
    // 窗口置顶
    maximizable: false
    // 禁止最大化
  });
  if (process.env.NODE_ENV === "development") {
    settingsWindow.webContents.openDevTools();
  }
  Menu.setApplicationMenu(null);
  if (VITE_DEV_SERVER_URL2) {
    settingsWindow.loadURL(VITE_DEV_SERVER_URL2 + "setting.html");
  } else {
    settingsWindow.loadFile(path.join(RENDERER_DIST2, "setting.html"));
  }
  settingsWindow.on("closed", () => {
    settingsWindow = null;
  });
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    settingsWindow = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createSettingWindow();
  }
});
function createTray(win2) {
  let tray = new Tray(path.join(process.env.VITE_PUBLIC, "favicon.ico"));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "显示窗口",
      click: () => {
        if (win2) {
          win2.show();
        }
      }
    },
    {
      label: "设置",
      click: () => {
        if (win2) {
          createSettingWindow();
        }
      }
    },
    {
      label: "关闭程序",
      role: "quit"
      // 使用 role 字段配置退出操作
    }
  ]);
  tray.setToolTip("剪切板");
  tray.setContextMenu(contextMenu);
  tray.on("double-click", () => {
    if (win2) {
      if (!win2.isVisible()) {
        win2.show();
      } else {
        win2.hide();
      }
    }
  });
}
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
const autoClipboard = createAutoClipboard();
function createWindow() {
  win = new BrowserWindow({
    width: 390,
    height: 600,
    icon: path.join(process.env.VITE_PUBLIC, "cv-1024.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: true,
      contextIsolation: true
    },
    frame: false,
    // 无边框窗口
    resizable: false,
    // 禁止调整窗口大小
    focusable: false,
    // 禁止窗口获取焦点
    alwaysOnTop: true,
    // 窗口置顶
    maximizable: false,
    // 禁止最大化
    show: false
    // 窗口初始化时不显示
  });
  if (process.env.NODE_ENV === "development") {
    win.webContents.openDevTools();
  }
  ipcMain.on("minimize-window", () => {
    if (win) {
      win.minimize();
      win.hide();
    }
  });
  ipcMain.on("auto-open", (_event, val) => {
    console.log("auto-open", val);
    app.setLoginItemSettings({
      openAtLogin: val
    });
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
  autoClipboard.stop();
  autoClipboard.start(win);
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
    autoClipboard.stop();
  }
});
app.on("activate", () => {
  const windows = BrowserWindow.getAllWindows();
  console.log("🚀 ~ app.on ~ windows:", windows);
  if (windows.length === 0) {
    createWindow();
  } else {
    windows[0].focus();
  }
});
app.on("ready", () => {
  app.on("will-quit", () => {
    globalShortcut.unregisterAll();
  });
});
const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
}
app.whenReady().then(() => {
  createWindow();
  if (win) {
    globalShortcutRegister(win);
    createTray(win);
    listenInWindow(win);
  }
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
