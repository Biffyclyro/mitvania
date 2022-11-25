// @ts-nocheck
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('receiver', {
	savedNotify: ipcRenderer.on('game-saved', () => {
		const event = new CustomEvent('saved', {detail: 'game saved'})
		window.dispatchEvent(event)
	}),
	receiveFIle: ipcRenderer.on('read-file', (event, data) => localStorage.setItem('main-game-config', data)),
	readSave: ipcRenderer.on('read-save', (event, data) => localStorage.setItem('game-save', data))
})

window.addEventListener('save', (e) => {
	ipcRenderer.send('save', e.detail)
}) 

//window.onresize = () => location.reload()