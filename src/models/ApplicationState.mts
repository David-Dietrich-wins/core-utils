export interface IApplicationState<T = unknown> {
  errorMessages: string[]
  message: string
  messages: string[]
  obj?: T
  server?: IServerState
  version: string
}

export interface IServerState<T = unknown> {
  currentTime: Date
  message: string
  obj?: T
  ready: boolean
  state: number
  startTime: Date
  statusCode: number
  uptime: string
}
