var V = Object.defineProperty;
var C = (e, t, o) => t in e ? V(e, t, { enumerable: !0, configurable: !0, writable: !0, value: o }) : e[t] = o;
var c = (e, t, o) => C(e, typeof t != "symbol" ? t + "" : t, o);
import { clipboard as l, ipcMain as E, nativeImage as A, screen as w, globalShortcut as D, Tray as L, Menu as O, app as d, BrowserWindow as x } from "electron";
import { fileURLToPath as U } from "node:url";
import a from "node:path";
import { createRequire as v } from "node:module";
const j = v(import.meta.url), { keyboard: T, Key: p } = j("@nut-tree-fork/nut-js");
class k {
  constructor(t = 500) {
    c(this, "timer", null);
    c(this, "preValue", "");
    c(this, "preImage", "");
    c(this, "win", null);
    this.timestamp = t;
  }
  start(t) {
    this.win = t, this.timer = setInterval(() => {
      var n, r;
      const o = l.readText(), i = l.readImage();
      o && this.preValue !== o ? (this.preValue = o, (n = this.win) == null || n.webContents.send("onClipboard", {
        type: "text",
        value: o
      })) : i && !i.isEmpty() && this.preImage !== i.toDataURL() && (this.preImage = i.toDataURL(), (r = this.win) == null || r.webContents.send("onClipboard", {
        type: "image",
        value: this.preImage
      }));
    }, this.timestamp), this.paste();
  }
  async pasteToExternalApp() {
    process.platform === "darwin" ? await T.type(p.LeftSuper, p.V) : await T.type(p.LeftControl, p.V);
  }
  paste() {
    E.on("write-clipboard", (t, { type: o, value: i }) => {
      if (this.preValue = i, o === "text")
        l.writeText(i), l.readText() && this.pasteToExternalApp();
      else if (o === "image") {
        const n = A.createFromDataURL(i);
        l.writeImage(n);
        const r = l.readImage();
        r && !r.isEmpty() && this.pasteToExternalApp();
      } else
        throw new Error(`Unsupported clipboard type: ${o}`);
    });
  }
  stop() {
    this.timer && clearInterval(this.timer), l.clear();
  }
}
let h = null;
function M() {
  return h || (h = new k()), h;
}
const S = v(import.meta.url), { uIOhook: f } = S("uiohook-napi");
function R(e) {
  const t = w.getCursorScreenPoint(), o = w.getDisplayNearestPoint(t), { x: i, y: n, width: r, height: m } = o.workArea, u = Math.min(
    Math.max(t.x, i),
    i + r - e.getBounds().width
  ), I = Math.min(
    Math.max(t.y, n),
    n + m - e.getBounds().height
  );
  e.setPosition(u, I);
}
function B(e) {
  t(), e.on("show", t), e.on("hide", () => {
    f.stop();
  });
  function t() {
    f.start(), f.on("click", () => {
      if (!e.isVisible())
        return;
      const o = w.getCursorScreenPoint(), i = e.getBounds(), { x: n, y: r, width: m, height: u } = i;
      o.x >= n && o.x <= n + m && o.y >= r && o.y <= r + u || e.hide();
    });
  }
}
function W(e) {
  D.register("ctrl+shift+v", () => {
    e && (R(e), e.show());
  });
}
function N(e) {
  let t = new L(a.join(process.env.VITE_PUBLIC, "favicon.ico"));
  const o = O.buildFromTemplate([
    {
      label: "显示窗口",
      click: () => {
        e && e.show();
      }
    },
    {
      label: "设置",
      click: () => {
        e && (R(e), e.show());
      }
    },
    {
      label: "关闭程序",
      role: "quit"
      // 使用 role 字段配置退出操作
    }
  ]);
  t.setToolTip("剪切板"), t.setContextMenu(o), t.on("double-click", () => {
    e && (e.isVisible() ? e.hide() : e.show());
  });
}
const y = a.dirname(U(import.meta.url));
process.env.APP_ROOT = a.join(y, "..");
const g = process.env.VITE_DEV_SERVER_URL, X = a.join(process.env.APP_ROOT, "dist-electron"), P = a.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = g ? a.join(process.env.APP_ROOT, "public") : P;
let s;
const b = M();
function _() {
  s = new x({
    width: 390,
    height: 600,
    icon: a.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: a.join(y, "preload.mjs"),
      nodeIntegration: !0
    },
    frame: !1,
    // 无边框窗口
    resizable: !1,
    // 禁止调整窗口大小
    focusable: !1,
    // 禁止窗口获取焦点
    alwaysOnTop: !0,
    // 窗口置顶
    maximizable: !1
    // 禁止最大化
  }), process.env.NODE_ENV === "development" && s.webContents.openDevTools(), E.on("minimize-window", () => {
    s && (s.minimize(), s.hide());
  }), g ? s.loadURL(g) : s.loadFile(a.join(P, "index.html")), b.stop(), b.start(s);
}
d.on("window-all-closed", () => {
  process.platform !== "darwin" && (d.quit(), s = null, b.stop());
});
d.on("activate", () => {
  x.getAllWindows().length === 0 && _();
});
d.whenReady().then(() => {
  _(), s && (W(s), N(s), process.env.NODE_ENV !== "development" && B(s));
});
export {
  X as MAIN_DIST,
  P as RENDERER_DIST,
  g as VITE_DEV_SERVER_URL
};
