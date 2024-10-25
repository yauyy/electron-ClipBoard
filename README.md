# CV剪切板

CV剪切板是一款可以查看并管理复制过的文本或图片的剪贴板管理工具。支持文本和图片的实时查看与收藏，帮助用户轻松管理和访问过往复制的内容。收藏的内容会被安全地存储在本地，即使重启应用后也能快速找到。

## 功能

- ✅**历史记录**：自动保存用户复制过的文本或图片，方便随时查看。
- ✅**收藏功能**：支持将常用内容收藏至本地，便于长期保留和快速访问。
- ✅**支持格式**：文本、图片。
- ✅**本地缓存**：收藏内容使用 LocalForage 进行本地存储，无需担心数据丢失。
- ✅**支持快捷键启动**：ctrl+shift+v。

## 待开发功能

- **支持搜索**：支持搜索功能，方便快速找到所需内容。
- **设置页面**：支持设置自定义快捷键。
- **更新提示**：支持检查更新提示。

## 技术栈

- **前端框架**：[Vue 3](https://github.com/vuejs/) + [TypeScript](https://github.com/microsoft/TypeScript)
- **桌面应用框架**：[Electron](https://github.com/electron/electron)
- **样式**：[UnoCSS](https://github.com/unocss/unocss)
- **全局鼠标事件监听**：[uiohook-napi](https://github.com/SnosMe/uiohook-napi)
- **本地存储**：[LocalForage](https://github.com/localForage/localForage)
- **自动粘贴**：[nut-tree-fork/nut-js](https://github.com/nut-tree/nut.js)

## 安装

### 环境要求

- Node.js 版本 >= 20
- pnpm 包管理工具

## 安装依赖

```bash
pnpm install
```

## 运行应用

```bash
pnpm run dev
```

## 打包应用

```bash
pnpm run build
```
