const {app, BrowserWindow, ipcMain, Tray, Menu, dialog} = require("electron")
const fs = require('fs').promises;
const {start, stop, close, writeCommand, getConnectKbd, getKBDList, deviceId} = require(`${__dirname}/gpkrc.js`)

let mainWindow
const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 980,
        icon: `${__dirname}/icons/256x256.png`,
        webPreferences: {
            preload: __dirname + '/preload.js',
            backgroundThrottling: false,
        },
        show: true,
    })

    mainWindow.loadURL(`file://${__dirname}/public/index.html`)
    mainWindow.setMenu(null)

    mainWindow.on('close', (event) => {
        try{
            close()
        } catch (e) {
            console.log(`close ${e}`)
        }
        app.quit()
    })
}

const doubleBoot = app.requestSingleInstanceLock()
if (!doubleBoot) app.quit()

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        try{
            close()
        } catch (e) {
            console.log(`close ${e}`)
        }
        app.quit()
    }
})
app.on('ready', () => {
    createWindow()
    //mainWindow.webContents.openDevTools()
})

app.on('activate', () => {
    if (mainWindow === null) createWindow()
})

ipcMain.on("connectDevice", (e, data) => {
    mainWindow.webContents.send("isConnectDevice", data)
})

const sleep = async (msec) => new Promise(resolve => setTimeout(resolve, msec))

const exportFile = (data) => {
    dialog.showSaveDialog({
        title: 'Export Config File',
        defaultPath: 'gpk_trackpad_settings.json',
        buttonLabel: 'Save',
        filters: [
            { name: 'JSON Files', extensions: ['json'] },
            { name: 'All Files', extensions: ['*'] }
        ]
    }).then(async result  => {
        if (!result.canceled) {
            await fs.writeFile(result.filePath, JSON.stringify(data, null, 2))
        }
    }).catch(err => {
        console.error('An error occurred:', err);
    });
}

const importFile = async () => {
    const  result = await dialog.showOpenDialog({
        title: 'Import Config File',
        buttonLabel: 'Open',
        filters: [
            { name: 'JSON Files', extensions: ['json'] },
            { name: 'All Files', extensions: ['*'] }
        ],
        properties: ['openFile']
    })

    if (!result.canceled && result.filePaths.length > 0) {
        const filePath = result.filePaths[0];
        const file = await fs.readFile(filePath, 'utf-8')
        return file
    }
    return undefined
}

const  commandId = {
    customSet:  118,
    customGet:  119,
    customSave:  120
}

ipcMain.handle('start', async (event,device) => {
    await start(device)
})
ipcMain.handle('stop', async (event, device) => {
    await stop(device)
})
ipcMain.handle('deviceId', async (event, device) => await deviceId(device))
ipcMain.handle('getKBDList', async (event) => await getKBDList())
ipcMain.handle('getConnectKbd', async (event, id) => await getConnectKbd(id))
ipcMain.handle('getConfig', async (event, device) => await writeCommand(device, {id: commandId.customGet}))

ipcMain.on("changeConnectDevice", (e, data) => {
    mainWindow.webContents.send("changeConnectDevice", data)
})
ipcMain.handle('sleep', async (event, msec) => {
    await sleep(msec)
})

ipcMain.handle("sendDeviceConfig", async (e, data) => {
    const byteArray = []

    const upper_scroll_term = (data.config.scroll_term & 0b1111110000) >> 4
    const lower_drag_term = (data.config.drag_term & 0b1111000000) >> 6
    const lower_default_speed = (data.config.default_speed & 0b110000) >> 4

    byteArray[0] = data.config.init | data.config.hf_waveform_number << 1

    byteArray[1] = data.config.can_hf_for_layer << 7 |
        data.config.can_drag << 6 |
        upper_scroll_term

    byteArray[2] = (data.config.scroll_term & 0b0000001111) << 4 | lower_drag_term

    byteArray[3] = (data.config.drag_term & 0b0000111111) << 2 |
        data.config.can_trackpad_layer << 1 |
        data.config.can_reverse_scrolling_direction

    byteArray[4] = data.config.drag_strength_mode << 7 |
        data.config.drag_strength << 2 |
        lower_default_speed

    byteArray[5] = (data.config.default_speed & 0b001111) << 4 | data.config.scroll_step

    byteArray[6] = data.config.can_short_scroll << 7

    await writeCommand(data, {id: commandId.customSave, data: byteArray})
})
ipcMain.handle('exportFile', async (event, data) => await exportFile(data))
ipcMain.handle('importFile', async (event, fn) => await importFile(fn))
