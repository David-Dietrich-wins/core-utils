import { IDate, IName, IType, IValue } from './interfaces.mjs'
import { IIdRequired } from './IdManager.mjs'

export interface IIdName<Tid = string> extends IIdRequired<Tid>, IName {}

export class IdName<Tid = string> implements IIdName<Tid> {
  constructor(public id: Tid, public name: string) {}
}

export interface IIdNameValue<Tvalue = string, Tid = string>
  extends IIdName<Tid>,
    IValue<Tvalue> {}

export class IdNameValue<Tvalue = string, Tid = string>
  extends IdName<Tid>
  implements IIdNameValue<Tvalue, Tid>
{
  constructor(id: Tid, name: string, public value: Tvalue) {
    super(id, name)
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
  constructor(id: Tid, name: string, public value: Tvalue, public type: Type) {
    super(id, name, value)
  }
}

/**
 * Used for sending data to a parent handler in a structured way with contextual id and name.
 */
export interface IValueChange<Tvalue = string>
  extends IIdNameValueType<Tvalue, string, string>,
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
) {
  const vc: IValueChange<T> = {
    id,
    name,
    value,
    type: type ?? '',
    date: date ?? Date.now(),
  }

  return vc
}
