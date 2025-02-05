import { arrayFirst } from './skky.js'

describe('index', () => {
  describe('myPackage', () => {
    it('should return a string containing the message', () => {
      const message = 'hello'

      const result = arrayFirst(['hello', 'bb'])

      expect(result).toMatch(message)
    })
  })
})
