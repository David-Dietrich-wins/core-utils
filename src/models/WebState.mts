import { IServerState, IWebStateResponse } from './interfaces.mjs'
import { IUserState } from './UserState.mjs'
import { safestr } from '../services/primitives/string-helper.mjs'

export interface ICryptoRequest {
  pin: string
  pinEncrypted: string
}

export interface IWebStateRequest {
  userId?: number
  crypto?: ICryptoRequest
}

export interface ICryptoState {
  message: string
  pin: string
  pinEncrypted: string
}

export interface IWebState {
  errorMessages: string[]
  message: string
  messages: string[]
  server?: IServerState
  user?: IUserState
  crypto?: ICryptoState
  webStateRequest?: IWebStateRequest
  totalFailures: number
  totalRequests: number
  version: string
}

/**
 * Used to report on the running state of the web server.
 */
export default class WebState implements IWebState {
  totalFailures: number
  totalRequests: number
  message: string
  server?: IServerState
  user?: IUserState
  version: string
  messages: string[]
  errorMessages: string[]

  constructor(
    totalFailures = 0,
    totalRequests = 0,
    message = 'success',
    server?: IServerState,
    user?: IUserState,
    version = 'UNKNOWN',
    messages: string[] = [],
    errorMessages: string[] = []
  ) {
    this.totalFailures = totalFailures
    this.totalRequests = totalRequests
    this.message = message
    this.server = server
    this.user = user
    this.version = version
    this.messages = messages
    this.errorMessages = errorMessages
  }
}

export const mockWebStateGoodResponse: IWebStateResponse = {
  errorMessages: [],
  message: 'Server is up.',
  messages: [],
  rsaPublicKey: safestr(process.env.RSA_PUBLIC_KEY),
  server: {
    currentTime: new Date(),
    message: 'Operational',
    obj: {
      aceKeepalive: {
        jwt: '',
        ready: false,
      },
    },
    ready: true,
    startTime: new Date('2023-11-27T20:36:04.932Z'),
    state: 1,
    statusCode: 200,
    uptime: '2h 54m 40s',
  },
  totalFailures: 0,
  totalRequests: 31,
  version: `${safestr(process.env.npm_package_version)}-test`,
}
