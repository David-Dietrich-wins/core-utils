import { arrayFirst, safestr, timeDifferenceString } from './skky.mjs'

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
  })
})
