import { HTTP_BadRequest, HTTP_Ok, MgmException } from '../models/MgmExceptionTypes.js'
import TelemetryAppInsights from './TelemetryAppInsights.js'

const CONST_HttpHeaderApplicationJson = { 'Content-Type': 'application/json' }

export default class AzureHelper {
  static contextTextResponse(body: unknown, httpStatusCode = HTTP_Ok) {
    if (HTTP_Ok !== httpStatusCode) {
      return {
        body,
        status: httpStatusCode,
      }
    }

    return {
      // defaulted to text/plain in context.res
      // headers: { 'Content-Type': 'text/plain' },
      body,
    }
  }

  static contextJsonResponse(body: unknown, httpStatusCode = 200) {
    if (HTTP_Ok !== httpStatusCode) {
      return {
        body,
        headers: CONST_HttpHeaderApplicationJson,
        status: httpStatusCode,
      }
    }

    return {
      body,
      headers: CONST_HttpHeaderApplicationJson,
    }
  }

  static ExceptionWrapper(
    telEventName: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    err: any,
    errorMessageDefault: string,
    telemetryBody: {
      featureId: string
      flowId: string
      [key: string]: string | boolean | number
    }
  ) {
    let errmsg = err?.message ?? errorMessageDefault

    AzureHelper.TelemetryMessage(telEventName, telEventName, {
      ...telemetryBody,
      flowStep: 'flowStep',
      returnMessage: errmsg,
    })

    if (err instanceof MgmException && err.obj?.jsonError?.data) {
      errmsg = err.obj?.jsonError?.data
    }

    return AzureHelper.contextJsonResponse({
      code: HTTP_BadRequest,
      message: errmsg,
    })
  }

  static TelemetryMessage(
    aiMessageName: string,
    errorPrefix: string,
    body: {
      featureId: string
      flowId: string
      flowStep: string
      [key: string]: string | boolean | number
    }
  ) {
    try {
      TelemetryAppInsights.sendEvent(aiMessageName, body)
    } catch (error) {
      console.error(
        `${errorPrefix}-`,
        body.featureId,
        ': Error sending event to AppInsights:',
        error
      )
    }
  }
}
