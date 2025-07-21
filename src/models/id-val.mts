import { IId, IIdRequired } from './IdManager.mjs'
import { INameVal } from './NameValManager.mjs'
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
  id: Tid
  val: Tval

  constructor(id: Tid, val: Tval) {
    this.id = id
    this.val = val
  }

  static ToIIdVal<Tid = string, Tval = string>(
    id: Tid,
    val: Tval
  ): IIdValRequired<Tid, Tval> {
    return { id, val }
  }

  static FromNameAndVal<Tid = string, Tval = string>(id: Tid, val: Tval) {
    return IdVal.ToIIdVal<Tid, Tval>(id, val)
  }

  static FromNameVal<Tval = string>(
    nameVal: INameVal<Tval>
  ): IIdValRequired<string, Tval> {
    return IdVal.ToIIdVal<string, Tval>(nameVal.name, nameVal.val)
  }
}
