export class AppObject {
  // eslint-disable-next-line class-methods-use-this
  get className() {
    return AppObject.name
  }

  classMethodString(methodName?: string, addSemi = false) {
    return `${this.className}:${methodName ? ` ${methodName}` : ''}${
      addSemi ? ':' : ''
    }`
  }
}
