import { jest } from '@jest/globals'
import { Request, Response } from 'express'
import { ApiWrapper } from '../models/ApiWrapper.mjs'
import ApiResponseHelper from './ApiResponseHelper.mjs'

test('apiWrapperResponseSuccess', () => {
  const resapi = ApiResponseHelper.apiWrapperResponseSuccess('test')

  expect(resapi?.id).toBeGreaterThan(0)
  expect(resapi?.ts).toBeGreaterThan(0)
  expect(resapi?.message).toBe('test')
  expect(resapi?.responseCode).toBe(0)
  expect(resapi?.result).toBe('success')
  expect(resapi?.obj).toBeUndefined()

  const obj = { a: 'test' }
  const resobj = ApiResponseHelper.apiWrapperResponseSuccess(obj)

  expect(resobj?.id).toBeGreaterThan(0)
  expect(resobj?.ts).toBeGreaterThan(0)
  expect(resobj?.message).toBe('')
  expect(resobj?.responseCode).toBe(0)
  expect(resobj?.result).toBe('success')
  expect(resobj?.obj).toBe(obj)

  const newApiWrapper = new ApiWrapper<string>()
  const resapiWrapper =
    ApiResponseHelper.apiWrapperResponseSuccess(newApiWrapper)

  expect(resapiWrapper?.id).toBeGreaterThan(0)
  expect(resapiWrapper?.ts).toBeGreaterThan(0)
  expect(resapiWrapper?.message).toBe('')
  expect(resapiWrapper?.responseCode).toBe(0)
  expect(resapiWrapper?.result).toBe('success')
  expect(resapiWrapper?.obj).toBeInstanceOf(ApiWrapper)
})

test('apiWrapperResponseError', () => {
  const resapi = ApiResponseHelper.apiWrapperResponseError('test')

  expect(resapi?.id).toBeGreaterThan(0)
  expect(resapi?.ts).toBeGreaterThan(0)
  expect(resapi?.message).toBe('test')
  expect(resapi?.responseCode).toBe(-1)
  expect(resapi?.result).toBe('Error')
  expect(resapi?.obj).toBeUndefined()

  const newApiWrapper = new ApiWrapper<string>()
  const resapiWrapper = ApiResponseHelper.apiWrapperResponseError(newApiWrapper)

  expect(resapiWrapper?.id).toBeGreaterThan(0)
  expect(resapiWrapper?.ts).toBeGreaterThan(0)
  expect(resapiWrapper?.message).toBe('')
  expect(resapiWrapper?.responseCode).toBe(-1)
  expect(resapiWrapper?.result).toBe('Error')
  expect(resapiWrapper?.obj).toBeInstanceOf(ApiWrapper)
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
  const mockRequest = { params: {} } as Request

  const mockResponse = {
    json: jest.fn(),
    status: jest.fn(() => mockResponse),
  } as unknown as Response

  ApiResponseHelper.respondWithError('test', mockRequest, mockResponse)

  expect(mockResponse.json).toHaveBeenCalledTimes(1)
})
