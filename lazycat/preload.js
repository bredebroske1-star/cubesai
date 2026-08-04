const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('lazycat', {
  openUrl: (url) => ipcRenderer.invoke('open-url', url),
});
