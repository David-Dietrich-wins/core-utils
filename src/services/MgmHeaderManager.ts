import { Request } from 'express'
import { JwtDecodeMgm } from './jwt.js'
import { HttpRequest } from '@azure/functions'
import { StringOrStringArrayObject } from '../models/types.js'
import { getBoolean, getObject, safestr } from '../services/general.js'
import { MgmException } from '../models/MgmExceptionTypes.js'

/**
 * Class for managing our HTTP Headers. Including JWT support for extracting data.
 */
export class MgmHeaderManager {
  constructor(public headers: StringOrStringArrayObject) {}

  getBoolean(name: string) {
    return getBoolean(this.getHeader(name))
  }
  getHeader(name: string) {
    return this.headers[name]
  }
  getHeaderString(name: string) {
    return getObject(this.getHeader(name))
  }
  getHeaderStringSafe(name: string) {
    return safestr(getObject(this.getHeader(name)))
  }

  has(name: string) {
    return Object.keys(this.headers).includes(name)
  }

  get bearerToken() {
    return this.getHeaderStringSafe('authorization').replace('Bearer ', '')
  }
  get jwtToken() {
    return JwtDecodeMgm(this.bearerToken)
  }

  get MgmDebugLevel() {
    return this.getBoolean('MgmDebugLevel')
  }

  get playerIdFromJwt() {
    const jwt = this.jwtToken

    if (!jwt?.mlife) {
      throw new MgmException(
        'Invalid security token when attempting to retrieve the player id.',
        'playerIdFromJwt'
      )
    }

    const playerId = jwt.mlife
    if (!playerId) {
      throw new MgmException(
        'Error retrieving Player Id from JWT security token.',
        'playerIdFromJwt'
      )
    }

    return playerId
  }

  get usingGraphQl() {
    return this.has('apollographql-client-name')
  }
}

export class MgmHeaderManagerForFunctionApps extends MgmHeaderManager {
  constructor(req: HttpRequest) {
    super(req.headers)
  }
}

export class MgmHeaderManagerForExpress extends MgmHeaderManager {
  constructor(req: Request) {
    super(MgmHeaderManagerForExpress.HeadersToStringOrStringObject(req))
  }

  // static Azure4HttpHeadersToStringOrStringObject(req: HttpRequest) {
  //   const headers: StringOrStringArrayObject = {}

  //   req.headers.forEach((value, key) => {
  //     headers[key] = value
  //   })

  //   return headers
  // }

  static HeadersToStringOrStringObject(req: Request) {
    const headers: StringOrStringArrayObject = {}

    const size = 2
    while (req.rawHeaders.length > 0) {
      const [key, value] = req.rawHeaders.splice(0, size)

      headers[key] = value
    }

    return headers
  }
}
