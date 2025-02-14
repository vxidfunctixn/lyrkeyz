export default class Store {
  constructor() {
    this.data = {
      currentText: null,
      texts: []
    }
    this.loadStore()
  }

  loadStore() {
    window.api.loadDataStore().then((data) => {
      if (data) this.data = data
      document.dispatchEvent(new Event('dataStoreLoaded', this.data))
    })
  }

  saveStore() {
    window.api.saveDataStore(this.data)
  }
}
