import { IVal } from './interfaces'

export interface IKeyVal<Tval = string, Tkey = string> extends IVal<Tval> {
  key: Tkey
}

export class KeyVal<Tval = string, Tkey = string> implements IKeyVal<Tval, Tkey> {
  key: Tkey
  val: Tval

  constructor(key: Tkey, val: Tval) {
    this.key = key
    this.val = val
  }
}

export type KeyValType<Tval = string, Tkey = string> = {
  key: Tkey
  val: Tval
}

export interface IKeyValueShort<Tval = string, Tkey = string> {
  k: Tkey
  v: Tval
}

export class KeyValueShort<Tval = string, Tkey = string> implements IKeyValueShort<Tval, Tkey> {
  k: Tkey
  v: Tval

  constructor(key: Tkey, value: Tval) {
    this.k = key
    this.v = value
  }
}

export type KeyValueShortType<Tval = string, Tkey = string> = {
  k: Tkey
  v: Tval
}
