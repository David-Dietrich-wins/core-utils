export interface IUserMainDatabase {
  active?: boolean
  birthDate?: string
  // description: string
  email: string
  firstName: string
  fullName: string
  id: string
  imageUrl: string
  lastName: string
  middleName: string
  mobilePhone: string
  // newUserDbId: string
  phone1: string
  verified: boolean

  roles: string[]
}

export class UserMainDatabase implements IUserMainDatabase {
  active = false
  birthDate = ''
  // description = ''
  email = ''
  firstName = ''
  fullName = ''
  id = ''
  imageUrl = ''
  lastName = ''
  middleName = ''
  mobilePhone = ''
  // newUserDbId = ''
  phone1 = ''
  verified = false

  roles = ['user']

  constructor(
    email?: string,
    firstName?: string,
    middleName?: string,
    lastName?: string,
    // displayName?: string,
    mobilePhone?: string,
    // description?: string,
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
