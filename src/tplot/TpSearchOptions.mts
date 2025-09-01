import type {
  ArrayOrSingle,
  JSONValue,
  StringOrStringArray,
} from '../models/types.mjs'

export type TpSearchJsonTuple = [string, JSONValue]
export type TpSearchTerm = string | number

export type TpSearchOptions =
  | object
  | StringOrStringArray
  | ArrayOrSingle<TpSearchJsonTuple>

export type ElementMatch = {
  $elemMatch: {
    name: string
    value: {
      $gte: number
    }
  }
}

/**
 * Represents a search match for scales (climate, religion, ...) in PolitAgree.
 */
export type ScaleMatch = {
  scales?: ElementMatch
  $and?: ScaleMatch[]
  type?: string
  exchange?: string | Readonly<string[]>
}
