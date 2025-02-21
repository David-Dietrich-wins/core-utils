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
  id = Date.now()
  ts = this.id

  constructor(
    public result = '',
    public message = '',
    public responseCode = 0,
    public obj?: T
  ) {}

  setError<TError = unknown>(errobj?: TError) {
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

  static responseCodeIsGood<TResponse extends { responseCode: number }>(
    ret?: TResponse
  ) {
    if (ret && isObject(ret, 'responseCode')) {
      return ret.responseCode >= 200 && ret.responseCode < 300
    }

    return false
  }

  static isSuccess<TResponse extends { result: string }>(ret?: TResponse) {
    if (ret && isObject(ret, 'result')) {
      return 'success' === safestrLowercase(ret.result)
    }

    return false
  }
}

// export type ApiResponseType<T> = InstanceType<typeof ApiResponse>
