import { ReduxAsyncStatus, ReduxHelper } from './redux-helper.mjs'

test('getStatus', () => {
  const state: ReduxAsyncStatus<string> = {
    status: 'fulfilled',
    data: 'test data',
    error: undefined,
    isLoading: false,
    lastUpdate: Date.now(),
    message: undefined,
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
  const update = { key: 'new value' },
   message = 'Update successful',
   state = ReduxHelper.Fulfilled(update, message)

  expect(state.status).toBe('fulfilled')
  expect(state.data).toEqual(update)
  expect(state.isLoading).toBe(false)
  expect(state.lastUpdate).toBeLessThanOrEqual(Date.now())
  expect(state.message).toBe(message)
})

test('FulfilledOnly', () => {
  const state: ReduxAsyncStatus<string> = {
    status: 'idle',
    data: 'test data',
    error: undefined,
    isLoading: false,
    lastUpdate: Date.now(),
    message: undefined,
  },

   message = 'Update successful'
  ReduxHelper.FulfilledOnly(state, message)
  expect(state).toMatchObject({
    status: 'fulfilled',
    error: undefined,
    isLoading: false,
    lastUpdate: expect.any(Number),
    message,
  })
  expect(state.lastUpdate).toBeLessThanOrEqual(Date.now())

  ReduxHelper.Pending(state, 'pending update')
  expect(state).toMatchObject({
    status: 'pending',
    error: undefined,
    isLoading: true,
    lastUpdate: expect.any(Number),
    message: 'pending update',
  })
  expect(state.lastUpdate).toBeLessThanOrEqual(Date.now())
})

test('RejectAndResetState', () => {
  const state: ReduxAsyncStatus<string> = {
    status: 'pending',
    data: 'test data',
    error: undefined,
    isLoading: true,
    lastUpdate: Date.now(),
    message: undefined,
  },

   error = 'An error occurred',
   ret = ReduxHelper.RejectAndResetState(state, error)

  expect(ret).toMatchObject({
    status: 'rejected',
    error: 'An error occurred',
    isLoading: false,
    lastUpdate: expect.any(Number),
    message: undefined,
  })
  expect(state.lastUpdate).toBeLessThanOrEqual(Date.now())
})

test('RejectAndResetState with message', () => {
  const state: ReduxAsyncStatus<string> = {
    status: 'pending',
    data: 'test data',
    error: undefined,
    isLoading: true,
    lastUpdate: Date.now(),
    message: undefined,
  },

   error = 'An error occurred',
   message = 'Operation failed',
   ret = ReduxHelper.RejectAndResetState(state, error, message)

  expect(ret).toMatchObject({
    status: 'rejected',
    error,
    isLoading: false,
    lastUpdate: expect.any(Number),
    message,
  })
  expect(state.lastUpdate).toBeLessThanOrEqual(Date.now())
})
test('RejectAndResetState with empty error', () => {
  const state: ReduxAsyncStatus<string> = {
    status: 'pending',
    data: 'test data',
    error: undefined,
    isLoading: true,
    lastUpdate: Date.now(),
    message: undefined,
  },

   ret = ReduxHelper.RejectAndResetState(state)

  expect(ret).toMatchObject({
    status: 'rejected',
    error: 'Unknown error',
    isLoading: false,
    lastUpdate: expect.any(Number),
    message: undefined,
  })
  expect(state.lastUpdate).toBeLessThanOrEqual(Date.now())
})

test('RejectOnly', () => {
  const state: ReduxAsyncStatus<string> = {
    status: 'pending',
    data: 'test data',
    error: undefined,
    isLoading: true,
    lastUpdate: Date.now(),
    message: undefined,
  },

   error = 'An error occurred',
   message = 'Operation failed'
  ReduxHelper.RejectOnly(state, error, message)

  expect(state).toMatchObject({
    status: 'rejected',
    error,
    isLoading: false,
    lastUpdate: expect.any(Number),
    message,
  })
  expect(state.lastUpdate).toBeLessThanOrEqual(Date.now())
})
