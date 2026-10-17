const { app, BrowserWindow, shell, Menu } = require('electron');
const path = require('path');

// Portable mode: store user data (custom words, wrong book, settings) inside the app folder
// so the whole folder can be copied to another computer with data intact.
app.setPath('userData', path.join(path.dirname(process.execPath), 'userData'));

// Single instance lock
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    const win = BrowserWindow.getAllWindows()[0];
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 720,
    minHeight: 560,
    title: 'English Test',
    backgroundColor: '#e8eaee',
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: false
    }
  });

  // Load the local HTML file (packaged into app root)
  win.loadFile(path.join(__dirname, 'index.html'));

  // Open external links in default browser instead of new Electron window
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Remove default menu bar entirely (cleaner app look)
  Menu.setApplicationMenu(null);

  // Prevent page title from overriding window title (keeps "English Test")
  win.on('page-title-updated', (e) => e.preventDefault());

  return win;
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
