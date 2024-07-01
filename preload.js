const { contextBridge, ipcRenderer } = require('electron')

const command = {
    start: async (device) => await ipcRenderer.invoke('start', device),
    stop: async (device) => await ipcRenderer.invoke('stop', device),
    close: async () => await ipcRenderer.invoke('close'),
    sleep: async (msec) => await ipcRenderer.invoke('sleep', msec),
    deviceId: async (device) => await ipcRenderer.invoke('deviceId', device),
    getKBDList: async () => await ipcRenderer.invoke('getKBDList'),
    changeConnectDevice: (dat) => ipcRenderer.send("changeConnectDevice", dat),
    getConnectKbd: async (id) => await ipcRenderer.invoke('getConnectKbd', id),
    getConfig: async (device) => await ipcRenderer.invoke('getConfig', device),
    sendDeviceConfig: async (data) => {
        await ipcRenderer.invoke('sendDeviceConfig', data)
        connectDevices = await Promise.all(connectDevices.map( (cd) => {
            if(data.id === cd.id &&
                data.manufacturer === cd.manufacturer &&
                data.product === cd.product &&
                data.productId === cd.productId &&
                data.vendorId === cd.vendorId){
                return data
            }
            return cd
        }))
    },
    setConnectDevices: async (devices) => {
        connectDevices = devices
    },
    exportFile: async (data) => await ipcRenderer.invoke('exportFile', data),
    importFile: async (fn) => await ipcRenderer.invoke('importFile', fn )
}

process.once('loaded', async () => {
    global.ipcRenderer = ipcRenderer
    contextBridge.exposeInMainWorld(
        "api", {
            start: async (device) => await command.start(device),
            stop: async (device) => await command.stop(device),
            keyboardSendLoop: keyboardSendLoop,
            sendDeviceConfig: async (data) => await command.sendDeviceConfig(data),
            setConnectDevices: (device) => command.setConnectDevices(device),
            exportFile:  async () => await command.exportFile(connectDevices),
            importFile: async () => {
                const dat = await command.importFile()
                if(dat) {
                    try {
                        const json = JSON.parse(dat)
                        connectDevices = await Promise.all(connectDevices.map(async (cd) => {
                           const j = json.find((j) =>
                                j.id === cd.id &&
                                j.manufacturer === cd.manufacturer &&
                                j.product === cd.product &&
                                j.productId === cd.productId &&
                                j.vendorId === cd.vendorId)
                           if(j){
                               await command.sendDeviceConfig(j)
                               return j
                           }
                           return cd
                       }))
                       await command.changeConnectDevice(connectDevices)
                    } catch (e) {
                        console.log(e)
                    }
                }
            },
            on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
        })
})

let connectDevices = [{
    id: "Daraku-Neko-NumNum Bento-31353-5440",
    manufacturer: "Daraku-Neko",
    product: "NumNum Bento",
    productId: 5440,
    vendorId: 31353,
    connected: false,
    config: {},
},{
    id: "Daraku-Neko-Ieneko42c-31353-5429",
    manufacturer: "Daraku-Neko",
    product: "Ieneko42c",
    productId: 5429,
    vendorId: 31353,
    connected: false,
    config: {},
},{
    id: "Daraku-Neko-Ieneko38RTR-31353-5456",
    manufacturer: "Daraku-Neko",
    product: "Ieneko38RTR",
    productId: 5456,
    vendorId: 31353,
    connected: false,
    config: {},
}]

const keyboardSendLoop = async () => {
   connectDevices.map(async (cd, i) => {
       const connectKbd = await command.getConnectKbd(cd.id)
       if(!connectKbd && cd.connected) {
           connectDevices[i].connected = false
           connectDevices[i].config = {}
           await command.changeConnectDevice(connectDevices)
       } else if(!connectKbd || !connectKbd.connected || !cd.connected) {
           const kdbList = await command.getKBDList()
           kdbList.map(async (kd) => {
               if (cd.vendorId === kd.vendorId && cd.productId === kd.productId) {
                   if (!connectKbd){
                       await command.start(cd)
                   } else {
                       connectDevices[i].connected = connectKbd.connected
                       if (connectKbd.connected) {
                           await command.getConfig(connectDevices[i])
                           await command.changeConnectDevice(connectDevices)
                       }
                   }
               }
           })
       } else if(connectKbd && connectKbd.config && !connectDevices[i].config.init) {
           connectDevices[i].config = connectKbd.config
           await command.changeConnectDevice(connectDevices)
       } else if(connectDevices[i].config.changed) {
           connectDevices[i].config.changed = false
           await command.changeConnectDevice(connectDevices)
           await command.sendDeviceConfig(connectDevices[i])
       }
   })
}

