import { isObject } from '../services/general.js'

/** Custom API error to throw. */
export default class MgmError<T = unknown> extends Error {
  constructor(
    message = 'Error',
    public statusCode = -1,
    public response?: T
  ) {
    super(message)

    Object.setPrototypeOf(this, new.target.prototype)
  }

  toString() {
    return `${this.message}\nResponse:\n${
      isObject(this.response) ? JSON.stringify(this.response, null, 2) : this.response ?? ''
    }`
  }
}
