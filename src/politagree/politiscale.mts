import { ISearchRequestView } from '../models/interfaces.mjs'
import { INameValue } from '../models/name-value.mjs'
import { ITickerSearch } from '../models/ticker-info.mjs'
import { isObject } from '../services/general.mjs'
import { ICity } from './city.mjs'
import { ICompany } from './company.mjs'

export type PolitiscaleName = 'climate' | 'freeSpeech' | 'religion'

export type IPolitiscale = INameValue<number, PolitiscaleName>

export type IPolitiscales = {
  [key in PolitiscaleName]: number
}

export interface IPolitiscaleSearchParams
  extends Partial<ISearchRequestView>,
    IPolitiscales {}

export function CreatePolitiscaleSearchParams(
  overrides?: Partial<IPolitiscaleSearchParams>
) {
  const DEFAULT_params: IPolitiscaleSearchParams = {
    term: '',
    climate: 0,
    freeSpeech: 0,
    religion: 0,
    limit: 0,
    offset: 0,
  }

  const ret: IPolitiscaleSearchParams = {
    ...DEFAULT_params,
    ...overrides,
  }

  return ret
}

export const DEFAULT_PolitiscalesAll: IPolitiscales = {
  climate: 0,
  freeSpeech: 0,
  religion: 0,
} as const

export function PolitiscalesCreateAll(overrides?: Partial<IPolitiscales>) {
  const ret: IPolitiscales = { ...DEFAULT_PolitiscalesAll, ...overrides }

  return ret
}
export interface IHasPolitiscales {
  scales?: IPolitiscale[]
}

export interface ITickerSearchWithScales
  extends ITickerSearch,
    IHasPolitiscales {}

export class Politiscale implements IPolitiscale {
  name: PolitiscaleName = 'climate'
  value = 0

  constructor(name: PolitiscaleName | IPolitiscale, value: number) {
    if (isObject(name)) {
      Object.assign(this, name)
    } else {
      this.name = name
      this.value = value
    }
  }
}

export type UiLayoutWithScales<T = ICity | ICompany> = {
  ret: T
  scales: IPolitiscales
}
