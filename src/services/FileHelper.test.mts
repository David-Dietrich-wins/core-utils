import { jest } from '@jest/globals'
import fs from 'node:fs'
import tmp from 'tmp'
import { FileHelper } from './FileHelper.mjs'
import { InstrumentationStatistics } from '../models/InstrumentationStatistics.mjs'
import { safeJsonToString } from './object-helper.mjs'

describe('DeleteFileIfExists', () => {
  test('good', async () => {
    const tmpFile = tmp.fileSync().name,

     stats = await FileHelper.writeArrayToJsonFile(tmpFile, [])
    fs.writeFileSync(tmpFile, '1\n2\n3\n4\n5\n\n# comment\n')

    const ret = FileHelper.DeleteFileIfExists(tmpFile)

    expect(ret).toBe(true)
    expect(stats.add).toBe(2)
    expect(stats.successes).toBe(1)
  })

  test('does not exist', () => {
    const filename = 'adsfasdfafpioupiupiuadfsiuapiudf.txt',

     ret = FileHelper.DeleteFileIfExists(filename)

    expect(ret).toBe(false)
  })
})

describe('addCommaIfNotFirst', () => {
  test('first', async () => {
    const fileContents = '',

     tmpFile = tmp.fileSync().name,

     retRun = await FileHelper.Run(tmpFile, async (fh) => {
      let bytesWritten = 0
      await fh.openForWrite()

      bytesWritten += await fh.addCommaIfNotFirst()

      bytesWritten += await fh.write(fileContents)

      return bytesWritten
    })

    expect(retRun).toEqual(0)

    const ret = FileHelper.ReadEntireFile(tmpFile)

    FileHelper.DeleteFileIfExists(tmpFile)

    expect(ret).toBe('')
  })

  test('not first', async () => {
    const fileContents = '',

     tmpFile = tmp.fileSync().name,

     retRun = await FileHelper.Run(tmpFile, async (fh) => {
      let bytesWritten = 0
      await fh.openForWrite()

      bytesWritten += await fh.addCommaIfNotFirst(1)

      bytesWritten += await fh.write(fileContents)

      return bytesWritten
    })

    expect(retRun).toBe(1)

    const ret = FileHelper.ReadEntireFile(tmpFile)

    FileHelper.DeleteFileIfExists(tmpFile)

    expect(ret).toBe(',')
  })
})

describe('write', () => {
  test('array of numbers', async () => {
    const fileContents = [1, 2, 3, 4, 5],

     tmpFile = tmp.fileSync().name,

     retRun = await FileHelper.Run(tmpFile, async (fh) => {
      await fh.openForWrite()

      return await fh.write(fileContents)
    })

    expect(retRun).toBe(11) // Length of '[1,2,3,4,5]'

    const ret = FileHelper.ReadEntireFile(tmpFile)

    FileHelper.DeleteFileIfExists(tmpFile)

    expect(ret).toBe('[1,2,3,4,5]')
  })

  test('array of strings', async () => {
    const fileContents = ['a', 'bc', 'def', 'ghij', 'klmno'],

     tmpFile = tmp.fileSync().name,

     retRun = await FileHelper.Run(tmpFile, async (fh) => {
      await fh.openForWrite()

      return await fh.write(fileContents)
    })

    expect(retRun).toBe(31) // Length of '["a","bc","def","ghij","klmno"]'

    const ret = FileHelper.ReadEntireFile(tmpFile)

    FileHelper.DeleteFileIfExists(tmpFile)

    expect(ret).toBe(safeJsonToString(fileContents))
  })

  test('object', async () => {
    const dateNow = Date.now(),
     fileContents = { a: 1, b: '2', c: 3.14, d: { a: 'b' }, e: dateNow },

     tmpFile = tmp.fileSync().name,

     retRun = await FileHelper.Run(tmpFile, async (fh) => {
      await fh.openForWrite()

      return await fh.write(fileContents)
    })

    expect(retRun).toBe(56) // Length of '{"a":1,"b":"2","c":3.14,"d":{"a":"b"},"e":<dateNow>}'

    const ret = FileHelper.ReadEntireFile(tmpFile)

    FileHelper.DeleteFileIfExists(tmpFile)

    expect(ret).toBe(safeJsonToString(fileContents))
  })

  test('string', async () => {
    const fileContents = 'hello',

     tmpFile = tmp.fileSync().name,

     retRun = await FileHelper.Run(tmpFile, async (fh) => {
      await fh.openForWrite()

      return await fh.write(fileContents)
    })

    expect(retRun).toBe(fileContents.length)

    const ret = FileHelper.ReadEntireFile(tmpFile)

    FileHelper.DeleteFileIfExists(tmpFile)

    expect(ret).toBe(fileContents)
  })

  test('undefined', async () => {
    const fileContents = undefined,

     tmpFile = tmp.fileSync().name,

     retRun = await FileHelper.Run(tmpFile, async (fh) => {
      await fh.openForWrite()

      return await fh.write(fileContents)
    })

    expect(retRun).toBe(0)

    const ret = FileHelper.ReadEntireFile(tmpFile)

    FileHelper.DeleteFileIfExists(tmpFile)

    expect(ret).toBe('')
  })

  test('file not opened first', async () => {
    const fileContents = 'hello',

     tmpFile = tmp.fileSync().name

    expect(
      async () =>
        await FileHelper.Run(tmpFile, async (fh) => await fh.write(fileContents))
    ).rejects.toThrow(
      `FileHelper: Cannot write to file, file handle is not open for ${tmpFile}.`
    )

    const ret = FileHelper.ReadEntireFile(tmpFile)

    FileHelper.DeleteFileIfExists(tmpFile)

    expect(ret).toBe('')
  })
})

describe('writeArrayToJsonFile', () => {
  test('good', async () => {
    const tmpFile = tmp.fileSync().name,

     dateNow = Date.now(),

     testdata = [
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
    ],

     ret = await FileHelper.writeArrayToJsonFile(
      tmpFile,
      testdata,
      (item) => {
        if (item.a === 1) {
          item.a = 2
        }

        return item
      }
    )

    expect(ret).toBeInstanceOf(InstrumentationStatistics)
    expect(ret.add).toBe(115)
    expect(ret.failures).toBe(0)
    expect(ret.skipped).toBe(0)
    expect(ret.totalProcessed).toBe(0)
    expect(ret.successes).toBe(1)

    const fileContents = FileHelper.ReadEntireFile(tmpFile)

    FileHelper.DeleteFileIfExists(tmpFile)

    expect(fileContents).toBe(safeJsonToString(testdata))
  })

  test('write exception', async () => {
    const tmpFile = tmp.fileSync().name,

     dateNow = Date.now(),

     testdata = [
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
    ],

     spy = jest
      .spyOn(FileHelper.prototype, 'write')
      .mockRejectedValue(new Error('Mocked error'))

    try {
      const ret = await FileHelper.writeArrayToJsonFile(
        tmpFile,
        testdata,
        (item) => {
          if (item.a === 1) {
            item.a = 2
          }

          return item
        }
      )
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toMatch(/^FileHelper: Error writing to file/i)
    } finally {
      FileHelper.DeleteFileIfExists(tmpFile)
    }

    expect(spy).toHaveBeenCalledTimes(1)
    spy.mockRestore()

    expect.assertions(3)
  })

  test('no mapper', async () => {
    const tmpFile = tmp.fileSync().name,

     dateNow = Date.now(),

     testdata = [
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
    ],

     ret = await FileHelper.writeArrayToJsonFile(tmpFile, testdata)

    expect(ret).toBeInstanceOf(InstrumentationStatistics)
    expect(ret.add).toBe(115)
    expect(ret.failures).toBe(0)
    expect(ret.skipped).toBe(0)
    expect(ret.totalProcessed).toBe(0)
    expect(ret.successes).toBe(1)

    const fileContents = FileHelper.ReadEntireFile(tmpFile)

    FileHelper.DeleteFileIfExists(tmpFile)

    expect(fileContents).toBe(safeJsonToString(testdata))
  })
})

describe('openForRead', () => {
  test('readLines', async () => {
    const tmpFile = tmp.fileSync().name
    fs.writeFileSync(tmpFile, 'hello world')

    const retRun = await FileHelper.Run(tmpFile, async (fh) => {
      await fh.openForRead()

      return await fh.readLines()
    })

    expect(retRun).toEqual(['hello world'])

    const ret = FileHelper.ReadEntireFile(tmpFile)

    FileHelper.DeleteFileIfExists(tmpFile)

    expect(ret).toBe('hello world')
  })

  test('file not open', async () => {
    const tmpFile = tmp.fileSync().name
    fs.writeFileSync(tmpFile, 'hello world')

    expect(
      async () =>
        await FileHelper.Run(tmpFile, async (fh) => await fh.readLines())
    ).rejects.toThrow(
      `FileHelper: Cannot read from file, file handle is not open for ${tmpFile}.`
    )

    const ret = FileHelper.ReadEntireFile(tmpFile)

    FileHelper.DeleteFileIfExists(tmpFile)

    expect(ret).toBe('hello world')
  })
})

test('write', async () => {
  const tmpFile = tmp.fileSync().name,

   fh = new FileHelper(tmpFile),
   spy = jest
    .spyOn(fh, 'write')
    .mockRejectedValue(new Error('Mocked error'))
  await fh.openForWrite()
  try {
    const retRun = await fh.write('hello world')

    expect(retRun).toBe(11)
  } catch (error) {
    expect(error).toEqual(new Error('Mocked error'))
    expect(spy).toHaveBeenCalledWith('hello world')
  } finally {
    await fh.close()

    FileHelper.DeleteFileIfExists(tmpFile)
  }

  expect(spy).toHaveBeenCalledTimes(1)
  spy.mockRestore()
})
