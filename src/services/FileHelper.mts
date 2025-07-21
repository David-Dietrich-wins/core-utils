import { FileHandle, open } from 'node:fs/promises'
import { isArray, safeArray } from './array-helper.mjs'
import { AppException } from '../models/AppException.mjs'
import { InstrumentationStatistics } from '../models/InstrumentationStatistics.mjs'
import fs from 'node:fs'
import { isObject } from './object-helper.mjs'
import { safestr } from './string-helper.mjs'

export class FileHelper {
  filename: string = ''
  fileHandle: FileHandle | undefined

  constructor(filename: string) {
    this.filename = filename
  }

  static async Run<T>(filename: string, fn: (fh: FileHelper) => Promise<T>) {
    const fileHelper = new FileHelper(filename)

    try {
      return await fn(fileHelper)
    } catch (error) {
      throw new AppException(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `FileHelper: Error processing file ${filename}: ${error}`
      )
    } finally {
      await fileHelper.close()
    }
  }

  static async writeArrayToJsonFile<T extends object = object>(
    filename: string,
    arrT: T[],
    mapFn?: (item: T) => object
  ) {
    const stats = new InstrumentationStatistics()

    FileHelper.DeleteFileIfExists(filename)

    const fw = new FileHelper(filename)
    try {
      await fw.openForWrite()
      stats.add += await fw.write('[')

      let i = 0
      for (const item of safeArray(arrT)) {
        const mappedItem = mapFn ? mapFn(item) : item

        // eslint-disable-next-line no-await-in-loop
        stats.add += await fw.addCommaIfNotFirst(i)
        // eslint-disable-next-line no-await-in-loop
        stats.add += await fw.write(mappedItem)

        ++i
      }

      stats.add += await fw.write(']')

      ++stats.successes

      return stats
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      stats.addFailure(`Error writing to file ${filename}: ${error}`)
      throw new AppException(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `FileHelper: Error writing to file ${filename}: ${error}`
      )
    } finally {
      await fw.close()
    }
  }

  // Static async FileHandleAutoClose(path: string, fileFlags = 'r') {
  //   Const fh = await open(path, fileFlags)

  //   Return {
  //     FileHandle: fh,
  //     [Symbol.asyncDispose]: async () => {
  //       Await fh.close()
  //     },
  //   }
  // }

  async addCommaIfNotFirst(iterationNumber = 0) {
    if (iterationNumber > 0) {
      return await this.write(',')
    }

    return 0
  }

  static DeleteFileIfExists(filename: string) {
    if (fs.existsSync(filename)) {
      fs.unlinkSync(filename)

      return true
    }

    return false
  }

  static ReadEntireFile(filename: string) {
    return fs.readFileSync(filename, 'utf8')
  }

  async close() {
    await this.fileHandle?.close()

    this.fileHandle = undefined
  }

  async open(openMode) {
    await this.close()

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    this.fileHandle = await open(this.filename, openMode)

    return this.fileHandle
  }

  async openForRead() {
    return this.open('r')
  }

  async openForWrite() {
    return this.open('w')
  }

  async readLines() {
    if (!this.fileHandle) {
      throw new AppException(
        `FileHelper: Cannot read from file, file handle is not open for ${this.filename}.`
      )
    }

    const lines: string[] = []
    for await (const line of this.fileHandle.readLines()) {
      lines.push(line)
    }

    return lines
  }

  async write(str: unknown, prefix = '', suffix = '') {
    const strToWrite =
      isObject(str) || isArray(str) ? JSON.stringify(str) : safestr(str)

    if (!this.fileHandle) {
      throw new AppException(
        `FileHelper: Cannot write to file, file handle is not open for ${this.filename}.`
      )
    }

    const ret = await this.fileHandle.write(
      safestr(prefix) + strToWrite + safestr(suffix)
    )

    return ret.bytesWritten
  }
}
