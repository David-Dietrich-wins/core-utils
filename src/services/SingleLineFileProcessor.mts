import fs from 'fs'
import { open } from 'node:fs/promises'
import { MgmLogger } from './MgmLogger.mjs'
import { hasData, safestrTrim } from './general.mjs'
import { InstrumentationStatistics } from '../models/InstrumentationStatistics.mjs'

export type SingleLineFileProcessorConfig<T = unknown> = {
  fileName: string
  logger: MgmLogger
  typeName: string
  trimLine?: boolean
  action: (safeLine: string) => Promise<T>
}

export class SingleLineFileProcessor<T = unknown> {
  constructor(public config: SingleLineFileProcessorConfig<T>) {}

  async processFile() {
    const stats = new InstrumentationStatistics()

    const { action, fileName, logger, trimLine = true, typeName } = this.config

    if (!fs.existsSync(fileName)) {
      logger.error('File not found:', fileName)

      stats.addFailure(`File not found: ${fileName}.`)
      return stats
    }

    logger.info('Processing', typeName, 'file:', fileName)

    let lineNumber = 1

    const file = await open(fileName, 'r')
    if (file) {
      for await (const line of file.readLines()) {
        const safeLine = safestrTrim(line)
        if (!hasData(safeLine)) {
          stats.addSkipped()

          logger.info('Processing line', lineNumber, 'SKIP EMPTY LINE')
        } else if (safeLine.startsWith('#')) {
          stats.addSkipped()

          logger.info('Processing line', lineNumber, `${typeName}:`, safeLine, 'SKIP COMMENT LINE')
        } else {
          logger.info('Processing line', lineNumber, `${typeName}:`, safeLine, 'START')

          try {
            await action(trimLine ? safeLine : line)

            stats.addSuccess()
          } catch (error) {
            stats.addFailure()

            logger.error('Error processing line', lineNumber, error)
          }

          logger.info('Processing line', lineNumber, `${typeName}:`, safeLine, 'END')
        }

        lineNumber++
      }
    }

    logger.info('Finished processing', typeName, 'file:', fileName, 'with', lineNumber, 'lines')

    return stats
  }
}
