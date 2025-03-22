import { INameValue } from './name-value.mjs'
import { IDate, IId, IName, IType } from './interfaces.mjs'

export interface IIdName<Tid = string, Tname = string>
  extends IId<Tid>,
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
}

export class IdNameNumber extends IdName<number> {}

export type IdNameType<Tid = string, Tname = string> = {
  id: Tid
  name: Tname
}

export type IdType<Tid = string, Ttype = unknown> = {
  id: Tid
  type: Ttype
}

export interface IdNameValue<Tvalue = string, Tid = string>
  extends IdName<Tid, string>,
    INameValue<Tvalue> {}
export interface IdNameValueType<Tvalue, Type = string, Tid = string>
  extends IdName<Tid, string>,
    INameValue<Tvalue>,
    IType<Type> {}

/**
 * Used for sending data to a parent handler in a structured way with contextual id and name.
 */
export interface IValueChange<Tvalue = string>
  extends IdNameValueType<Tvalue, string, string>,
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
