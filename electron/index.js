const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')


const createWindow = () => {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true
		}
	})
	win.loadFile(path.join(__dirname, '../index.html'))

	fs.readFile(path.join(__dirname, '../assets/mainGameConfig.json'), (error, data) => {
		win.webContents.send("read-file", data.toString());
	})
}

app.on('ready', () => {
	createWindow()
	app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('save', (event, data) => console.log(data))