const { app, BrowserWindow, Menu, shell, nativeTheme } = require('electron');
const path = require('path');

// Keep a global reference to prevent garbage collection
let mainWindow;

function createWindow() {
  // Follow system dark/light mode
  nativeTheme.themeSource = 'system';

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 680,
    title: 'Thailand Monitor',
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 16, y: 16 },
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#0f172a' : '#f1f5f9',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,         // allow external API fetch (CORS bypass for local app)
      webSecurity: false,     // allow cross-origin requests to finance/data APIs
    },
    icon: path.join(__dirname, 'build', 'icon.icns'),
    show: false, // Show after ready-to-show for smooth launch
  });

  mainWindow.loadFile('index.html');

  // Show window smoothly when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Handle system theme changes
  nativeTheme.on('updated', () => {
    mainWindow.setBackgroundColor(
      nativeTheme.shouldUseDarkColors ? '#0f172a' : '#f1f5f9'
    );
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Build the application menu
function buildMenu() {
  const template = [
    {
      label: 'Thailand Monitor',
      submenu: [
        { label: 'About Thailand Monitor', role: 'about' },
        { type: 'separator' },
        { label: 'Hide Thailand Monitor', accelerator: 'Command+H', role: 'hide' },
        { label: 'Hide Others', accelerator: 'Command+Alt+H', role: 'hideOthers' },
        { label: 'Show All', role: 'unhide' },
        { type: 'separator' },
        { label: 'Quit Thailand Monitor', accelerator: 'Command+Q', role: 'quit' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { label: 'Reload', accelerator: 'Command+R', click: () => mainWindow?.reload() },
        { type: 'separator' },
        { label: 'Toggle Full Screen', accelerator: 'Ctrl+Command+F', role: 'togglefullscreen' },
        { type: 'separator' },
        { label: 'Zoom In', accelerator: 'Command+=', role: 'zoomIn' },
        { label: 'Zoom Out', accelerator: 'Command+-', role: 'zoomOut' },
        { label: 'Reset Zoom', accelerator: 'Command+0', role: 'resetZoom' },
        { type: 'separator' },
        { label: 'Toggle Developer Tools', accelerator: 'Alt+Command+I', role: 'toggleDevTools' },
      ],
    },
    {
      label: 'Window',
      submenu: [
        { label: 'Minimize', accelerator: 'Command+M', role: 'minimize' },
        { label: 'Zoom', role: 'zoom' },
        { type: 'separator' },
        { label: 'Bring All to Front', role: 'front' },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(() => {
  buildMenu();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
