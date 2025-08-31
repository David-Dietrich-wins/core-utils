import { IHasPolitiscales, IPolitiscale } from './politiscale.mjs'
import { IName, ISlug } from '../models/interfaces.mjs'
import { IdName } from '../models/id-name.mjs'
import { isObject } from '../primitives/object-helper.mjs'

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

  static CreateICity(overrides?: Partial<ICity>) {
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

export interface IdNameSlug<Tid = string> extends IdName<Tid>, ISlug {}

export type IdNameSlugWithScales = IdNameSlug & IHasPolitiscales
