const path = require('path');
const os = require('os');
const fs = require('fs');
const resizeImg = require('resize-img');
const {app, BrowserWindow, Menu, ipcMain, shell} = require('electron');
const ResizeImg = require('resize-img');

const isDev = !app.isPackaged;
const isMac = process.platform === 'darwin';

let mainWindow;

function createMainWindow () {
    mainWindow = new BrowserWindow({
        title: 'Image Resizer',
        width: isDev ? 1920 : 1000,
        height: isDev ? 1080: 800,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false,
            preload: path.join(__dirname, './renderer/js/preload.js'),
        },
    });

    //Open dev tools if in development mode
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
}
//Create about window
function createAboutWindow () {
    const aboutWindow = new BrowserWindow({
        title: 'About Image Resizer',
        width: 300,
        height: 300,
        resizable: false,
        minimizable: false,
        maximizable: false,
        parent: mainWindow,
        modal: true,
        webPreferences: {contextIsolation: true, nodeIntegration: false}
    });

    aboutWindow.loadFile(path.join(__dirname, './renderer/about.html'));
}


//App is ready

app.whenReady().then(() => {
    createMainWindow();
    //Implement menu
    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);

    //Remove mainWindow from memory on close
    mainWindow.on('closed', () => (mainWindow = null));

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
});

//Menu template
const menu = [
    ...(isMac ? [
        {
            label: app.name,
            submenu: [
                {
                    label: 'About',
                    click: createAboutWindow,
                },
            ],
        },
    ] : []),
    {
        role: 'fileMenu',
    },
    ...(!isDev ? [{
        label: 'Help',
        submenu: [
            {
                label: 'About',
                click: createAboutWindow,
            },
        ],
    }] : [])
];

//Respond to ipcRenderer events
ipcMain.on('image:resize', (e, options) => {
    options.dest = path.join(os.homedir(), 'imageresizer');
    resizeImage(options);
});
ipcMain.on('app:open-about', () => {
    createAboutWindow();
});

//Resize image
async function resizeImage({
    imgPath,
    width,
    height,
    dest
}){
    try{
        const newPath = await resizeImg(fs.readFileSync(imgPath), {
            width: +width,
            height: +height,
        });
        //Create filename
        const filename = path.basename(imgPath);
        //create dest folder if it doesn't exist
        if(!fs.existsSync(dest)){
            fs.mkdirSync(dest, { recursive: true });
        }
        //Write file to destination
        const saveTo = path.join(dest, filename);
        fs.writeFileSync(saveTo, newPath);
        //Send success to renderer
        mainWindow.webContents.send('image:done', {path: saveTo});
        //Open dest folder
        shell.openPath(dest);
        shell.showItemInFolder(saveTo);
    } catch (error) {
        console.log(error);
        mainWindow.webContents.send('image:error', String(error.message || error));
    }
}

app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit();
    }
});