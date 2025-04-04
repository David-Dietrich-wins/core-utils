import { IdName } from '../models/id-name.mjs'
import { IName, ISlug } from '../models/interfaces.mjs'
import { isObject } from '../services/general.mjs'
import { IHasPolitiscales, IPolitiscale } from './politiscale.mjs'

export interface ICity extends IName, ISlug, Required<IHasPolitiscales> {
  city: string
  description: string
  sourceUrl: string
  city_img: string
}

export class City implements ICity {
  name = ''
  city = ''
  description = ''
  sourceUrl = ''
  city_img = ''
  slug = ''
  scales: IPolitiscale[] = []

  constructor(obj?: ICity) {
    if (isObject(obj)) {
      Object.assign(this, obj)
    }
  }

  static CreateICity(overrides?: Partial<ICity>): ICity {
    const icity: ICity = {
      city: '',
      city_img: '',
      description: '',
      name: '',
      scales: [],
      slug: '',
      sourceUrl: '',
      ...overrides,
    }

    return icity
  }
}

export interface IdNameSlug<Tid = string, Tname = string>
  extends IdName<Tid, Tname>,
    ISlug {}

export type IdNameSlugWithScales = IdNameSlug & IHasPolitiscales
