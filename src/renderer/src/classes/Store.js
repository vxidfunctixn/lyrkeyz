import Utils from './Utils'

export default class Store {
  constructor() {
    this.data = {
      currentText: null,
      texts: [
        {
          id: 0,
          nextId: 2
        },
        {
          id: 1,
          name: 'Przykładowy tekst',
          text: 'Przykładowy tekst'
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

  getText(id) {
    return this.data.texts.find((x) => x.id === id)
  }

  setText(id, data) {
    const textIndex = this.data.texts.findIndex((x) => x.id === id)
    if (textIndex !== -1) {
      Object.assign(this.data.texts[textIndex], data)
    }
    this.debouncedSaveStore()
  }
}
