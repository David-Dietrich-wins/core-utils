import { IName, ISlug } from '../models/interfaces'
import { Concrete } from '../models/types'
import { isObject } from '../services/general'
import { IHasPolitiscales, IPolitiscale } from './politiscale'

// export interface ICity extends I_Id, IName, Concrete<IHasPolitiscales>, ISlug {
//   city: string
//   description: string
//   sourceUrl: string
//   city_img: string
// }

//  ITableId,
export interface ICity extends IName, ISlug, Concrete<IHasPolitiscales> {
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
