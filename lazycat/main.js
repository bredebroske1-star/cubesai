const { app, BrowserWindow, session, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
      webviewTag: false,
      allowRunningInsecureContent: false,
      enableRemoteModule: false
    }
  });

  // Load the UI
  win.loadFile('ui/index.html');

  // Minimal security headers
  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    const responseHeaders = details.responseHeaders || {};
    responseHeaders['Content-Security-Policy'] = [
      "default-src 'self' https:; script-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https:;"
    ];
    callback({ responseHeaders });
  });

  // Robust ad/tracker blocking using blocklist (matches subdomains)
  const blocklist = require('./blocklist.json');
  const blocked = new Set(blocklist.map(h => h.toLowerCase()));

  function hostBlocked(url) {
    try {
      const u = new URL(url);
      const host = u.hostname.toLowerCase();
      if (blocked.has(host)) return true;
      for (const b of blocked) {
        if (host === b) return true;
        if (host.endsWith('.' + b)) return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  }

  session.defaultSession.webRequest.onBeforeRequest((details, cb) => {
    if (hostBlocked(details.url)) return cb({ cancel: true });
    return cb({});
  });

  // Prevent popups and unsafe window opens
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (!/^https?:\/\//.test(url)) return { action: 'deny' };
    if (hostBlocked(url)) return { action: 'deny' };
    // open externally
    require('electron').shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('open-url', async (_, url) => {
  const ses = session.defaultSession;
  return ses.loadExtension ? true : true;
});
