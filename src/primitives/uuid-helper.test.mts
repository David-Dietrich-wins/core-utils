import { newGuid } from './uuid-helper.mjs'

test('newGuid', () => {
  const newg = newGuid()

  expect(newg.length).toBe(36)
})
