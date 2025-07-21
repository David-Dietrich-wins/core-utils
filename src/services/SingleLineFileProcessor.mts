import { InstrumentationStatistics } from '../models/InstrumentationStatistics.mjs'
import { LogManager } from './LogManager.mjs'
import { existsSync } from 'node:fs'
import { hasData } from './general.mjs'
import { open } from 'node:fs/promises'
import { safestrTrim } from './string-helper.mjs'

export type SingleLineFileProcessorConfig<T = unknown> = {
  fileName: string
  logger: LogManager
  typeName: string
  trimLine?: boolean
  action: (safeLine: string) => Promise<T>
}

export class SingleLineFileProcessor<T = unknown> {
  constructor(public config: SingleLineFileProcessorConfig<T>) {}

  async openExistingFile(stats: InstrumentationStatistics) {
    const { fileName, logger, typeName } = this.config

    if (!existsSync(fileName)) {
      logger.error('File not found:', fileName)

      stats.addFailure(`File not found: ${fileName}.`)
      return
    }

    logger.info('Processing', typeName, 'file:', fileName)

    return open(fileName, 'r')
  }

  /**
   * Processes a file line by line, executing the provided action for each non-empty, non-comment line.
   * @returns An instance of InstrumentationStatistics containing the results of the processing.
   */
  async processFile() {
    const stats = new InstrumentationStatistics(),
      { action, fileName, logger, trimLine = true, typeName } = this.config

    let lineNumber = 1

    const file = await this.openExistingFile(stats)
    if (file) {
      for await (const line of file.readLines()) {
        const safeLine = safestrTrim(line)
        if (!hasData(safeLine)) {
          stats.addSkipped()

          logger.info('Processing line', lineNumber, 'SKIP EMPTY LINE')
        } else if (safeLine.startsWith('#')) {
          stats.addSkipped()

          logger.info(
            'Processing line',
            lineNumber,
            `${typeName}:`,
            safeLine,
            'SKIP COMMENT LINE'
          )
        } else {
          logger.info(
            'Processing line',
            lineNumber,
            `${typeName}:`,
            safeLine,
            'START'
          )

          try {
            await action(trimLine ? safeLine : line)

            stats.addSuccess()
          } catch (error) {
            stats.addFailure()

            logger.error('Error processing line', lineNumber, error)
          }

          logger.info(
            'Processing line',
            lineNumber,
            `${typeName}:`,
            safeLine,
            'END'
          )
        }

        lineNumber++
      }

      logger.info(
        'Finished processing',
        typeName,
        'file:',
        fileName,
        'with',
        lineNumber,
        'lines'
      )
    }

    stats.finished()
    return stats
  }
}
