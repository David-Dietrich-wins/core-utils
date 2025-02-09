import { IServerState, IWebStateResponse } from './interfaces.mjs'
import { safestr } from '../services/general.mjs'
import { IUserState } from './UserState.mjs'

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
  constructor(
    public totalFailures = 0,
    public totalRequests = 0,
    public message = 'success',
    public server: IServerState,
    public user: IUserState,
    public version = 'UNKNOWN',
    public messages = [],
    public errorMessages = []
  ) {}
}

export const mockWebStateGoodResponse: IWebStateResponse = {
  errorMessages: [],
  message: 'Server is up.',
  messages: [],
  pinKey: 'Jak this is for you',
  pinKeyVault: 'Jak this is for you',
  rsaPublicKey:
    '-----BEGIN RSA PUBLIC KEY-----\nMIICCgKCAgEA4MysBA8jNsSNj82sVCB+CfYrcl81/jIxU7hQba4rxkL+ry0G4NmltxVCtNzCGjJVhppIM63PXccbg7UNim/1sVUV2YQEg8DHdQnsUK0eE58hqNn/34r5QWjEaXf8oRzhLadxt1yD7oc8efWPGlCn1ulJlPSEYOoR31Mx5zuAfZ5/3BPOyHv36HZN1cqHpz/f6CLovBb6/Y47rimfbV7MgTBQKT+R/SFIY0FjyjBtubqBMJ2eVXxr9npoXJfQYjtTlp26NHNGnpqWFmiIiIeVeZZLramEHrGE1qHCUZfAClTtVYJwvd6E44Z6JvTMl4pNU/EzcjUGNe6tLvGvu2gC+BujRz6cMZhJF1rrHDH6qGCunXdNV7tNsnQWeIgR1mlkQ0Ni8Sjd7Iwqsv6wtD7CybtAe07JIClQsBSlELRj6cBELpkGjWCrYyJjNwgcT1/rTpeJAzAmha6Ksc75bjOpkzuBm+09DgzXNd/1GSlZrkjgs5yO4xBWUBC03EAJSlUgSXPe6NLDJQuzjUJuULBFox/9BycgJvHNDpUEiIUINJW8HQ5mv0+FNK/g+RKDh1S0/EI7FwbfKYi9pZfJNREOQihsAO0PFhYJLqJkM6YCRbCNvSPmS8KcaYQj4Jbb1qZc0A6HZ3HENGSHEcDU0e2RdbvOU89sVHsmWuJElR2cg7sCAwEAAQ==\n-----END RSA PUBLIC KEY-----',
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
    state: 1,
    startTime: new Date('2023-11-27T20:36:04.932Z'),
    statusCode: 200,
    uptime: '2h 54m 40s',
  },
  version: `${safestr(process.env.npm_package_version)}-test`,
  totalFailures: 0,
  totalRequests: 31,
}
