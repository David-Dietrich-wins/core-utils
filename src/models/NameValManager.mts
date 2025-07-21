import { IName, IVal } from './interfaces.mjs'
import { InstrumentationStatistics } from './InstrumentationStatistics.mjs'
import { safeArray } from '../services/array-helper.mjs'

export interface INameVal<Tval = string> extends IName, IVal<Tval> {}

export class NameVal<Tval = string> implements INameVal<Tval> {
  name: string
  val: Tval

  constructor(name: string, val: Tval) {
    this.name = name
    this.val = val
  }

  static CreateINameVal<T = unknown>(name: string, val: T): INameVal<T> {
    const inv: INameVal<T> = { name, val }

    return inv
  }
}

export class NameValType<TValue = string, TType = string>
  extends NameVal<TValue>
  implements INameVal<TValue>
{
  type: TType

  constructor(name: string, value: TValue, type: TType) {
    super(name, value)
    this.type = type
  }
}

export type NameValAsType<Tvalue = string> = {
  name: string
  value: Tvalue
}

export class NameValManager<TValue = string> {
  list: INameVal<TValue>[]
  stats?: InstrumentationStatistics

  constructor(
    list: INameVal<TValue>[] = [],
    stats?: InstrumentationStatistics
  ) {
    this.list = list
    this.stats = stats
  }

  static CreateNameValManager<TValue = string>(
    arr: INameVal<TValue>[] | null | undefined,
    stats?: InstrumentationStatistics
  ): NameValManager<TValue> {
    return new NameValManager(safeArray(arr), stats)
  }

  static ToINameVal<TValue = string>(
    name: string,
    val: TValue
  ): INameVal<TValue> {
    const item: INameVal<TValue> = {
      name,
      val,
    }

    return item
  }
}
