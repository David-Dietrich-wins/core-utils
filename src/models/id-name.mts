import type { IDate, IName, IType, IValue } from './interfaces.mjs'
import type { IIdRequired } from './IdManager.mjs'

export interface IIdName<Tid = string, Tname = string>
  extends IIdRequired<Tid>,
    IName<Tname> {}

export class IdName<Tid = string, Tname = string>
  implements IIdName<Tid, Tname>
{
  id: Tid
  name: Tname

  constructor(id: Tid, name: Tname) {
    this.id = id
    this.name = name
  }

  static ToIIdName<Tid = string>(id: Tid, name: string): IIdName<Tid> {
    return { id, name }
  }
}

export interface IIdNameValue<Tvalue = string, Tid = string>
  extends IIdName<Tid>,
    IValue<Tvalue> {}

export class IdNameValue<Tvalue = string, Tid = string>
  extends IdName<Tid>
  implements IIdNameValue<Tvalue, Tid>
{
  value: Tvalue

  constructor(id: Tid, name: string, value: Tvalue) {
    super(id, name)

    this.value = value
  }
}

export type IdType<Tid = string, Ttype = unknown> = IIdRequired<Tid> &
  IType<Ttype>

export interface IIdNameValueType<Tvalue = string, Ttype = string, Tid = string>
  extends IIdNameValue<Tvalue, Tid>,
    IType<Ttype> {}

export class IdNameValueType<Tvalue = string, Type = string, Tid = string>
  extends IdNameValue<Tvalue, Tid>
  implements IIdNameValueType<Tvalue, Type, Tid>
{
  type: Type

  constructor(id: Tid, name: string, value: Tvalue, type: Type) {
    super(id, name, value)
    this.type = type
  }

  static ToIIdNameValueType<Tvalue = string, Type = string, Tid = string>(
    id: Tid,
    name: string,
    value: Tvalue,
    type: Type
  ): IIdNameValueType<Tvalue, Type, Tid> {
    return {
      id,
      name,
      type,
      value,
    }
  }
}

/**
 * Used for sending data to a parent handler in a structured way with contextual id and name.
 */
export interface IValueChange<Tvalue = string>
  extends IIdNameValueType<Tvalue>,
    IDate<number> {}
/**
 * Used to pass structured data back to a caller. Especially for event handlers.
 */
export type ValueChangeHandler<Tvalue = string, TReturn = void> = (
  change: IValueChange<Tvalue>
) => TReturn

export function createValueChange<T = string>(
  id: string,
  name: string,
  value: T,
  type?: string,
  date?: number
): IValueChange<T> {
  return {
    date: date ?? Date.now(),
    id,
    name,
    type: type ?? '',
    value,
  }
}
