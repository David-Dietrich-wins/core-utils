import { IIdRequired } from './IdManager.mjs'
import { IValue } from './interfaces.mjs'

export interface IIdValue<Tid = string, Tvalue = string>
  extends IIdRequired<Tid>,
    IValue<Tvalue> {}

export class IdValue<Tid = string, Tvalue = string>
  implements IIdValue<Tid, Tvalue>
{
  id: Tid
  value: Tvalue

  constructor(id: Tid, value: Tvalue) {
    this.id = id
    this.value = value
  }
}

export type IdValueType<Tid = string, Tvalue = string> = {
  id: Tid
  value: Tvalue
}
