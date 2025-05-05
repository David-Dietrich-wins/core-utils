import { z } from 'zod'
import { isObject } from '../services/object-helper.mjs'
import { IId } from './IdManager.mjs'

// const ZodDateField = z.union([
//   z.string().refine((val) => !isNaN(Date.parse(val)), {
//     message: 'Invalid date string',
//   }),
//   z.number().refine((val) => !isNaN(val), {
//     message: 'Invalid date number',
//   }),
//   z.date(),
// ])

export const CreatedOnSchema = <T extends string | number | Date = Date>(
  created: z.ZodType<T>
) => {
  return z.object({
    created,
  })
}
export type ICreated<T extends string | number | Date = Date> = z.infer<
  ReturnType<typeof CreatedOnSchema<T>>
>

export const CreatedBySchema = <T extends string | number | Date = Date>(
  created: z.ZodType<T>
) =>
  z
    .object({
      createdby: z.string().min(1).max(1000),
    })
    .merge(CreatedOnSchema<T>(created))
export type ICreatedBy<T extends string | number | Date = Date> = z.infer<
  ReturnType<typeof CreatedBySchema<T>>
>

export const UpdatedOnSchema = <T extends string | number | Date = Date>(
  updated: z.ZodType<T>
) => {
  return z.object({
    updated,
  })
}
export type IUpdated<T extends string | number | Date = Date> = z.infer<
  ReturnType<typeof UpdatedOnSchema<T>>
>

export const UpdatedBySchema = <T extends string | number | Date = Date>(
  updated: z.ZodType<T>
) =>
  z
    .object({
      updatedby: z.string().min(1).max(1000),
    })
    .merge(UpdatedOnSchema<T>(updated))
export type IUpdatedBy<T extends string | number | Date = Date> = z.infer<
  ReturnType<typeof UpdatedBySchema<T>>
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

  copyFromDatabase(dbtp: IIdCreatedUpdated<Tid>) {
    super.copyFromDatabase(dbtp)

    this.updatedby = dbtp.updatedby
    this.updated = dbtp.updated
  }
}
