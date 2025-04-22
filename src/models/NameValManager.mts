import { safeArray } from '../services/array-helper.mjs'
import { InstrumentationStatistics } from './InstrumentationStatistics.mjs'
import { IName, IVal } from './interfaces.mjs'

export interface INameVal<Tval = string, Tname = string>
  extends IName<Tname>,
    IVal<Tval> {}

export class NameVal<Tval = string, Tname = string>
  implements INameVal<Tval, Tname>
{
  name: Tname
  val: Tval

  constructor(name: Tname, val: Tval) {
    this.name = name
    this.val = val
  }
}

export class NameValType<TValue = string, TType = string, TName = string>
  extends NameVal<TValue, TName>
  implements INameVal<TValue, TName>
{
  type: TType

  constructor(name: TName, value: TValue, type: TType) {
    super(name, value)
    this.type = type
  }
}

export type NameValAsType<Tvalue = string, Tname = string> = {
  name: Tname
  value: Tvalue
}

export class NameValManager<TValue = string, TName = string> {
  constructor(
    public list: INameVal<TValue, TName>[] = [],
    public stats?: InstrumentationStatistics
  ) {}

  static CreateNameValManager<TValue = string, TName = string>(
    arr: INameVal<TValue, TName>[] | null | undefined,
    stats?: InstrumentationStatistics
  ): NameValManager<TValue, TName> {
    return new NameValManager(safeArray(arr), stats)
  }

  static CreateINameVal<TValue = string, TName = string>(
    name: TName,
    val: TValue
  ): INameVal<TValue, TName> {
    const item: INameVal<TValue, TName> = {
      name,
      val,
    }

    return item
  }
}
