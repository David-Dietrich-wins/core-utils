export type AnyFixLater = unknown
export type JSONValue = string | number | boolean | { [x: string]: JSONValue } | JSONValue[]

export type Concrete<Type> = {
  [Property in keyof Type]-?: Type[Property]
}

export type CreateImmutable<Type> = {
  +readonly [Property in keyof Type]: Type[Property]
}

export type CreateMutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property]
}

export type ModifyType<T, R> = Omit<T, keyof R> & R

export type TypeOrArray<T> = T | T[]
export type StringOrStringArray = TypeOrArray<string>
