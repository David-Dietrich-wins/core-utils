import { describe, expect, it } from '@jest/globals'
import UserState from './UserState.mjs'

describe('userState', () => {
  it('default args', () => {
    expect.assertions(5)

    const userState = new UserState()

    expect(userState.id).toBe('User')
    expect(userState.name).toBe('User')
    expect(userState.status).toBe('')
    expect(userState.statusCode).toBe(-1)
    expect(userState.obj).toBeUndefined()
  })

  it('good', () => {
    expect.assertions(5)

    const userState = new UserState<{ data: string }>('User', 'success', 1, {
      data: 'hello',
    })

    expect(userState.id).toBe('User')
    expect(userState.name).toBe('User')
    expect(userState.status).toBe('success')
    expect(userState.statusCode).toBe(1)
    expect(userState.obj?.data).toBe('hello')
  })

  it('constructor default', () => {
    expect.assertions(5)

    const userState = new UserState('User', 'success')

    expect(userState.id).toBe('User')
    expect(userState.name).toBe('User')
    expect(userState.status).toBe('success')
    expect(userState.statusCode).toBe(-1)
    expect(userState.obj).toBeUndefined()
  })

  it('constructor name', () => {
    expect.assertions(5)

    const userState = new UserState('User', '')

    expect(userState.id).toBe('User')
    expect(userState.name).toBe('User')
    expect(userState.status).toBe('')
    expect(userState.statusCode).toBe(-1)
    expect(userState.obj).toBeUndefined()
  })

  it('constructor status code', () => {
    expect.assertions(5)

    const userState = new UserState('Test', 'success', 200)

    expect(userState.id).toBe('Test')
    expect(userState.name).toBe('Test')
    expect(userState.status).toBe('success')
    expect(userState.statusCode).toBe(200)
    expect(userState.obj).toBeUndefined()
  })

  it('constructor test success', () => {
    expect.assertions(5)

    const userState = new UserState('Test', 'success', -1)

    expect(userState.id).toBe('Test')
    expect(userState.name).toBe('Test')
    expect(userState.status).toBe('success')
    expect(userState.statusCode).toBe(-1)
    expect(userState.obj).toBeUndefined()
  })

  it('success', () => {
    expect.assertions(5)

    const userState = new UserState<{ message: string }>(
      'Test',
      'success',
      200,
      {
        message: 'hello',
      }
    )

    expect(userState.id).toBe('Test')
    expect(userState.name).toBe('Test')
    expect(userState.status).toBe('success')
    expect(userState.statusCode).toBe(200)
    expect(userState.obj?.message).toBe('hello')
  })
})
