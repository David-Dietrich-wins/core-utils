import { z } from 'zod/v4'
import { isObject } from '../services/object-helper.mjs'
import { IId } from './IdManager.mjs'

export type ICreated<T extends string | number | Date = Date> = z.infer<
  ReturnType<typeof IdCreated.zCreatedOn<T>>
>
export type ICreatedBy<T extends string | number | Date = Date> = z.infer<
  ReturnType<typeof IdCreated.zCreatedBy<T>>
>

export type IUpdated<T extends string | number | Date = Date> = z.infer<
  ReturnType<typeof IdCreatedUpdated.zUpdatedOn<T>>
>

export type IUpdatedBy<T extends string | number | Date = Date> = z.infer<
  ReturnType<typeof IdCreatedUpdated.zUpdatedBy<T>>
>

export interface ICreatedOnBy<T extends Date | string | number = Date> {
  createdby: string
  createdon: T
}
export interface IUpdatedOn<T extends Date | string | number = Date> {
  updatedon?: T
}
export interface IUpdatedOnBy<T extends Date | string | number = Date>
  extends IUpdatedOn<T> {
  updatedby?: string
}

export type IIdCreated<
  Tid = string,
  Tcreated extends string | number | Date = Date
> = IId<Tid> & ICreatedBy<Tcreated>
export type IIdCreatedUpdated<
  Tid = string,
  Tcreated extends string | number | Date = Date
> = IIdCreated<Tid, Tcreated> & IUpdatedBy<Tcreated>

export class IdCreated<Tid = string> implements IIdCreated<Tid> {
  id?: Tid
  createdby = 'IdCreated'
  created = new Date()

  constructor(
    id: Tid | IIdCreated<Tid>,
    createdby = 'IdCreated',
    created = new Date()
  ) {
    if (isObject(id)) {
      this.copyFromDatabase(id as IIdCreated<Tid>)
    } else {
      this.id = id as Tid

      this.created = created
      this.createdby = createdby
    }
  }

  static zCreatedOn<T extends string | number | Date = Date>(
    created: z.ZodType<T>
  ) {
    return z.object({
      created,
    })
  }

  static zCreatedBy<T extends string | number | Date = Date>(
    created: z.ZodType<T>
  ) {
    return z
      .object({
        createdby: z.string().min(1).max(1000),
      })
      .merge(IdCreated.zCreatedOn<T>(created))
  }

  copyFromDatabase(dbtp: IIdCreated<Tid>) {
    this.id = dbtp.id
    this.createdby = dbtp.createdby
    this.created = dbtp.created
  }
}

export class IdCreatedUpdated<Tid = string>
  extends IdCreated<Tid>
  implements IIdCreatedUpdated<Tid>
{
  updatedby = 'IdCreatedUpdated'
  updated = new Date()

  constructor(
    id: Tid | IIdCreatedUpdated<Tid>,
    createdby = 'IdCreatedUpdated',
    created = new Date(),
    updatedby = 'IdCreatedUpdated',
    updated = new Date()
  ) {
    super(id, createdby, created)

    if (id && isObject(id)) {
      this.copyFromDatabase(id as IIdCreatedUpdated<Tid>)
    } else {
      this.updated = updated
      this.updatedby = updatedby
    }
  }

  static zUpdatedOn<T extends string | number | Date = Date>(
    updated: z.ZodType<T>
  ) {
    return z.object({
      updated,
    })
  }

  static zUpdatedBy<T extends string | number | Date = Date>(
    updated: z.ZodType<T>
  ) {
    return z
      .object({
        updatedby: z.string().min(1).max(1000),
      })
      .merge(IdCreatedUpdated.zUpdatedOn<T>(updated))
  }

  copyFromDatabase(dbtp: IIdCreatedUpdated<Tid>) {
    super.copyFromDatabase(dbtp)

    this.updatedby = dbtp.updatedby
    this.updated = dbtp.updated
  }
}
