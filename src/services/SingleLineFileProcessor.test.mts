import { jest } from '@jest/globals'
// eslint-disable-next-line sort-imports
import { fileSync, setGracefulCleanup } from 'tmp'
import {
  getGlobalLogger,
  mockLoggerDebug,
  mockLoggerError,
  mockLoggerInfo,
  mockLoggerLog,
  mockLoggerSilly,
  mockLoggerWarn,
} from '../jest.setup.mjs'
import { safestr } from './string-helper.mjs'
import { writeFileSync } from 'node:fs'

const sflp = await import('./SingleLineFileProcessor.mjs'),
  { SingleLineFileProcessor } = sflp
// eslint-disable-next-line sort-imports
import type { SingleLineFileProcessorConfig } from './SingleLineFileProcessor.mjs'

const CONST_DelayTime = 50000

// Cleanup files created by tmp
setGracefulCleanup()

test('constructor', async () => {
  const tmpFile = fileSync({
    mode: 0o644,
    postfix: '.txt',
    prefix: 'prefix-',
  })
  writeFileSync(tmpFile.name, '1\n2\n3\n4\n5\n\n# comment\n')

  const action = jest.fn(() => Promise.resolve(1)),
    config: SingleLineFileProcessorConfig<number> = {
      action,
      fileName: tmpFile.name,
      logger: getGlobalLogger(),
      typeName: 'type',
    },
    processor = new SingleLineFileProcessor(config)

  expect(processor.config).toBe(config)

  const stats = await processor.processFile()

  // Expect(open).toHaveBeenCalledTimes(1)
  expect(action).toHaveBeenCalledTimes(5)

  expect(mockLoggerDebug).toHaveBeenCalledTimes(0)
  expect(mockLoggerError).toHaveBeenCalledTimes(0)
  expect(mockLoggerInfo).toHaveBeenCalledTimes(14)
  expect(mockLoggerLog).toHaveBeenCalledTimes(0)
  expect(mockLoggerSilly).toHaveBeenCalledTimes(0)
  expect(mockLoggerWarn).toHaveBeenCalledTimes(0)

  expect(mockLoggerInfo.mock.calls[0]).toStrictEqual([
    'Processing',
    'type',
    'file:',
    tmpFile.name,
  ])

  expect(mockLoggerInfo.mock.calls[1]).toStrictEqual([
    'Processing line',
    1,
    'type:',
    '1',
    'START',
  ])
  expect(mockLoggerInfo.mock.calls[2]).toStrictEqual([
    'Processing line',
    1,
    'type:',
    '1',
    'END',
  ])

  expect(mockLoggerInfo.mock.calls[3]).toStrictEqual([
    'Processing line',
    2,
    'type:',
    '2',
    'START',
  ])
  expect(mockLoggerInfo.mock.calls[4]).toStrictEqual([
    'Processing line',
    2,
    'type:',
    '2',
    'END',
  ])

  expect(mockLoggerInfo.mock.calls[5]).toStrictEqual([
    'Processing line',
    3,
    'type:',
    '3',
    'START',
  ])
  expect(mockLoggerInfo.mock.calls[6]).toStrictEqual([
    'Processing line',
    3,
    'type:',
    '3',
    'END',
  ])

  expect(mockLoggerInfo.mock.calls[7]).toStrictEqual([
    'Processing line',
    4,
    'type:',
    '4',
    'START',
  ])
  expect(mockLoggerInfo.mock.calls[8]).toStrictEqual([
    'Processing line',
    4,
    'type:',
    '4',
    'END',
  ])

  expect(mockLoggerInfo.mock.calls[9]).toStrictEqual([
    'Processing line',
    5,
    'type:',
    '5',
    'START',
  ])
  expect(mockLoggerInfo.mock.calls[10]).toStrictEqual([
    'Processing line',
    5,
    'type:',
    '5',
    'END',
  ])

  expect(mockLoggerInfo.mock.calls[11]).toStrictEqual([
    'Processing line',
    6,
    'SKIP EMPTY LINE',
  ])
  expect(mockLoggerInfo.mock.calls[12]).toStrictEqual([
    'Processing line',
    7,
    'type:',
    '# comment',
    'SKIP COMMENT LINE',
  ])
  expect(mockLoggerInfo.mock.calls[13]).toStrictEqual([
    'Finished processing',
    'type',
    'file:',
    tmpFile.name,
    'with',
    8,
    'lines',
  ])

  expect(stats.add).toBe(0)
  expect(stats.delete).toBe(0)
  expect(stats.failures).toBe(0)
  expect(
    stats.finishTime ? stats.finishTime.getTime() : 0
  ).toBeGreaterThanOrEqual(Date.now())
  expect(stats.msg).toStrictEqual([])
  expect(stats.startTime.getTime()).toBeGreaterThan(
    Date.now() - CONST_DelayTime
  )
  expect(stats.skipped).toBe(2)
  expect(stats.successes).toBe(5)
  expect(stats.suffixWhenPlural).toBe('s')
  expect(stats.suffixWhenSingle).toBe('')
  expect(stats.totalProcessed).toBe(7)
  expect(stats.update).toBe(0)
  expect(stats.upsert).toBe(0)
})

test('constructor file not found', async () => {
  // Const tmpFile = fileSync({ mode: 0o644, prefix: 'prefix-', postfix: '.txt' })
  // Fs.writeFileSync(tmpFile.name, '1\n2\n3\n4\n5\n\n# comment\n')
  const action = jest.fn(() => Promise.resolve(1)),
    config: SingleLineFileProcessorConfig<number> = {
      action,
      fileName: 'notfound.txt',
      logger: getGlobalLogger(),
      typeName: 'type',
    },
    processor = new SingleLineFileProcessor(config)

  expect(processor.config).toBe(config)

  const stats = await processor.processFile()

  expect(action).toHaveBeenCalledTimes(0)

  expect(mockLoggerDebug).toHaveBeenCalledTimes(0)
  expect(mockLoggerError).toHaveBeenCalledTimes(1)
  expect(mockLoggerInfo).toHaveBeenCalledTimes(0)
  expect(mockLoggerLog).toHaveBeenCalledTimes(0)
  expect(mockLoggerSilly).toHaveBeenCalledTimes(0)
  expect(mockLoggerWarn).toHaveBeenCalledTimes(0)

  expect(mockLoggerError.mock.calls[0]).toStrictEqual([
    'File not found:',
    'notfound.txt',
  ])

  expect(stats.add).toBe(0)
  expect(stats.delete).toBe(0)
  expect(stats.failures).toBe(1)
  expect(
    stats.finishTime ? stats.finishTime.getTime() : 0
  ).toBeGreaterThanOrEqual(Date.now())
  expect(stats.msg).toStrictEqual(['File not found: notfound.txt.'])
  expect(stats.startTime.getTime()).toBeGreaterThan(
    Date.now() - CONST_DelayTime
  )
  expect(stats.skipped).toBe(0)
  expect(stats.successes).toBe(0)
  expect(stats.suffixWhenPlural).toBe('s')
  expect(stats.suffixWhenSingle).toBe('')
  expect(stats.totalProcessed).toBe(1)
  expect(stats.update).toBe(0)
  expect(stats.upsert).toBe(0)
})

test('action exception', async () => {
  const tmpFile = fileSync({
    mode: 0o644,
    postfix: '.txt',
    prefix: 'prefix-',
  })
  writeFileSync(tmpFile.name, '1\n2\n3\n4\n5\n\n# comment\n')

  const action = jest.fn(() => Promise.reject(new Error('action exception'))),
    config: SingleLineFileProcessorConfig<number> = {
      action,
      fileName: tmpFile.name,
      logger: getGlobalLogger(),
      typeName: 'type',
    },
    processor = new SingleLineFileProcessor(config)
  expect(processor.config).toBe(config)

  const stats = await processor.processFile()

  expect(action).toHaveBeenCalledTimes(5)

  expect(mockLoggerDebug).toHaveBeenCalledTimes(0)
  expect(mockLoggerError).toHaveBeenCalledTimes(5)
  expect(mockLoggerInfo).toHaveBeenCalledTimes(14)
  expect(mockLoggerSilly).toHaveBeenCalledTimes(0)
  expect(mockLoggerWarn).toHaveBeenCalledTimes(0)

  expect(stats.add).toBe(0)
  expect(stats.delete).toBe(0)
  expect(stats.failures).toBe(5)
  expect(
    stats.finishTime ? stats.finishTime.getTime() : 0
  ).toBeGreaterThanOrEqual(Date.now())
  expect(stats.msg).toStrictEqual([])
  expect(stats.startTime.getTime()).toBeGreaterThan(
    Date.now() - CONST_DelayTime
  )
  expect(stats.skipped).toBe(2)
  expect(stats.successes).toBe(0)
  expect(stats.suffixWhenPlural).toBe('s')
  expect(stats.suffixWhenSingle).toBe('')
  expect(stats.totalProcessed).toBe(7)
  expect(stats.update).toBe(0)
  expect(stats.upsert).toBe(0)
})

test('action exception with trimline', async () => {
  const tmpFile = fileSync({
    mode: 0o644,
    postfix: '.txt',
    prefix: 'prefix-',
  })
  writeFileSync(tmpFile.name, '1\n2\n3\n4\n5\n\n# comment\n')

  const action = jest.fn((safeline: string) =>
      Promise.resolve(safestr(safeline).length)
    ),
    config: SingleLineFileProcessorConfig<number> = {
      action,
      fileName: tmpFile.name,
      logger: getGlobalLogger(),
      trimLine: false,
      typeName: 'type',
    },
    processor = new SingleLineFileProcessor(config)
  expect(processor.config).toBe(config)

  const stats = await processor.processFile()

  expect(mockLoggerDebug).toHaveBeenCalledTimes(0)
  expect(mockLoggerError).toHaveBeenCalledTimes(0)
  expect(mockLoggerInfo).toHaveBeenCalledTimes(14)
  expect(mockLoggerSilly).toHaveBeenCalledTimes(0)
  expect(mockLoggerWarn).toHaveBeenCalledTimes(0)

  expect(mockLoggerInfo.mock.calls[0]).toStrictEqual([
    'Processing',
    'type',
    'file:',
    tmpFile.name,
  ])

  expect(mockLoggerInfo.mock.calls[1]).toStrictEqual([
    'Processing line',
    1,
    'type:',
    '1',
    'START',
  ])
  expect(mockLoggerInfo.mock.calls[2]).toStrictEqual([
    'Processing line',
    1,
    'type:',
    '1',
    'END',
  ])

  expect(mockLoggerInfo.mock.calls[3]).toStrictEqual([
    'Processing line',
    2,
    'type:',
    '2',
    'START',
  ])
  expect(mockLoggerInfo.mock.calls[4]).toStrictEqual([
    'Processing line',
    2,
    'type:',
    '2',
    'END',
  ])

  expect(mockLoggerInfo.mock.calls[5]).toStrictEqual([
    'Processing line',
    3,
    'type:',
    '3',
    'START',
  ])
  expect(mockLoggerInfo.mock.calls[6]).toStrictEqual([
    'Processing line',
    3,
    'type:',
    '3',
    'END',
  ])

  expect(mockLoggerInfo.mock.calls[7]).toStrictEqual([
    'Processing line',
    4,
    'type:',
    '4',
    'START',
  ])
  expect(mockLoggerInfo.mock.calls[8]).toStrictEqual([
    'Processing line',
    4,
    'type:',
    '4',
    'END',
  ])

  expect(mockLoggerInfo.mock.calls[9]).toStrictEqual([
    'Processing line',
    5,
    'type:',
    '5',
    'START',
  ])
  expect(mockLoggerInfo.mock.calls[10]).toStrictEqual([
    'Processing line',
    5,
    'type:',
    '5',
    'END',
  ])

  expect(mockLoggerInfo.mock.calls[11]).toStrictEqual([
    'Processing line',
    6,
    'SKIP EMPTY LINE',
  ])
  expect(mockLoggerInfo.mock.calls[12]).toStrictEqual([
    'Processing line',
    7,
    'type:',
    '# comment',
    'SKIP COMMENT LINE',
  ])
  expect(mockLoggerInfo.mock.calls[13]).toStrictEqual([
    'Finished processing',
    'type',
    'file:',
    tmpFile.name,
    'with',
    8,
    'lines',
  ])

  expect(stats.add).toBe(0)
  expect(stats.delete).toBe(0)
  expect(stats.failures).toBe(0)
  expect(
    stats.finishTime ? stats.finishTime.getTime() : 0
  ).toBeGreaterThanOrEqual(Date.now())
  expect(stats.msg).toStrictEqual([])
  expect(stats.startTime.getTime()).toBeGreaterThan(
    Date.now() - CONST_DelayTime
  )
  expect(stats.skipped).toBe(2)
  expect(stats.successes).toBe(5)
  expect(stats.suffixWhenPlural).toBe('s')
  expect(stats.suffixWhenSingle).toBe('')
  expect(stats.totalProcessed).toBe(7)
  expect(stats.update).toBe(0)
  expect(stats.upsert).toBe(0)
})

test('processFile bad', async () => {
  const tmpFile = fileSync({
    mode: 0o644,
    postfix: '.txt',
    prefix: 'prefix-',
  })
  writeFileSync(tmpFile.name, '1\n2\n3\n4\n5\n\n# comment\n')

  const action = jest.fn(() => Promise.reject(new Error('action exception'))),
    config: SingleLineFileProcessorConfig<number> = {
      action,
      fileName: tmpFile.name,
      logger: getGlobalLogger(),
      typeName: 'type',
    },
    processor = new SingleLineFileProcessor(config)
  expect(processor.config).toBe(config)

  const stats = await processor.processFile()

  expect(action).toHaveBeenCalledTimes(5)

  expect(mockLoggerDebug).toHaveBeenCalledTimes(0)
  expect(mockLoggerError).toHaveBeenCalledTimes(5)
  expect(mockLoggerInfo).toHaveBeenCalledTimes(14)
  expect(mockLoggerSilly).toHaveBeenCalledTimes(0)
  expect(mockLoggerWarn).toHaveBeenCalledTimes(0)

  expect(mockLoggerError.mock.calls[0][0]).toBe('Error processing line')
  expect(mockLoggerError.mock.calls[0][1]).toBe(1)
  let err = mockLoggerError.mock.calls[0][2] as Error
  expect(err).toBeInstanceOf(Error)
  expect(err.message).toBe('action exception')
  expect(err.stack).toMatch(/^Error: action exception/u)

  expect(mockLoggerError.mock.calls[1][0]).toBe('Error processing line')
  expect(mockLoggerError.mock.calls[1][1]).toBe(2)
  err = mockLoggerError.mock.calls[1][2] as Error
  expect(err).toBeInstanceOf(Error)
  expect(err.message).toBe('action exception')
  expect(err.stack).toMatch(/^Error: action exception/u)

  expect(mockLoggerError.mock.calls[2][0]).toBe('Error processing line')
  expect(mockLoggerError.mock.calls[2][1]).toBe(3)
  err = mockLoggerError.mock.calls[2][2] as Error
  expect(err).toBeInstanceOf(Error)
  expect(err.message).toBe('action exception')
  expect(err.stack).toMatch(/^Error: action exception/u)

  expect(mockLoggerError.mock.calls[3][0]).toBe('Error processing line')
  expect(mockLoggerError.mock.calls[3][1]).toBe(4)
  err = mockLoggerError.mock.calls[3][2] as Error
  expect(err).toBeInstanceOf(Error)
  expect(err.message).toBe('action exception')
  expect(err.stack).toMatch(/^Error: action exception/u)

  expect(mockLoggerError.mock.calls[4][0]).toBe('Error processing line')
  expect(mockLoggerError.mock.calls[4][1]).toBe(5)
  err = mockLoggerError.mock.calls[4][2] as Error
  expect(err).toBeInstanceOf(Error)
  expect(err.message).toBe('action exception')
  expect(err.stack).toMatch(/^Error: action exception/u)

  expect(mockLoggerInfo.mock.calls[0]).toStrictEqual([
    'Processing',
    'type',
    'file:',
    tmpFile.name,
  ])

  expect(mockLoggerInfo.mock.calls[1]).toStrictEqual([
    'Processing line',
    1,
    'type:',
    '1',
    'START',
  ])
  expect(mockLoggerInfo.mock.calls[2]).toStrictEqual([
    'Processing line',
    1,
    'type:',
    '1',
    'END',
  ])

  expect(mockLoggerInfo.mock.calls[3]).toStrictEqual([
    'Processing line',
    2,
    'type:',
    '2',
    'START',
  ])
  expect(mockLoggerInfo.mock.calls[4]).toStrictEqual([
    'Processing line',
    2,
    'type:',
    '2',
    'END',
  ])

  expect(mockLoggerInfo.mock.calls[5]).toStrictEqual([
    'Processing line',
    3,
    'type:',
    '3',
    'START',
  ])
  expect(mockLoggerInfo.mock.calls[6]).toStrictEqual([
    'Processing line',
    3,
    'type:',
    '3',
    'END',
  ])

  expect(mockLoggerInfo.mock.calls[7]).toStrictEqual([
    'Processing line',
    4,
    'type:',
    '4',
    'START',
  ])
  expect(mockLoggerInfo.mock.calls[8]).toStrictEqual([
    'Processing line',
    4,
    'type:',
    '4',
    'END',
  ])

  expect(mockLoggerInfo.mock.calls[9]).toStrictEqual([
    'Processing line',
    5,
    'type:',
    '5',
    'START',
  ])
  expect(mockLoggerInfo.mock.calls[10]).toStrictEqual([
    'Processing line',
    5,
    'type:',
    '5',
    'END',
  ])

  expect(mockLoggerInfo.mock.calls[11]).toStrictEqual([
    'Processing line',
    6,
    'SKIP EMPTY LINE',
  ])
  expect(mockLoggerInfo.mock.calls[12]).toStrictEqual([
    'Processing line',
    7,
    'type:',
    '# comment',
    'SKIP COMMENT LINE',
  ])
  expect(mockLoggerInfo.mock.calls[13]).toStrictEqual([
    'Finished processing',
    'type',
    'file:',
    tmpFile.name,
    'with',
    8,
    'lines',
  ])

  expect(stats.add).toBe(0)
  expect(stats.delete).toBe(0)
  expect(stats.failures).toBe(5)
  expect(
    stats.finishTime ? stats.finishTime.getTime() : 0
  ).toBeGreaterThanOrEqual(Date.now())
  expect(stats.msg).toStrictEqual([])
  expect(stats.startTime.getTime()).toBeGreaterThan(
    Date.now() - CONST_DelayTime
  )
  expect(stats.skipped).toBe(2)
  expect(stats.successes).toBe(0)
  expect(stats.suffixWhenPlural).toBe('s')
  expect(stats.suffixWhenSingle).toBe('')
  expect(stats.totalProcessed).toBe(7)
  expect(stats.update).toBe(0)
  expect(stats.upsert).toBe(0)
})

test('open fails', async () => {
  // MockOpen.mockImplementationOnce(() => {
  //   Return Promise.reject(new Error('open failed'))
  // })

  const action = jest.fn(() => Promise.resolve(1)),
    config: SingleLineFileProcessorConfig<number> = {
      action,
      fileName: 'notfound.txt',
      logger: getGlobalLogger(),
      typeName: 'type',
    },
    processor = new SingleLineFileProcessor(config)
  expect(processor.config).toBe(config)

  const stats = await processor.processFile()

  expect(action).toHaveBeenCalledTimes(0)

  expect(mockLoggerDebug).toHaveBeenCalledTimes(0)
  expect(mockLoggerError).toHaveBeenCalledTimes(1)
  expect(mockLoggerInfo).toHaveBeenCalledTimes(0)
  expect(mockLoggerLog).toHaveBeenCalledTimes(0)
  expect(mockLoggerSilly).toHaveBeenCalledTimes(0)
  expect(mockLoggerWarn).toHaveBeenCalledTimes(0)

  expect(mockLoggerError.mock.calls[0]).toStrictEqual([
    'File not found:',
    'notfound.txt',
  ])

  expect(stats.add).toBe(0)
  expect(stats.delete).toBe(0)
  expect(stats.failures).toBe(1)
  expect(
    stats.finishTime ? stats.finishTime.getTime() : 0
  ).toBeGreaterThanOrEqual(Date.now())
  expect(stats.msg).toStrictEqual(['File not found: notfound.txt.'])
  expect(stats.startTime.getTime()).toBeGreaterThan(
    Date.now() - CONST_DelayTime
  )
  expect(stats.skipped).toBe(0)
  expect(stats.successes).toBe(0)
  expect(stats.suffixWhenPlural).toBe('s')
  expect(stats.suffixWhenSingle).toBe('')
  expect(stats.totalProcessed).toBe(1)
  expect(stats.update).toBe(0)
  expect(stats.upsert).toBe(0)
})
