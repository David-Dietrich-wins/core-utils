import { Response } from 'express'
import { isString } from './string-helper.mjs'
import { isObject } from './object-helper.mjs'
import { ApiResponse } from '../models/ApiResponse.mjs'
import { HTTP_Forbidden } from '../models/AppException.mjs'

/**
 * Used to wrap all API return calls in a standard wrapper.
 */
export default abstract class ApiResponseHelper {
  static apiResponseError<T = unknown>(obj: T) {
    // uow.syserrWrite(req.uiv?.muserid ?? 'respondWithError', fname, obj)

    const crret =
      isObject(obj) && obj instanceof ApiResponse
        ? obj
        : new ApiResponse<T>(obj)

    crret.setError(obj)

    return crret
  }

  static ApiResponseSuccess<T = unknown>(obj: T) {
    const crret =
      isObject(obj) && obj instanceof ApiResponse
        ? obj
        : new ApiResponse<T>(obj)

    if (isString(obj)) {
      crret.message = obj

      crret.setSuccess()
    } else {
      crret.setSuccess(obj)
    }

    return crret
  }

  static respondWithError<T>(fname: string, res: Response, obj?: T) {
    console.log(fname, 'Error returned:', obj)
    // uow.syserrWrite(req.uiv?.muserid ?? 'respondWithError', fname, obj)

    const crret = ApiResponseHelper.apiResponseError(obj)

    res.status(HTTP_Forbidden).json(crret)
  }

  static respondWithSuccess<T>(res: Response, obj?: T) {
    const crret = ApiResponseHelper.ApiResponseSuccess(obj)

    res.json(crret)
  }
}
