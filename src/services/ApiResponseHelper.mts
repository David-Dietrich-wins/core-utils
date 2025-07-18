import { isString } from './string-helper.mjs'
import { isObject } from './object-helper.mjs'
import { ApiResponse } from '../models/ApiResponse.mjs'

/**
 * Used to wrap all API return calls in a standard wrapper.
 */
export class ApiResponseHelper {
  static Error<T = unknown>(obj: T) {
    // Uow.syserrWrite(req.uiv?.muserid ?? 'respondWithError', fname, obj)

    let crret: ApiResponse<T>
    if (isObject(obj) && obj instanceof ApiResponse) {
      crret = obj
    } else {
      crret = new ApiResponse(obj, 'Error', 'Error', -1)

      crret.setError(obj)
    }

    return crret
  }

  static Success<T = unknown>(obj: T) {
    let crret: ApiResponse<T>
    if (isObject(obj) && obj instanceof ApiResponse) {
      crret = obj
    } else {
      crret = new ApiResponse(obj)

      if (obj && isString(obj)) {
        crret.message = obj as string

        crret.setSuccess()
      } else {
        crret.setSuccess(obj)
      }
    }

    return crret
  }
}
