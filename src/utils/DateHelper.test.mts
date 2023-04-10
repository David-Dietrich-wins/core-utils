import {
  addDaysToDate,
  addHoursToDate,
  addMillisToDate,
  addMinutesToDate,
  addSecondsToDate,
} from './DateHelper.mjs'

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
