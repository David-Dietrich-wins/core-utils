import { AppException, AppExceptionHttp } from './AppException.mjs'
import { type IPagedResponse, PagedResponse } from './PagedResponse.mjs'
import { safestr, safestrLowercase } from '../primitives/string-helper.mjs'
import { type FetchDataTypesAllowed } from '../services/html-helper.mjs'
import { type IDataWithStats } from './types.mjs'
import { InstrumentationStatistics } from './InstrumentationStatistics.mjs'
import { isObject } from '../primitives/object-helper.mjs'

/**
 * Represents the status of an HTTP response usually used in API responses.
 * @interface IStatus
 * @property {number} [status] - The HTTP status code of the response.
 * @property {string} [statusText] - The status text associated with the HTTP response.
 */
export interface IStatus {
  status?: number
  statusText?: string
}

/**
 * Represents the status of an HTTP response.
 * This interface is used to provide detailed information about the response, including status code, message, and any additional data.
 * @interface ResponseStatus
 * @property {string} [code] - A code representing the status of the response.
 * @property {string} [message] - A message providing more details about the response status.
 */
export interface ResponseStatus extends IStatus {
  code?: string
  message?: string
}
export interface IApiResponseError extends IStatus {
  error: string
}
export interface IApiResponse<T = unknown> extends IDataWithStats<T> {
  id: number
  ts: number
  code?: number
  message?: string
  responseCode?: number
  result: string
}

export class ApiResponse<TData = unknown> implements IApiResponse<TData> {
  id = Date.now()
  ts = this.id

  data: TData
  result = ''
  message = ''
  responseCode = 0
  stats: InstrumentationStatistics

  constructor(
    data: TData,
    result = '',
    message = '',
    responseCode = 0,
    stats = new InstrumentationStatistics()
  ) {
    this.data = data
    this.result = result
    this.message = message
    this.responseCode = responseCode
    this.stats = stats
  }

  static IsStatus(obj: unknown): obj is IStatus {
    return isObject(obj, 'status') || isObject(obj, 'statusText')
  }

  static IsApiResponse(obj: unknown): obj is IApiResponse {
    return (
      // ApiResponse.IsStatus(obj) &&
      isObject(obj, 'id') &&
      isObject(obj, 'ts') &&
      isObject(obj, 'data') &&
      isObject(obj, 'stats') &&
      isObject(obj, 'result')
    )
  }

  static IsApiResponseError(obj: unknown) {
    if (!isObject(obj)) {
      return false
    }

    if (ApiResponse.IsApiResponse(obj)) {
      try {
        ApiResponse.verifySuccess(
          ApiResponse.IsApiResponseError.name,
          obj,
          true
        )

        return false
      } catch (error) {
        console.error('Error verifying API response:', error)
      }
    }

    return true
  }

  static HasObj(obj: unknown): obj is { obj: unknown } {
    return isObject(obj, 'obj')
  }

  static IsCaptureResponse(
    obj: unknown
  ): obj is { captureResponse: IApiResponseError } {
    return isObject(obj, 'captureResponse')
  }

  static IsWrappedCaptureResponse(
    obj: unknown
  ): obj is { captureResponse: IApiResponseError } {
    return ApiResponse.HasObj(obj) && ApiResponse.IsCaptureResponse(obj.obj)
  }

  static IsWrappedCaptureResponseWithMessage(
    obj: unknown
  ): obj is { obj: { captureResponse: { message: string } } } {
    return (
      ApiResponse.HasObj(obj) &&
      ApiResponse.IsCaptureResponse(obj.obj) &&
      isObject(obj.obj.captureResponse, 'message')
    )
  }

  static createFromErrorMessage(
    message: string,
    data?: unknown,
    stats?: InstrumentationStatistics
  ) {
    return new ApiResponse(data, 'Error', message, 200, stats)
  }

  static createFromIApiResponse<T extends FetchDataTypesAllowed>(
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
    /* Should be an HTML window.location object. */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    location?: any
  ) {
    console.error(fname, err)
    if (location && err instanceof AppExceptionHttp) {
      if (err.httpStatusCode === 403) {
        setTimeout(() => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          location.href = `/login?callbackUrl=${encodeURIComponent(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-plus-operands
            location.pathname + location.search
          )}`
        }, 100)

        // Redirect(
        //   '/api/auth/signin?callbackUrl=' +
        //     EncodeURIComponent(window.location.href)
        // )

        return true
      }
    }

    return false
  }

  static verifySuccess<T = unknown>(
    fname: string,
    ret: IApiResponse<T>,
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

  static verifySuccessPagedResponse<T = unknown>(
    fname: string,
    ret: IApiResponse<IPagedResponse<T>>,
    allowNoDataReturned = false
  ) {
    if (!ApiResponse.isSuccess(ret)) {
      throw new AppException(
        safestr(ret.message, `Bad result from API call: ${ret.result}.`),
        fname
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!allowNoDataReturned && !ret.data) {
      throw new AppException('No data returned', fname)
    }

    return PagedResponse.createFromApiResponse(ret)
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
            this.data = errobj as unknown as TData
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
      return safestrLowercase(ret.result) === 'success'
    }

    return false
  }
}

// Export type ApiResponseType<T> = InstanceType<typeof ApiResponse>
