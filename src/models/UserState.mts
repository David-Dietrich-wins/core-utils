export interface IUserState<T = unknown> {
  id: string
  message?: string
  name: string
  obj?: T
  status: string
  statusCode: number
}

// Custom API error to throw
export default class UserState<T = unknown> implements IUserState<T> {
  id = ''

  constructor(
    public name = 'User',
    public status: string,
    public statusCode = -1,
    public obj?: T
  ) {
    this.id = name
  }
}
