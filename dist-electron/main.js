var v = Object.defineProperty;
var C = (e, t, o) => t in e ? v(e, t, { enumerable: !0, configurable: !0, writable: !0, value: o }) : e[t] = o;
var c = (e, t, o) => C(e, typeof t != "symbol" ? t + "" : t, o);
import { clipboard as l, ipcMain as x, nativeImage as A, screen as g, globalShortcut as L, Tray as j, Menu as O, app as m, BrowserWindow as y } from "electron";
import { fileURLToPath as U } from "node:url";
import a from "node:path";
import { createRequire as R } from "node:module";
const k = R(import.meta.url), { keyboard: T, Key: p, mouse: D } = k("@nut-tree-fork/nut-js");
class M {
  constructor(t = 500) {
    c(this, "timer", null);
    c(this, "preValue", "");
    c(this, "preImage", "");
    c(this, "win", null);
    this.timestamp = t;
  }
  start(t) {
    console.log(D.on, "mouse"), this.win = t, this.timer = setInterval(() => {
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
    x.on("write-clipboard", async (t, { type: o, value: i }) => {
      if (console.log(t), this.preValue = i, o === "text")
        l.writeText(i), l.readText() ? await this.pasteToExternalApp() : console.log("剪贴板为空");
      else if (o === "image") {
        const n = A.createFromDataURL(i);
        l.writeImage(n);
        const r = l.readImage();
        r && !r.isEmpty() ? await this.pasteToExternalApp() : console.log("剪贴板为空");
      }
    });
  }
  stop() {
    this.timer && clearInterval(this.timer), l.clear();
  }
}
let h = null;
function S() {
  return h || (h = new M()), h;
}
const B = R(import.meta.url), { uIOhook: f } = B("uiohook-napi");
function P(e) {
  const t = g.getCursorScreenPoint(), o = g.getDisplayNearestPoint(t), { x: i, y: n, width: r, height: u } = o.workArea, d = Math.min(
    Math.max(t.x, i),
    i + r - e.getBounds().width
  ), I = Math.min(
    Math.max(t.y, n),
    n + u - e.getBounds().height
  );
  e.setPosition(d, I);
}
function W(e) {
  t(), e.on("show", t), e.on("hide", () => {
    f.stop();
  });
  function t() {
    f.start(), f.on("click", () => {
      if (!e.isVisible())
        return;
      const o = g.getCursorScreenPoint(), i = e.getBounds(), { x: n, y: r, width: u, height: d } = i;
      o.x >= n && o.x <= n + u && o.y >= r && o.y <= r + d || e.hide();
    });
  }
}
function q(e) {
  L.register("ctrl+shift+v", () => {
    e && (P(e), e.show());
  });
}
function z(e) {
  let t = new j(a.join(process.env.VITE_PUBLIC, "favicon.ico"));
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
        e && (P(e), e.show());
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
const E = a.dirname(U(import.meta.url));
process.env.APP_ROOT = a.join(E, "..");
const w = process.env.VITE_DEV_SERVER_URL, Y = a.join(process.env.APP_ROOT, "dist-electron"), V = a.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = w ? a.join(process.env.APP_ROOT, "public") : V;
let s;
const b = S();
function _() {
  s = new y({
    width: 390,
    height: 600,
    icon: a.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: a.join(E, "preload.mjs"),
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
  }), x.on("minimize-window", () => {
    s && (s.minimize(), s.hide());
  }), w ? s.loadURL(w) : s.loadFile(a.join(V, "index.html")), b.stop(), b.start(s);
}
m.on("window-all-closed", () => {
  process.platform !== "darwin" && (m.quit(), s = null, b.stop());
});
m.on("activate", () => {
  y.getAllWindows().length === 0 && _();
});
m.whenReady().then(() => {
  _(), s && (q(s), z(s), W(s));
});
export {
  Y as MAIN_DIST,
  V as RENDERER_DIST,
  w as VITE_DEV_SERVER_URL
};
