/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from 'crypto'
import https from 'https'
import axios, { AxiosRequestConfig, AxiosResponse, isAxiosError } from 'axios'
import { safestr, urlJoin } from '../services/general.mjs'
import { MgmLogger } from './MgmLogger.mjs'
import { ApiWrapper } from '../models/ApiWrapper.mjs'
import { GrayArrowExceptionHttpNotAllowed } from '../models/GrayArrowException.mjs'
import { ApiProps } from '../models/types.mjs'

export interface IApiRepository {
  logInfo(msg: string): void

  getKeyForSaving(key: string): string
  handleAxiosError(
    fname: string,
    err: any,
    relativePath: string,
    saveKey: string,
    requestBody: any
    // errorMessage?: IMgmErrorMessage
  ): GrayArrowExceptionHttpNotAllowed<Record<string, any>>

  httpGet<TResponse, TRequestConfig>(
    fname: string,
    keyForSaving: string,
    relativePath?: string,
    requestConfig?: AxiosRequestConfig<TRequestConfig>
    // errorMessage?: IMgmErrorMessage
  ): Promise<TResponse>
  httpGetRaw<TResponse, TReguestConfig>(
    fname: string,
    keyForSaving: string,
    relativePath?: string,
    requestConfig?: AxiosRequestConfig<TReguestConfig>
    // errorMessage?: IMgmErrorMessage
  ): Promise<AxiosResponse<TResponse>>

  httpPost<TResponse, TReguestBody>(
    fname: string,
    keyForSaving: string,
    relativePath: string | undefined,
    requestConfig: AxiosRequestConfig,
    requestBody?: TReguestBody
    // errorMessage?: IMgmErrorMessage
  ): Promise<TResponse>
  httpPostRaw<TResponse, TRequestBody>(
    fname: string,
    keyForSaving: string,
    relativePath: string | undefined,
    requestConfig: AxiosRequestConfig,
    requestBody?: TRequestBody
    // errorMessage?: IMgmErrorMessage
  ): Promise<AxiosResponse<TResponse>>
}

export const saveApiCall = (
  fname: string,
  url: string,
  key: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: any
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const saveInternal = (obj: any) => {
  //   if (obj && isObject(obj)) {
  //     if (obj instanceof AxiosError) {
  //       obj = obj.response?.data
  //     }
  //   }

  //   if (isObject(obj) || isArray(obj)) {
  //     return safestrToJson(safeJsonToString(response))
  //   }

  //   return obj
  // }

  // const cyclicSafeRequest = saveInternal(request)
  // const cyclicSafeResponse = saveInternal(response)

  fname = safestr(fname, saveApiCall.name)

  console.log(
    fname,
    '--',
    url,
    key,
    ', Response:',
    safestr(response?.statusText)
  )

  // if (isAxiosError(response)) {
  //   throw new GrayArrowExceptionHttpNotAllowed(key, response.response?.data)
  // }
}

export class ApiRepository implements IApiRepository {
  private logger: MgmLogger

  constructor(
    public apiProps: ApiProps,
    public loggerComponentName = '',
    public saveKeyPrefix = 'api-'
  ) {
    // if (!apiProps?.logFilename) {
    //   throw new GrayArrowException(
    //     'You must provide a log Filename for API logging.',
    //     ApiRepository.name
    //   )
    // }

    this.logger = MgmLogger.createInstance({
      componentName: safestr(loggerComponentName, ApiRepository.name),
      rotateBaseFileName: apiProps.logFilename ?? 'gaming-services-library',
      logLevel: apiProps.logLevel,
    })
  }

  logInfo(msg: string) {
    this.logger.info(msg)
  }

  getApiUrl(path?: string) {
    return urlJoin(this.apiProps.baseUrl, safestr(path))
  }

  getKeyForSaving(key: string) {
    return `${this.saveKeyPrefix}${key}`
  }

  handleAxiosErrorRaw(fname: string, err: any, url: string, saveKey: string) {
    let jsonError: Record<string, any> | undefined

    let errmsg = safestr(err.message)
    this.logger.error(`${fname}: ${errmsg}`)

    if (isAxiosError(err)) {
      jsonError = err.toJSON()

      this.logger.error(jsonError)
    }

    if (err.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(fname, 'headers:', err.response.headers)
      console.log(fname, 'status:', err.response.status)
      console.log(fname, 'data:', err.response.data)

      if (err.response.data.ErrorMessage) {
        errmsg = err.response.data.ErrorMessage
      }
    } else if (err.message) {
      // Something happened in setting up the request that triggered an Error
      console.log(fname, 'Error:', err.message)
    }

    if (err.config) {
      console.log(fname, 'config:', err.config)
    }

    // Something happened in setting up the request that triggered an Error
    console.log(this.handleAxiosErrorRaw.name, fname, errmsg)
    saveApiCall(fname, url, saveKey, errmsg)

    return { errmsg, fname, jsonError }
  }

  handleAxiosError(fname: string, err: any, url: string, saveKey: string) {
    const errCracked = this.handleAxiosErrorRaw(fname, err, url, saveKey)
    // console.log(error.config);
    return new GrayArrowExceptionHttpNotAllowed(
      errCracked.errmsg,
      fname,
      errCracked.jsonError
    )
  }

  async httpGet<TResponse, TRequestConfig = unknown>(
    fname: string,
    keyForSaving: string,
    relativePath: string | undefined,
    requestConfig: AxiosRequestConfig<TRequestConfig>
  ) {
    const apiResponse = await this.httpGetRaw<TResponse, TRequestConfig>(
      fname,
      keyForSaving,
      relativePath,
      requestConfig
    )

    return apiResponse.data
  }

  async httpGetRaw<TResponse, TRequestConfig = undefined>(
    fname: string,
    keyForSaving: string,
    relativePath: string | undefined,
    requestConfig: AxiosRequestConfig<TRequestConfig>
  ) {
    const saveKey = this.getKeyForSaving(keyForSaving)
    const url = this.getApiUrl(relativePath)

    try {
      requestConfig.httpsAgent =
        this.allowLegacyRenegotiationforNodeJsOptions.httpsAgent
      // this.logInfo(`login: ${safeJsonToString(loginRequest)}.`)
      const apiResponse = await axios.get<
        TResponse,
        AxiosResponse<TResponse>,
        TRequestConfig
      >(url, requestConfig)
      saveApiCall(fname, url, saveKey, apiResponse)

      // if (res.status >= 200 && res.status < 300) {
      //   // if (res.data?.IsPINLocked) {
      //   //   this.logInfo(`Pin locked for user: ${loginRequest.UserName}.`)

      //   //   throw new GrayArrowExceptionHttpForbidden('PIN Locked', this.login.name)
      //   // }

      //   this.logInfo(
      //     `Successful login for user: ${
      //       loginRequest.UserName
      //     }, ${safeJsonToString(res.data)}.`
      //   )

      return apiResponse
    } catch (err) {
      const mgmex = this.handleAxiosError(fname, err, url, saveKey)

      throw mgmex
    }
  }

  async httpPost<TResponse, TRequestBody = unknown>(
    fname: string,
    keyForSaving: string,
    relativePath: string | undefined,
    requestConfig: AxiosRequestConfig,
    requestBody?: TRequestBody
  ) {
    const apiResponse = await this.httpPostRaw<TResponse, TRequestBody>(
      fname,
      keyForSaving,
      relativePath,
      requestConfig,
      requestBody
    )

    return apiResponse.data
  }

  /**
   * Handle this problem with Node 18
   * write EPROTO B8150000:error:0A000152:SSL routines:final_renegotiate:unsafe legacy renegotiation disabled
   * see https://stackoverflow.com/questions/74324019/allow-legacy-renegotiation-for-nodejs/74600467#74600467
   **/
  allowLegacyRenegotiationforNodeJsOptions = {
    httpsAgent: new https.Agent({
      // for self signed you could also add
      // rejectUnauthorized: false,
      // allow legacy server
      secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
    }),
  }

  async httpPostRaw<TResponse, TRequestBody = unknown>(
    fname: string,
    keyForSaving: string,
    relativePath: string | undefined,
    requestConfig: AxiosRequestConfig,
    requestBody?: TRequestBody
  ) {
    const saveKey = this.getKeyForSaving(keyForSaving)
    const url = this.getApiUrl(relativePath)

    try {
      requestConfig.httpsAgent =
        this.allowLegacyRenegotiationforNodeJsOptions.httpsAgent
      // this.logInfo(`login: ${safeJsonToString(loginRequest)}.`)
      const apiResponse = await axios.post<
        TResponse,
        AxiosResponse<TResponse>,
        TRequestBody
      >(url, requestBody, requestConfig)
      saveApiCall(fname, url, saveKey, apiResponse)

      // if (res.status >= 200 && res.status < 300) {
      //   // if (res.data?.IsPINLocked) {
      //   //   this.logInfo(`Pin locked for user: ${loginRequest.UserName}.`)

      //   //   throw new GrayArrowExceptionHttpForbidden('PIN Locked', this.login.name)
      //   // }

      //   this.logInfo(
      //     `Successful login for user: ${
      //       loginRequest.UserName
      //     }, ${safeJsonToString(res.data)}.`
      //   )

      return apiResponse
    } catch (err) {
      const mgmex = this.handleAxiosError(fname, err, url, saveKey)

      throw mgmex
    }
  }

  static sendApiSuccess<T>(returnData?: T) {
    return ApiRepository.sendApiWrappedResponse(
      'success',
      undefined,
      undefined,
      returnData
    )
  }

  static sendApiWrappedResponse<T = unknown>(
    result = '',
    msg = '',
    responseCode = 0,
    returnData?: T
  ) {
    const apiwrap = new ApiWrapper<T>(result, msg, responseCode, returnData)

    return apiwrap
  }
}
