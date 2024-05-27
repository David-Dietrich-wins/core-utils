import fs from 'fs'
import readline from 'readline'
import { MgmLogger } from './MgmLogger'
import { hasData, safestrTrim } from './general'

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
    const { action, fileName, logger, trimLine = true, typeName } = this.config

    if (!fs.existsSync(fileName)) {
      logger.error('File not found:', fileName)
      return
    }
    logger.info('Processing', typeName, 'file:', fileName)

    const fileStream = fs.createReadStream(fileName)

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    })
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.

    let lineNumber = 1
    for await (const line of rl) {
      const safeLine = safestrTrim(line)
      if (!hasData(safeLine)) {
        logger.info('Processing line', lineNumber, 'SKIP EMPTY LINE')
      } else if (safeLine.startsWith('#')) {
        logger.info('Processing line', lineNumber, `${typeName}:`, safeLine, 'SKIP COMMENT LINE')
      } else {
        logger.info('Processing line', lineNumber, `${typeName}:`, safeLine, 'START')

        try {
          await action(trimLine ? safeLine : line)
        } catch (error) {
          logger.error('Error processing line', lineNumber, error)
        }

        logger.info('Processing line', lineNumber, `${typeName}:`, safeLine, 'END')
      }

      lineNumber++
    }

    logger.info('Finished processing', typeName, 'file:', fileName, 'with', lineNumber, 'lines')

    return lineNumber
  }
}
