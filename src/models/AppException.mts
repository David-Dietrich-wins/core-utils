import { hasData } from '../services/general.mjs'

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

export class AppException<Tobj = string> extends Error {
  constructor(
    message: string,
    public functionNameSource = AppException.name,
    public obj?: Tobj,
    public responseCode?: number
  ) {
    super(message)

    if (!hasData(this.functionNameSource)) {
      this.functionNameSource = AppException.name
    }

    // new.target is the constructor that was called (even if it's a subclass)
    // Object.setPrototypeOf(this, new.target.prototype) is used to set the prototype of the instance to the prototype of the class
    // This is necessary to ensure that instanceof checks work correctly
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class AppExceptionSecurity<Tobj = string> extends AppException<Tobj> {
  constructor(message: string, functionNameSource: string, obj?: Tobj) {
    super(message, functionNameSource, obj)
  }
}

export class AppExceptionHttp<Tobj = Response> extends AppException<Tobj> {
  constructor(
    m: string,
    functionNameSource: string,
    public httpStatusCode = 500,
    response?: Tobj
  ) {
    super(
      m,
      hasData(functionNameSource) ? functionNameSource : 'AppExceptionHttp',
      response
    )
  }
}

export class AppExceptionHttpUnauthorized<T> extends AppExceptionHttp<T> {
  constructor(message: string, functionNameSource: string, response?: T) {
    super(message, functionNameSource, HTTP_Unauthorized, response)
  }
}

export class AppExceptionHttpForbidden<T> extends AppExceptionHttp<T> {
  constructor(message: string, functionNameSource: string, response?: T) {
    super(message, functionNameSource, HTTP_Forbidden, response)
  }
}

export class AppExceptionHttpNotAcceptable<T> extends AppExceptionHttp<T> {
  constructor(message: string, functionNameSource: string, response?: T) {
    super(message, functionNameSource, HTTP_NotAcceptable, response)
  }
}

export class AppExceptionHttpNotAllowed<T> extends AppExceptionHttp<T> {
  constructor(message: string, functionNameSource: string, response?: T) {
    super(message, functionNameSource, HTTP_MethodNotAllowed, response)
  }
}

export class AppExceptionHttpNotFound<T> extends AppExceptionHttp<T> {
  constructor(message: string, functionNameSource: string, response?: T) {
    super(message, functionNameSource, HTTP_NotFound, response)
  }
}
