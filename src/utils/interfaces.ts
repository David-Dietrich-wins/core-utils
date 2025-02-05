<<<<<<< HEAD
import { Document, ObjectId } from 'bson'
import { AnyFixLater } from './types.js'

export type StringOrObjectId = string | ObjectId

export interface IAnyStringItems {
  [key: string]: AnyFixLater
}

=======
>>>>>>> 5ed179635b17d3454802648186c6b4d535190e23
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

export interface Iid<T = string> {
  id?: T
}

export interface I_id<T = ObjectId> {
  _id?: T
}

export interface ITableId extends Document, I_id {}

export interface ITableIdUser extends ITableId {
  userid: StringOrObjectId
}
export interface ITableIdUserOptional extends ITableId {
  userid?: StringOrObjectId
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
