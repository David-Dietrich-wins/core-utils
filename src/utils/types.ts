<<<<<<< HEAD
export type AnyFixLater = unknown

export type TypeOrArray<T> = T | T[]
export type StringOrStringArray = TypeOrArray<string>
=======
>>>>>>> 5ed179635b17d3454802648186c6b4d535190e23
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
<<<<<<< HEAD
=======

export type StringOrStringArray = ArrayOrSingle<string>
>>>>>>> 5ed179635b17d3454802648186c6b4d535190e23
