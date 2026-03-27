// Preload script — runs in renderer context before page loads
// Exposes only safe, minimal APIs via contextBridge

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  // App version
  getVersion: () => ipcRenderer.invoke('get-version'),
});
