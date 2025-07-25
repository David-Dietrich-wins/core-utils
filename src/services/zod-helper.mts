import { StringHelper, isString } from './string-helper.mjs'
import { arrayFirst, isArray } from './array-helper.mjs'
import { isNumber } from './number-helper.mjs'
import { z } from 'zod/v4'

type StringSettings = {
  arrayStringMax?: number
  trim?: boolean
  uppercase?: boolean
  lowercase?: boolean
}

export function zStringMinMax(
  min = 0,
  max = 1000,
  extras?: StringSettings
): z.ZodString {
  let ret = z.string().min(min).max(max)

  if (extras?.trim) {
    ret = ret.trim()
  }

  if (extras?.uppercase) {
    ret = ret.toUpperCase()
  } else if (extras?.lowercase) {
    ret = ret.toLowerCase()
  }

  return ret
}

export function zFromStringOrStringArray(
  min = 0,
  max = 1000,
  extras?: StringSettings
) {
  return z
    .union([
      zStringMinMax(min, extras?.arrayStringMax ?? max),
      z.array(zStringMinMax(min, max)),
    ])
    .transform((arg): string | string[] => {
      let items = StringHelper.SplitToArray(arg, ',', true, extras?.trim)

      if (extras?.uppercase) {
        items = items.map((item) => item.toUpperCase())
      } else if (extras?.lowercase) {
        items = items.map((item) => item.toLowerCase())
      }

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-confusing-void-expression
      return isArray(items, 2) ? items : arrayFirst(items) ?? []
    })
}

export function zToStringArray(min = 0, max = 1000, extras?: StringSettings) {
  return z
    .union([
      zStringMinMax(min, extras?.arrayStringMax ?? max),
      z.array(zStringMinMax(min, max)),
    ])
    .transform((arg): string[] => {
      let items = StringHelper.SplitToArray(arg, ',', true, extras?.trim)

      if (extras?.uppercase) {
        items = items.map((item) => item.toUpperCase())
      } else if (extras?.lowercase) {
        items = items.map((item) => item.toLowerCase())
      }

      return items
    })
}

export function zDateTime() {
  return z.preprocess((arg) => {
    if (isString(arg) || isNumber(arg) || arg instanceof Date) {
      return new Date(arg)
    }
  }, z.date())
}
