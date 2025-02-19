import { Request, Response } from 'express'
import { isObject, isString } from '../services/general.mjs'
import { ApiResponse } from '../models/ApiResponse.mjs'
import { HTTP_Forbidden } from '../models/IntecoreException.mjs'

/**
 * Used to wrap all API return calls in a standard wrapper.
 */
export default abstract class ApiResponseHelper {
  static apiResponseError<T = unknown>(obj?: T) {
    // uow.syserrWrite(req.uiv?.muserid ?? 'respondWithError', fname, obj)

    const crret =
      isObject(obj) && obj instanceof ApiResponse ? obj : new ApiResponse<T>()

    crret.setError(obj)

    return crret
  }

  static ApiResponseResponseSuccess<T = unknown>(obj?: T) {
    const crret =
      isObject(obj) && obj instanceof ApiResponse ? obj : new ApiResponse<T>()

    if (isString(obj)) {
      crret.message = obj as string

      crret.setSuccess()
    } else {
      crret.setSuccess(obj)
    }

    return crret
  }

  static respondWithError<T>(
    fname: string,
    req: Request,
    res: Response,
    obj?: T
  ) {
    console.log(fname, 'Error returned:', obj)
    // uow.syserrWrite(req.uiv?.muserid ?? 'respondWithError', fname, obj)

    const crret = ApiResponseHelper.apiResponseError(obj)

    res.status(HTTP_Forbidden).json(crret)
  }

  static respondWithSuccess<T>(res: Response, obj?: T) {
    const crret = ApiResponseHelper.ApiResponseResponseSuccess(obj)

    res.json(crret)
  }
}
