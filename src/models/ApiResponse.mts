import { AppException, AppExceptionHttp } from './AppException.mjs'
import { safestr, safestrLowercase } from '../services/string-helper.mjs'
import { isObject } from '../services/object-helper.mjs'
import { IDataWithStats } from './types.mjs'
import { FetchDataTypesAllowed } from '../services/fetch-http.mjs'
import { InstrumentationStatistics } from './InstrumentationStatistics.mjs'
import { PagedResponse, type IPagedResponse } from './PagedResponse.mjs'

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

  /**
   * Checks if an error is a 403 Forbidden error and redirects to the sign-in page if so.
   * This function is intended to be used as a global error handler for API calls.
   * @param fname - The name of the function that is calling this error handler.
   * This is used for logging purposes to identify where the error occurred.
   * @param err The error object that was thrown. This can be any type of error, including
   * custom errors like AppException or AppExceptionHttp.
   * @param location The window.location object, which contains information about the current URL.
   * @returns true if the error was handled (e.g., a 403 error that redirects to a sign-in page),
   * false otherwise.
   */
  static ErrorHandler(
    fname: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    err: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    location?: any /* should be an HTML window.location object. */
  ) {
    console.error(fname, err)
    if (location && err instanceof AppExceptionHttp) {
      if (err.httpStatusCode === 403) {
        setTimeout(() => {
          location.href = `/login?callbackUrl=${encodeURIComponent(
            location.pathname + location.search
          )}`
        }, 100)

        // redirect(
        //   '/api/auth/signin?callbackUrl=' +
        //     encodeURIComponent(window.location.href)
        // )

        return true
      }
    }

    return false
  }

  static VerifySuccess<T = unknown>(
    fname: string,
    ret: ApiResponse<T>,
    allowNoDataReturned = false
  ) {
    if (!ApiResponse.isSuccess(ret)) {
      throw new AppException(
        safestr(ret.message, `Bad result from API call: ${ret.result}.`),
        fname
      )
    }

    if (!allowNoDataReturned && !ret.data) {
      throw new AppException('No data returned', fname)
    }

    return ret.data
  }

  static VerifySuccessPagedResponse<T = unknown>(
    fname: string,
    ret: ApiResponse<IPagedResponse<T>>,
    allowNoDataReturned = false
  ) {
    if (!ApiResponse.isSuccess(ret)) {
      throw new AppException(
        safestr(ret.message, `Bad result from API call: ${ret.result}.`),
        fname
      )
    }

    if (!allowNoDataReturned && !ret.data) {
      throw new AppException('No data returned', fname)
    }

    return PagedResponse.CreateFromApiResponse(ret)
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
