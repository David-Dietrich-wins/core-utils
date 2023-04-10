import { AnyFixLater } from './types'

export interface IAnyStringItems {
  [id: string]: AnyFixLater
}

export interface ICreatedBy {
  createdby: string
  created: Date
}
export interface IUpdatedBy {
  updatedby: string
  updated: Date
}

export interface ICreatedOnBy {
  createdby: string
  createdon: Date
}
export interface IUpdatedOnBy {
  updatedby?: string
  updatedon?: Date
}

export interface IDate<T = string> {
  date: T
}

export interface I_Id<T = string> {
  _id?: T
}

export interface IId<T = string> {
  id?: T
}

export interface IName<T = string> {
  name: T
}

export interface IPrice {
  price: number
}

export interface ISlug {
  slug: string
}

export interface IType<T = string> {
  type: T
}

export interface IVal<T> {
  val: T
}

export interface IValue<T> {
  value: T
}

export interface IJwt {
  jwt: string
}
