import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import * as remote from '@electron/remote/main'
import { writeFile, copyFileSync } from 'fs'
import path from 'path'

const isTest = process.env.NODE_ENV === 'test'
if (isTest) {
    require('wdio-electron-service/main')
}

remote.initialize()

function createWindow(): void {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 900,
        height: 670,
        show: false,
        autoHideMenuBar: true,
        icon: icon,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            allowRunningInsecureContent: true,
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false,
            webSecurity: false,
        },
    })
    remote.enable(mainWindow.webContents)

    mainWindow.on('ready-to-show', () => {
        mainWindow.show()
    })

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return { action: 'deny' }
    })

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }

    mainWindow.webContents.session.webRequest.onBeforeSendHeaders(
        (details, callback) => {
            callback({
                requestHeaders: { Origin: '*', ...details.requestHeaders },
            })
        }
    )

    mainWindow.webContents.session.webRequest.onHeadersReceived(
        (details, callback) => {
            callback({
                responseHeaders: {
                    'Access-Control-Allow-Origin': ['*'],
                    //'Content-Security-Policy': ["img-src 'self' data:;"], // Allowing data: URIs for images
                    ...details.responseHeaders,
                },
            })
        }
    )

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url)
        return { action: 'deny' }
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron')

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

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
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

type FilePathContentPair = {
    filePath: string
    content: string
}
ipcMain.handle('dialog:openFile', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'JSON Files', extensions: ['json'] }],
    })

    return result.filePaths
})

ipcMain.handle('copy-file', async () => {
    const SOURCE_FILE_PATH = path.join(
        __dirname,
        '../../../../assignmentsConfig.json'
    )

    const { filePath: destinationFile } = await dialog.showSaveDialog({
        title: 'Save Copy As',
        defaultPath: SOURCE_FILE_PATH,
        filters: [{ name: 'All Files', extensions: ['.json'] }],
    })

    if (!destinationFile) {
        //User didn't select location
        return null
    }

    try {
        copyFileSync(SOURCE_FILE_PATH, destinationFile)
        return destinationFile
    } catch (error) {
        return null
    }
})

ipcMain.handle('generate', async (_event, htmlData: FilePathContentPair[]) => {
    for (const pair of htmlData) {
        const win = new BrowserWindow({ show: false })
        win.loadURL(
            `data:text/html;base64;charset=utf-8,${Buffer.from(pair.content).toString('base64')}`
        )

        win.webContents.on('did-finish-load', async () => {
            await win.webContents.executeJavaScript(
                `document.querySelectorAll('link[rel="stylesheet"], style').forEach(elem => elem.disabled = true);`
            )
            await win.webContents.insertCSS(
                'th, td { padding: 5px; }\n' +
                    'table, th, td { border: 1px solid black; border-collapse: collapse; margin-bottom: 10px; }'
            )

            // Use default printing options
            const pdfPath = join(getDocumentsPath(), pair.filePath + '.pdf')
            const data = await win.webContents.printToPDF({
                printBackground: true,
            })
            writeFile(pdfPath, data, () => {})
        })
    }
})

const getDocumentsPath = () =>
    join(app.getPath('documents'), 'canvas-capture-desktop')

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
