/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ContextManager } from './ContextManager.mjs'

test('ContextManager', () => {
  const cm = ContextManager.getInstance()
  expect(cm).toMatchObject({
    id: expect.any(String),
  })

  const cm2 = ContextManager.getInstance()
  expect(cm2).toBe(cm)
  expect(cm2.id).toBe(cm.id)
})
