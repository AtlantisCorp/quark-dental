import { app, BrowserWindow } from 'electron'
import * as fs from 'fs'
import * as path from 'path'

(<any>global).loadResource = process.argv.includes('--dev') ? 
    (filepath: string): string => { 
        return fs.readFileSync(path.join('.', filepath), 'utf8') 
    } :
    (filepath: string): string => { 
        const resourcesPath: string = (<any>process).resourcesPath
        return fs.readFileSync(path.join(resourcesPath, 'app.asar', filepath), 'utf8')
    }

(<any>global).HTMLResourcesPath = '/out/website/html'

let mainWindow = null 

app.on('window-all-closed', function() {
    app.quit();
});

app.on('ready', () => {
    // once electron has started up, create a window.
    mainWindow = new BrowserWindow({
        width: 1280, 
        height: 720, 
        frame:true, 
        title: 'Quark Editor',
        webPreferences: {nodeIntegration: true}
    });

    // hide the default menu bar that comes with the browser window
    mainWindow.setMenuBarVisibility(false);

    // load a website to display
    mainWindow.loadURL(`file://${__dirname}/../website/index.html`);

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
});