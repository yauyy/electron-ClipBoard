import { clipboard, type BrowserWindow, ipcMain, nativeImage } from 'electron';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const { keyboard, Key, mouse } = require('@nut-tree-fork/nut-js');

class AutoClipboard {
  private timer: NodeJS.Timeout | null = null;
  private preValue: string = '';
  private preImage: string = '';
  private win: BrowserWindow | null = null;
  constructor(private timestamp = 500) {}

  public start(w: BrowserWindow) {

    console.log(mouse.on, 'mouse');

    this.win = w;
    this.timer = setInterval(() => {
      // 读取剪贴板内容-文本
      const text = clipboard.readText();
      const img = clipboard.readImage();
      if (text && this.preValue !== text) {
        this.preValue = text;
        this.win?.webContents.send('onClipboard', {
          type: 'text',
          value: text,
        });
      } else if (img && !img.isEmpty() && this.preImage !== img.toDataURL()) {
        this.preImage = img.toDataURL();
        this.win?.webContents.send('onClipboard', {
          type: 'image',
          value: this.preImage,
        });
      }
    }, this.timestamp);

    this.paste();
  }
  async pasteToExternalApp() {
    // 通过模拟 Ctrl + V (Windows/Linux) 或 Cmd + V (macOS) 来粘贴内容
    if (process.platform === 'darwin') {
      await keyboard.type(Key.LeftSuper, Key.V);
    } else {
      await keyboard.type(Key.LeftControl, Key.V);
    }
  }
  paste() {
    ipcMain.on('write-clipboard', async (_event, { type, value }) => {
      console.log(_event);
      this.preValue = value;
      if (type === 'text') {
        clipboard.writeText(value);
        const clipboardText = clipboard.readText();
        if (clipboardText) {
          await this.pasteToExternalApp();
        } else {
          console.log('剪贴板为空');
        }
      } else if (type === 'image') {
        const image = nativeImage.createFromDataURL(value);
        clipboard.writeImage(image);
        const clipboardImage = clipboard.readImage();
        if (clipboardImage && !clipboardImage.isEmpty()) {
          await this.pasteToExternalApp();
        } else {
          console.log('剪贴板为空');
        }
      }
    });
  }

  public stop() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    clipboard.clear();
  }
}

let autoClipboard: AutoClipboard | null = null;

function createAutoClipboard() {
  if (!autoClipboard) {
    autoClipboard = new AutoClipboard();
  }
  return autoClipboard;
}

export default createAutoClipboard;