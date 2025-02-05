<<<<<<< HEAD
import { arrayFirst } from './skky.js'

describe('index', () => {
  describe('myPackage', () => {
    it('should return a string containing the message', () => {
      const message = 'hello'

      const result = arrayFirst(['hello', 'bb'])

      expect(result).toMatch(message)
    })
=======
import { arrayFirst, safestr, timeDifferenceString } from './skky.js'

describe('skky', () => {
  test('arrayFirst', () => {
    const message = 'hello'

    const result = arrayFirst(['hello', 'bb'])

    expect(result).toMatch(message)
  })

  test('Time Difference', () => {
    const dtNow = new Date()
    const startDate = new Date(+dtNow)

    startDate.setSeconds(startDate.getSeconds() - 2)
    const str = timeDifferenceString(startDate)

    // console.log('Time Difference:', str)
    expect(safestr(str).length).toBeGreaterThan(1)
>>>>>>> 5ed179635b17d3454802648186c6b4d535190e23
  })
})
