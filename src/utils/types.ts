export type ArrayOrSingle<T> = T | T[]

export type Concrete<Type> = {
  [Property in keyof Type]-?: Type[Property]
}

export type CreateImmutable<Type> = {
  +readonly [Property in keyof Type]: Type[Property]
}

export type CreateMutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property]
}

export type JSONValue = string | number | boolean | { [x: string]: JSONValue } | JSONValue[]

export type ModifyType<T, R> = Omit<T, keyof R> & R

export type Opaque<K, T = string> = T & { __TYPE__: K }

export type StringOrStringArray = ArrayOrSingle<string>
