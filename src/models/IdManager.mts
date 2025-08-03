import * as z from 'zod'
import {
  arrayAdd,
  arrayRemove,
  isArray,
  safeArray,
} from '../services/array-helper.mjs'
import { AppException } from './AppException.mjs'
import { FindObjectWithField } from '../services/object-helper.mjs'
import { InstrumentationStatistics } from './InstrumentationStatistics.mjs'
import { zStringMinMax } from '../services/zod-helper.mjs'

// Export type IId<T> = z.infer<ReturnType<typeof IIdSchema<z.ZodType<T>>>>

export interface IId<T = string> {
  id?: T
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IIdRequired<T = string> extends Required<IId<T>> {}

export class IdManager<T extends IId<Tid>, Tid = T['id']> {
  list: T[]
  stats?: InstrumentationStatistics

  constructor(list: T[] = [], stats?: InstrumentationStatistics) {
    if (!isArray(list) || !list.every((item) => 'id' in item)) {
      throw new AppException('list must be an array', 'IdManager.constructor')
    }

    this.list = list
    this.stats = stats
  }

  static CreateIdManager<T extends IId<Tid>, Tid = T['id']>(
    arr: T[] | null | undefined,
    stats?: InstrumentationStatistics
  ) {
    return new IdManager(safeArray(arr), stats)
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  static FindObjectWithId<T extends object = object>(
    obj: T,
    id: string | number
  ) {
    return FindObjectWithField(obj, 'id', id)
  }

  static zIId<T extends z.ZodType = z.ZodString>(id: T) {
    return z.object({
      id: id.optional(),
    })
  }

  static readonly zIdString = z.object({ id: zStringMinMax(1, 50) })

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
