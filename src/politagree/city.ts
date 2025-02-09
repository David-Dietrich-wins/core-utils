import { IName, ISlug, ITableId } from '../utils/interfaces.js'
import { isObject } from '../utils/skky.js'
import { IHasPolitiscales, IPolitiscale } from '../utils/ticker-info.js'
import { Concrete } from '../utils/types.js'

export interface ICity extends ITableId, IName, ISlug, Concrete<IHasPolitiscales> {
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

  constructor(obj?: unknown) {
    if (isObject(obj)) {
      Object.assign(this, obj)
    }
  }
}
