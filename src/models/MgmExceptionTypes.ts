import MgmError from './MgmError.js'
import { hasData } from '../services/general.js'

export const HTTP_Ok = 200 as const
export const HTTP_Created = 201 as const
export const HTTP_Accepted = 202 as const
export const HTTP_BadRequest = 400 as const
export const HTTP_Unauthorized = 401 as const
export const HTTP_Forbidden = 403 as const
export const HTTP_NotFound = 404 as const
export const HTTP_MethodNotAllowed = 405 as const
export const HTTP_NotAcceptable = 406 as const
export const HTTP_PreconditionRequired = 428 as const
export const HTTP_NetworkAuthenticationRequired = 511 as const

export class MgmException<Tobj = string> extends MgmError {
  functionNameSource: string
  obj?: Tobj
  responseCode?: number

  constructor(m: string, functionNameSource: string, obj?: Tobj) {
    super(m)

    this.functionNameSource = hasData(functionNameSource) ? functionNameSource : 'MgmException'
    this.obj = obj

    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class MgmExceptionHttp<Tobj = Response> extends MgmException<Tobj> {
  httpStatusCode: number

  constructor(m: string, functionNameSource: string, httpStatusCode = 500, response?: Tobj) {
    super(m, hasData(functionNameSource) ? functionNameSource : 'MgmExceptionHttp', response)

    this.httpStatusCode = httpStatusCode
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class MgmExceptionHttpUnauthorized<T> extends MgmExceptionHttp<T> {
  constructor(message: string, functionNameSource: string, response?: T) {
    super(message, functionNameSource, HTTP_Unauthorized, response)

    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class MgmExceptionHttpForbidden<T> extends MgmExceptionHttp<T> {
  constructor(message: string, functionNameSource: string, response?: T) {
    super(message, functionNameSource, HTTP_Forbidden, response)

    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class MgmExceptionHttpNotAcceptable<T> extends MgmExceptionHttp<T> {
  constructor(message: string, functionNameSource: string, response?: T) {
    super(message, functionNameSource, HTTP_NotAcceptable, response)

    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class MgmExceptionHttpNotAllowed<T> extends MgmExceptionHttp<T> {
  constructor(message: string, functionNameSource: string, response?: T) {
    super(message, functionNameSource, HTTP_MethodNotAllowed, response)

    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class MgmExceptionHttpNotFound<T> extends MgmExceptionHttp<T> {
  constructor(message: string, functionNameSource: string, response?: T) {
    super(message, functionNameSource, HTTP_NotFound, response)

    Object.setPrototypeOf(this, new.target.prototype)
  }
}
