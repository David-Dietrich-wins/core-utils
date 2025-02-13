import { IntecoreObject } from './IntecoreObject.mjs'

test('constructor', () => {
  const io = new IntecoreObject()

  expect(io.className).toBe('IntecoreObject')

  expect(io.classMethodString()).toBe('IntecoreObject:')
  expect(io.classMethodString('method')).toBe('IntecoreObject: method')
  expect(io.classMethodString('method', true)).toBe('IntecoreObject: method:')
})
