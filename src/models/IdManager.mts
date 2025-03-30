import { arrayAdd, arrayRemove } from '../index.mjs'
import { InstrumentationStatistics } from './InstrumentationStatistics.mjs'

export interface IId<T = string> {
  id?: T
}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IIdRequired<T = string> extends Required<IId<T>> {}

export class IdManager<Tid extends IId> {
  constructor(
    public list: Tid[] = [],
    public stats?: InstrumentationStatistics
  ) {}

  static Create<T extends IId>(arr: T[] = []) {
    return new IdManager(arr)
  }

  add(item: Tid, index?: number): IdManager<Tid> {
    arrayAdd(this.list, item, index)

    this.stats?.addSuccess()
    return this
  }

  remove(idObj: Tid): IdManager<Tid> {
    arrayRemove(this.list, idObj)

    this.stats?.deleted()

    return this
  }
}
