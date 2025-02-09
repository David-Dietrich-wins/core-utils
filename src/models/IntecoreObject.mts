export class IntecoreObject {
  static readonly CLASS_Name = 'IntecoreObject'

  get className() {
    return IntecoreObject.CLASS_Name
  }
  classMethodString(methodName?: string, addSemi = false) {
    return `${this.className}:${methodName ? ' ' + methodName : ''}${addSemi ? ':' : ''}`
  }
}
