import localforage from "localforage";

const localforageStore = localforage.createInstance({
  name: 'my-clipboard',
  storeName: 'clipboardStore',
  version: 1,
  description: '剪切板'
});

export default localforageStore;