import { Request, Response } from 'express'
import { isObject, isString } from '../services/general'
import { ApiWrapper } from '../services/ApiWrapper'
import { HTTP_Forbidden } from '.'

/**
 * Used to wrap all API return calls in a standard wrapper.
 */
export default abstract class ApiResponseHelper {
  static respondWithError<T>(fname: string, req: Request, res: Response, obj?: T) {
    console.log(fname, 'Error returned:', obj)
    // uow.syserrWrite(req.uiv?.muserid ?? 'respondWithError', fname, obj)

    let crret
    if (isObject(obj) && obj instanceof ApiWrapper) {
      crret = obj
    } else {
      crret = new ApiWrapper()

      crret.setError(obj)
    }

    res.status(HTTP_Forbidden).json(crret)
  }

  static respondWithSuccess<T>(res: Response, obj?: T) {
    let crret
    if (isObject(obj) && obj instanceof ApiWrapper) {
      crret = obj
    } else {
      crret = new ApiWrapper()

      if (isString(obj)) {
        crret.message = obj as string

        crret.setSuccess()
      } else {
        crret.setSuccess(obj)
      }
    }

    res.json(crret)
  }
}
