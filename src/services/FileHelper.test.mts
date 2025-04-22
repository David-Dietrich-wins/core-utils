import fs from 'node:fs'
import tmp from 'tmp'
import { FileHelper } from './FileHelper.mjs'
import { InstrumentationStatistics } from '../models/InstrumentationStatistics.mjs'
import { safeJsonToString } from './object-helper.mjs'

describe('DeleteFileIfExists', () => {
  test('good', () => {
    const tmpFile = tmp.fileSync().name

    const stats = FileHelper.writeArrayToJsonFile(tmpFile, [])
    fs.writeFileSync(tmpFile, '1\n2\n3\n4\n5\n\n# comment\n')

    const ret = FileHelper.DeleteFileIfExists(tmpFile)

    expect(ret).toBe(true)
    expect(stats.add).toBe(0)
  })

  test('does not exist', () => {
    const filename = 'adsfasdfafpioupiupiuadfsiuapiudf.txt'

    const ret = FileHelper.DeleteFileIfExists(filename)

    expect(ret).toBe(false)
  })
})

describe('addCommaIfNotFirst', () => {
  test('first', () => {
    const fileContents = ''

    const tmpFile = tmp.fileSync().name

    const fh = new FileHelper(tmpFile)
    fh.openForWrite()
    fh.addCommaIfNotFirst()
    fh.write(fileContents)
    fh.close()

    const ret = fh.read()

    FileHelper.DeleteFileIfExists(tmpFile)

    expect(ret).toBe('')
  })

  test('not first', () => {
    const fileContents = ''

    const tmpFile = tmp.fileSync().name

    const fh = new FileHelper(tmpFile)
    fh.openForWrite()
    fh.addCommaIfNotFirst(2)
    fh.write(fileContents)
    fh.close()

    const ret = fh.read()

    FileHelper.DeleteFileIfExists(tmpFile)

    expect(ret).toBe(',')
  })
})

describe('write', () => {
  test('array of numbers', () => {
    const fileContents = [1, 2, 3, 4, 5]

    const tmpFile = tmp.fileSync().name

    const fh = new FileHelper(tmpFile)
    fh.openForWrite()
    fh.write(fileContents)
    fh.close()

    const ret = fh.read()

    FileHelper.DeleteFileIfExists(tmpFile)

    expect(ret).toBe('[1,2,3,4,5]')
  })

  test('array of strings', () => {
    const fileContents = ['a', 'bc', 'def', 'ghij', 'klmno']

    const tmpFile = tmp.fileSync().name

    const fh = new FileHelper(tmpFile)
    fh.openForWrite()
    fh.write(fileContents)
    fh.close()

    const ret = fh.read()

    FileHelper.DeleteFileIfExists(tmpFile)

    expect(ret).toBe(safeJsonToString(fileContents))
  })

  test('object', () => {
    const dateNow = Date.now()
    const fileContents = { a: 1, b: '2', c: 3.14, d: { a: 'b' }, e: dateNow }

    const tmpFile = tmp.fileSync().name

    const fh = new FileHelper(tmpFile)
    fh.openForWrite()
    fh.write(fileContents)
    fh.close()

    const ret = fh.read()

    FileHelper.DeleteFileIfExists(tmpFile)

    expect(ret).toBe(safeJsonToString(fileContents))
  })

  test('string', () => {
    const fileContents = 'hello'

    const tmpFile = tmp.fileSync().name

    const fh = new FileHelper(tmpFile)
    fh.openForWrite()
    fh.write(fileContents)
    fh.close()

    const ret = fh.read()

    FileHelper.DeleteFileIfExists(tmpFile)

    expect(ret).toBe(fileContents)
  })

  test('undefined', () => {
    const fileContents = undefined

    const tmpFile = tmp.fileSync().name

    const fh = new FileHelper(tmpFile)
    fh.openForWrite()
    fh.write(fileContents)
    fh.close()

    const ret = fh.read()

    FileHelper.DeleteFileIfExists(tmpFile)

    expect(ret).toBe('')
  })
})

describe('writeArrayToJsonFile', () => {
  test('good', () => {
    const tmpFile = tmp.fileSync().name

    const dateNow = Date.now()

    const testdata = [
      {
        a: 1,
        b: '2',
        c: 3.14,
        d: { a: 'b' },
        e: dateNow,
      },
      {
        a: 1,
        b: '2',
        c: 3.14,
        d: { a: 'b' },
        e: dateNow,
      },
    ]

    const ret = FileHelper.writeArrayToJsonFile(tmpFile, testdata, (item) => {
      if (item.a === 1) {
        item.a = 2
      }

      return item
    })

    expect(ret).toBeInstanceOf(InstrumentationStatistics)
    expect(ret.add).toBe(2)
    expect(ret.successes).toBe(1)
    expect(ret.failures).toBe(0)
    expect(ret.skipped).toBe(0)
    expect(ret.totalProcessed).toBe(2)

    const fh = new FileHelper(tmpFile)
    const fileContents = fh.read()

    FileHelper.DeleteFileIfExists(tmpFile)

    expect(fileContents).toBe(safeJsonToString(testdata))
  })

  test('no mapper', () => {
    const tmpFile = tmp.fileSync().name

    const dateNow = Date.now()

    const testdata = [
      {
        a: 1,
        b: '2',
        c: 3.14,
        d: { a: 'b' },
        e: dateNow,
      },
      {
        a: 1,
        b: '2',
        c: 3.14,
        d: { a: 'b' },
        e: dateNow,
      },
    ]

    const ret = FileHelper.writeArrayToJsonFile(tmpFile, testdata)

    expect(ret).toBeInstanceOf(InstrumentationStatistics)
    expect(ret.add).toBe(2)
    expect(ret.successes).toBe(1)
    expect(ret.failures).toBe(0)
    expect(ret.skipped).toBe(0)
    expect(ret.totalProcessed).toBe(2)

    const fh = new FileHelper(tmpFile)
    const fileContents = fh.read()

    FileHelper.DeleteFileIfExists(tmpFile)

    expect(fileContents).toBe(safeJsonToString(testdata))
  })
})
