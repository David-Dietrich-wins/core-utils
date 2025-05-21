export type ReduxAsyncStatus<T = unknown> = {
  status: 'idle' | 'pending' | 'fulfilled' | 'rejected'
  error?: string
  data: T
  isLoading: boolean
  message?: string
}

export class ReduxHelper {
  static rejected<T = unknown>(
    state: ReduxAsyncStatus<T>,
    error: { message: string }
  ) {
    state.status = 'rejected'
    state.isLoading = false
    state.error = error.message
  }
  static getStatus<T = unknown>(
    status: ReduxAsyncStatus<T>,
    defaultValue: T
  ): T {
    if (status.status === 'fulfilled') {
      return status.data
    }

    if (status.status === 'rejected') {
      return status.error as T
    }

    return defaultValue
  }
}
