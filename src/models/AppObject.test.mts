import { AppObject } from './AppObject.mjs'

test('constructor', () => {
  const io = new AppObject()

  expect(io.className).toBe('AppObject')

  expect(io.classMethodString()).toBe('AppObject:')
  expect(io.classMethodString('method')).toBe('AppObject: method')
  expect(io.classMethodString('method', true)).toBe('AppObject: method:')
})
