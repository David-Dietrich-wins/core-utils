import { IIdRequired } from './IdManager.mjs'

export interface IUserMainDatabase extends IIdRequired<string> {
  active?: boolean
  birthDate?: string
  // Description: string
  email: string
  firstName: string
  fullName: string
  imageUrl: string
  insertInstant?: number
  lastLoginInstant?: number
  lastUpdateInstant?: number
  lastName: string
  middleName: string
  mobilePhone: string
  passwordChangeRequired?: boolean
  passwordLastUpdateInstant?: number
  // NewUserDbId: string
  phone1: string
  usernameStatus?: string
  verified: boolean

  roles: string[]
}

export class UserMainDatabase implements IUserMainDatabase {
  active = false
  birthDate = ''
  // Description = ''
  email = ''
  firstName = ''
  fullName = ''
  id = ''
  imageUrl = ''
  lastName = ''
  middleName = ''
  mobilePhone = ''
  // NewUserDbId = ''
  phone1 = ''
  verified = false

  roles = ['user']

  constructor(
    email?: string,
    firstName?: string,
    middleName?: string,
    lastName?: string,
    // DisplayName?: string,
    mobilePhone?: string,
    // Description?: string,
    imageUrl?: string,
    fullName?: string,
    birthDate?: string,
    verified?: boolean,
    active?: boolean,
    id?: string
  ) {
    this.birthDate = birthDate ?? '1977-07-07'
    this.email = email ?? ''
    this.firstName = firstName ?? ''
    this.fullName = fullName ?? ''
    this.imageUrl = imageUrl ?? ''
    this.lastName = lastName ?? ''
    this.middleName = middleName ?? ''
    this.mobilePhone = mobilePhone ?? '999-999-9999'
    this.phone1 = mobilePhone ?? ''
    this.verified = verified ?? false
    this.active = active ?? false
    this.id = id ?? ''
  }
}
