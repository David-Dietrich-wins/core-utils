/* eslint-disable @typescript-eslint/no-explicit-any */
import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import crypto from 'crypto'
import https from 'https'
import { safestr, urlJoin } from '../services/general'
import { MgmLogger } from './MgmLogger'
import { ApiWrapper } from './ApiWrapper'
import { MgmExceptionHttp, MgmExceptionHttpNotAllowed } from '../models/MgmExceptionTypes'
import { ApiProps } from '../models/types'
import { IMgmErrorMessage } from '../models/interfaces'

export interface IApiRepository {
  logInfo(msg: string): void

  getKeyForSaving(key: string): string
  handleAxiosError(
    fname: string,
    err: any,
    relativePath: string,
    saveKey: string,
    requestBody: any,
    errorMessage?: IMgmErrorMessage
  ): void

  httpGet<TResponse, TRequestConfig>(
    fname: string,
    keyForSaving: string,
    relativePath?: string,
    requestConfig?: AxiosRequestConfig<TRequestConfig>,
    errorMessage?: IMgmErrorMessage
  ): Promise<TResponse>
  httpGetRaw<TResponse, TReguestConfig>(
    fname: string,
    keyForSaving: string,
    relativePath?: string,
    requestConfig?: AxiosRequestConfig<TReguestConfig>,
    errorMessage?: IMgmErrorMessage
  ): Promise<AxiosResponse<TResponse>>

  httpPost<TResponse, TReguestBody>(
    fname: string,
    keyForSaving: string,
    relativePath: string | undefined,
    requestConfig: AxiosRequestConfig,
    requestBody?: TReguestBody,
    errorMessage?: IMgmErrorMessage
  ): Promise<TResponse>
  httpPostRaw<TResponse, TRequestBody>(
    fname: string,
    keyForSaving: string,
    relativePath: string | undefined,
    requestConfig: AxiosRequestConfig,
    requestBody?: TRequestBody,
    errorMessage?: IMgmErrorMessage
  ): Promise<AxiosResponse<TResponse>>

  sendApiSuccess<T = any>(returnData?: T): ApiWrapper<T>
  sendApiWrappedResponse<T = unknown>(
    result: string,
    msg: string,
    responseCode: number,
    returnData?: T
  ): ApiWrapper<T>
}

const saveApiCall = (
  fname: string,
  url: string,
  key: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request?: any
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
  request = safestr(request, 'Empty request.')
  const showRequest = fname.toLowerCase() !== 'login'

  console.log(
    fname,
    '--',
    url,
    key,
    ', Request:',
    showRequest ? request : '***',
    ', Response:',
    response?.message ?? response.statusText
  )

  // if (Axios.isAxiosError(response)) {
  //   throw new MgmExceptionHttpNotAllowed(key, response.response?.data)
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
    //   throw new MgmException(
    //     'You must provide a log Filename for API logging.',
    //     ApiRepository.name
    //   )
    // }

    this.logger = new MgmLogger(
      safestr(loggerComponentName, ApiRepository.name),
      apiProps.logFilename ?? 'gaming-services-library',
      apiProps.logLevel
    )
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

  handleAxiosErrorRaw(
    fname: string,
    err: any,
    url: string,
    saveKey: string,
    requestBody: any,
    errorMessage?: IMgmErrorMessage
  ) {
    let jsonError: Record<string, any> | undefined

    let errmsg = safestr(err.message, errorMessage?.errorMessage)
    this.logger?.error(`${fname}: ${errmsg}`)

    if (Axios.isAxiosError(err)) {
      jsonError = err.toJSON()

      this.logger?.error(jsonError)
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
    } else if (err.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(fname, 'request:', err.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log(fname, 'Error:', err.message)
    }

    console.log(fname, 'config:', err.config)

    // Something happened in setting up the request that triggered an Error
    console.log(this.handleAxiosError.name, fname, errmsg)
    saveApiCall(fname, url, saveKey, errmsg, requestBody)

    return { errmsg, fname, jsonError }
  }

  handleAxiosError(
    fname: string,
    err: any,
    url: string,
    saveKey: string,
    requestBody: any,
    errorMessage?: IMgmErrorMessage
  ) {
    const errCracked = this.handleAxiosErrorRaw(fname, err, url, saveKey, requestBody, errorMessage)
    // console.log(error.config);
    throw new MgmExceptionHttpNotAllowed(errCracked.errmsg, fname, errCracked.jsonError)
  }

  async httpGet<TResponse, TRequestConfig = unknown>(
    fname: string,
    keyForSaving: string,
    relativePath: string | undefined,
    requestConfig: AxiosRequestConfig<TRequestConfig>,
    errorMessage?: IMgmErrorMessage
  ) {
    const apiResponse = await this.httpGetRaw<TResponse, TRequestConfig>(
      fname,
      keyForSaving,
      relativePath,
      requestConfig,
      errorMessage
    )

    return apiResponse.data
  }

  async httpGetRaw<TResponse, TRequestConfig = undefined>(
    fname: string,
    keyForSaving: string,
    relativePath: string | undefined,
    requestConfig: AxiosRequestConfig<TRequestConfig>,
    errorMessage?: IMgmErrorMessage
  ) {
    const saveKey = this.getKeyForSaving(keyForSaving)
    const url = this.getApiUrl(relativePath)

    try {
      requestConfig.httpsAgent = this.allowLegacyRenegotiationforNodeJsOptions.httpsAgent
      // this.logInfo(`login: ${safeJsonToString(loginRequest)}.`)
      const apiResponse = await Axios.get<TResponse, AxiosResponse<TResponse>, TRequestConfig>(
        url,
        requestConfig
      )
      saveApiCall(fname, url, saveKey, apiResponse)

      // if (res.status >= 200 && res.status < 300) {
      //   // if (res.data?.IsPINLocked) {
      //   //   this.logInfo(`Pin locked for user: ${loginRequest.UserName}.`)

      //   //   throw new MgmExceptionHttpForbidden('PIN Locked', this.login.name)
      //   // }

      //   this.logInfo(
      //     `Successful login for user: ${
      //       loginRequest.UserName
      //     }, ${safeJsonToString(res.data)}.`
      //   )

      return apiResponse
    } catch (err) {
      this.handleAxiosError(fname, err, url, saveKey, '')
    }
    // saveApiCall(url, 'ace-login', res)

    throw new MgmExceptionHttp(safestr(errorMessage?.errorMessage, this.httpGetRaw.name), fname)
  }

  async httpPost<TResponse, TRequestBody = unknown>(
    fname: string,
    keyForSaving: string,
    relativePath: string | undefined,
    requestConfig: AxiosRequestConfig,
    requestBody?: TRequestBody,
    errorMessage?: IMgmErrorMessage
  ) {
    const apiResponse = await this.httpPostRaw<TResponse, TRequestBody>(
      fname,
      keyForSaving,
      relativePath,
      requestConfig,
      requestBody,
      errorMessage
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
    requestBody?: TRequestBody,
    errorMessage?: IMgmErrorMessage
  ) {
    const saveKey = this.getKeyForSaving(keyForSaving)
    const url = this.getApiUrl(relativePath)

    try {
      requestConfig.httpsAgent = this.allowLegacyRenegotiationforNodeJsOptions.httpsAgent
      // this.logInfo(`login: ${safeJsonToString(loginRequest)}.`)
      const apiResponse = await Axios.post<TResponse, AxiosResponse<TResponse>, TRequestBody>(
        url,
        requestBody,
        requestConfig
      )
      saveApiCall(fname, url, saveKey, apiResponse, requestBody)

      // if (res.status >= 200 && res.status < 300) {
      //   // if (res.data?.IsPINLocked) {
      //   //   this.logInfo(`Pin locked for user: ${loginRequest.UserName}.`)

      //   //   throw new MgmExceptionHttpForbidden('PIN Locked', this.login.name)
      //   // }

      //   this.logInfo(
      //     `Successful login for user: ${
      //       loginRequest.UserName
      //     }, ${safeJsonToString(res.data)}.`
      //   )

      return apiResponse
    } catch (err) {
      this.handleAxiosError(fname, err, url, saveKey, '')
    }

    throw new MgmExceptionHttp(safestr(errorMessage?.errorMessage, this.httpPostRaw.name), fname)
  }

  sendApiSuccess<T>(returnData?: T) {
    return this.sendApiWrappedResponse('success', undefined, undefined, returnData)
  }

  sendApiWrappedResponse<T = unknown>(result = '', msg = '', responseCode = 0, returnData?: T) {
    const apiwrap = new ApiWrapper<T>(result, msg, responseCode, returnData)

    return apiwrap
  }
}
