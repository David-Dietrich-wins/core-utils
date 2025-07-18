import * as MyLib from './index.mjs'

describe('MyLib', () => {
  it('should have exports', () => {
    expect(MyLib).toEqual(expect.any(Object))
  })

  it('should not have undefined exports', () => {
    for (const k of Object.keys(MyLib))
      {expect(MyLib).not.toHaveProperty(k, undefined)}
  })
})
