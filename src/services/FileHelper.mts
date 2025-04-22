import fs from 'node:fs'
import { InstrumentationStatistics } from '../models/InstrumentationStatistics.mjs'
import { safestr } from './string-helper.mjs'
import { isObject } from './object-helper.mjs'
import { isArray } from './array-helper.mjs'
import { safeArray } from './array-helper.mjs'

export class FileHelper {
  fsid = 0

  constructor(private filename: string) {}

  static DeleteFileIfExists(filename: string) {
    if (fs.existsSync(filename)) {
      fs.unlinkSync(filename)

      return true
    }

    return false
  }

  close() {
    fs.closeSync(this.fsid)
  }

  openForWrite() {
    this.fsid = fs.openSync(this.filename, 'w')

    return this.fsid
  }

  read() {
    return fs.readFileSync(this.filename, 'utf8')
  }

  write(str: unknown, prefix = '', suffix = '') {
    const strToWrite =
      isObject(str) || isArray(str)
        ? JSON.stringify(str)
        : (str ?? '').toString()

    return fs.writeSync(
      this.fsid,
      safestr(prefix) + strToWrite + safestr(suffix)
    )
  }

  addCommaIfNotFirst(iterationNumber = 0) {
    if (iterationNumber > 0) {
      return this.write(',')
    }

    return 0
  }

  static writeArrayToJsonFile<T extends object = object>(
    filename: string,
    arrT: T[],
    mapFn?: (item: T) => object
  ) {
    const stats = new InstrumentationStatistics()

    FileHelper.DeleteFileIfExists(filename)

    const fw = new FileHelper(filename)
    fw.openForWrite()
    fw.write('[')

    safeArray(arrT).forEach((item, i) => {
      const mappedItem = mapFn ? mapFn(item) : item

      fw.addCommaIfNotFirst(i)
      fw.write(mappedItem)

      stats.added()
    })

    fw.write(']')
    fw.close()

    ++stats.successes

    return stats
  }
}
