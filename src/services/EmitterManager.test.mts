import { jest, test, expect } from '@jest/globals'
import { CreateEmitterManager } from './EmitterManager.mjs'

test('CreateEmitterManager', () => {
  const emitterManager = CreateEmitterManager<number>('TestEvent')

  expect(emitterManager).toBeDefined()

  expect(typeof emitterManager.on).toBe('function')
  expect(typeof emitterManager.off).toBe('function')
  expect(typeof emitterManager.emit).toBe('function')

  const mockFn = jest.fn()
  emitterManager.on(mockFn)
  expect(mockFn).toHaveBeenCalledTimes(0)
  emitterManager.emit(42)
  expect(mockFn).toHaveBeenCalledTimes(1)
  expect(mockFn).toHaveBeenCalledWith(42)
  emitterManager.off(mockFn)
  expect(mockFn).toHaveBeenCalledTimes(1)
  emitterManager.emit(42)
  expect(mockFn).toHaveBeenCalledTimes(1)
})
