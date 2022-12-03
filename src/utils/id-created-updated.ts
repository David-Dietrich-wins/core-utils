import { isNullOrUndefined, isObject } from './skky'
import { ICreatedBy, IId, IUpdatedBy } from './interfaces'

export interface IIdCreated<Tid = string> extends IId<Tid>, ICreatedBy {}
export interface IIdCreatedUpdated<Tid = string> extends IIdCreated<Tid>, IUpdatedBy {}

export class IdCreated<Tid = string> implements IIdCreated<Tid> {
  id?: Tid
  createdby = 'IdCreated'
  created = new Date()

  constructor(
    id: Tid | IIdCreated<Tid> | undefined,
    createdby = 'IdCreated',
    created = new Date()
  ) {
    if (id && isObject(id)) {
      this.copyFromDatabase(id as IIdCreated<Tid>)
    } else {
      if (!isNullOrUndefined(id)) {
        this.id = id as Tid
      }

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
    id: Tid | IIdCreatedUpdated<Tid> | undefined,
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
