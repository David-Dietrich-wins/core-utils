import { INameTypeValue, INameValue } from './interfaces.mjs'
import {
  isNullOrUndefined,
  sortFunction,
} from '../primitives/object-helper.mjs'
import { safestr, safestrLowercase } from '../primitives/string-helper.mjs'
import { InstrumentationStatistics } from './InstrumentationStatistics.mjs'
import { safeArray } from '../primitives/array-helper.mjs'

export class NameValue<Tvalue = string> implements INameValue<Tvalue> {
  name: string
  value: Tvalue

  constructor(name: string, value: Tvalue) {
    this.name = name
    this.value = value
  }
}

export class NameValueType<TValue = string, TType = string>
  extends NameValue<TValue>
  implements INameTypeValue<TValue, TType>
{
  type: TType

  constructor(name: string, value: TValue, type: TType) {
    super(name, value)
    this.type = type
  }
}

export type NameValueAsType<Tvalue = string, Tname = string> = {
  name: Tname
  value: Tvalue
}

export type INameValueBoolean = INameValue<boolean>
export type INameValueNumber = INameValue<number>

export type NameValueBoolean = NameValueType<boolean>
export type NameValueNumber = NameValueType<number>
export type NameValueString = NameValueType

export class NameValueManager<TValue = string> {
  list: INameValue<TValue>[]
  stats?: InstrumentationStatistics

  constructor(
    list: INameValue<TValue>[] = [],
    stats?: InstrumentationStatistics
  ) {
    this.list = list
    this.stats = stats
  }

  static CreateNameValueManager<TValue = string>(
    arr: INameValue<TValue>[] | null | undefined,
    stats?: InstrumentationStatistics
  ): NameValueManager<TValue> {
    return new NameValueManager(safeArray(arr), stats)
  }

  static CreateINameValue<TValue = string>(
    name: string,
    value: TValue
  ): INameValue<TValue> {
    const item: INameValue<TValue> = {
      name,
      value,
    }

    return item
  }
}

export class NameValueWithStyle {
  name: string
  value: string | number | undefined
  style?: object
  tooltip?: string
  order?: number

  constructor(
    name: string,
    value?: string | number,
    style?: object,
    tooltip?: string,
    order?: number
  ) {
    this.name = name
    this.value = value
    this.style = style
    this.tooltip = tooltip
    this.order = order
  }
}

type StyleFormatter = (
  val: number | string | null | undefined,
  showZeroValues: boolean,
  numDecimalPlaces: number
) => string

export class NameValueLineFormatter<T extends object> {
  key: keyof T
  keyDisplayValue: string
  order?: number
  formatter?: StyleFormatter
  tooltip?: string
  style?: object
  formatNumberOrString?: (val: number | string | null | undefined) => string

  constructor(
    key: keyof T,
    keyDisplayValue: string,
    order?: number,
    formatter?: StyleFormatter,
    tooltip?: string,
    style?: object,
    formatNumberOrString?: (val: number | string | null | undefined) => string
  ) {
    this.key = key
    this.keyDisplayValue = keyDisplayValue
    this.order = order
    this.formatter = formatter
    this.tooltip = tooltip
    this.style = style
    this.formatNumberOrString = formatNumberOrString
  }

  FromStyle(
    name: string,
    value: number | string | undefined,
    showZeroValues = true,
    numDecimalPlaces = 2
  ) {
    return new NameValueWithStyle(
      this.keyDisplayValue,
      this.formatter
        ? this.formatter(value, showZeroValues, numDecimalPlaces)
        : value,
      this.style,
      this.tooltip
    )
  }

  NumberOrString(name: string, value: number | string | undefined) {
    return new NameValueWithStyle(
      this.keyDisplayValue,
      this.formatNumberOrString ? this.formatNumberOrString(value) : value,
      this.style,
      this.tooltip
    )
  }
}

export class NameValueLineFormatManager<T extends object> {
  nvlist: NameValueLineFormatter<T>[] = []

  constructor(nvlist: NameValueLineFormatter<T>[] = []) {
    this.nvlist = nvlist
  }

  FormatWithStyle(data: NameValue[], sortField?: string, sortDirection = true) {
    const itemMapper = (item: NameValueWithStyle) => {
        const nvlf = this.nvlist.find((x) => x.key === item.name)

        return nvlf?.FromStyle
          ? nvlf.FromStyle(item.name, item.value)
          : new NameValueWithStyle(
              item.name,
              item.value,
              nvlf?.style,
              nvlf?.tooltip
            )
      },
      ordered: NameValueWithStyle[] = [],
      unordered: NameValueWithStyle[] = []
    safeArray(data).forEach((item) => {
      const nvlf = this.nvlist.find((x) => x.key === item.name)

      if (nvlf) {
        if (isNullOrUndefined(nvlf.order)) {
          const im = itemMapper(item)

          unordered.push(im)
        } else {
          ordered.push(Object.assign(item, { order: nvlf.order }))
        }
      }
    })

    if (safestrLowercase(sortField) === 'name') {
      unordered.sort((a, b) => sortFunction(a.name, b.name, sortDirection))
    } else if (safestrLowercase(sortField) === 'value') {
      unordered.sort((a, b) => sortFunction(a.value, b.value, sortDirection))
    }

    return ordered
      .sort((a, b) => sortFunction(a.order, b.order, sortDirection))
      .map(itemMapper)
      .concat(unordered)
  }

  FromObject(obj?: object, sortField?: string, sortDirection = true) {
    return this.FormatWithStyle(
      Object.entries(obj || {}).map(
        ([key, value]) => new NameValue(key, safestr(value))
      ),
      sortField,
      sortDirection
    )
  }
}
