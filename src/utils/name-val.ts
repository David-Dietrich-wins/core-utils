import { IName, IVal } from './interfaces'

export interface INameVal<Tval = string, Tname = string> extends IName<Tname>, IVal<Tval> {}

export class NameVal<Tval = string, Tname = string> implements INameVal<Tval, Tname> {
  name: Tname
  val: Tval

  constructor(name: Tname, val: Tval) {
    this.name = name
    this.val = val
  }
}

export type NameValType<Tval = string, Tname = string> = {
  name: Tname
  val: Tval
}
