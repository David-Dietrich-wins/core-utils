import {
  IUserCreatedUpdatedTable,
  UserCreatedUpdatedTable,
} from '../models/UserCreatedUpdatedTable.mjs'
import { NameVal } from '../models/NameValManager.mjs'
import { isObject } from '../services/primitives/object-helper.mjs'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IFacet<T = any> extends IUserCreatedUpdatedTable, NameVal<T> {
  symbol: string
  resolution: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FacetSaveParameters<T = any> = {
  symbol: string
  resolution: string
  facets: IFacet<T>[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Facet<T = any>
  extends UserCreatedUpdatedTable
  implements IFacet<T>
{
  name = ''
  symbol = ''
  resolution = ''
  val!: T

  constructor(
    name: string | IFacet,
    symbol: string,
    resolution: string,
    val: T,
    updatedby: string = 'IdUserCreatedUpdated',
    updated?: Date,
    createdby = 'IdUserCreatedUpdated',
    created?: Date
  ) {
    super(undefined, updatedby, updated, createdby, created)

    if (isObject(name)) {
      Object.assign(this, name)
    } else {
      this.name = name
      this.symbol = symbol
      this.resolution = resolution
      this.val = val
    }
  }
}
