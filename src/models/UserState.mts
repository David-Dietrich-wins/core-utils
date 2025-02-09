// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IUserState<T = any> {
  id: string
  disallowedPins: string[]
  message?: string
  name: string
  obj?: T
  status: string
  statusCode: number
}

// Custom API error to throw
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default class UserState<T = any> implements IUserState<T> {
  id = ''
  disallowedPins = []

  constructor(
    public name = 'User',
    public status: string,
    public statusCode = -1,
    public obj?: T
  ) {
    this.id = name
  }
}
