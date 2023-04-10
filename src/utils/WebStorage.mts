import { GrayArrowException } from './GrayArrowException.mjs'
import { hasData, isArray, isObject, safeJsonToString, safestrToJson, safestrTrim } from './skky.mjs'

class WebStorage {
  get storageProvider(): Storage {
    throw new GrayArrowException('No storage provider', 'storageProvider')
  }

  /**
   * Clears all storage.
   */
  clear() {
    this.storageProvider.clear()
  }

  /**
   * Gets an item from the storageProvider.
   * @param key The key of the storageProvider item to retrieve.
   * @returns The value stored at key, an object if one is detected, otherwise null if the key cannot be found.
   */
  getItem<T extends object>(key: string) {
    const val = safestrTrim(this.getString(key))
    if (hasData(val)) {
      if (
        (val.startsWith('{') && val.endsWith('}')) ||
        (val.startsWith('[') && val.endsWith(']'))
      ) {
        return safestrToJson<T>(val)
      }
    }

    return undefined
  }

  getString(key: string) {
    return this.storageProvider.getItem(key)
  }

  /**
   * Removes a key item from storageProvider.
   * @param key The key of the storageProvider item to remove.
   */
  removeItem(key: string) {
    this.storageProvider.removeItem(key)
  }

  /**
   * Sets a storageProvider item at key with value.
   * @param key The key of the storageProvider item to remove.
   * @param value The string or object to store into the sessonStorage key.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setItem(key: string, value: any) {
    const saveval = isObject(value) || isArray(value) ? safeJsonToString(value) : String(value)

    this.storageProvider.setItem(key, saveval)
  }
}

/**
 * Override our WebStorage object's storageProvide for our specific use case.
 * We need to hold this in a method as Storage cannot be accessed until useEffect().
 */
class WebStorageLocal extends WebStorage {
  get storageProvider() {
    return localStorage
  }
}

/**
 * Override our WebStorage object's storageProvide for our specific use case.
 * We need to hold this in a method as Storage cannot be accessed until useEffect().
 */
class WebStorageSession extends WebStorage {
  get storageProvider(): Storage {
    return sessionStorage
  }
}

export const LocalStorage = new WebStorageLocal()
export const SessionStorage = new WebStorageSession()
