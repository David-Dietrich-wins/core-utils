import { ICity } from './city.mjs'
import { ICompany } from './company.mjs'
import type { INameValue } from '../models/interfaces.mjs'
import { ISearchRequestView } from '../services/SearchRequestView.mjs'
import { isObject } from '../services/object-helper.mjs'

export type PolitiscaleName = 'climate' | 'freeSpeech' | 'religion'

export type IPolitiscale = INameValue<number, PolitiscaleName>

export type IPolitiscales = {
  [key in PolitiscaleName]: number
}

export interface IPolitiscaleSearchParams
  extends ISearchRequestView,
    IPolitiscales {}

export function CreatePolitiscaleSearchParams(
  overrides?: Partial<IPolitiscaleSearchParams>
) {
  const ret: IPolitiscaleSearchParams = {
    climate: 0,
    exactMatch: false,
    freeSpeech: 0,
    limit: 0,
    offset: 0,
    pageIndex: 0,
    pageSize: 0,
    religion: 0,
    sortColumn: '',
    sortDirection: 'asc',
    term: '',
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
