import { AppException } from './AppException.mjs'
import { DateHelper } from '../primitives/date-helper.mjs'
import { InstrumentationStatistics } from './InstrumentationStatistics.mjs'
import { numberToString } from '../primitives/number-helper.mjs'

const CONST_DefaultSecondsMs = /^(?<temp1>\d+ seconds?|\d+m?s)$/u

it('String message', () => {
  const msg = 'string',
    mstats = new InstrumentationStatistics()
  mstats.addProcessed(msg)

  expect(mstats.messageString()).toContain('Processed 1')
  expect(mstats.messageString()).toContain(`
Messages:
`)
  expect(mstats.messageString()).toContain('string')
})

it('String array message', () => {
  const msg = ['string', 'array'],
    mstats = new InstrumentationStatistics()
  mstats.addProcessed(msg)

  expect(mstats.messageString()).toContain('Processed 1')
  expect(mstats.messageString()).toContain(`
Messages:
`)
  expect(mstats.messageString()).toContain(`string
`)
  expect(mstats.messageString()).toContain('array')
})

it('Object message', () => {
  const msg = { id: 'string', ts: 2234443 },
    mstats = new InstrumentationStatistics()
  mstats.addProcessed(msg)

  expect(mstats.messageString()).toContain('Processed 1')
  expect(mstats.messageString()).toContain(`
Messages:
`)
  expect(mstats.messageString()).toContain('"string"')
  expect(mstats.messageString()).toContain('"ts":2234443')
})

it('messageSuccessFail good', () => {
  const istats = new InstrumentationStatistics('record', 'records', 24, 20, 4),
    stats2 = new InstrumentationStatistics('Activity', 'Activities', 12, 10, 2),
    stats3 = new InstrumentationStatistics(
      'Transaction',
      'Transactions',
      6,
      1,
      5
    ),
    stringResultShouldStartWith =
      'Sent 24 records (Success: 20, Fail: 4), 12 Activities (Success: 10, Fail: 2) and 6 Transactions (Success: 1, Fail: 5) in ',
    strmsg = istats.messageSuccessFail({ individualStats: [stats2, stats3] }),
    truncatedMsg = strmsg.slice(0, stringResultShouldStartWith.length)
  expect(truncatedMsg).toStrictEqual(stringResultShouldStartWith)
})

it('messageSuccessFail good without prefix', () => {
  const istats = new InstrumentationStatistics('record', 'records', 24, 20, 4),
    stats2 = new InstrumentationStatistics('Activity', 'Activities', 12, 10, 2),
    stats3 = new InstrumentationStatistics(
      'Transaction',
      'Transactions',
      6,
      1,
      5
    ),
    stringResultShouldStartWith =
      '24 records (Success: 20, Fail: 4), 12 Activities (Success: 10, Fail: 2) and 6 Transactions (Success: 1, Fail: 5) in ',
    strmsg = istats.messageSuccessFail({
      individualStats: [stats2, stats3],
      prefix: '',
    }),
    truncatedMsg = strmsg.slice(0, stringResultShouldStartWith.length)
  expect(truncatedMsg).toStrictEqual(stringResultShouldStartWith)
})

it('setSuffix good', () => {
  const arrMessages = ['string', 'array'],
    istats = new InstrumentationStatistics()
  istats.addProcessed(arrMessages)

  expect(istats.messageString()).toContain('Processed 1')
  expect(istats.messageString()).toContain(`
Messages:
`)
  expect(istats.messageString()).toContain(`string
`)
  expect(istats.messageString()).toContain('array')

  istats.setSuffix('suffix', 'suffixes')

  let msgTotalProcessed = istats.messageTotalProcessedWithSuccessFail(
    true,
    true
  )
  expect(msgTotalProcessed).toStrictEqual('1 suffix (Success: 0, Fail: 0)')

  istats.addProcessed(arrMessages)
  msgTotalProcessed = istats.messageTotalProcessedWithSuccessFail(true, true)
  expect(msgTotalProcessed).toStrictEqual('2 suffixes (Success: 0, Fail: 0)')
})

describe('messageString', () => {
  it('one line good', () => {
    const arrMessages = ['string', 'array'],
      istats = new InstrumentationStatistics()
    istats.addProcessed(arrMessages)

    const msg = istats.messageString(true)

    expect(msg).toContain('Processed 1')
  })

  it('failure good', () => {
    const arrMessages = ['string', 'array'],
      istats = new InstrumentationStatistics()
    istats.addFailure(arrMessages)
    const msg = istats.messageString(false)

    expect(msg).toContain('Processed 1')
    expect(msg).toContain('Failures: 1')

    const msgOneLine = istats.messageString(true)

    expect(msgOneLine).toContain('Processed 1')
    expect(msgOneLine).toContain('Failures: 1')
  })

  it('success good', () => {
    const arrMessages = ['string', 'array'],
      istats = new InstrumentationStatistics()
    istats.addSuccess(arrMessages)
    const msg = istats.messageString(false)

    expect(msg).toContain('Processed 1')
    expect(msg).toContain('Successes: 1')

    const msgOneLine = istats.messageString(true)

    expect(msgOneLine).toContain('Processed 1')
    expect(msgOneLine).toContain('Successes: 1')
  })

  it('skipped good', () => {
    const arrMessages = ['string', 'array'],
      istats = new InstrumentationStatistics()
    istats.addSkipped(arrMessages)
    const msg = istats.messageString(false)

    expect(msg).toContain('Processed 1')
    expect(msg).toContain('Skipped: 1')

    const msgOneLine = istats.messageString(true)

    expect(msgOneLine).toContain('Processed 1')
    expect(msgOneLine).toContain('Skipped: 1')
  })

  it('delete good', () => {
    const arrMessages = ['string', 'array'],
      istats = new InstrumentationStatistics()
    istats.deleted(arrMessages)
    const msg = istats.messageString(false)

    expect(msg).toContain('Processed 1')
    expect(msg).toContain('Deleted: 1')

    const msgOneLine = istats.messageString(true)

    expect(msgOneLine).toContain('Processed 1')
    expect(msgOneLine).toContain('Deleted: 1')
  })

  it('upsert good', () => {
    const arrMessages = ['string', 'array'],
      istats = new InstrumentationStatistics()
    istats.upserted(arrMessages)
    const msg = istats.messageString(false)

    expect(msg).toContain('Processed 1')
    expect(msg).toContain('Upserted: 1')

    const msgOneLine = istats.messageString(true)

    expect(msgOneLine).toContain('Processed 1')
    expect(msgOneLine).toContain('Upserted: 1')
  })

  it('update good', () => {
    const arrMessages = ['string', 'array'],
      istats = new InstrumentationStatistics()
    istats.updated(arrMessages)
    const msg = istats.messageString(false)

    expect(msg).toContain('Processed 1')
    expect(msg).toContain('Updated: 1')

    const msgOneLine = istats.messageString(true)

    expect(msgOneLine).toContain('Processed 1')
    expect(msgOneLine).toContain('Updated: 1')
  })

  it('add good', () => {
    const arrMessages = ['string', 'array'],
      istats = new InstrumentationStatistics()
    istats.added(arrMessages)
    const msg = istats.messageString(false)

    expect(msg).toContain('Processed 1')
    expect(msg).toContain('Added: 1')

    const msgOneLine = istats.messageString(true)

    expect(msgOneLine).toContain('Processed 1')
    expect(msgOneLine).toContain('Added: 1')
  })
})

describe('messageTotalProcessedWithSuccessFail', () => {
  it('with skipped good', () => {
    const arrMessages = ['string', 'array'],
      istats = new InstrumentationStatistics()
    istats.addSkipped(arrMessages)
    const msg = istats.messageTotalProcessedWithSuccessFail(true, true)

    expect(msg.indexOf('1 ')).toBe(0)
    expect(msg).toContain('Skipped: 1')
  })

  it('with false SuccessFailIf0', () => {
    const arrMessages = ['string', 'array'],
      istats = new InstrumentationStatistics()
    istats.addSkipped(arrMessages)
    const msg = istats.messageTotalProcessedWithSuccessFail(false, false)

    expect(msg).toBe('1 ')
  })

  it('with true SuccessFailIf0', () => {
    const arrMessages = ['string', 'array'],
      istats = new InstrumentationStatistics()
    let msg = istats.messageTotalProcessedWithSuccessFail(false)
    expect(msg).toBe('0 s')
    msg = istats.messageTotalProcessedWithSuccessFail(false, false)
    expect(msg).toBe('0 s')
    msg = istats.messageTotalProcessedWithSuccessFail(true)
    expect(msg).toBe('0 s (Success: 0, Fail: 0)')
    msg = istats.messageTotalProcessedWithSuccessFail(true, true)
    expect(msg).toBe('0 s (Success: 0, Fail: 0)')

    istats.addSkipped(arrMessages)
    msg = istats.messageTotalProcessedWithSuccessFail(true, true)
    expect(msg).toBe('1  (Success: 0, Fail: 0, Skipped: 1)')

    istats.addFailure()
    msg = istats.messageTotalProcessedWithSuccessFail(false, false)
    expect(msg).toBe('2 s (Fail: 1)')
    istats.failures = 0

    istats.addSuccess(arrMessages)
    msg = istats.messageTotalProcessedWithSuccessFail(false, false)
    expect(msg).toBe('3 s (Success: 1)')
    msg = istats.messageTotalProcessedWithSuccessFail(false, true)
    expect(msg).toBe('3 s (Success: 1, Skipped: 1)')

    istats.addFailure(arrMessages)
    msg = istats.messageTotalProcessedWithSuccessFail(true, true)
    expect(msg).toBe('4 s (Success: 1, Fail: 1, Skipped: 1)')
    istats.addFailure(arrMessages)
    msg = istats.messageTotalProcessedWithSuccessFail(true, true)
    expect(msg).toBe('5 s (Success: 1, Fail: 2, Skipped: 1)')
  })
})

describe('lineSeparator', () => {
  it('default', () => {
    const arrMessages = ['string', 'array'],
      istats = new InstrumentationStatistics()
    istats.addSkipped(arrMessages)
    const msg = istats.lineSeparator()

    expect(msg).toBe('\n')
  })

  it('one line', () => {
    const arrMessages = ['string', 'array'],
      istats = new InstrumentationStatistics()
    istats.addSkipped(arrMessages)
    const msg = istats.lineSeparator(true)

    expect(msg).toBe(', ')
  })

  it('multiline', () => {
    const arrMessages = ['string', 'array'],
      istats = new InstrumentationStatistics()
    istats.addSkipped(arrMessages)
    const msg = istats.lineSeparator(false)

    expect(msg).toBe('\n')
  })

  it('oneLine and multilineSeparator', () => {
    const arrMessages = ['string', 'array'],
      istats = new InstrumentationStatistics()
    istats.addSkipped(arrMessages)
    const msg = istats.lineSeparator(true, '.\n')

    expect(msg).toBe(', ')
  })

  it('multilineSeparator', () => {
    const arrMessages = ['string', 'array'],
      istats = new InstrumentationStatistics()
    istats.addSkipped(arrMessages)
    const msg = istats.lineSeparator(false, '.\n')

    expect(msg).toBe('.\n')
  })
})

it('processingTimeInSeconds good', () => {
  const arrMessages = ['string', 'array'],
    istats = new InstrumentationStatistics()
  istats.addSkipped(arrMessages)
  const msg = istats.processingTimeInSeconds

  expect(msg).toBe(0)
})

it('finish time good', () => {
  const arrMessages = ['string', 'array'],
    istats = new InstrumentationStatistics()
  istats.addSkipped(arrMessages)

  const finishTime = istats.finished()

  expect(Date.now() - Number(finishTime)).toBeLessThan(1000)
})

it('clear good', () => {
  const arrMessages = ['string', 'array'],
    istats = new InstrumentationStatistics()
  istats.addSkipped(arrMessages)

  expect(istats.totalProcessed).toBe(1)
  expect(istats.skipped).toBe(1)

  istats.clear()
  expect(istats.totalProcessed).toBe(0)
  expect(istats.skipped).toBe(0)
  expect(istats.successes).toBe(0)
  expect(istats.failures).toBe(0)
  expect(istats.add).toBe(0)
  expect(istats.delete).toBe(0)
  expect(istats.update).toBe(0)
  expect(istats.upsert).toBe(0)
  expect(istats.msg).toStrictEqual([])
  expect(istats.startTime).not.toBeNull()
  expect(istats.finishTime).toBeUndefined()

  const msg = istats.messageString()
  expect(msg.indexOf('Processed 0 items in')).toBe(0)
  expect(istats.processingTimeInSeconds).toBe(0)

  const finishTime = istats.finished()

  expect(Date.now() - Number(finishTime)).toBeLessThan(1000)
})

it('clear times also', () => {
  const arrMessages = ['string', 'array'],
    istats = new InstrumentationStatistics()
  istats.addSkipped(arrMessages)

  expect(istats.totalProcessed).toBe(1)
  expect(istats.skipped).toBe(1)

  istats.clear(true)
  expect(istats.totalProcessed).toBe(0)
  expect(istats.skipped).toBe(0)
  expect(istats.successes).toBe(0)
  expect(istats.failures).toBe(0)
  expect(istats.add).toBe(0)
  expect(istats.delete).toBe(0)
  expect(istats.update).toBe(0)
  expect(istats.upsert).toBe(0)
  expect(istats.msg).toStrictEqual([])
  expect(istats.startTime).not.toBeNull()
  expect(istats.finishTime).toBeUndefined()

  const msg = istats.messageString()
  expect(msg.indexOf('Processed 0 items in')).toBe(0)
  expect(istats.processingTimeInSeconds).toBe(0)

  const finishTime = istats.finished()

  expect(Date.now() - Number(finishTime)).toBeLessThan(1000)
})

it('addMessage bad', () => {
  const arrMessages = 1,
    istats = new InstrumentationStatistics()

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    istats.addMessage(arrMessages as any)

    throw new AppException('Should never get here')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err instanceof Error) {
      expect(err.message).toBe('Message is not a string or set of strings.')
    }
  }

  expect.assertions(1)
})

describe('addStats', () => {
  it('empty', () => {
    const istats = new InstrumentationStatistics('record', 'records', 24, 20, 4)

    istats.addStats()
    const msg = istats.messageSuccessFail({ individualStats: [] }),
      stringResultShouldStartWith =
        'Sent 24 records (Success: 20, Fail: 4) in ',
      truncatedMsg = msg.slice(0, stringResultShouldStartWith.length)
    expect(truncatedMsg).toStrictEqual(stringResultShouldStartWith)
  })

  it('good', () => {
    const istats = new InstrumentationStatistics(
        'record',
        'records',
        24,
        20,
        4
      ),
      stats2 = new InstrumentationStatistics(
        'Activity',
        'Activities',
        12,
        10,
        2
      ),
      stats3 = new InstrumentationStatistics(
        'Transaction',
        'Transactions',
        6,
        1,
        5
      )

    istats.addStats([stats2, stats3], true)
    const msg = istats.messageSuccessFail({
        individualStats: [stats2, stats3],
      }),
      stringResultShouldStartWith =
        'Sent 42 records (Success: 31, Fail: 11), 12 Activities (Success: 10, Fail: 2) and 6 Transactions (Success: 1, Fail: 5) in ',
      truncatedMsg = msg.slice(0, stringResultShouldStartWith.length)
    expect(truncatedMsg).toStrictEqual(stringResultShouldStartWith)
  })

  it('concat msg false', () => {
    const istats = new InstrumentationStatistics(
        'record',
        'records',
        24,
        20,
        4
      ),
      stats2 = new InstrumentationStatistics(
        'Activity',
        'Activities',
        12,
        10,
        2
      ),
      stats3 = new InstrumentationStatistics(
        'Transaction',
        'Transactions',
        6,
        1,
        5
      )

    istats.addStats([stats2, stats3], false)
    const msg = istats.messageSuccessFail({
        individualStats: [stats2, stats3],
      }),
      stringResultShouldStartWith =
        'Sent 42 records (Success: 31, Fail: 11), 12 Activities (Success: 10, Fail: 2) and 6 Transactions (Success: 1, Fail: 5) in ',
      truncatedMsg = msg.slice(0, stringResultShouldStartWith.length)
    expect(truncatedMsg).toStrictEqual(stringResultShouldStartWith)
  })
})

describe('processedTimesArray', () => {
  it('good', () => {
    const stats = new InstrumentationStatistics(),
      [
        totalRecordsProcessed,
        totalAvgRecordsPerSecond,
        totalAvgProcessingTimeString,
      ] = stats.processedTimesArray()

    expect(stats.processingTimeInSeconds).toBe(0)
    expect(totalRecordsProcessed).toBe('0')
    expect(totalAvgRecordsPerSecond).toBe('0.0')
    expect(totalAvgProcessingTimeString).toMatch(CONST_DefaultSecondsMs)

    stats.totalProcessed = 100
    stats.finishTime = new Date(stats.startTime.getTime() + 10000)
    expect(stats.processingTimeInSeconds).toBe(10)
    expect(totalRecordsProcessed).toBe('0')
    // Expect(totalAvgRecordsPerSecond).toBe('10.0')
    expect(totalAvgProcessingTimeString).toMatch(CONST_DefaultSecondsMs)
  })

  it.each([
    [0, 0],
    [1, 1],
    [2, 0],
    [2, 1],
    [2, 2],
    [3, 2],
    [5, 1],
    [8, 2],
    [30, 3],
    [44, 7],
    [100, 10],
    [200, 10],
    [789, 11],
    [871, 23],
    [1000, 22],
    [204382, 333],
    [98456817, 12137],
  ])('seconds %s, %s', (totalProcessed, secondsToAdvance) => {
    const stats = new InstrumentationStatistics()
    stats.totalProcessed = totalProcessed
    stats.finishTime = new Date(
      stats.startTime.getTime() + secondsToAdvance * 1000
    )

    const [
        totalRecordsProcessed,
        totalAvgRecordsPerSecond,
        totalAvgProcessingTimeString,
      ] = stats.processedTimesArray(),
      avgRecordsPerSecond =
        totalProcessed / (secondsToAdvance ? secondsToAdvance : 1)

    expect(stats.processingTimeInSeconds).toBe(
      Math.round(
        (Number(stats.finishTime ?? 0) - stats.startTime.getTime()) / 1000
      )
    )
    expect(totalRecordsProcessed).toBe(numberToString(totalProcessed))
    expect(totalAvgRecordsPerSecond).toBe(avgRecordsPerSecond.toFixed(1))
    expect(totalAvgProcessingTimeString).toBe(
      DateHelper.timeDifferenceStringFromMillis(
        secondsToAdvance * 1000,
        true,
        true
      )
    )
    // Expect(totalAvgProcessingTimeString).toMatch(CONST_DefaultSecondsMs)
  })
})

describe('toJson', () => {
  it.each([5, 10, 20, 100, 1000])('addSuccess: %s', (totalProcessed) => {
    const stats = new InstrumentationStatistics()

    for (let i = 0; i < totalProcessed; i++) {
      stats.addSuccess()
    }

    const json = stats.toJson()

    expect(json).toStrictEqual({
      add: 0,
      delete: 0,
      failures: 0,
      finishTime: stats.finishTime,
      msg: [],
      processingTime: expect.anything(),
      processingTimeInSeconds: expect.closeTo(0, 1),
      skipped: 0,
      startTime: stats.startTime,
      successes: totalProcessed,
      suffixWhenPlural: 's',
      suffixWhenSingle: '',
      totalProcessed,
      update: 0,
      upsert: 0,
    })
  })

  it.each([5, 10, 20, 100, 1000])('addFailure: %s', (totalProcessed) => {
    const stats = new InstrumentationStatistics()

    for (let i = 0; i < totalProcessed; i++) {
      stats.addFailure()
    }

    const json = stats.toJson()

    expect(json).toStrictEqual({
      add: 0,
      delete: 0,
      failures: totalProcessed,
      finishTime: stats.finishTime,
      msg: [],
      processingTime: expect.anything(),
      processingTimeInSeconds: expect.closeTo(0, 1),
      skipped: 0,
      startTime: stats.startTime,
      successes: 0,
      suffixWhenPlural: 's',
      suffixWhenSingle: '',
      totalProcessed,
      update: 0,
      upsert: 0,
    })
  })
})
