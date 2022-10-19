// @ts-ignore
const { ConfigObjec } = require("../config-object")
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('teste', {
	receive: ipcRenderer.on('read-file', (event, data) => ConfigObjec.config = data)
})