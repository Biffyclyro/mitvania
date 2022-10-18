const { app, BrowserWindow } = require('electron')
const path = require('path')


const createWindow = () => {
  const win = new BrowserWindow({
    width: 1366,
    height: 728,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  })
  win.loadFile('../index.html')
}

app.on('ready', () => {
	createWindow()

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
