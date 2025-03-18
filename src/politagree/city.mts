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
}
