export default class TextManager {
  constructor() {
    this.textList = document.getElementById('text-list')
    this.buttonAddText = document.getElementById('add-text')
    this.list = []

    this.buttonAddText.addEventListener('click', () => this.addNewText())
    this.textList.addEventListener('click', (e) => this.setText(e))
    this.textList.addEventListener('contextmenu', (e) => this.deleteText(e))

    document.addEventListener('dataStoreLoaded', () => {
      this.list = window.store.getList()
      this.renderList()
    })
  }

  renderList() {
    let html = ''
    this.list.map((text) => {
      const highlight = window.store.getCurrentTextId() === text.id ? ' highlight' : ''
      html += `
      <div class="text${highlight}" data-id="${text.id}">${text.name}</div>
      `
    })
    this.textList.innerHTML = html
  }

  updateListItemName(id, value) {
    const item = this.textList.querySelector(`.text[data-id="${id}"]`)
    if (item) item.innerHTML = value
  }

  addNewText() {
    window.store.addText()
    this.list = window.store.getList()
    this.renderList()
    window.textEditor.loadText(true)
  }

  setText(e) {
    if (e?.target?.classList?.contains('text')) {
      const textId = Number(e.target.dataset.id)
      window.store.setCurrentText(textId)
      this.renderList()
      window.textEditor.loadText()
    }
  }

  deleteText(e) {
    if (e?.target?.classList?.contains('text')) {
      const textId = Number(e.target.dataset.id)
      window.store.deleteText(textId)
      this.list = window.store.getList()
      this.renderList()
      window.textEditor.loadText()
    }
  }
}
