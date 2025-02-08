import { ObjectId } from 'bson'
import { JSONValue } from '../models/types'

export type TpSearchOptions =
  | string
  | object
  | string[]
  | [string, JSONValue]
  | [string, JSONValue][]
export type TpSearchTerm = string | number

export type ObjectOfObjectIds = {
  [x: string]: ObjectId
}

export type ElementMatch = {
  $elemMatch: {
    name: string
    value: {
      $gte: number
    }
  }
}

export type ScaleMatch = {
  scales?: ElementMatch
  $and?: ScaleMatch[]
  type?: string
  exchange?: string | Readonly<string[]>
}
