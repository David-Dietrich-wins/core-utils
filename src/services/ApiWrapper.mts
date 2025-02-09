import { GrayArrowException } from '../models/GrayArrowException.mjs'
import { isNullOrUndefined, isObject, safestrLowercase } from './general.mjs'

export interface IApiWrapper<T = unknown> {
  id: number
  ts: number
  message: string
  responseCode: number
  result: string

  obj?: T
}

export class ApiWrapper<T = unknown> implements IApiWrapper<T> {
  id = +new Date()
  ts = this.id

  // constructor itemsskky
  message = ''
  responseCode = 0
  result = ''

  // General purpose
  obj?: T

  constructor(result = '', msg = '', responseCode = 0, obj?: T) {
    this.result = result
    this.message = msg
    this.responseCode = responseCode

    this.obj = obj
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setError(errobj?: any) {
    this.result = 'Error'
    this.responseCode = -1

    if (errobj) {
      if (isObject(errobj) && errobj instanceof GrayArrowException) {
        if (!isNullOrUndefined(errobj.responseCode)) {
          this.responseCode = errobj.responseCode ?? -1
        }

        if (errobj.message) {
          this.message = errobj.message
        }

        if (errobj.obj) {
          this.obj = errobj.obj
        }
      } else {
        switch (typeof errobj) {
          case 'string':
            this.message = errobj
            break
          case 'number':
            this.responseCode = errobj
            break
          default:
            this.obj = errobj
            break
        }
      }
    }
  }

  setSuccess(obj?: T) {
    this.result = 'success'

    this.obj = obj
  }

  static responseCodeIsGood(ret?: unknown): boolean {
    if (isObject(ret, 'responseCode')) {
      const rcode = (ret as { responseCode: number }).responseCode
      return rcode >= 200 && rcode < 300
    }

    return false
  }
  static isSuccess(ret?: unknown): boolean {
    if (isObject(ret, 'result')) {
      return 'success' === safestrLowercase((ret as { result: string }).result)
    }

    return false
  }
}
