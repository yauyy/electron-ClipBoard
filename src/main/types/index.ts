export interface IClipboardParams {
  type: 'text' | 'image';
  value: string;
}
export interface IClipboardItem extends IClipboardParams {
  // id
  id: string;
  // 是否收藏
  isCollect?: boolean;
}

export interface ICollectItem extends IClipboardItem {
  id: string;
}

export const enum ClipboardType {
  // 收藏
  Collection = 'collection',
  // 剪贴板
  Clipboard = 'clipboard',
}
