import Utils from './Utils'

export default class Store {
  constructor() {
    this.data = {
      currentText: 1,
      texts: [
        {
          id: 0,
          nextId: 2
        },
        {
          id: 1,
          name: 'Przykładowy tekst',
          content: 'Przykładowy tekst',
          selection: {
            row: 0,
            column: 0
          }
        }
      ]
    }

    this.debouncedSaveStore = Utils.debounce(() => {
      this.saveStore()
    }, 1000)

    this.loadStore()

    window.addEventListener('beforeunload', () => {
      this.saveStore()
    })
  }

  loadStore() {
    window.api.loadDataStore().then((data) => {
      if (data) this.data = data
      else this.saveStore()
      document.dispatchEvent(new Event('dataStoreLoaded', this.data))
    })
  }

  saveStore() {
    window.api.saveDataStore(this.data)
  }

  getText(id = null) {
    if (!id) return this.data.texts.find((x) => x.id === this.data.currentText)
    return this.data.texts.find((x) => x.id === id)
  }

  getCurrentTextId() {
    return this.data.currentText
  }

  setText(id, data) {
    const textIndex = this.data.texts.findIndex((x) => x.id === id)
    if (textIndex !== -1) {
      Object.assign(this.data.texts[textIndex], data)
    }
    this.debouncedSaveStore()
  }

  getCurrent() {
    return this.data.currentText
  }

  getList() {
    return this.data.texts.slice(1)
  }

  generateTextId() {
    const id = this.data.texts[0].nextId
    this.data.texts[0].nextId++
    return id
  }

  setCurrentText(id) {
    if (this.data.texts.findIndex((x) => x.id === id) !== -1) this.data.currentText = id
    this.debouncedSaveStore()
  }

  addText() {
    const id = this.generateTextId()
    this.data.texts.push({
      id,
      name: 'Nowy tekst ' + id,
      content: '',
      selection: {
        row: 0,
        column: 0
      }
    })
    this.data.currentText = id
    this.debouncedSaveStore()
  }

  deleteText(id) {
    const textIndex = this.data.texts.findIndex((x) => x.id === id)
    if (textIndex === -1) return
    this.data.texts.splice(textIndex, 1)

    if (this.data.texts.length < 2) {
      this.addText()
    } else if (this.data.currentText === id) {
      if (textIndex > 1) {
        this.data.currentText = this.data.texts[textIndex - 1].id
      } else {
        this.data.currentText = this.data.texts[textIndex].id
      }
    }
    this.debouncedSaveStore()
  }
}
