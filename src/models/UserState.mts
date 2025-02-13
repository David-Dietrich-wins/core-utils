import { IIdName } from './id-name.mjs'

export interface IUserState<T = unknown> extends IIdName<string, string> {
  message?: string
  obj?: T
  status: string
  statusCode: number
}

// Custom API error to throw
export default class UserState<T = unknown> implements IUserState<T> {
  id = ''

  constructor(
    public name = 'User',
    public status = '',
    public statusCode = -1,
    public obj?: T
  ) {
    this.id = name
  }
}
