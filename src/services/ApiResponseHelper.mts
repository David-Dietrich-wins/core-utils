import { Request, Response } from 'express'
import { isObject, isString } from '../services/general.mjs'
import { ApiWrapper } from '../models/ApiWrapper.mjs'
import { HTTP_Forbidden } from '../models/GrayArrowException.mjs'

/**
 * Used to wrap all API return calls in a standard wrapper.
 */
export default abstract class ApiResponseHelper {
  static apiWrapperResponseError<T = unknown>(obj?: T) {
    // uow.syserrWrite(req.uiv?.muserid ?? 'respondWithError', fname, obj)

    const crret =
      isObject(obj) && obj instanceof ApiWrapper ? obj : new ApiWrapper<T>()

    crret.setError(obj)

    return crret
  }

  static apiWrapperResponseSuccess<T = unknown>(obj?: T) {
    const crret =
      isObject(obj) && obj instanceof ApiWrapper ? obj : new ApiWrapper<T>()

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

    const crret = ApiResponseHelper.apiWrapperResponseError(obj)

    res.status(HTTP_Forbidden).json(crret)
  }

  static respondWithSuccess<T>(res: Response, obj?: T) {
    const crret = ApiResponseHelper.apiWrapperResponseSuccess(obj)

    res.json(crret)
  }
}
