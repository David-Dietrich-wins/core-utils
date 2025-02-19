import { HttpException } from './IntecoreException.mjs'
import { isObject, safestrLowercase } from '../services/general.mjs'

export interface IApiResponse<T = unknown> {
  id: number
  ts: number
  code?: number
  message: string
  responseCode: number
  result: string

  obj?: T
}

export class ApiResponse<T = unknown> implements IApiResponse<T> {
  id = +new Date()
  ts = this.id

  // constructor items
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

  setError<T = unknown>(errobj?: T) {
    this.result = 'Error'
    this.responseCode = -1

    if (errobj) {
      if (isObject(errobj) && errobj instanceof HttpException) {
        if (errobj.responseCode) {
          this.responseCode = errobj.responseCode
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.obj = errobj as any
            break
        }
      }
    }
  }

  setSuccess(obj?: T) {
    this.result = 'success'

    if (obj) {
      this.obj = obj
    }
  }

  static responseCodeIsGood<T extends { responseCode: number }>(ret?: T) {
    if (ret && isObject(ret, 'responseCode')) {
      return ret.responseCode >= 200 && ret.responseCode < 300
    }

    return false
  }

  static isSuccess<T extends { result: string }>(ret?: T) {
    if (ret && isObject(ret, 'result')) {
      return 'success' === safestrLowercase(ret.result)
    }

    return false
  }
}

// export type CaptureResponseType<T> = InstanceType<typeof CaptureResponse>
