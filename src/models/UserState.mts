import { IIdName, IdName } from './id-name.mjs'

export interface IUserState<T = unknown> extends IIdName<string> {
  message?: string
  obj?: T
  status: string
  statusCode: number
}

// Custom API error to throw
export default class UserState<T = unknown>
  extends IdName<string>
  implements IUserState<T>
{
  status: string
  statusCode: number
  obj?: T

  constructor(name = 'User', status = '', statusCode = -1, obj?: T) {
    super(name, name)

    this.status = status
    this.statusCode = statusCode
    this.obj = obj
  }
}
