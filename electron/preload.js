const { contextBridge, ipcRenderer } = require('electron')
	//nome precisa ser mudado de teste
contextBridge.exposeInMainWorld('teste', {
	//receive: ipcRenderer.on('read-file', (event, data) => FacadeObjectConfig.config = data),
	receive: ipcRenderer.on('read-file', (event, data) => localStorage.setItem('main-game-config',data)),
})

window.addEventListener('save', (e) => {
	ipcRenderer.send('save', e.detail)
}) 