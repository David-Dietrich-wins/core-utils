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

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export abstract class ReduxHelper {
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
      data: deepCloneJson(data),
      error: undefined,
      isLoading: false,
      lastUpdate: Date.now(),
      message: undefined,
      status: 'idle',
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
      lastUpdate: Date.now(),
      message,
      status: 'rejected',
    }

    return rrs
  }

  /**
   * Rejects the state and sets the error message.
   * @param state The ReduxAsyncStatus state to update.
   * @param error The error message to set.
   * @param message An optional message to set.
   */
  static RejectOnly(state: ReduxAsyncStatus, error?: string, message?: string) {
    state.error = safestr(error, 'Unknown error')
    state.isLoading = false
    state.lastUpdate = Date.now()
    state.message = message
    state.status = 'rejected'
  }
}
