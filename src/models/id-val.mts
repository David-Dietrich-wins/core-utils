import { IId, IIdRequired } from './IdManager.mjs'
import { IVal } from './interfaces.mjs'

export interface IIdVal<Tid = string, Tval = string>
  extends IId<Tid>,
    IVal<Tval> {}

export interface IIdValRequired<Tid = string, Tval = string>
  extends IIdRequired<Tid>,
    IVal<Tval> {}

export class IdVal<Tid = string, Tval = string>
  implements IIdValRequired<Tid, Tval>
{
  constructor(public id: Tid, public val: Tval) {}

  static CreateIdVal<Tid = string, Tval = string>(id: Tid, val: Tval) {
    const idval: IIdValRequired<Tid, Tval> = { id, val }

    return idval
  }
}
