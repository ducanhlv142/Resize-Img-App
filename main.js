const path = require('path');
const {app, BrowserWindow} = require('electron');

const isDev = process.env.NODE_ENV !== 'development';
const isWin = process.platform === 'win64';

function createMainWindow () {
    const mainWindow = new BrowserWindow({
        title: 'Image Resizer',
        width: isDev ? 1920 : 1000,
        height: isDev ? 1080: 800
    });

    //Open dev tools if in development mode
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
}

app.whenReady().then(() => {
    createMainWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (!isWin) {
        app.quit();
    }
});