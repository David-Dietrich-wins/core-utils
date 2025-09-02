import { type ReduxAsyncStatus, ReduxHelper } from './redux-helper.mjs'

test('getStatus', () => {
  const state: ReduxAsyncStatus<string> = {
    data: 'test data',
    error: undefined,
    isLoading: false,
    lastUpdate: Date.now(),
    message: undefined,
    status: 'fulfilled',
  }

  expect(ReduxHelper.getStatus(state, 'default')).toBe('test data')

  state.status = 'rejected'
  state.error = 'error occurred'
  expect(ReduxHelper.getStatus(state, 'default')).toBe('error occurred')

  state.status = 'idle'
  expect(ReduxHelper.getStatus(state, 'default')).toBe('default')
})

test('InitialState', () => {
  const initialData = { key: 'value' },
    state = ReduxHelper.InitialState(initialData)

  expect(state.status).toBe('idle')
  expect(state.data).toEqual(initialData)
  expect(state.isLoading).toBe(false)
  expect(state.lastUpdate).toBeLessThanOrEqual(Date.now())
})

test('Fulfilled', () => {
  const message = 'Update successful',
    update = { key: 'new value' },
    ustate = ReduxHelper.Fulfilled(update, message)

  expect(ustate.status).toBe('fulfilled')
  expect(ustate.data).toEqual(update)
  expect(ustate.isLoading).toBe(false)
  expect(ustate.lastUpdate).toBeLessThanOrEqual(Date.now())
  expect(ustate.message).toBe(message)
})

test('FulfilledOnly', () => {
  const message = 'Update successful',
    state: ReduxAsyncStatus<string> = {
      data: 'test data',
      error: undefined,
      isLoading: false,
      lastUpdate: Date.now(),
      message: undefined,
      status: 'idle',
    }
  ReduxHelper.FulfilledOnly(state, message)
  expect(state).toMatchObject({
    error: undefined,
    isLoading: false,
    lastUpdate: expect.any(Number),
    message,
    status: 'fulfilled',
  })
  expect(state.lastUpdate).toBeLessThanOrEqual(Date.now())

  ReduxHelper.Pending(state, 'pending update')
  expect(state).toMatchObject({
    error: undefined,
    isLoading: true,
    lastUpdate: expect.any(Number),
    message: 'pending update',
    status: 'pending',
  })
  expect(state.lastUpdate).toBeLessThanOrEqual(Date.now())
})

test('RejectAndResetState', () => {
  const error = 'An error occurred',
    state: ReduxAsyncStatus<string> = {
      data: 'test data',
      error: undefined,
      isLoading: true,
      lastUpdate: Date.now(),
      message: undefined,
      status: 'pending',
    },
    zret = ReduxHelper.RejectAndResetState(state, error)

  expect(zret).toMatchObject({
    error: 'An error occurred',
    isLoading: false,
    lastUpdate: expect.any(Number),
    message: undefined,
    status: 'rejected',
  })
  expect(state.lastUpdate).toBeLessThanOrEqual(Date.now())
})

test('RejectAndResetState with message', () => {
  const error = 'An error occurred',
    message = 'Operation failed',
    state: ReduxAsyncStatus<string> = {
      data: 'test data',
      error: undefined,
      isLoading: true,
      lastUpdate: Date.now(),
      message: undefined,
      status: 'pending',
    },
    zret = ReduxHelper.RejectAndResetState(state, error, message)

  expect(zret).toMatchObject({
    error,
    isLoading: false,
    lastUpdate: expect.any(Number),
    message,
    status: 'rejected',
  })
  expect(state.lastUpdate).toBeLessThanOrEqual(Date.now())
})
test('RejectAndResetState with empty error', () => {
  const state: ReduxAsyncStatus<string> = {
      data: 'test data',
      error: undefined,
      isLoading: true,
      lastUpdate: Date.now(),
      message: undefined,
      status: 'pending',
    },
    zret = ReduxHelper.RejectAndResetState(state)

  expect(zret).toMatchObject({
    error: 'Unknown error',
    isLoading: false,
    lastUpdate: expect.any(Number),
    message: undefined,
    status: 'rejected',
  })
  expect(state.lastUpdate).toBeLessThanOrEqual(Date.now())
})

test('RejectOnly', () => {
  const error = 'An error occurred',
    message = 'Operation failed',
    state: ReduxAsyncStatus<string> = {
      data: 'test data',
      error: undefined,
      isLoading: true,
      lastUpdate: Date.now(),
      message: undefined,
      status: 'pending',
    }

  ReduxHelper.RejectOnly(state, error, message)

  expect(state).toMatchObject({
    error,
    isLoading: false,
    lastUpdate: expect.any(Number),
    message,
    status: 'rejected',
  })
  expect(state.lastUpdate).toBeLessThanOrEqual(Date.now())
})
