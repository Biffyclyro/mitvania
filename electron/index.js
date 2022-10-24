const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')

app.on('ready', () => {
	createWindow()
	app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

const createWindow = () => {
	fs.readFile(path.join(__dirname, '../assets/mainGameConfig.json'), (error, mainGameConfig) => {
		const win = new BrowserWindow({
			width: 800,
			height: 600,
			webPreferences: {
				preload: path.join(__dirname, 'preload.js'),
				//nodeIntegration: true
			}
		})
		
		win.webContents.send("read-file", mainGameConfig.toString())

		win.loadFile(path.join(__dirname, '../index.html'))

		fs.readFile(path.join(__dirname, '../gameSave.json'), (error, gameSave) => {
			win.webContents.send('read-save', gameSave.toString())
		})

		ipcMain.on('save', (event, data) => {
			fs.writeFile(path.join(__dirname, '../gameSave.json'), JSON.stringify(data), (error) => {
				if (error) {
					console.log(error)
				} else {
					win.webContents.send('game-saved')
				}
			})
		})
	})
}