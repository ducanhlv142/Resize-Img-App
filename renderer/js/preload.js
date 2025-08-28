const { contextBridge, ipcRenderer } = require('electron');
const os = require('os');              // Node core
const path = require('path');          // Node core
const Toastify = require('toastify-js');

contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (ch, data) => ipcRenderer.send(ch, data),
  on: (ch, fn) => ipcRenderer.on(ch, (_e, ...args) => fn(...args)),
  once: (ch, fn) => ipcRenderer.once(ch, (_e, ...args) => fn(...args)),
  invoke: (ch, data) => ipcRenderer.invoke(ch, data),
  removeAllListeners: (ch) => ipcRenderer.removeAllListeners(ch),
});

contextBridge.exposeInMainWorld('os',   { homedir: () => os.homedir() });
contextBridge.exposeInMainWorld('path', { join: (...a) => path.join(...a) });

contextBridge.exposeInMainWorld('toastify', {
  toast: (opts) => Toastify(opts).showToast(),
});

contextBridge.exposeInMainWorld('app', {
    openAbout: () => ipcRenderer.send('app:open-about'),
});