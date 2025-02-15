export default class Utils {
  constructor() {
    throw new Error('This class cannot be instantiated')
  }

  static debounce(func, wait = 0, immediate = false) {
    let timeout
    return function (...args) {
      const context = this
      const later = () => {
        timeout = null
        if (!immediate) {
          func.apply(context, args)
        }
      }
      const callNow = immediate && !timeout
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
      if (callNow) {
        func.apply(context, args)
      }
    }
  }
}
