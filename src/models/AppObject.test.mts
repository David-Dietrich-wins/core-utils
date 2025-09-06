import { describe, expect, it } from '@jest/globals'
import { AppObject } from './AppObject.mjs'

describe('constructor', () => {
  it('good', () => {
    expect.assertions(4)

    const io = new AppObject()

    expect(io.className).toBe('AppObject')

    expect(io.classMethodString()).toBe('AppObject:')
    expect(io.classMethodString('method')).toBe('AppObject: method')
    expect(io.classMethodString('method', true)).toBe('AppObject: method:')
  })
})
