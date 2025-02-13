export default class TextFormater {
  constructor() {
    this.textInput = document.getElementById('text-input')
    this.textOverlay = document.getElementById('text-overlay')
    this.lineOverlay = document.getElementById('line-overlay')

    this.textChange()

    this.textInput.addEventListener('input', () => this.textChange())
    document.addEventListener('selectionchange', () => this.textChange())
    this.textInput.addEventListener('scroll', () => this.handleTextScroll())

    this.textInput.focus()
  }

  loadText(value) {
    this.textInput.value = value
    this.textChange()
  }

  textChange() {
    const linesData = this.prepareLinesData()
    this.renderLines(linesData)
  }

  prepareLinesData() {
    const lines = []
    const splittedLines = this.textInput.value.split('\n')
    const verses = [{ syllables: [] }]
    let verseNumber = 1

    splittedLines.map((line, index) => {
      const syllables = this.countLineSyllabes(line)
      if (syllables !== 0) {
        verses[verses.length - 1].syllables.push(syllables)
      }

      const isHeader = line.trim().startsWith('[') && line.trim().endsWith(']')

      lines.push({
        syllables,
        text: line,
        verseCount: verseNumber,
        isHeader
      })

      if (syllables === 0 || index === splittedLines.length - 1 || isHeader) {
        verseNumber = 1
        verses.push({
          syllables: []
        })
      } else {
        verseNumber++
      }
    })
    return lines
  }

  renderLines(linesData) {
    let lineOverlayHTML = ''
    let textOverlayHTML = ''

    const cursorPosition = this.getCursorPosition()

    linesData.map((line, index) => {
      const isActiveLine = index === cursorPosition.currentLine
      const highlightClass = isActiveLine ? ' highlight' : ''
      const cursorCarret = '<span class="cursor-carret"></span>'

      let columnData = `<span class="separator"></span>`
      let textHighLight = line.text

      if (isActiveLine) {
        textHighLight =
          textHighLight.slice(0, cursorPosition.currentColumn) +
          cursorCarret +
          textHighLight.slice(cursorPosition.currentColumn)
      }

      const textHighLightCommentArr = textHighLight.split('//')
      textHighLight = textHighLightCommentArr[0]
      const textHighLightCommentArr2 = textHighLight.split(`/${cursorCarret}/`)
      if (textHighLightCommentArr2.length > 1) {
        textHighLight = `${textHighLightCommentArr2[0]}<span class="comment">/${cursorCarret}/${textHighLightCommentArr2[1]}</span>`
      }
      if (textHighLightCommentArr.length > 1) {
        textHighLight += `<span class="comment">//${textHighLightCommentArr.slice(1).join('//')}</span>`
      }

      if (line.isHeader) {
        columnData = `<span class="header"></span>`
        textHighLight = `<span class="header">${textHighLight}</span>`
      } else if (line.syllables > 0) {
        const firstClass = line.verseCount === 1 ? ' first' : ''
        const nextElement = linesData?.[index + 1]
        const lastClass =
          nextElement === undefined || nextElement?.syllables === 0 || nextElement?.isHeader
            ? ' last'
            : ''
        columnData = `
          <span class="verseNumber">${line.verseCount}.</span>
          <span class="syllable">${line.syllables}</span>
          <span class="buckle${firstClass}${lastClass}">
          `
      }

      lineOverlayHTML += `
        <div class="line${highlightClass}">
           <div class="column-data">${columnData}</div>
        </div>
        `
      textOverlayHTML += `
        <div class="line${highlightClass}">
           <div class="column-data">${textHighLight}</div>
        </div>
        `
    })

    this.lineOverlay.innerHTML = lineOverlayHTML
    this.textOverlay.innerHTML = textOverlayHTML
  }

  countLineSyllabes(lineOfText) {
    let temp = 0
    const removeComment = lineOfText.split('//')[0].trim()
    const removeSpecialChars = removeComment.replace(/[^a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]/g, '')
    const reduceSyllablesCount = removeSpecialChars
      .replace(/([aeiouyąęó])\1{2,}/gi, '$1')
      .replace(/(?<=[bcdfghjklmnpqrstvwxyz])([aeiouyąęó])\1(?=[bcdfghjklmnpqrstvwxyz])/gi, '$1$1')
      .replace(/([aeiouyąęó])\1(?!\w)/gi, '$1')
    const wordArr = reduceSyllablesCount.match(/\S+/g)
    if (!wordArr) return temp
    for (let i = 0; i < wordArr.length; i++) {
      const vowelCount = wordArr[i].match(/[aeiouyąęó]/gi)

      if (vowelCount != null) {
        temp += vowelCount.length
      }

      const count_of_i = wordArr[i].toLowerCase().split(/[i]/g)
      if (count_of_i != null && count_of_i.length > 1) {
        for (let j = 1; j < count_of_i.length; j++) {
          const nextLetter = count_of_i[j][0]
          if (nextLetter != null) {
            if (nextLetter.match(/[aeiouąęó]/gi) != null) temp--
          }
        }
      }
    }

    return temp
  }

  getCursorPosition() {
    const cursorPosition = this.textInput.selectionStart
    const textBeforeCursor = this.textInput.value.substring(0, cursorPosition)
    const lines = textBeforeCursor.split('\n')

    return {
      currentLine: lines.length - 1,
      currentColumn: lines[lines.length - 1].length
    }
  }

  handleTextScroll() {
    this.lineOverlay.scroll({
      left: 0,
      top: this.textInput.scrollTop
    })

    this.textOverlay.scroll({
      left: this.textInput.scrollLeft,
      top: this.textInput.scrollTop
    })
  }
}
