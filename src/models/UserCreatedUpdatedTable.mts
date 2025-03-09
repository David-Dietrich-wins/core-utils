import { ObjectId } from 'bson'
import {
  ITableId,
  ICreatedBy,
  IUpdatedBy,
  IUserId,
  StringOrObjectId,
} from './interfaces.mjs'
import {
  hasData,
  isNullOrUndefined,
  isObject,
  isString,
} from '../services/general.mjs'

export interface ICreatedTable extends ITableId, ICreatedBy {}
export interface ICreatedUpdatedTable extends ICreatedTable, IUpdatedBy {}

export interface IUserCreatedUpdatedTable
  extends ICreatedUpdatedTable,
    IUserId {}

export class CreatedTable implements ICreatedTable {
  _id?: ObjectId | undefined
  createdby!: string
  created = new Date()

  constructor(
    createdby: string | ICreatedTable = 'IdCreatedUpdated',
    created?: Date
  ) {
    if (isObject(createdby)) {
      this.copyFromDatabase(createdby as ICreatedTable)
    } else {
      this.createdby = createdby as string
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
      this.copyFromDatabase(updatedby as ICreatedUpdatedTable)
    } else {
      this.updatedby = updatedby as string
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

export class UserCreatedUpdatedTable
  extends CreatedUpdatedTable
  implements IUserCreatedUpdatedTable
{
  userid = new ObjectId()

  constructor(
    userid?: StringOrObjectId | IUserCreatedUpdatedTable,
    updatedby = 'IdUserCreatedUpdated',
    updated?: Date,
    createdby = 'IdUserCreatedUpdated',
    created?: Date
  ) {
    super(updatedby, updated, createdby, created)

    if (isObject(userid) && !(userid instanceof ObjectId)) {
      this.copyFromDatabase(userid as IUserCreatedUpdatedTable)
    } else {
      this.userid = new ObjectId(userid as StringOrObjectId)
    }
  }

  static fixupForUpsert(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    obj: any,
    userid: StringOrObjectId,
    username: string,
    dateToSetTo?: Date
  ): boolean {
    const isUpdate = false

    if (isNullOrUndefined(obj)) {
      throw new Error('You must pass a non-empty object to fixupForInsert.')
    }

    const dateToUse = isNullOrUndefined(dateToSetTo) ? new Date() : dateToSetTo

    if (!hasData(obj.created)) {
      obj.created = dateToUse
    }

    if (!hasData(obj.createdby)) {
      obj.createdBy = username
    }

    obj.updated = dateToUse
    obj.updatedBy = username

    return isUpdate
  }

  copyFromDatabase(dbtp: IUserCreatedUpdatedTable) {
    super.copyFromDatabase(dbtp)

    if (dbtp.userid) {
      this.userid = isString(dbtp.userid)
        ? new ObjectId(dbtp.userid)
        : dbtp.userid
    }
  }
}
