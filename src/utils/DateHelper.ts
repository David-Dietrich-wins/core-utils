/**
 * Adds (or subtracts if millisToAdd is negative) any number of seconds to a Date.
 * If no Date is provided, the current Date now is used.
 * @param millisToAdd The number of milliseconds to add to the optional Date passed in.
 * @param date Optional Date. Will use new Date() if none passed in. If a number is provided, it is assumed to be in Date epoch milliseconds.
 * @returns A new Date object with the number of seconds added.
 */
export function addMillisToDate(millisToAdd: number, date?: Date | number | string) {
  const d = date ? new Date(date) : new Date()

  return new Date(d.getTime() + millisToAdd)
}

/**
 * Adds (or subtracts if secondsToAdd is negative) any number of seconds to a Date.
 * If no Date is provided, the current Date now is used.
 * @param millisToAdd The number of seconds to add to the optional Date passed in.
 * @param date Optional Date. Will use new Date() if none passed in.
 * @returns A new Date object with the number of seconds added.
 */
export function addSecondsToDate(secondsToAdd: number, date?: Date | number | string) {
  return addMillisToDate(secondsToAdd * 1000, date)
}

/**
 * Adds (or subtracts if minutesToAdd is negative) any number of minutes to a Date.
 * If no Date is provided, the current Date now is used.
 * @param minutesToAdd The number of minutes to add to the optional Date passed in.
 * @param date Optional Date. Will use new Date() if none passed in.
 * @returns A new Date object with the number of minutes added.
 */
export function addMinutesToDate(minutesToAdd: number, date?: Date | number | string) {
  return addMillisToDate(minutesToAdd * 60 * 1000, date)
}

/**
 * Adds (or subtracts if hoursToAdd is negative) any number of hours to a Date.
 * If no Date is provided, the current Date now is used.
 * @param hoursToAdd The number of hours to add to the optional Date passed in.
 * @param date Optional Date. Will use new Date() if none passed in.
 * @returns A new Date object with the number of hours added.
 */
export function addHoursToDate(hoursToAdd: number, date?: Date | number | string) {
  return addMillisToDate(hoursToAdd * 60 * 60 * 1000, date)
}

/**
 * Adds (or subtracts if daysToAdd is negative) any number of days to a Date.
 * If no Date is provided, the current Date now is used.
 * @param daysToAdd The number of days to add to the optional Date passed in.
 * @param date Optional Date. Will use new Date() if none passed in.
 * @returns A new Date object with the number of days added.
 */
export function addDaysToDate(daysToAdd: number, date?: Date | number | string) {
  return addMillisToDate(daysToAdd * 24 * 60 * 60 * 1000, date)
}
