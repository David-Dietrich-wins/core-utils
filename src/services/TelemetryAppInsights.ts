import { createLogger, format, transports } from 'winston'
import * as appInsights from 'applicationinsights'

const loggingLevels = {
  emerg: 0,
  alert: 1,
  crit: 2,
  error: 3,
  warning: 4,
  notice: 5,
  info: 6,
  debug: 7,
}

const logger = createLogger({
  level: 'info',
  levels: loggingLevels,
  format: format.json(),
  defaultMeta: { flowId: 0 },
  transports: [new transports.Console()],
})

export default class TelemetryAppInsights {
  public static setup() {
    console.log('TelemetryAppInsights setting up.')

    appInsights
      .setup()
      .setAutoCollectConsole(true)
      .setAutoCollectRequests(true)
      .setAutoCollectPerformance(true, true)
      .setAutoCollectExceptions(true)
      .setAutoCollectDependencies(true)
      .setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C)
      .start()
  }

  public static sendEvent(
    message: string,
    meta?: { [key: string]: string | boolean | number }
  ) {
    try {
      logger.info(message, meta)
    } catch (error) {
      console.error('Error sending event to AppInsights:', error)
    }
  }
}
