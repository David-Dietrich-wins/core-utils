import { FindObjectWithField } from '../index.mjs'
import { arrayAdd, arrayRemove } from '../services/array-helper.mjs'
import { safeArray } from '../services/general.mjs'
import { InstrumentationStatistics } from './InstrumentationStatistics.mjs'

export interface IId<T = string> {
  id?: T
}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IIdRequired<T = string> extends Required<IId<T>> {}

export class IdManager<T extends IId> {
  constructor(
    public list: T[] = [],
    public stats?: InstrumentationStatistics
  ) {}

  static Create<T extends IId>(
    arr: T[] | null | undefined,
    stats?: InstrumentationStatistics
  ) {
    return new IdManager(safeArray(arr), stats)
  }

  static FindObjectWithId<T extends object = object>(
    obj: T,
    id: string | number
  ) {
    return FindObjectWithField(obj, 'id', id)
  }

  add(item: T, index?: number) {
    arrayAdd(this.list, item, index)

    this.stats?.addSuccess()
    return this
  }

  remove(idObj: T) {
    this.list = arrayRemove(this.list, idObj)

    this.stats?.deleted()
    return this
  }
}
