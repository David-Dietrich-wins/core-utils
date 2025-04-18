import { capitalizeFirstLetter, capitalizeWords } from './string-helper.mjs'

test('capitalizeFirstLetter', () => {
  expect(capitalizeFirstLetter('hello')).toBe('Hello')
  expect(capitalizeFirstLetter('')).toBe('')
  expect(capitalizeFirstLetter(null)).toBe('')
  expect(capitalizeFirstLetter(undefined)).toBe('')
  expect(capitalizeFirstLetter('123')).toBe('123')
  expect(capitalizeFirstLetter('hello world')).toBe('Hello world')
  expect(capitalizeFirstLetter('hello world!')).toBe('Hello world!')
})

test('capitalizeWords', () => {
  expect(capitalizeWords('hello world')).toBe('Hello World')
  expect(capitalizeWords('')).toBe('')
  expect(capitalizeWords(null)).toBe('')
  expect(capitalizeWords(undefined)).toBe('')
  expect(capitalizeWords('123')).toBe('123')
  expect(capitalizeWords('hello world!')).toBe('Hello World!')
  expect(capitalizeWords('hello world! how are you?')).toBe(
    'Hello World! How Are You?'
  )
  expect(capitalizeWords('hello world! how are you?')).toBe(
    'Hello World! How Are You?'
  )
  expect(capitalizeWords('hello world! how are you?')).toBe(
    'Hello World! How Are You?'
  )
})
