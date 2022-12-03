export class GrayArrowObject {
  static readonly CLASS_Name = 'GrayArrowObject'

  get className() {
    return GrayArrowObject.CLASS_Name
  }
  classMethodString(methodName?: string, addSemi = false) {
    return `${this.className}:${methodName ? ' ' + methodName : ''}${addSemi ? ':' : ''}`
  }
}
