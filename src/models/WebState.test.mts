import { DateHelper } from '../primitives/date-helper.mjs'
import { HTTP_Ok } from './AppException.mjs'
import { type IServerState } from './ApplicationState.mjs'
import UserState from './UserState.mjs'
import WebState from './WebState.mjs'

const startTime = new Date(),
  testConfig = {
    getTestServerState() {
      const dtNow = new Date(),
        server: IServerState = {
          currentTime: dtNow,
          message: 'Operational',
          ready: true,
          startTime,
          state: 1,
          statusCode: HTTP_Ok,
          uptime: DateHelper.timeDifferenceString(startTime),
        }

      return server
    },
  }

test('WebState good', () => {
  const serverState = testConfig.getTestServerState(),
    userState = new UserState<{ data: 'hello' }>('User', 'success', 1, {
      data: 'hello',
    }),
    webState = new WebState(0, 0, 'success', serverState, userState)

  expect(webState.totalFailures).toBe(0)
  expect(webState.totalRequests).toBe(0)
  expect(webState.message).toBe('success')
})

test('WebState default constructor', () => {
  const webState = new WebState()

  expect(webState.totalFailures).toBe(0)
  expect(webState.totalRequests).toBe(0)
  expect(webState.message).toBe('success')
})

test('WebState constructor good', () => {
  const serverState = testConfig.getTestServerState(),
    userState = new UserState<{ data: 'hello' }>('User', 'success', 1, {
      data: 'hello',
    }),
    webState = new WebState(
      1,
      1,
      'fail',
      serverState,
      userState,
      '1.0.0',
      ['msg'],
      ['errMsg']
    )

  expect(webState.totalFailures).toBe(1)
  expect(webState.totalRequests).toBe(1)
  expect(webState.message).toBe('fail')
})
