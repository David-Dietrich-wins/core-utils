import { jest } from '@jest/globals'
import { Response } from 'express'
import { ApiResponse } from '../models/ApiResponse.mjs'
import ApiResponseHelper from './ApiResponseHelper.mjs'

test('ApiResponseSuccess', () => {
  const resapi = ApiResponseHelper.ApiResponseSuccess('test')

  expect(resapi?.id).toBeGreaterThan(0)
  expect(resapi?.ts).toBeGreaterThan(0)
  expect(resapi?.message).toBe('test')
  expect(resapi?.responseCode).toBe(0)
  expect(resapi?.result).toBe('success')
  expect(resapi?.data).toBe('test')

  const obj = { a: 'test' }
  const resobj = ApiResponseHelper.ApiResponseSuccess(obj)

  expect(resobj?.id).toBeGreaterThan(0)
  expect(resobj?.ts).toBeGreaterThan(0)
  expect(resobj?.message).toBe('')
  expect(resobj?.responseCode).toBe(0)
  expect(resobj?.result).toBe('success')
  expect(resobj?.data).toBe(obj)

  const newApiResponse = new ApiResponse('')
  const resApiResponse = ApiResponseHelper.ApiResponseSuccess(newApiResponse)

  expect(resApiResponse?.id).toBeGreaterThan(0)
  expect(resApiResponse?.ts).toBeGreaterThan(0)
  expect(resApiResponse?.message).toBe('')
  expect(resApiResponse?.responseCode).toBe(0)
  expect(resApiResponse?.result).toBe('success')
  expect(resApiResponse?.data).toBeInstanceOf(ApiResponse)
})

test('ApiResponseResponseError', () => {
  const resapi = ApiResponseHelper.apiResponseError('test')

  expect(resapi?.id).toBeGreaterThan(0)
  expect(resapi?.ts).toBeGreaterThan(0)
  expect(resapi?.message).toBe('test')
  expect(resapi?.responseCode).toBe(-1)
  expect(resapi?.result).toBe('Error')
  expect(resapi?.data).toBe('test')

  const newApiResponse = new ApiResponse<string>('')
  const resApiResponse = ApiResponseHelper.apiResponseError(newApiResponse)

  expect(resApiResponse?.id).toBeGreaterThan(0)
  expect(resApiResponse?.ts).toBeGreaterThan(0)
  expect(resApiResponse?.message).toBe('')
  expect(resApiResponse?.responseCode).toBe(-1)
  expect(resApiResponse?.result).toBe('Error')
  expect(resApiResponse?.data).toBeInstanceOf(ApiResponse)
})

test('respondWithSuccess', () => {
  const mockResponse = {
    json: jest.fn(),
    status: jest.fn(() => mockResponse),
  } as unknown as Response

  ApiResponseHelper.respondWithSuccess(mockResponse, 'test')

  expect(mockResponse.json).toHaveBeenCalledTimes(1)
})

test('respondWithError', () => {
  const mockResponse = {
    json: jest.fn(),
    status: jest.fn(() => mockResponse),
  } as unknown as Response

  ApiResponseHelper.respondWithError('test', mockResponse)

  expect(mockResponse.json).toHaveBeenCalledTimes(1)
})
