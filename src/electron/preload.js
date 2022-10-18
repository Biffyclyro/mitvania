const {contextBridge, ipcRenderer} = require('electron')
//export const t = {teste: true}
window.addEventListener('DOMContentLoaded', () => {
	ipcRenderer.on('c', () => console.log('ué'))
})
