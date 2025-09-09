import type { IName, IVal } from './interfaces.mjs'
import { InstrumentationStatistics } from './InstrumentationStatistics.mjs'
import { safeArray } from '../primitives/array-helper.mjs'

export interface INameVal<Tval = string, Tname extends string = string>
  extends IName<Tname>,
    IVal<Tval> {}

export class NameVal<Tval = string, Tname extends string = string>
  implements INameVal<Tval, Tname>
{
  name: Tname
  val: Tval

  constructor(name: Tname, val: Tval) {
    this.name = name
    this.val = val
  }

  static createINameVal<T = unknown, Tname extends string = string>(
    name: Tname,
    val: T
  ): INameVal<T, Tname> {
    const inv: INameVal<T, Tname> = { name, val }

    return inv
  }
}

export class NameValType<
    TValue = string,
    TType = string,
    Tname extends string = string
  >
  extends NameVal<TValue, Tname>
  implements INameVal<TValue, Tname>
{
  type: TType

  constructor(name: Tname, value: TValue, type: TType) {
    super(name, value)
    this.type = type
  }
}

export type NameValAsType<Tvalue = string, Tname extends string = string> = {
  name: Tname
  value: Tvalue
}

export class NameValManager<TValue = string, Tname extends string = string> {
  list: INameVal<TValue, Tname>[]
  stats?: InstrumentationStatistics

  constructor(
    list: INameVal<TValue, Tname>[] = [],
    stats?: InstrumentationStatistics
  ) {
    this.list = list
    this.stats = stats
  }

  static createNameValManager<TValue = string, Tname extends string = string>(
    arr: INameVal<TValue, Tname>[] | null | undefined,
    stats?: InstrumentationStatistics
  ): NameValManager<TValue, Tname> {
    return new NameValManager(safeArray(arr), stats)
  }

  static toINameVal<TValue = string, Tname extends string = string>(
    name: Tname,
    val: TValue
  ): INameVal<TValue, Tname> {
    const item: INameVal<TValue, Tname> = {
      name,
      val,
    }

    return item
  }
}
