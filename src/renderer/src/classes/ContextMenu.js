export default class ContextMenu {
  constructor(event, options) {
    this.options = options
    this.event = event
    this.x = event.clientX
    this.y = event.clientY
    this.menu = this.createMenu()
  }

  createMenu() {
    const menu = document.createElement('div')
    menu.classList.add('context-menu')
    menu.tabIndex = '0'
    menu.style.top = this.y + 'px'
    menu.style.left = this.x + 'px'
    let menuHtml = ''

    this.options.map((option, index) => {
      if (option.type === 'separator') {
        menuHtml += '<div class="separator"></div>'
      } else {
        const disabled = option.disabled ? ' disabled' : ''
        menuHtml += `
        <button class="option${disabled}" data-index="-1" data-option="${index}">
          ${option.label}
        </button>
        `
      }
    })
    this.event.target.classList.add('context-menu-target')

    menu.innerHTML = menuHtml

    document.body.appendChild(menu)
    menu.focus()
    menu.addEventListener('blur', (e) => this.removeMenu(e))
    menu.addEventListener('click', (e) => this.handleClick(e))
    return menu
  }

  removeMenu(e) {
    if (this.menu.contains(e.relatedTarget) === false) {
      this.event.target.classList.remove('context-menu-target')
      this.menu.remove()
    } else {
      this.menu.focus()
    }
  }

  handleClick(e) {
    const id = e.target?.dataset?.option
    if (id) {
      const callback = this.options[Number(id)]?.action
      if (typeof callback === 'function') {
        callback()
        this.menu.blur()
      }
    }
  }
}
