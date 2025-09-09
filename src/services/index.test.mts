import * as MyLib from './index.mjs'
import { describe, expect, it } from '@jest/globals'

describe('index', () => {
  it('should have exports', () => {
    expect.assertions(1)

    expect(MyLib).toStrictEqual(expect.any(Object))
  })

  // eslint-disable-next-line jest/prefer-ending-with-an-expect
  it('should not have undefined exports', () => {
    expect.assertions(24)

    for (const k of Object.keys(MyLib)) {
      expect(MyLib).not.toHaveProperty(k, undefined)
    }
  })
})
