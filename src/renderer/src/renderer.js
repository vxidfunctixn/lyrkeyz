import TextEditor from './classes/TextEditor'
import TextManager from './classes/TextManager'
import Store from './classes/Store'

function init() {
  window.addEventListener('DOMContentLoaded', () => {
    setVersion()
    window.store = new Store()
    window.textEditor = new TextEditor()
    window.textManager = new TextManager()
  })
}

function setVersion() {
  const versions = window.electron.process.versions
  const appVersion = window.electron.process.env.npm_package_version
  const appName = 'LyrkeyZ'

  replaceText('.app-version', `${appName} v${appVersion}`)
  replaceText('.electron-version', `Electron v${versions.electron}`)
  replaceText('.chrome-version', `Chromium v${versions.chrome}`)
  replaceText('.node-version', `Node v${versions.node}`)
}

function replaceText(selector, text) {
  const element = document.querySelector(selector)
  if (element) element.innerText = text
}

init()
