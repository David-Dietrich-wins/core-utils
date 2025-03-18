import { jest } from '@jest/globals'
// import { HttpResponse, http } from 'msw'
import {
  AxiosError,
  AxiosHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import {
  getGlobalLogger,
  mockConsoleError,
  mockConsoleInfo,
  mockConsoleLog,
  mockConsoleWarn,
  mockLoggerDebug,
  mockLoggerError,
  mockLoggerInfo,
  mockLoggerLog,
  mockLoggerSilly,
  mockLoggerWarn,
  TEST_Parameters_DEV,
  // mockServer,
} from '../jest.setup.mjs'
import { ApiProps } from '../models/types.mjs'
import { ApiRepository, saveApiCall } from './ApiRepository.mjs'
import { LogManager } from './LogManager.mjs'
import { urlJoin } from './general.mjs'

type PostExceptionAxiosResponseData = {
  response: {
    status: number
    statusText: string
    data: {
      testing: string
      ErrorMessage?: string
    }
  }
}

type PostExceptionAxiosResponseDataErrorMessage = {
  testing: string
  ErrorMessage?: string
}

const baseUrl = TEST_Parameters_DEV.apiBaseUrl
const logFilename = 'api-repository.TEST.log'

let mockCreateInstance: jest.Mock

beforeEach(() => {
  mockCreateInstance = LogManager.createInstance = jest.fn(() =>
    getGlobalLogger()
  )
})

afterEach(() => {
  mockCreateInstance.mockRestore()
})

test('constructor', () => {
  const apiProps: ApiProps = {
    baseUrl,
  }

  const apirepo = new ApiRepository(apiProps)
  expect(apirepo).toBeInstanceOf(ApiRepository)

  expect(mockConsoleError).toHaveBeenCalledTimes(0)
  expect(mockConsoleInfo).toHaveBeenCalledTimes(0)
  expect(mockConsoleLog).toHaveBeenCalledTimes(0)
  expect(mockConsoleWarn).toHaveBeenCalledTimes(0)

  expect(mockCreateInstance).toHaveBeenCalledTimes(1)
  expect(mockLoggerDebug).toHaveBeenCalledTimes(0)
  expect(mockLoggerError).toHaveBeenCalledTimes(0)
  expect(mockLoggerInfo).toHaveBeenCalledTimes(0)
  expect(mockLoggerLog).toHaveBeenCalledTimes(0)
  expect(mockLoggerSilly).toHaveBeenCalledTimes(0)
  expect(mockLoggerWarn).toHaveBeenCalledTimes(0)
})

test('constructor with logFileName', () => {
  const apiProps: ApiProps = {
    baseUrl,
    logFilename,
  }

  const apirepo = new ApiRepository(apiProps, 'abc')
  expect(apirepo).toBeInstanceOf(ApiRepository)
})

test('constructor with saveKeyPrefix', () => {
  const apiProps: ApiProps = {
    baseUrl,
    logFilename,
  }

  const apirepo = new ApiRepository(apiProps, 'abc', 'saveKeyPrefix-')
  expect(apirepo).toBeInstanceOf(ApiRepository)
})

describe('handleAxiosErrorRaw', () => {
  test('good', () => {
    const fname = 'TEST-handleAxiosErrorRaw:'
    const err = new Error('test-error')
    const url = 'https://dave.com'
    const saveKey = 'test-saveKey'

    const apiProps: ApiProps = {
      baseUrl,
    }

    const apirepo = new ApiRepository(apiProps, 'abc')

    let ret = apirepo.handleAxiosErrorRaw(fname, err, url, saveKey)
    expect(ret).toMatchObject({
      errmsg: 'test-error',
      fname,
      jsonError: undefined,
    })

    const axiosError = new AxiosError('test', '777')
    ret = apirepo.handleAxiosErrorRaw(fname, axiosError, url, saveKey)

    expect(ret.errmsg).toBe('test')
    expect(ret.fname).toBe(fname)
  })

  test('with AxiosError', async () => {
    const fname = 'TEST-handleAxiosErrorRaw with AxiosError:'
    const saveKey = 'test-saveKey'
    const url = `${baseUrl}/`

    const mockRequestData: PostExceptionAxiosResponseData = {
      response: {
        status: 500,
        statusText: 'Unhandled Exception',
        data: {
          testing: 'testing',
        },
      },
    }

    const myHeaders = {
      'Content-Type': 'application/json',
    }

    const mockRequestHeaders = new AxiosHeaders(myHeaders)
    const mockResponseHeaders = new AxiosHeaders(myHeaders)

    const requestData = {
      hello: 'world',
    }
    const mockRequestConfig: InternalAxiosRequestConfig<typeof requestData> = {
      method: 'post',
      url,
      data: requestData,
      headers: mockRequestHeaders,
    }

    const res: AxiosResponse<
      PostExceptionAxiosResponseData,
      typeof requestData
    > = {
      data: mockRequestData,
      status: 401,
      statusText: 'Unauthorized',
      headers: mockResponseHeaders,
      config: mockRequestConfig,
      request: { hello: 'world' },
    }

    expect(res.data).toEqual(mockRequestData)

    const axiosError = new AxiosError<
      PostExceptionAxiosResponseData,
      typeof requestData
    >('Unauthorized', '401', mockRequestConfig, mockRequestHeaders, res)
    axiosError.response = res
    axiosError.config = mockRequestConfig

    const apiProps: ApiProps = {
      baseUrl,
    }

    const apirepo = new ApiRepository(apiProps, 'abc')
    const ret = apirepo.handleAxiosErrorRaw(fname, axiosError, url, saveKey)

    expect(ret.errmsg).toBe('Unauthorized')
    expect(ret.fname).toBe(fname)
    expect(ret.jsonError?.message).toBe('Unauthorized')
    expect(ret.jsonError?.name).toBe('AxiosError')
    expect(ret.jsonError?.description).toBeUndefined()
    expect(ret.jsonError?.code).toBe('401')
    expect(ret.jsonError?.status).toBe(401)
    expect(ret.jsonError?.stack).toMatch(/^AxiosError: Unauthorized/)
  })

  test('AxiosError data.ErrorMessage', async () => {
    const fname = 'TEST-handleAxiosErrorRaw with AxiosError:'
    const saveKey = 'test-saveKey'
    const url = `${baseUrl}/`

    const mockRequestData: PostExceptionAxiosResponseDataErrorMessage = {
      testing: 'testing',
      ErrorMessage: 'test-ErrorMessage',
    }

    const myHeaders = {
      'Content-Type': 'application/json',
    }

    const mockRequestHeaders = new AxiosHeaders(myHeaders)
    const mockResponseHeaders = new AxiosHeaders(myHeaders)

    const requestData = {
      hello: 'world',
    }
    const mockRequestConfig: InternalAxiosRequestConfig<typeof requestData> = {
      method: 'post',
      url,
      data: requestData,
      headers: mockRequestHeaders,
    }

    const res: AxiosResponse<
      PostExceptionAxiosResponseDataErrorMessage,
      typeof requestData
    > = {
      data: mockRequestData,
      status: 401,
      statusText: 'Unauthorized',
      headers: mockResponseHeaders,
      config: mockRequestConfig,
      request: { hello: 'world' },
    }

    res.data.ErrorMessage = 'test-ErrorMessage'

    expect(res.data).toEqual(mockRequestData)

    const axiosError = new AxiosError<
      PostExceptionAxiosResponseDataErrorMessage,
      typeof requestData
    >('Unauthorized', '401', mockRequestConfig, mockRequestHeaders, res)
    axiosError.response = res
    axiosError.config = mockRequestConfig

    const apiProps: ApiProps = {
      baseUrl,
    }

    const apirepo = new ApiRepository(apiProps, 'abc')
    const ret = apirepo.handleAxiosErrorRaw(fname, axiosError, url, saveKey)

    expect(ret.errmsg).toBe('test-ErrorMessage')
    expect(ret.fname).toBe(fname)
    expect(ret.jsonError?.message).toBe('Unauthorized')
    expect(ret.jsonError?.name).toBe('AxiosError')
    expect(ret.jsonError?.description).toBeUndefined()
    expect(ret.jsonError?.code).toBe('401')
    expect(ret.jsonError?.status).toBe(401)
    expect(ret.jsonError?.config).toStrictEqual({
      method: 'post',
      url: 'http://localhost:3000/',
      data: {
        hello: 'world',
      },
      headers: new AxiosHeaders({ 'Content-Type': 'application/json' }),
    })
    expect(ret.jsonError?.stack).toMatch(/^AxiosError: Unauthorized/)
  })

  test('AxiosError err.request', async () => {
    const fname = 'TEST-handleAxiosErrorRaw with AxiosError:'
    const saveKey = 'test-saveKey'
    const url = `${baseUrl}/`

    const myHeaders = {
      'Content-Type': 'application/json',
    }

    const mockRequestHeaders = new AxiosHeaders(myHeaders)
    const mockResponseHeaders = new AxiosHeaders(myHeaders)

    const requestData = {
      hello: 'world',
      request: { hello: 'world', request2: 'req2' },
    }
    const mockRequestConfig: InternalAxiosRequestConfig<typeof requestData> = {
      method: 'post',
      url,
      data: requestData,
      headers: mockRequestHeaders,
    }

    const res: AxiosResponse = {
      data: requestData,
      status: 401,
      statusText: 'Unauthorized',
      headers: mockResponseHeaders,
      config: mockRequestConfig,
      request: { hello: 'world' },
    }

    expect(res.data).toEqual(requestData)

    const axiosError = new AxiosError<
      PostExceptionAxiosResponseData,
      typeof requestData
    >('Unauthorized', '401', mockRequestConfig, mockRequestHeaders)
    // axiosError.response = res
    axiosError.config = mockRequestConfig

    const apiProps: ApiProps = {
      baseUrl,
    }

    const apirepo = new ApiRepository(apiProps, 'abc')
    const ret = apirepo.handleAxiosErrorRaw(fname, axiosError, url, saveKey)

    expect(ret.errmsg).toBe('Unauthorized')
    expect(ret.fname).toBe(fname)
    expect(ret.jsonError?.message).toBe('Unauthorized')
    expect(ret.jsonError?.name).toBe('AxiosError')
    expect(ret.jsonError?.description).toBeUndefined()
    expect(ret.jsonError?.code).toBe('401')
    expect(ret.jsonError?.status).toBeUndefined()
    expect(ret.jsonError?.stack).toMatch(/^AxiosError: Unauthorized/)
  })
})

test('saveApiCall no response', async () => {
  const fname = 'TEST-handleAxiosErrorRaw:'
  const saveKey = 'test-saveKey'
  const url = `${baseUrl}/`

  const myHeaders = {
    'Content-Type': 'application/json',
  }

  const mockRequestHeaders = new AxiosHeaders(myHeaders)

  const requestData = {
    hello: 'world',
    request: { hello: 'world', request2: 'req2' },
  }
  const mockRequestConfig: InternalAxiosRequestConfig<typeof requestData> = {
    method: 'post',
    url,
    data: requestData,
    headers: mockRequestHeaders,
  }

  // const mockResponse: AxiosResponse = {
  //   data: requestData,
  //   status: 401,
  //   statusText: 'Unauthorized',
  //   headers: mockResponseHeaders,
  //   config: mockRequestConfig,
  //   request: { hello: 'world' },
  // }

  saveApiCall(fname, url, saveKey, mockRequestConfig)
  expect(mockConsoleLog).toHaveBeenCalledTimes(1)
  expect(mockConsoleLog.mock.calls[0]).toStrictEqual([
    'TEST-handleAxiosErrorRaw:',
    '--',
    'http://localhost:3000/',
    'test-saveKey',
    ', Response:',
    '',
  ])

  saveApiCall(fname, url, saveKey, mockRequestConfig)
  expect(mockConsoleLog).toHaveBeenCalledTimes(2)
  expect(mockConsoleLog.mock.calls[1]).toStrictEqual([
    'TEST-handleAxiosErrorRaw:',
    '--',
    'http://localhost:3000/',
    'test-saveKey',
    ', Response:',
    '',
  ])

  saveApiCall(fname, url, saveKey, undefined)

  expect(mockConsoleError).toHaveBeenCalledTimes(0)
  expect(mockConsoleInfo).toHaveBeenCalledTimes(0)
  expect(mockConsoleLog).toHaveBeenCalledTimes(3)
  expect(mockConsoleWarn).toHaveBeenCalledTimes(0)

  expect(mockConsoleLog.mock.calls[2]).toStrictEqual([
    'TEST-handleAxiosErrorRaw:',
    '--',
    'http://localhost:3000/',
    'test-saveKey',
    ', Response:',
    '',
  ])

  expect(mockLoggerDebug).toHaveBeenCalledTimes(0)
  expect(mockLoggerError).toHaveBeenCalledTimes(0)
  expect(mockLoggerInfo).toHaveBeenCalledTimes(0)
  expect(mockLoggerLog).toHaveBeenCalledTimes(0)
  expect(mockLoggerSilly).toHaveBeenCalledTimes(0)
  expect(mockLoggerWarn).toHaveBeenCalledTimes(0)
})

test('handleAxiosError', async () => {
  const fname = 'TEST-handleAxiosErrorRaw with AxiosError:'
  const saveKey = 'test-saveKey'
  const url = `${baseUrl}/`

  const myHeaders = {
    'Content-Type': 'application/json',
  }

  const mockRequestHeaders = new AxiosHeaders(myHeaders)
  const mockResponseHeaders = new AxiosHeaders(myHeaders)

  const requestData = {
    hello: 'world',
    request: { hello: 'world', request2: 'req2' },
  }
  const mockRequestConfig: InternalAxiosRequestConfig<typeof requestData> = {
    method: 'post',
    url,
    data: requestData,
    headers: mockRequestHeaders,
  }

  const res: AxiosResponse = {
    data: requestData,
    status: 401,
    statusText: 'Unauthorized',
    headers: mockResponseHeaders,
    config: mockRequestConfig,
    request: { hello: 'world' },
  }

  expect(res.data).toEqual(requestData)

  const axiosError = new AxiosError<
    PostExceptionAxiosResponseData,
    typeof requestData
  >('Unauthorized', '401', mockRequestConfig, mockRequestHeaders)
  // axiosError.response = res
  axiosError.config = mockRequestConfig

  const apiProps: ApiProps = {
    baseUrl,
  }

  const apirepo = new ApiRepository(apiProps, 'abc')
  const retex = apirepo.handleAxiosError(fname, axiosError, url, saveKey)

  expect(retex.message).toBe('Unauthorized')
  expect(retex.functionNameSource).toBe(fname)

  expect(retex.obj?.code).toBe('401')
  expect(retex.obj?.columnNumber).toBeUndefined()
  expect(retex.obj?.config).toBeDefined()
  expect(retex.obj?.description).toBeUndefined()
  expect(retex.obj?.fileName).toBeUndefined()
  expect(retex.obj?.lineNumber).toBeUndefined()
  expect(retex.obj?.name).toBe('AxiosError')
  expect(retex.obj?.number).toBeUndefined()
  expect(retex.obj?.status).toBeUndefined()
  expect(retex.obj?.stack).toMatch(/^AxiosError: Unauthorized/)
  expect(retex.httpStatusCode).toBe(405)
  // expect(retex.response).toBeUndefined()
  expect(retex.stack).toMatch(/^Error: Unauthorized/)
})

describe('httpGetRaw', () => {
  // test('good', async () => {
  //   const fname = 'TEST-httpGetRaw:'
  //   const saveKey = 'test-saveKey'
  //   const url = urlJoin(baseUrl, 'dave/')
  //   const xmlReturnData =
  //     '<CRMAcresMessage xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://localhost/CRMAcres.xsd"><Header><OriginalMessageID>1714422936</OriginalMessageID><TimeStamp>2024-04-29T13:35:36.850</TimeStamp><Operation Data="PlayerFind" Operand="Information"/></Header><Site><SiteID>1</SiteID></Site><Body><PlayerFind><PlayersFound><PlayerFound><PlayerID>84294964</PlayerID><FirstName>HEATHER</FirstName><MiddleName>L</MiddleName><LastName>WEINER</LastName><MailingCity>FOREST HILLS</MailingCity><MailingState>NY</MailingState><MailingCountry>840</MailingCountry><Ranking>106</Ranking><DateOfBirth>1988-05-05T00:00:00</DateOfBirth><Gender>F</Gender><PINLocked>N</PINLocked><DiscreetPlayer>N</DiscreetPlayer><CreditAccount>0</CreditAccount><AddressLine1>118-17 UNION TPKE</AddressLine1><AddressLine2>APT 110</AddressLine2></PlayerFound><PlayerFound><PlayerID>84294964</PlayerID><FirstName>HEATHER</FirstName><MiddleName>L</MiddleName><LastName>WEINER</LastName><MailingCity>GLEN OAKS</MailingCity><MailingState>NY</MailingState><MailingCountry>840</MailingCountry><Ranking>106</Ranking><DateOfBirth>1988-05-05T00:00:00</DateOfBirth><Gender>F</Gender><PINLocked>N</PINLocked><DiscreetPlayer>N</DiscreetPlayer><CreditAccount>0</CreditAccount><AddressLine1>26069 UNION TPKE # 1</AddressLine1></PlayerFound></PlayersFound></PlayerFind></Body></CRMAcresMessage>'
  //   const mockStaticF = jest.fn().mockReturnValue(xmlReturnData)
  //   axios.get = mockStaticF
  //   mockServer.use(
  //     http.get(url, () => {
  //       return HttpResponse.xml(xmlReturnData)
  //     })
  //   )
  //   const myHeaders = {
  //     'Content-Type': 'application/json',
  //   }
  //   const mockRequestHeaders = new AxiosHeaders(myHeaders)
  //   const requestData = {
  //     hello: 'world',
  //     request: { hello: 'world', request2: 'req2' },
  //   }
  //   const mockRequestConfig: InternalAxiosRequestConfig<typeof requestData> = {
  //     method: 'get',
  //     url,
  //     data: requestData,
  //     headers: mockRequestHeaders,
  //   }
  //   const apiProps: ApiProps = {
  //     baseUrl,
  //   }
  //   const apirepo = new ApiRepository(apiProps, 'loggerComponent')
  //   const ret = await apirepo.httpGetRaw(
  //     fname,
  //     saveKey,
  //     '/dave',
  //     mockRequestConfig
  //   )
  //   expect(mockStaticF).toHaveBeenCalledTimes(1)
  //   mockStaticF.mockRestore()
  //   expect(ret).toBeDefined()
  // })
  // test('exception', async () => {
  //   const fname = 'TEST-httpGetRaw:'
  //   const saveKey = 'test-saveKey'
  //   const url = urlJoin(baseUrl, 'dave/')
  //   const xmlReturnData =
  //     '<CRMAcresMessage xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://localhost/CRMAcres.xsd"><Header><OriginalMessageID>1714422936</OriginalMessageID><TimeStamp>2024-04-29T13:35:36.850</TimeStamp><Operation Data="PlayerFind" Operand="Information"/></Header><Site><SiteID>1</SiteID></Site><Body><PlayerFind><PlayersFound><PlayerFound><PlayerID>84294964</PlayerID><FirstName>HEATHER</FirstName><MiddleName>L</MiddleName><LastName>WEINER</LastName><MailingCity>FOREST HILLS</MailingCity><MailingState>NY</MailingState><MailingCountry>840</MailingCountry><Ranking>106</Ranking><DateOfBirth>1988-05-05T00:00:00</DateOfBirth><Gender>F</Gender><PINLocked>N</PINLocked><DiscreetPlayer>N</DiscreetPlayer><CreditAccount>0</CreditAccount><AddressLine1>118-17 UNION TPKE</AddressLine1><AddressLine2>APT 110</AddressLine2></PlayerFound><PlayerFound><PlayerID>84294964</PlayerID><FirstName>HEATHER</FirstName><MiddleName>L</MiddleName><LastName>WEINER</LastName><MailingCity>GLEN OAKS</MailingCity><MailingState>NY</MailingState><MailingCountry>840</MailingCountry><Ranking>106</Ranking><DateOfBirth>1988-05-05T00:00:00</DateOfBirth><Gender>F</Gender><PINLocked>N</PINLocked><DiscreetPlayer>N</DiscreetPlayer><CreditAccount>0</CreditAccount><AddressLine1>26069 UNION TPKE # 1</AddressLine1></PlayerFound></PlayersFound></PlayerFind></Body></CRMAcresMessage>'
  //   const mockStaticF = jest
  //     .fn()
  //     .mockRejectedValue(new Error('Request failed with status code 404'))
  //   axios.get = mockStaticF
  //   mockServer.use(
  //     http.get(url, () => {
  //       return HttpResponse.xml(xmlReturnData)
  //     })
  //   )
  //   const myHeaders = {
  //     'Content-Type': 'application/json',
  //   }
  //   const mockRequestHeaders = new AxiosHeaders(myHeaders)
  //   const requestData = {
  //     hello: 'world',
  //     request: { hello: 'world', request2: 'req2' },
  //   }
  //   const mockRequestConfig: InternalAxiosRequestConfig<typeof requestData> = {
  //     method: 'get',
  //     url,
  //     data: requestData,
  //     headers: mockRequestHeaders,
  //   }
  //   const apiProps: ApiProps = {
  //     baseUrl,
  //   }
  //   const apirepo = new ApiRepository(apiProps, 'loggerComponent')
  //   try {
  //     await apirepo.httpGetRaw(fname, saveKey, '/dave', mockRequestConfig)
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   } catch (e: any) {
  //     expect(e).toBeInstanceOf(Error)
  //     expect(e.msg).toBe('Request failed with status code 404')
  //     expect(e.stack).toMatch(/^Error: Request failed with status code 404/)
  //   }
  //   expect.assertions(3)
  // })
})

// describe('httpPostRaw', () => {
//   test('good', async () => {
//     const fname = 'TEST-httpGetRaw:'
//     const saveKey = 'test-saveKey'
//     const url = urlJoin(baseUrl, 'dave/')

//     const xmlReturnData =
//       '<CRMAcresMessage xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://localhost/CRMAcres.xsd"><Header><OriginalMessageID>1714422936</OriginalMessageID><TimeStamp>2024-04-29T13:35:36.850</TimeStamp><Operation Data="PlayerFind" Operand="Information"/></Header><Site><SiteID>1</SiteID></Site><Body><PlayerFind><PlayersFound><PlayerFound><PlayerID>84294964</PlayerID><FirstName>HEATHER</FirstName><MiddleName>L</MiddleName><LastName>WEINER</LastName><MailingCity>FOREST HILLS</MailingCity><MailingState>NY</MailingState><MailingCountry>840</MailingCountry><Ranking>106</Ranking><DateOfBirth>1988-05-05T00:00:00</DateOfBirth><Gender>F</Gender><PINLocked>N</PINLocked><DiscreetPlayer>N</DiscreetPlayer><CreditAccount>0</CreditAccount><AddressLine1>118-17 UNION TPKE</AddressLine1><AddressLine2>APT 110</AddressLine2></PlayerFound><PlayerFound><PlayerID>84294964</PlayerID><FirstName>HEATHER</FirstName><MiddleName>L</MiddleName><LastName>WEINER</LastName><MailingCity>GLEN OAKS</MailingCity><MailingState>NY</MailingState><MailingCountry>840</MailingCountry><Ranking>106</Ranking><DateOfBirth>1988-05-05T00:00:00</DateOfBirth><Gender>F</Gender><PINLocked>N</PINLocked><DiscreetPlayer>N</DiscreetPlayer><CreditAccount>0</CreditAccount><AddressLine1>26069 UNION TPKE # 1</AddressLine1></PlayerFound></PlayersFound></PlayerFind></Body></CRMAcresMessage>'
//     const mockAxiosPost = jest.fn().mockReturnValue(xmlReturnData)
//     axios.post = mockAxiosPost

//     mockServer.use(
//       http.post(url, () => {
//         return HttpResponse.xml(xmlReturnData)
//       })
//     )

//     const myHeaders = {
//       'Content-Type': 'application/json',
//     }

//     const mockRequestHeaders = new AxiosHeaders(myHeaders)

//     const requestData = {
//       hello: 'world',
//       request: { hello: 'world', request2: 'req2' },
//     }
//     const mockRequestConfig: InternalAxiosRequestConfig<typeof requestData> = {
//       method: 'get',
//       url,
//       data: requestData,
//       headers: mockRequestHeaders,
//     }

//     const apiProps: ApiProps = {
//       baseUrl,
//     }

//     const apirepo = new ApiRepository(apiProps, 'loggerComponent')
//     const ret = await apirepo.httpPostRaw(
//       fname,
//       saveKey,
//       '/dave',
//       mockRequestConfig
//     )

//     expect(mockAxiosPost).toHaveBeenCalledTimes(1)
//     mockAxiosPost.mockRestore()

//     expect(ret).toBeDefined()
//   })

//   test('exception', async () => {
//     const fname = 'TEST-httpGetRaw:'
//     const saveKey = 'test-saveKey'
//     const url = urlJoin(baseUrl, 'Patrons/')

//     const xmlReturnData =
//       '<CRMAcresMessage xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://localhost/CRMAcres.xsd"><Header><OriginalMessageID>1714422936</OriginalMessageID><TimeStamp>2024-04-29T13:35:36.850</TimeStamp><Operation Data="PlayerFind" Operand="Information"/></Header><Site><SiteID>1</SiteID></Site><Body><PlayerFind><PlayersFound><PlayerFound><PlayerID>84294964</PlayerID><FirstName>HEATHER</FirstName><MiddleName>L</MiddleName><LastName>WEINER</LastName><MailingCity>FOREST HILLS</MailingCity><MailingState>NY</MailingState><MailingCountry>840</MailingCountry><Ranking>106</Ranking><DateOfBirth>1988-05-05T00:00:00</DateOfBirth><Gender>F</Gender><PINLocked>N</PINLocked><DiscreetPlayer>N</DiscreetPlayer><CreditAccount>0</CreditAccount><AddressLine1>118-17 UNION TPKE</AddressLine1><AddressLine2>APT 110</AddressLine2></PlayerFound><PlayerFound><PlayerID>84294964</PlayerID><FirstName>HEATHER</FirstName><MiddleName>L</MiddleName><LastName>WEINER</LastName><MailingCity>GLEN OAKS</MailingCity><MailingState>NY</MailingState><MailingCountry>840</MailingCountry><Ranking>106</Ranking><DateOfBirth>1988-05-05T00:00:00</DateOfBirth><Gender>F</Gender><PINLocked>N</PINLocked><DiscreetPlayer>N</DiscreetPlayer><CreditAccount>0</CreditAccount><AddressLine1>26069 UNION TPKE # 1</AddressLine1></PlayerFound></PlayersFound></PlayerFind></Body></CRMAcresMessage>'
//     const mockAxiosPost = jest
//       .fn()
//       .mockRejectedValue(new Error('Request failed with status code 404'))
//     axios.post = mockAxiosPost

//     mockServer.use(
//       http.post(url, () => {
//         return HttpResponse.xml(xmlReturnData)
//       })
//     )

//     const myHeaders = {
//       'Content-Type': 'application/json',
//     }

//     const mockRequestHeaders = new AxiosHeaders(myHeaders)

//     const requestData = {
//       hello: 'world',
//       request: { hello: 'world', request2: 'req2' },
//     }
//     const mockRequestConfig: InternalAxiosRequestConfig<typeof requestData> = {
//       method: 'post',
//       url,
//       data: requestData,
//       headers: mockRequestHeaders,
//     }

//     const apiProps: ApiProps = {
//       baseUrl,
//     }

//     const apirepo = new ApiRepository(apiProps, 'loggerComponent')
//     try {
//       await apirepo.httpPostRaw(fname, saveKey, '/dave', mockRequestConfig)
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (e: any) {
//       expect(e).toBeInstanceOf(Error)
//       expect(e.msg).toBe('Request failed with status code 404')
//       expect(e.stack).toMatch(/^Error: Request failed with status code 404/)
//     }

//     expect.assertions(3)
//   })
// })

test('sendApiWrappedResponse', async () => {
  const result = ''
  const msg = ''
  const responseCode = 0
  const returnData = { hello: 'world' }

  let apiWrapper = ApiRepository.sendApiWrappedResponse(
    returnData,
    result,
    msg,
    responseCode
  )

  expect(apiWrapper.id).toBeGreaterThan(0)
  expect(apiWrapper.ts).toBeGreaterThan(0)
  expect(apiWrapper.data).toEqual(returnData)
  expect(apiWrapper.result).toBe(result)
  expect(apiWrapper.message).toBe(msg)
  expect(apiWrapper.responseCode).toBe(responseCode)

  apiWrapper = ApiRepository.sendApiWrappedResponse(returnData)

  expect(apiWrapper.id).toBeGreaterThan(0)
  expect(apiWrapper.ts).toBeGreaterThan(0)
  expect(apiWrapper.data).toBeUndefined()
  expect(apiWrapper.result).toBe('')
  expect(apiWrapper.message).toBe('')
  expect(apiWrapper.responseCode).toBe(0)
})

test('sendApiSuccess', async () => {
  const returnData = { hello: 'world' }

  let apiWrapper = ApiRepository.sendApiSuccess(returnData)

  expect(apiWrapper.id).toBeGreaterThan(0)
  expect(apiWrapper.ts).toBeGreaterThan(0)
  expect(apiWrapper.data).toEqual(returnData)
  expect(apiWrapper.result).toBe('success')
  expect(apiWrapper.message).toBe('')
  expect(apiWrapper.responseCode).toBe(0)

  apiWrapper = ApiRepository.sendApiSuccess(returnData)

  expect(apiWrapper.id).toBeGreaterThan(0)
  expect(apiWrapper.ts).toBeGreaterThan(0)
  expect(apiWrapper.data).toBeUndefined()
  expect(apiWrapper.result).toBe('success')
  expect(apiWrapper.message).toBe('')
  expect(apiWrapper.responseCode).toBe(0)
})

test('getApiUrl', async () => {
  const apiProps: ApiProps = {
    baseUrl,
  }

  const apirepo = new ApiRepository(apiProps)
  expect(apirepo).toBeInstanceOf(ApiRepository)

  expect(apirepo.getApiUrl('')).toBe(urlJoin(baseUrl, '/'))
  expect(apirepo.getApiUrl('/')).toBe(urlJoin(baseUrl, '/'))
  expect(apirepo.getApiUrl('test')).toBe(urlJoin(baseUrl, 'test'))
})

test('getKeyForSaving', async () => {
  const apiProps: ApiProps = {
    baseUrl,
  }

  const apirepo = new ApiRepository(apiProps, undefined, 'prefix-')
  expect(apirepo).toBeInstanceOf(ApiRepository)

  expect(apirepo.getKeyForSaving('test')).toBe('prefix-test')
})
