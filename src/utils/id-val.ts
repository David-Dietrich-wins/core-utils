import { Iid, IVal } from './interfaces.js'

export interface IIdVal<Tid = string, Tval = string> extends Iid<Tid>, IVal<Tval> {}

export class IdVal<Tid = string, Tval = string> implements IIdVal<Tid, Tval> {
  id: Tid
  val: Tval

  constructor(id: Tid, val: Tval) {
    this.id = id
    this.val = val
  }
}

export type IdValType<Tid = string, Tval = string> = {
  id: Tid
  val: Tval
}
