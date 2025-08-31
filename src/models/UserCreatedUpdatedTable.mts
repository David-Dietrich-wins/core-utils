import { ICreatedBy, IUpdatedBy } from './id-created-updated.mjs'
import {
  hasData,
  isNullOrUndefined,
  isObject,
} from '../primitives/object-helper.mjs'
import { AnyObject } from './types.mjs'
import { AppException } from './AppException.mjs'
import { IId } from './IdManager.mjs'
import { IUserId } from './interfaces.mjs'

export interface ICreatedTable<Tid = string> extends IId<Tid>, ICreatedBy {}
export interface ICreatedUpdatedTable<Tid = string>
  extends ICreatedTable<Tid>,
    IUpdatedBy {}

export interface IUserCreatedUpdatedTable<T = string, Tid = string>
  extends ICreatedUpdatedTable<Tid>,
    IUserId<T> {}

export class CreatedTable<Tid = string> implements ICreatedTable<Tid> {
  id?: Tid
  createdby!: string
  created = new Date()

  constructor(
    createdby: string | ICreatedTable = 'IdCreatedUpdated',
    created?: Date
  ) {
    if (isObject(createdby)) {
      this.copyFromDatabase(createdby)
    } else {
      this.createdby = createdby
      if (created) {
        this.created = created
      }
    }
  }

  copyFromDatabase(dbtp: ICreatedTable) {
    if (hasData(dbtp.createdby)) {
      this.createdby = dbtp.createdby
    }
    if (hasData(dbtp.created)) {
      this.created = dbtp.created
    }
  }
}

export class CreatedUpdatedTable
  extends CreatedTable
  implements ICreatedUpdatedTable
{
  updatedby!: string
  updated = new Date()

  constructor(
    updatedby: string | ICreatedUpdatedTable = 'IdCreatedUpdated',
    updated?: Date,
    createdby = 'IdCreatedUpdated',
    created?: Date
  ) {
    super(createdby, created)
    if (updatedby && isObject(updatedby)) {
      this.copyFromDatabase(updatedby)
    } else {
      this.updatedby = updatedby
      if (updated) {
        this.updated = updated
      }
    }
  }

  copyFromDatabase(dbtp: ICreatedUpdatedTable) {
    super.copyFromDatabase(dbtp)

    if (hasData(dbtp.updatedby)) {
      this.updatedby = dbtp.updatedby
    }
    if (hasData(dbtp.updated)) {
      this.updated = dbtp.updated
    }
  }
}

export class UserCreatedUpdatedTable<T = string>
  extends CreatedUpdatedTable
  implements IUserCreatedUpdatedTable<T>
{
  userid: T | undefined

  constructor(
    userid?: T | IUserCreatedUpdatedTable<T>,
    updatedby = 'IdUserCreatedUpdated',
    updated?: Date,
    createdby = 'IdUserCreatedUpdated',
    created?: Date
  ) {
    super(updatedby, updated, createdby, created)

    if (isObject(userid)) {
      this.copyFromDatabase(userid)
    } else {
      this.userid = userid
    }
  }

  static fixupForUpsert(
    obj: AnyObject,
    // Userid: string,
    username: string,
    dateToSetTo?: Date
  ) {
    if (isNullOrUndefined(obj)) {
      throw new AppException(
        'You must pass a non-empty object to fixupForInsert.'
      )
    }

    const dateToUse = isNullOrUndefined(dateToSetTo) ? new Date() : dateToSetTo,
      wasUpdated = false

    if (!hasData(obj.created)) {
      obj.created = dateToUse
    }

    if (!hasData(obj.createdby)) {
      obj.createdby = username
    }

    obj.updated = dateToUse
    obj.updatedby = username

    return wasUpdated
  }

  copyFromDatabase(dbtp: IUserCreatedUpdatedTable<T>) {
    super.copyFromDatabase(dbtp)

    if (dbtp.userid) {
      this.userid = dbtp.userid
    }
  }
}
