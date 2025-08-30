import { Typish, TypishFunction } from '../../models/types.mjs'
import { safeArray } from './array-helper.mjs'

/**
 * Tests an object to determine if it is a function.
 * @param obj Any object to test if it is a function.
 * @returns True if the object is a function.
 */
export function isFunction(obj: unknown) {
  return 'function' === typeof obj
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function typishValue<T = unknown>(val: Typish<T>, ...args: any[]): T {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return isFunction(val) ? val(...args) : val
}
export function copyToTypishFunction<T = unknown>(val: T): TypishFunction<T> {
  const fn = () => typishValue(val)

  return fn
}
export function copyArrayToTypishFunction<T = unknown>(
  val: T[]
): TypishFunction<T>[] {
  return safeArray(val).map((item) => copyToTypishFunction(item))
}
