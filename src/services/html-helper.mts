export abstract class HtmlHelper {
  static ParamsEncoder(params?: object): string {
    return Object.entries(params || {}).reduce((acc, [key, value], index) => {
      const encodedKey = encodeURIComponent(key)
      const encodedValue = encodeURIComponent(value)
      // No & before the first parameter
      const separator = index === 0 ? '' : '&'

      return `${acc}${separator}${encodedKey}=${encodedValue}`
    }, '')
  }
}
