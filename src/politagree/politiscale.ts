import { isObject } from '../utils/skky.js'
import { IPolitiscale, PolitiscaleName } from '../utils/ticker-info.js'

export default class Politiscale implements IPolitiscale {
  name: PolitiscaleName = 'climate'
  value = 0

  constructor(name: PolitiscaleName, value: number) {
    if (isObject(name)) {
      Object.assign(this, name)
    } else {
      this.name = name
      this.value = value
    }
  }
}
