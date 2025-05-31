import { deepCloneJson } from './object-helper.mjs'
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

  static InitialState<T extends object = object>(data: T): ReduxAsyncStatus<T> {
    const state: ReduxAsyncStatus<T> = {
      status: 'idle',
      error: undefined,
      data: deepCloneJson(data),
      isLoading: false,
      lastUpdate: Date.now(),
      message: undefined,
    }

    return state
  }

  static Fulfilled<T extends object = object>(update: T, message?: string) {
    const state: ReduxAsyncStatus<T> = {
      data: deepCloneJson(update),
      error: undefined,
      isLoading: false,
      lastUpdate: Date.now(),
      message,
      status: 'fulfilled',
    }

    return state
  }

  static FulfilledOnly(state: ReduxAsyncStatus, message?: string) {
    state.error = undefined
    state.isLoading = false
    state.lastUpdate = Date.now()
    state.message = message
    state.status = 'fulfilled'
  }

  static Pending(state: ReduxAsyncStatus, message?: string) {
    state.error = undefined
    state.isLoading = true
    state.lastUpdate = Date.now()
    state.message = message
    state.status = 'pending'
  }

  static RejectAndResetState<T = unknown>(
    state: ReduxAsyncStatus<T>,
    error?: string,
    message?: string
  ) {
    const rrs: ReduxAsyncStatus<T> = {
      ...deepCloneJson(state),
      error: safestr(error, 'Unknown error'),
      isLoading: false,
      message,
      lastUpdate: Date.now(),
      status: 'rejected',
    }

    return rrs
  }
  static RejectOnly(state: ReduxAsyncStatus, error?: string, message?: string) {
    state.error = safestr(error, 'Unknown error')
    state.isLoading = false
    state.lastUpdate = Date.now()
    state.message = message
    state.status = 'rejected'
  }
}
