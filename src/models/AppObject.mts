export class AppObject {
  get className() {
    return AppObject.name
  }

  classMethodString(methodName?: string, addSemi = false) {
    return `${this.className}:${methodName ? ` ${  methodName}` : ''}${
      addSemi ? ':' : ''
    }`
  }
}
