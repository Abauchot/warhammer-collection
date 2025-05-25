const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { spawn } = require('child_process');
const serve = require('electron-serve');

const loadURL = serve({ directory: '../warhammer-front/dist' });

let mainWindow;
let strapiProcess;

function startStrapi() {
  // Démarrer le serveur Strapi
  strapiProcess = spawn('node', ['./strapi-server.js'], {
    stdio: 'pipe',
    env: {
      ...process.env,
      NODE_ENV: 'production'
    }
  });

  strapiProcess.stdout.on('data', (data) => {
    console.log(`Strapi: ${data}`);
  });

  strapiProcess.stderr.on('data', (data) => {
    console.error(`Strapi Error: ${data}`);
  });
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  if (isDev) {
    await mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    await loadURL(mainWindow);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  startStrapi();
  setTimeout(createWindow, 5000); // Attendre 5 secondes pour que Strapi démarre
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
  if (strapiProcess) {
    strapiProcess.kill();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
}); 