import { UserMainDatabase } from './UserMainDatabase.mjs'

it('UserMainDatabase', () => {
  const user = new UserMainDatabase()

  expect(user).toBeInstanceOf(UserMainDatabase)
  expect(user.active).toBe(false)
  expect(user.birthDate).toBe('1977-07-07')
  expect(user.email).toBe('')
  expect(user.firstName).toBe('')
  expect(user.fullName).toBe('')
  expect(user.imageUrl).toBe('')
  expect(user.lastName).toBe('')
  expect(user.middleName).toBe('')
  expect(user.mobilePhone).toBe('999-999-9999')
  expect(user.phone1).toBe('')
  expect(user.verified).toBe(false)
  expect(user.roles).toEqual(['user'])
  expect(user.id).toBe('')
})
