import { type IIdRequired, IdManager } from './IdManager.mjs'
import { type IValue } from './interfaces.mjs'
import { InstrumentationStatistics } from './InstrumentationStatistics.mjs'
import { safeArray } from '../primitives/array-helper.mjs'

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

export class IdValueManager<Tid = string, Tvalue = string> extends IdManager<
  IIdValue<Tid, Tvalue>
> {
  constructor(
    list: IIdValue<Tid, Tvalue>[] = [],
    stats?: InstrumentationStatistics
  ) {
    super(list, stats)
  }

  static CreateIdValueManager<Tid = string, Tvalue = string>(
    arr: IIdValue<Tid, Tvalue>[] | null | undefined,
    stats?: InstrumentationStatistics
  ) {
    return new IdValueManager(safeArray(arr), stats)
  }

  static CreateIIdValue<Tid = string, Tvalue = string>(
    id: Tid,
    value: Tvalue
  ): IIdValue<Tid, Tvalue> {
    const item: IIdValue<Tid, Tvalue> = new IdValue(id, value)

    return item
  }
}
