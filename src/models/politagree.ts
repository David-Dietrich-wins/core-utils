import { IDate, IId, IName, ISlug } from './interfaces'
import { INameValue } from './name-value'
import { ITicker, ITickerSearch } from './ticker-info'
import { Concrete } from './types'

export type PolitiscaleName = 'climate' | 'freeSpeech' | 'religion'

export type IPolitiscale = INameValue<number, PolitiscaleName>

export interface IHasPolitiscales {
  scales?: IPolitiscale[]
}

export interface ICompanyCityBase extends IDate, Concrete<IHasPolitiscales>, IName, ISlug, ITicker {
  description: string
  imageUrl: string
  website: string
}

export interface ICity extends IId, Concrete<IHasPolitiscales> {
  name: string
  city: string
  description: string
  sourceUrl: string
  city_img: string
  slug: string
  scales: IPolitiscale[]
}

export interface ITickerSearchWithScales extends ITickerSearch, IHasPolitiscales {}
