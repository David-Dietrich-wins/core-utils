import { describe, expect, it } from '@jest/globals'
import { ApiResponse } from '../models/ApiResponse.mjs'
import { ApiResponseHelper } from './ApiResponseHelper.mjs'

describe('api responses', () => {
  it('success', () => {
    expect.assertions(18)

    const apires = ApiResponseHelper.success('test'),
      apiresSuccess = new ApiResponse('', 'success', '', 0),
      obj = { a: 'test' },
      objres = ApiResponseHelper.success(obj),
      resApiResponse = ApiResponseHelper.success(apiresSuccess)

    expect(apires.id).toBeGreaterThan(0)
    expect(apires.ts).toBeGreaterThan(0)
    expect(apires.message).toBe('test')
    expect(apires.responseCode).toBe(0)
    expect(apires.result).toBe('success')
    expect(apires.data).toBe('test')

    expect(objres.id).toBeGreaterThan(0)
    expect(objres.ts).toBeGreaterThan(0)
    expect(objres.message).toBe('')
    expect(objres.responseCode).toBe(0)
    expect(objres.result).toBe('success')
    expect(objres.data).toBe(obj)

    expect(resApiResponse.id).toBeGreaterThan(0)
    expect(resApiResponse.ts).toBeGreaterThan(0)
    expect(resApiResponse.message).toBe('')
    expect(resApiResponse.responseCode).toBe(0)
    expect(resApiResponse.result).toBe('success')
    expect(resApiResponse.data).toBe('')
  })

  it('error', () => {
    expect.assertions(12)

    const apires = ApiResponseHelper.error('test'),
      newApiResponse = new ApiResponse<string>('Error', 'Error', 'Error', -1),
      resApiResponse = ApiResponseHelper.error(newApiResponse)

    expect(apires.id).toBeGreaterThan(0)
    expect(apires.ts).toBeGreaterThan(0)
    expect(apires.message).toBe('test')
    expect(apires.responseCode).toBe(-1)
    expect(apires.result).toBe('Error')
    expect(apires.data).toBe('test')
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
