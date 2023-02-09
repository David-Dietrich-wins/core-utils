import { safestr, timeDifferenceString } from '../src/utils/skky'

describe('Helpers', () => {
  test('Time Difference', () => {
    const dtNow = new Date()
    const startDate = new Date(+dtNow)

    startDate.setSeconds(startDate.getSeconds() - 2)
    const str = timeDifferenceString(startDate)

    // console.log('Time Difference:', str)
    expect(safestr(str).length).toBeGreaterThan(1)
  })
})
