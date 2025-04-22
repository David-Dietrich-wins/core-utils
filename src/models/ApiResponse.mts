import { AppExceptionHttp } from './AppException.mjs'
import { safestrLowercase } from '../services/string-helper.mjs'
import { isObject } from '../services/object-helper.mjs'
import { IDataWithStats } from './types.mjs'
import { FetchDataTypesAllowed } from '../services/fetch-http.mjs'
import { InstrumentationStatistics } from './InstrumentationStatistics.mjs'

export interface IApiResponse<T = unknown> extends IDataWithStats<T> {
  id: number
  ts: number
  code?: number
  message: string
  responseCode: number
  result: string
}

export class ApiResponse<TData = unknown> implements IApiResponse<TData> {
  id = Date.now()
  ts = this.id

  constructor(
    public data: TData,
    public result = '',
    public message = '',
    public responseCode = 0,
    public stats = new InstrumentationStatistics()
  ) {}

  static CreateFromErrorMessage(
    message: string,
    data?: unknown,
    stats?: InstrumentationStatistics
  ) {
    return new ApiResponse(data, 'Error', message, 200, stats)
  }

  static CreateFromIApiResponse<T extends FetchDataTypesAllowed>(
    iApiResponse: IApiResponse<T>
  ) {
    const crret = new ApiResponse<T>(
      iApiResponse.data,
      iApiResponse.result,
      iApiResponse.message,
      iApiResponse.responseCode,
      iApiResponse.stats
    )
    // Object.assign(crret, iApiResponse)

    return crret
  }

  get isGood() {
    return ApiResponse.responseCodeIsGood(this)
  }
  get isError() {
    return !this.isGood
  }
  get isErrorSignedOut() {
    return this.responseCode === 401
  }
  get isSuccess() {
    return this.isGood && ApiResponse.isSuccess(this)
  }

  setError<TError = unknown>(errobj?: TError) {
    this.result = 'Error'
    this.responseCode = -1

    if (errobj) {
      if (isObject(errobj) && errobj instanceof AppExceptionHttp) {
        if (errobj.responseCode) {
          this.responseCode = errobj.responseCode
        }

        if (errobj.message) {
          this.message = errobj.message
        }

        if (errobj.obj) {
          this.data = errobj.obj
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
            this.data = errobj as any
            break
        }
      }
    }
  }

  setSuccess(obj?: TData) {
    this.result = 'success'

    if (obj) {
      this.data = obj
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
