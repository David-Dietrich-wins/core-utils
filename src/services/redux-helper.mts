import { safestr } from './string-helper.mjs'

export type ReduxAsyncStatus<T = unknown> = {
  status: 'idle' | 'pending' | 'fulfilled' | 'rejected'
  error?: string
  data: T
  isLoading: boolean
  lastUpdate: number
  message?: string
}

export class ReduxHelper {
  static getStatus<T = unknown>(
    state: ReduxAsyncStatus<T>,
    defaultValue: T
  ): T {
    if (state.status === 'fulfilled') {
      return state.data
    }

    if (state.status === 'rejected') {
      return state.error as T
    }

    return defaultValue
  }

  static Fulfilled<T = unknown>(state: ReduxAsyncStatus<T>, message?: string) {
    state.error = undefined
    state.isLoading = false
    state.lastUpdate = Date.now()
    state.message = message
    state.status = 'fulfilled'

    return state
  }

  static Pending<T = unknown>(state: ReduxAsyncStatus<T>, message?: string) {
    state.error = undefined
    state.isLoading = true
    state.lastUpdate = Date.now()
    state.message = message
    state.status = 'pending'

    return state
  }

  static RejectAndResetState<T = unknown>(
    state: ReduxAsyncStatus<T>,
    error?: string,
    message?: string
  ) {
    const rrs: ReduxAsyncStatus<T> = {
      ...state,
      error: safestr(error, 'Unknown error'),
      isLoading: false,
      message,
      lastUpdate: Date.now(),
      status: 'rejected',
    }

    return rrs
  }
  static RejectOnly<T = unknown>(
    state: ReduxAsyncStatus<T>,
    error?: string,
    message?: string
  ) {
    state.error = safestr(error, 'Unknown error')
    state.isLoading = false
    state.lastUpdate = Date.now()
    state.message = message
    state.status = 'rejected'

    return state
  }
}
