import CryptoHelper from '../src/utils/CryptoHelper'
import InstrumentationStatistics from '../src/utils/InstrumentationStatistics'

import {
  addDaysToDate,
  addHoursToDate,
  addMillisToDate,
  addMinutesToDate,
  addSecondsToDate,
} from '../src/utils/DateHelper'

describe('CryptoHelper', () => {
  test('Generate random string', () => {
    const lengthForRandomString = 4
    const ranstr = CryptoHelper.GenerateRandomString(lengthForRandomString)

    expect(ranstr).toHaveLength(lengthForRandomString)
  })
})

describe('DateHelper', () => {
  const dateToTest = new Date()
  const dateInMillis = dateToTest.getTime()

  test('Add Milliseconds', () => {
    const numToAdd = 2456
    const newDate = addMillisToDate(numToAdd, dateToTest)

    expect(newDate.getTime() - dateInMillis).toEqual(numToAdd)
  })

  test('Add Seconds', () => {
    const numToAdd = 2456
    const newDate = addSecondsToDate(numToAdd, dateToTest)

    expect(newDate.getTime() - dateInMillis).toEqual(numToAdd * 1000)
  })

  test('Add Minutes', () => {
    const numToAdd = 2456
    const newDate = addMinutesToDate(numToAdd, dateToTest)

    expect(newDate.getTime() - dateInMillis).toEqual(numToAdd * 1000 * 60)
  })

  test('Add Hours', () => {
    const numToAdd = 2456
    const newDate = addHoursToDate(numToAdd, dateToTest)

    expect(newDate.getTime() - dateInMillis).toEqual(numToAdd * 1000 * 60 * 60)
  })

  test('Add Days', () => {
    const numToAdd = 26
    const newDate = addDaysToDate(numToAdd, dateToTest)

    expect(newDate.getTime() - dateInMillis).toEqual(numToAdd * 1000 * 60 * 60 * 24)
  })
})

describe('Instrumentation Statistics', () => {
  test('string2', () => {
    const msg = 'string'

    const istats = new InstrumentationStatistics()
    istats.addProcessed(msg)

    expect(istats.messageString()).toContain('Processed 1')
    expect(istats.messageString()).toContain('Messages:')
    expect(istats.messageString()).toContain('string')
  })

//   test('string array', () => {
//     const msg = ['string', 'array']

//     const istats = new InstrumentationStatistics()
//     istats.addProcessed(msg)

//     expect(istats.messageString()).toContain('Processed 1')
//     expect(istats.messageString()).toContain(`
// Messages:
// `)
//     expect(istats.messageString()).toContain(`string
// `)
//     expect(istats.messageString()).toContain('array')
//   })

//   test('object', () => {
//     const msg = { id: 'string', ts: 2234443 }

//     const istats = new InstrumentationStatistics()
//     istats.addProcessed(msg)

//     expect(istats.messageString()).toContain('Processed 1')
//     expect(istats.messageString()).toContain(`
// Messages:
// `)
//     expect(istats.messageString()).toContain('"string"')
//     expect(istats.messageString()).toContain('"ts":2234443')
//   })
})
