import { INameValue } from '../models/name-value.js'
import { ITickerSearch } from '../models/ticker-info.js'
import { isObject } from '../services/general.js'

export type PolitiscaleName = 'climate' | 'freeSpeech' | 'religion'

export type IPolitiscale = INameValue<number, PolitiscaleName>

export interface IHasPolitiscales {
  scales?: IPolitiscale[]
}

export interface ITickerSearchWithScales extends ITickerSearch, IHasPolitiscales {}

export class Politiscale implements IPolitiscale {
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
