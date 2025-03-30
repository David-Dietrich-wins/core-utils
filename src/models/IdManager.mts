import { InstrumentationStatistics } from './InstrumentationStatistics.mjs'

export interface IId<T = string> {
  id?: T
}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IIdRequired<T = string> extends Required<IId<T>> {}

export class IdManager<Tiid extends IId> {
  constructor(
    public list: Tiid[] = [],
    public stats?: InstrumentationStatistics
  ) {}
}
