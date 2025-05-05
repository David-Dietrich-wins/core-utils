import { z } from 'zod'
import { arrayFirst, isArray } from './array-helper.mjs'
import { StringHelper } from './string-helper.mjs'

export function zStringMinMax(min = 0, max = 1000) {
  return z.string().min(min).max(max)
}

export function zFromStringOrStringArray(min = 0, max = 1000) {
  return z
    .union([zStringMinMax(min, max), z.array(zStringMinMax(min, max))])
    .transform((arg): string | string[] => {
      const items = StringHelper.SplitToArray(arg)

      return isArray(items, 2) ? items : arrayFirst(items) ?? []
    })
}

export function zToStringArray(min = 0, max = 1000) {
  return z
    .union([zStringMinMax(min, max), z.array(zStringMinMax(min, max))])
    .transform((arg): string[] => StringHelper.SplitToArray(arg))
}
