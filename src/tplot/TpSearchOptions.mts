import { JSONValue } from '../models/types.mjs'

export type TpSearchOptions =
  | string
  | object
  | string[]
  | [string, JSONValue]
  | [string, JSONValue][]
export type TpSearchTerm = string | number

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
