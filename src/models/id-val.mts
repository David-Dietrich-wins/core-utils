import { IId } from './IdManager.mjs'
import { IVal } from './interfaces.mjs'

export interface IIdVal<Tid = string, Tval = string>
  extends IId<Tid>,
    IVal<Tval> {}

export class IdVal<Tid = string, Tval = string> implements IIdVal<Tid, Tval> {
  constructor(public id: Tid, public val: Tval) {}
}
