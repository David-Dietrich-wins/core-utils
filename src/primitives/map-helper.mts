
export function dictionaryUpsert<K, V>(dict: Map<K, V>, key: K, value: V): void {
  dict.set(key, value)
}

export function dictionaryUpsertAll<K, V>(dictTarget: Map<K, V>, dictSource: NodeJS.Dict<V>): void {
  for (const [key, value] of Object.entries(dictSource)) {
    dictionaryUpsert(dictTarget, key as K, value)
  }
}

export function dictionaryFromObject<K extends string | number | symbol, V>(obj: NodeJS.Dict<V>): Map<K, V> {
  const map = new Map<K, V>()
  dictionaryUpsertAll(map, obj)
  return map
}

export function dictionaryToObject<K extends string | number | symbol, V>(map: Map<K, V>): NodeJS.Dict<V> {
  const obj: NodeJS.Dict<V> = {}
  for (const [key, value] of map.entries()) {
    obj[key as string] = value
  }
  return obj
}

export function processEnvUpsert(dict: NodeJS.Dict<string>): void {
  for (const [key, value] of Object.entries(dict)) {
    process.env[key] = value
  }
}
