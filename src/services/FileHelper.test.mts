/* eslint-disable jest/no-conditional-expect */
/* eslint-disable jest/no-conditional-in-test */
import * as fs from 'node:fs'
import { describe, expect, it, jest } from '@jest/globals'
import { FileHelper } from './FileHelper.mjs'
import { InstrumentationStatistics } from '../models/InstrumentationStatistics.mjs'
import { safeJsonToString } from '../primitives/object-helper.mjs'
import tmp from 'tmp'

describe('deleteFileIfExists', () => {
  it('good', async () => {
    expect.assertions(3)

    const atmpFile = tmp.fileSync().name,
      stats = await FileHelper.writeArrayToJsonFile(atmpFile, [])
    fs.writeFileSync(atmpFile, '1\n2\n3\n4\n5\n\n# comment\n')

    const ret = FileHelper.DeleteFileIfExists(atmpFile)

    expect(ret).toBe(true)
    expect(stats.add).toBe(2)
    expect(stats.successes).toBe(1)
  })

  it('does not exist', () => {
    expect.assertions(1)

    const filename = 'adsfasdfafpioupiupiuadfsiuapiudf.txt',
      ret = FileHelper.DeleteFileIfExists(filename)

    expect(ret).toBe(false)
  })
})

describe('addCommaIfNotFirst', () => {
  it('first', async () => {
    expect.assertions(2)

    const atmpFile = tmp.fileSync().name,
      fileContents = '',
      retRun = await FileHelper.Run(atmpFile, async (fh) => {
        let bytesWritten = 0
        await fh.openForWrite()

        bytesWritten += await fh.addCommaIfNotFirst()

        bytesWritten += await fh.write(fileContents)

        return bytesWritten
      })

    expect(retRun).toBe(0)

    const ret = FileHelper.ReadEntireFile(atmpFile)

    FileHelper.DeleteFileIfExists(atmpFile)

    expect(ret).toBe('')
  })

  it('not first', async () => {
    expect.assertions(2)

    const atmpFile = tmp.fileSync().name,
      fileContents = '',
      retRun = await FileHelper.Run(atmpFile, async (fh) => {
        let bytesWritten = 0
        await fh.openForWrite()

        bytesWritten += await fh.addCommaIfNotFirst(1)

        bytesWritten += await fh.write(fileContents)

        return bytesWritten
      })

    expect(retRun).toBe(1)

    const ret = FileHelper.ReadEntireFile(atmpFile)

    FileHelper.DeleteFileIfExists(atmpFile)

    expect(ret).toBe(',')
  })
})

describe('write', () => {
  it('array of numbers', async () => {
    expect.assertions(2)

    const atmpFile = tmp.fileSync().name,
      fileContents = [1, 2, 3, 4, 5],
      retRun = await FileHelper.Run(atmpFile, async (fh) => {
        await fh.openForWrite()

        return await fh.write(fileContents)
      })

    expect(retRun).toBe(11)

    const ret = FileHelper.ReadEntireFile(atmpFile)

    FileHelper.DeleteFileIfExists(atmpFile)

    expect(ret).toBe('[1,2,3,4,5]')
  })

  it('array of strings', async () => {
    expect.assertions(2)

    const atmpFile = tmp.fileSync().name,
      fileContents = ['a', 'bc', 'def', 'ghij', 'klmno'],
      retRun = await FileHelper.Run(atmpFile, async (fh) => {
        await fh.openForWrite()

        return await fh.write(fileContents)
      })

    expect(retRun).toBe(31)

    const ret = FileHelper.ReadEntireFile(atmpFile)

    FileHelper.DeleteFileIfExists(atmpFile)

    expect(ret).toBe(safeJsonToString(fileContents))
  })

  it('object', async () => {
    expect.assertions(2)

    const atmpFile = tmp.fileSync().name,
      dateNow = Date.now(),
      fileContents = { a: 1, b: '2', c: 3.14, d: { a: 'b' }, e: dateNow },
      retRun = await FileHelper.Run(atmpFile, async (fh) => {
        await fh.openForWrite()

        return await fh.write(fileContents)
      })

    expect(retRun).toBe(56)

    const ret = FileHelper.ReadEntireFile(atmpFile)

    FileHelper.DeleteFileIfExists(atmpFile)

    expect(ret).toBe(safeJsonToString(fileContents))
  })

  it('string', async () => {
    expect.assertions(2)

    const atmpFile = tmp.fileSync().name,
      fileContents = 'hello',
      retRun = await FileHelper.Run(atmpFile, async (fh) => {
        await fh.openForWrite()

        return await fh.write(fileContents)
      })

    expect(retRun).toBe(fileContents.length)

    const ret = FileHelper.ReadEntireFile(atmpFile)

    FileHelper.DeleteFileIfExists(atmpFile)

    expect(ret).toBe(fileContents)
  })

  it('undefined', async () => {
    expect.assertions(2)

    const atmpFile = tmp.fileSync().name,
      fileContents = undefined,
      retRun = await FileHelper.Run(atmpFile, async (fh) => {
        await fh.openForWrite()

        return await fh.write(fileContents)
      })

    expect(retRun).toBe(0)

    const ret = FileHelper.ReadEntireFile(atmpFile)

    FileHelper.DeleteFileIfExists(atmpFile)

    expect(ret).toBe('')
  })

  it('file not opened first', async () => {
    expect.assertions(2)

    const fileContents = 'hello',
      tmpFile = tmp.fileSync().name

    await expect(
      async () =>
        await FileHelper.Run(
          tmpFile,
          async (fh) => await fh.write(fileContents)
        )
    ).rejects.toThrow(
      `FileHelper: Cannot write to file, file handle is not open for ${tmpFile}.`
    )

    const ret = FileHelper.ReadEntireFile(tmpFile)

    FileHelper.DeleteFileIfExists(tmpFile)

    expect(ret).toBe('')
  })

  // eslint-disable-next-line jest/prefer-ending-with-an-expect
  it('write exception', async () => {
    expect.assertions(3)

    const atmpFile = tmp.fileSync().name,
      fh = new FileHelper(atmpFile),
      spy = jest.spyOn(fh, 'write').mockRejectedValue(new Error('Mocked error'))
    await fh.openForWrite()
    try {
      const retRun = await fh.write('hello world')

      expect(retRun).toBe(11)
    } catch (error) {
      expect(error).toStrictEqual(new Error('Mocked error'))
      expect(spy).toHaveBeenCalledWith('hello world')
    } finally {
      await fh.close()

      FileHelper.DeleteFileIfExists(atmpFile)
    }

    expect(spy).toHaveBeenCalledTimes(1)

    spy.mockRestore()
  })
})

describe('writeArrayToJsonFile', () => {
  it('good', async () => {
    expect.assertions(7)

    const atmpFile = tmp.fileSync().name,
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
      zret = await FileHelper.writeArrayToJsonFile(
        atmpFile,
        testdata,
        (item) => {
          if (item.a === 1) {
            item.a = 2
          }

          return item
        }
      )

    expect(zret).toBeInstanceOf(InstrumentationStatistics)
    expect(zret.add).toBe(115)
    expect(zret.failures).toBe(0)
    expect(zret.skipped).toBe(0)
    expect(zret.totalProcessed).toBe(0)
    expect(zret.successes).toBe(1)

    const fileContents = FileHelper.ReadEntireFile(atmpFile)

    FileHelper.DeleteFileIfExists(atmpFile)

    expect(fileContents).toBe(safeJsonToString(testdata))
  })

  it('write exception', async () => {
    expect.assertions(3)

    const atmpFile = tmp.fileSync().name,
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
      zspy = jest
        .spyOn(FileHelper.prototype, 'write')
        .mockRejectedValue(new Error('Mocked error'))

    try {
      await FileHelper.writeArrayToJsonFile(atmpFile, testdata, (item) => {
        if (item.a === 1) {
          item.a = 2
        }

        return item
      })
    } catch (error) {
      expect(error).toBeInstanceOf(Error)

      if (error instanceof Error) {
        expect(error.message).toMatch(/^FileHelper: Error writing to file/iu)
      }
    } finally {
      FileHelper.DeleteFileIfExists(atmpFile)
    }

    expect(zspy).toHaveBeenCalledTimes(1)

    zspy.mockRestore()

    expect.assertions(3)
  })

  it('no mapper', async () => {
    expect.assertions(7)

    const atmpFile = tmp.fileSync().name,
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
      zret = await FileHelper.writeArrayToJsonFile(atmpFile, testdata)

    expect(zret).toBeInstanceOf(InstrumentationStatistics)
    expect(zret.add).toBe(115)
    expect(zret.failures).toBe(0)
    expect(zret.skipped).toBe(0)
    expect(zret.totalProcessed).toBe(0)
    expect(zret.successes).toBe(1)

    const fileContents = FileHelper.ReadEntireFile(atmpFile)

    FileHelper.DeleteFileIfExists(atmpFile)

    expect(fileContents).toBe(safeJsonToString(testdata))
  })
})

describe('openForRead', () => {
  it('readLines', async () => {
    expect.assertions(2)

    const tmpFile = tmp.fileSync().name
    fs.writeFileSync(tmpFile, 'hello world')

    const retRun = await FileHelper.Run(tmpFile, async (fh) => {
      await fh.openForRead()

      return await fh.readLines()
    })

    expect(retRun).toStrictEqual(['hello world'])

    const ret = FileHelper.ReadEntireFile(tmpFile)

    FileHelper.DeleteFileIfExists(tmpFile)

    expect(ret).toBe('hello world')
  })

  it('file not open', async () => {
    expect.assertions(2)

    const tmpFile = tmp.fileSync().name
    fs.writeFileSync(tmpFile, 'hello world')

    await expect(
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
