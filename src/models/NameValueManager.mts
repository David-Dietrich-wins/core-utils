import { safeArray } from '../services/array-helper.mjs'
import { InstrumentationStatistics } from './InstrumentationStatistics.mjs'
import { IName, IType, IValue } from './interfaces.mjs'

export interface INameType<TType = string> extends IName, IType<TType> {}
export interface INameTypeValue<TValue = string, TType = string>
  extends IName,
    IType<TType>,
    IValue<TValue> {}
export interface INameValue<Tvalue = string> extends IName, IValue<Tvalue> {}

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
export type NameValueString = NameValueType<string>

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
