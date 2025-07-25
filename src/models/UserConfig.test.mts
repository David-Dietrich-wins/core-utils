import { UserConfig } from './UserConfig.mjs'

test('create an instance', () => {
  const userConfig = new UserConfig('userId', 'key', 'value')

  expect(userConfig).toBeInstanceOf(UserConfig)
  expect(userConfig.k).toBe('key')
  expect(userConfig.v).toBe('value')
  expect(userConfig.userid).toBe('userId')
  expect(userConfig.updatedby).toBe('Config')
  expect(userConfig.updated).toBeInstanceOf(Date)
  expect(userConfig.createdby).toBe('Config')
  expect(userConfig.created).toBeInstanceOf(Date)
})

test('copyFromDatabase', () => {
  let userConfig = new UserConfig('userId', 'key', 'value')
  const dbtp = {
    created: new Date('2025-12-01T12:00:00.000Z'),
    createdby: 'newCreatedBy',
    k: 'newKey',
    updated: new Date('2025-12-01T12:00:00.000Z'),
    updatedby: 'newUpdatedBy',
    userid: 'newUserId',
    v: 'newValue',
  }

  userConfig.copyFromDatabase(dbtp)

  expect(userConfig.k).toBe('newKey')
  expect(userConfig.v).toBe('newValue')
  expect(userConfig.userid).toBe('newUserId')
  expect(userConfig.updatedby).toBe('newUpdatedBy')
  expect(userConfig.updated).toEqual(new Date('2025-12-01T12:00:00.000Z'))
  expect(userConfig.createdby).toBe('newCreatedBy')
  expect(userConfig.created).toEqual(new Date('2025-12-01T12:00:00.000Z'))

  userConfig = new UserConfig('userId', '', '')
  userConfig.copyFromDatabase({ ...dbtp, k: '' })
  expect(userConfig.k).toBe('')
  expect(userConfig.v).toBe('newValue')
  expect(userConfig.userid).toBe('newUserId')
  expect(userConfig.updatedby).toBe('newUpdatedBy')
  expect(userConfig.updated).toEqual(new Date('2025-12-01T12:00:00.000Z'))
  expect(userConfig.createdby).toBe('newCreatedBy')
  expect(userConfig.created).toEqual(new Date('2025-12-01T12:00:00.000Z'))

  userConfig = new UserConfig('userId', '', '')
  userConfig.copyFromDatabase({ ...dbtp, v: '' })
  expect(userConfig.k).toBe('newKey')
  expect(userConfig.v).toBe('')
  expect(userConfig.userid).toBe('newUserId')
  expect(userConfig.updatedby).toBe('newUpdatedBy')
  expect(userConfig.updated).toEqual(new Date('2025-12-01T12:00:00.000Z'))
  expect(userConfig.createdby).toBe('newCreatedBy')
  expect(userConfig.created).toEqual(new Date('2025-12-01T12:00:00.000Z'))
})

test('fromApi good', () => {
  const nameVal = { name: 'key', val: 'value' },
    userConfig = UserConfig.fromApi(
      undefined,
      nameVal,
      'userId',
      'email@email.com'
    )

  expect(userConfig.k).toBe('key')
  expect(userConfig.v).toBe('value')
  expect(userConfig.userid).toBe('userId')
  expect(userConfig.updatedby).toBe('email@email.com')
  expect(userConfig.updated).toBeInstanceOf(Date)
  expect(userConfig.createdby).toBe('email@email.com')
  expect(userConfig.created).toBeInstanceOf(Date)
})

test('fromNameVal good', () => {
  const nameVal = { name: 'key', val: 'value' },
    userConfig = UserConfig.fromNameVal(nameVal, 'userId', 'email@email.com')

  expect(userConfig.k).toBe('key')
  expect(userConfig.v).toBe('value')
  expect(userConfig.userid).toBe('userId')
  expect(userConfig.updatedby).toBe('email@email.com')
  expect(userConfig.updated).toBeInstanceOf(Date)
  expect(userConfig.createdby).toBe('email@email.com')
  expect(userConfig.created).toBeInstanceOf(Date)
})

test('api', () => {
  const userConfig = new UserConfig('userId', 'key', 'value'),
    userData = userConfig.api()

  expect(userData).toEqual({ name: 'key', val: 'value' })
  expect(userData.name).toBe('key')
  expect(userData.val).toBe('value')
  expect(userConfig.k).toBe('key')
  expect(userConfig.v).toBe('value')
  expect(userConfig.userid).toBe('userId')
  expect(userConfig.updatedby).toBe('Config')
  expect(userConfig.updated).toBeInstanceOf(Date)
  expect(userConfig.createdby).toBe('Config')
  expect(userConfig.created).toBeInstanceOf(Date)
})
