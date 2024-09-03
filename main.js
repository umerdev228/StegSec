// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'assets/images/logo.ico'),  // Path to your icon
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('views/welcome.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


// Handle OAuth flow
ipcMain.handle('google-oauth', async () => {
  return new Promise((resolve, reject) => {
    const authWindow = new BrowserWindow({
      width: 500,
      height: 600,
      show: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
      },
    });

    const GOOGLE_CLIENT_ID = '1093906640655-sc8vdtfoe5611c2omet4uvjgmjdi6lup.apps.googleusercontent.com';

    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${GOOGLE_CLIENT_ID}&response_type=token&scope=email profile&redirect_uri=http://localhost`;

    authWindow.loadURL(authUrl);

    // Listen for URL change events
    authWindow.webContents.on('will-redirect', (event, newUrl) => {
      if (newUrl.startsWith('http://localhost')) {
        const rawToken = /access_token=([^&]*)/.exec(newUrl) || null;
        const accessToken = rawToken && rawToken.length > 1 ? rawToken[1] : null;
        const error = /\?error=(.+)$/.exec(newUrl);

        if (accessToken) {
          resolve(accessToken);
        } else if (error) {
          reject(new Error('OAuth Error: ' + error[1]));
        }

        authWindow.close();
      }
    });

    authWindow.on('closed', () => {
      reject(new Error('Auth window was closed by the user'));
    });
  });
});


// StegSec10ZEE92ze671209hik288juk81762iilk539e3ZS4EDdq213421123
// 1093906640655-sc8vdtfoe5611c2omet4uvjgmjdi6lup.apps.googleusercontent.com
// const environment = {
//   BASE_URL: 'https://stegsecbackend.onrender.com/api/',
//   STEG_URL: 'https://stegsecapp.onrender.com/api/',
//   STEG_API_KEY: 'StegSec10ZEE92ze671209hik288juk81762iilk539e3ZS4EDdq213421123',
//   GOOGLE_KEY:
//     '1093906640655-sc8vdtfoe5611c2omet4uvjgmjdi6lup.apps.googleusercontent.com',
// };

