import { safeArray } from '../services/array-helper.mjs'
import { InstrumentationStatistics } from './InstrumentationStatistics.mjs'
import { IName, IType, IValue } from './interfaces.mjs'

export interface INameType<TType = string, Tname = string>
  extends IName<Tname>,
    IType<TType> {}
export interface INameTypeValue<TValue = string, TType = string, Tname = string>
  extends IName<Tname>,
    IType<TType>,
    IValue<TValue> {}
export interface INameValue<Tvalue = string, Tname = string>
  extends IName<Tname>,
    IValue<Tvalue> {}

export class NameValue<Tvalue = string, Tname = string>
  implements INameValue<Tvalue, Tname>
{
  name: Tname
  value: Tvalue

  constructor(name: Tname, value: Tvalue) {
    this.name = name
    this.value = value
  }
}

export class NameValueType<TValue = string, TType = string, TName = string>
  extends NameValue<TValue, TName>
  implements INameTypeValue<TValue, TType, TName>
{
  type: TType

  constructor(name: TName, value: TValue, type: TType) {
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

export class NameValueManager<TValue = string, TName = string> {
  constructor(
    public list: INameValue<TValue, TName>[] = [],
    public stats?: InstrumentationStatistics
  ) {}

  static CreateNameValueManager<TValue = string, TName = string>(
    arr: INameValue<TValue, TName>[] | null | undefined,
    stats?: InstrumentationStatistics
  ): NameValueManager<TValue, TName> {
    return new NameValueManager(safeArray(arr), stats)
  }

  static CreateINameValue<TValue = string, TName = string>(
    name: TName,
    value: TValue
  ): INameValue<TValue, TName> {
    const item: INameValue<TValue, TName> = {
      name,
      value,
    }

    return item
  }
}
