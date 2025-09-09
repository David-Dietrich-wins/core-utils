import { describe, expect, it } from '@jest/globals'
import { ApiResponse } from '../models/ApiResponse.mjs'
import { ApiResponseHelper } from './ApiResponseHelper.mjs'

describe('api responses', () => {
  it('success', () => {
    expect.assertions(18)

    const resapi = ApiResponseHelper.success('test')

    expect(resapi.id).toBeGreaterThan(0)
    expect(resapi.ts).toBeGreaterThan(0)
    expect(resapi.message).toBe('test')
    expect(resapi.responseCode).toBe(0)
    expect(resapi.result).toBe('success')
    expect(resapi.data).toBe('test')

    const obj = { a: 'test' },
      resobj = ApiResponseHelper.success(obj)

    expect(resobj.id).toBeGreaterThan(0)
    expect(resobj.ts).toBeGreaterThan(0)
    expect(resobj.message).toBe('')
    expect(resobj.responseCode).toBe(0)
    expect(resobj.result).toBe('success')
    expect(resobj.data).toBe(obj)

    const newApiResponse = new ApiResponse('', 'success', '', 0),
      resApiResponse = ApiResponseHelper.success(newApiResponse)

    expect(resApiResponse.id).toBeGreaterThan(0)
    expect(resApiResponse.ts).toBeGreaterThan(0)
    expect(resApiResponse.message).toBe('')
    expect(resApiResponse.responseCode).toBe(0)
    expect(resApiResponse.result).toBe('success')
    expect(resApiResponse.data).toBe('')
  })

  it('error', () => {
    expect.assertions(12)

    const resapi = ApiResponseHelper.error('test')

    expect(resapi.id).toBeGreaterThan(0)
    expect(resapi.ts).toBeGreaterThan(0)
    expect(resapi.message).toBe('test')
    expect(resapi.responseCode).toBe(-1)
    expect(resapi.result).toBe('Error')
    expect(resapi.data).toBe('test')

    const newApiResponse = new ApiResponse<string>(
        'Error',
        'Error',
        'Error',
        -1
      ),
      resApiResponse = ApiResponseHelper.error(newApiResponse)

    expect(resApiResponse.id).toBeGreaterThan(0)
    expect(resApiResponse.ts).toBeGreaterThan(0)
    expect(resApiResponse.message).toBe('Error')
    expect(resApiResponse.responseCode).toBe(-1)
    expect(resApiResponse.result).toBe('Error')
    expect(resApiResponse.data).toBe('Error')
  })
})

// i t('respondWithSuccess', () => {
//   Const mockResponse = {
//     Json: jest.fn(),
//     Status: jest.fn(() => mockResponse),
//   } as unknown as Response

//   ApiResponseHelper.respondWithSuccess(mockResponse, 'test')

//   Expect(mockResponse.json).toHaveBeenCalledTimes(1)
// })

// i t('respondWithError', () => {
//   Const mockResponse = {
//     Json: jest.fn(),
//     Status: jest.fn(() => mockResponse),
//   } as unknown as Response

//   ApiResponseHelper.respondWithError('test', mockResponse)

//   Expect(mockResponse.json).toHaveBeenCalledTimes(1)
// })
