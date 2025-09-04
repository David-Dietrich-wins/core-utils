import { newGuid } from './uuid-helper.mjs'

it('newGuid', () => {
  const newg = newGuid()

  expect(newg.length).toBe(36)
})
