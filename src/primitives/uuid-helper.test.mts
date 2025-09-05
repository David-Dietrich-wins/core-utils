import { describe, expect, it } from '@jest/globals'
import { newGuid } from './uuid-helper.mjs'

describe('uuid-helper', () => {
  it('newGuid', () => {
    expect.assertions(1)

    const newg = newGuid()

    expect(newg).toHaveLength(36)
  })
})
