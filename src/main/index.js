import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fs from 'fs'

const dataPath = join(app.getPath('userData'), 'lyrkeyz-data.json')
const windowStatePath = join(app.getPath('userData'), 'window-state.json')
const defaultWindowSize = { width: 1200, height: 800 }
let mainWindow

function createWindow() {
  const windowState = loadWindowState()

  mainWindow = new BrowserWindow({
    width: windowState.width || 1000,
    height: windowState.height || 800,
    x: windowState.x,
    y: windowState.y,
    minWidth: 600,
    minHeight: 300,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.on('resize', () => {
    const bounds = mainWindow.getBounds()
    saveWindowState(bounds)
  })

  mainWindow.on('move', () => {
    const bounds = mainWindow.getBounds()
    saveWindowState(bounds)
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

function loadDataStore() {
  try {
    const data = fs.readFileSync(dataPath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return null
  }
}

function saveDataStore(storeData) {
  const data = JSON.stringify(storeData, null, 2)
  fs.writeFileSync(dataPath, data)
}

function loadWindowState() {
  try {
    const data = fs.readFileSync(windowStatePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return defaultWindowSize
  }
}

let saveStateTimeout = null
function saveWindowState(bounds) {
  clearTimeout(saveStateTimeout)
  saveStateTimeout = setTimeout(() => {
    const data = JSON.stringify(bounds, null, 2)
    fs.writeFileSync(windowStatePath, data)
  }, 200)
}

ipcMain.handle('load-data-store', () => loadDataStore())
ipcMain.handle('save-data-store', (e, storeData) => saveDataStore(storeData))
