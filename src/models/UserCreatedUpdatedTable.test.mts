/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import { type AnyObject, type AnyRecord } from './types.mjs'
import {
  CreatedTable,
  CreatedUpdatedTable,
  type ICreatedTable,
  type ICreatedUpdatedTable,
  type IUserCreatedUpdatedTable,
  UserCreatedUpdatedTable,
} from './UserCreatedUpdatedTable.mjs'

describe('CreatedTable', () => {
  it('constructor string', () => {
    const createTable = new CreatedTable('IdCreatedUpdated')

    expect(createTable).toBeInstanceOf(CreatedTable)
    expect(createTable.createdby).toBe('IdCreatedUpdated')
    expect(createTable.created).toBeInstanceOf(Date)
  })

  it('constructor all items', () => {
    const createTable = new CreatedTable(
      'IdCreatedUpdated',
      new Date('2025-12-01T12:00:00.000Z')
    )

    expect(createTable).toBeInstanceOf(CreatedTable)
    expect(createTable.createdby).toBe('IdCreatedUpdated')
    expect(createTable.created).toBeInstanceOf(Date)
  })

  it('constructor object', () => {
    const acreatedTable: ICreatedTable = {
        created: new Date('2025-12-01T12:00:00.000Z'),
        createdby: 'IdCreatedUpdated',
      },
      createTable = new CreatedTable(acreatedTable)

    expect(createTable).toBeInstanceOf(CreatedTable)
    expect(createTable.createdby).toBe('IdCreatedUpdated')
    expect(createTable.created).toBeInstanceOf(Date)
  })

  it('copyFromDatabase', () => {
    const icreatedTable: ICreatedTable = {
      created: new Date('2025-12-01T12:00:00.000Z'),
      createdby: 'IdCreatedUpdated',
    }

    let createTable = new CreatedTable()
    expect(createTable).toBeInstanceOf(CreatedTable)
    expect(createTable.createdby).toBe('IdCreatedUpdated')
    expect(createTable.created).toBeInstanceOf(Date)

    let ret = createTable.copyFromDatabase(icreatedTable)
    expect(ret).toBeUndefined()
    expect(createTable.createdby).toBe('IdCreatedUpdated')
    expect(createTable.created).toBeInstanceOf(Date)

    createTable = new CreatedTable()
    ret = createTable.copyFromDatabase({ ...icreatedTable, createdby: '' })
    expect(ret).toBeUndefined()
    expect(createTable.createdby).toBe('IdCreatedUpdated')
    expect(createTable.created).toBeInstanceOf(Date)

    createTable = new CreatedTable({} as ICreatedTable)
    expect(createTable.createdby).toBe(undefined)
    expect(createTable.created).toBeInstanceOf(Date)
  })
})

describe('CreatedUpdatedTable', () => {
  it('constructor string', () => {
    const createTable = new CreatedUpdatedTable('IdCreatedUpdated')

    expect(createTable).toBeInstanceOf(CreatedUpdatedTable)
    expect(createTable.createdby).toBe('IdCreatedUpdated')
    expect(createTable.created).toBeInstanceOf(Date)
  })

  it('constructor all items', () => {
    const createTable = new CreatedUpdatedTable(
      'IdCreatedUpdated',
      new Date('2025-12-01T12:00:00.000Z')
    )

    expect(createTable).toBeInstanceOf(CreatedUpdatedTable)
    expect(createTable.createdby).toBe('IdCreatedUpdated')
    expect(createTable.created).toBeInstanceOf(Date)
  })

  it('constructor object', () => {
    const acreatedTable: ICreatedUpdatedTable = {
        created: new Date('2025-12-01T12:00:00.000Z'),
        createdby: 'IdCreatedUpdated',
        updated: new Date('2025-12-01T12:00:00.000Z'),
        updatedby: 'IdCreatedUpdated',
      },
      createTable = new CreatedUpdatedTable(acreatedTable)

    expect(createTable).toBeInstanceOf(CreatedTable)
    expect(createTable.createdby).toBe('IdCreatedUpdated')
    expect(createTable.created).toBeInstanceOf(Date)
    expect(createTable.updatedby).toBe('IdCreatedUpdated')
    expect(createTable.updated).toBeInstanceOf(Date)
  })

  it('copyFromDatabase', () => {
    const icreatedTable: ICreatedUpdatedTable = {
      created: new Date('2025-12-01T12:00:00.000Z'),
      createdby: 'IdCreatedUpdated',
      updated: new Date('2025-12-01T12:00:00.000Z'),
      updatedby: 'IdCreatedUpdated',
    }

    let createTable = new CreatedUpdatedTable()
    expect(createTable).toBeInstanceOf(CreatedUpdatedTable)
    expect(createTable.createdby).toBe('IdCreatedUpdated')
    expect(createTable.created).toBeInstanceOf(Date)
    expect(createTable.updatedby).toBe('IdCreatedUpdated')
    expect(createTable.updated).toBeInstanceOf(Date)

    const ret = createTable.copyFromDatabase(icreatedTable)
    expect(ret).toBeUndefined()
    expect(createTable.createdby).toBe('IdCreatedUpdated')
    expect(createTable.created).toBeInstanceOf(Date)
    expect(createTable.updatedby).toBe('IdCreatedUpdated')
    expect(createTable.updated).toBeInstanceOf(Date)

    createTable = new CreatedUpdatedTable({
      createdby: '',
    } as ICreatedUpdatedTable)
    expect(createTable).toBeInstanceOf(CreatedUpdatedTable)
    expect(createTable.createdby).toBe('IdCreatedUpdated')
    expect(createTable.created).toBeInstanceOf(Date)
    expect(createTable.updatedby).toBe(undefined)
    expect(createTable.updated).toBeInstanceOf(Date)
  })
})

describe('UserCreatedUpdatedTable', () => {
  it('constructor string', () => {
    const createTable = new UserCreatedUpdatedTable('IdCreatedUpdated')

    expect(createTable).toBeInstanceOf(UserCreatedUpdatedTable)
    expect(createTable.createdby).toBe('IdUserCreatedUpdated')
    expect(createTable.created).toBeInstanceOf(Date)
  })

  it('constructor all items', () => {
    const createTable = new UserCreatedUpdatedTable(
      'userId-123',
      'IdCreatedUpdated',
      new Date('2025-12-01T12:00:00.000Z')
    )

    expect(createTable).toBeInstanceOf(UserCreatedUpdatedTable)
    expect(createTable.createdby).toBe('IdUserCreatedUpdated')
    expect(createTable.created).toBeInstanceOf(Date)
    expect(createTable.userid).toBe('userId-123')
  })

  it('constructor object', () => {
    const acreatedTable: IUserCreatedUpdatedTable = {
        created: new Date('2025-12-01T12:00:00.000Z'),
        createdby: 'IdCreatedUpdated',
        updated: new Date('2025-12-01T12:00:00.000Z'),
        updatedby: 'IdCreatedUpdated',
        userid: 'userId-123',
      },
      createTable = new UserCreatedUpdatedTable(acreatedTable)

    expect(createTable).toBeInstanceOf(UserCreatedUpdatedTable)
    expect(createTable.createdby).toBe('IdCreatedUpdated')
    expect(createTable.created).toBeInstanceOf(Date)
    expect(createTable.updatedby).toBe('IdCreatedUpdated')
    expect(createTable.updated).toBeInstanceOf(Date)
    expect(createTable.userid).toBe('userId-123')
  })

  it('copyFromDatabase', () => {
    const icreatedTable: IUserCreatedUpdatedTable = {
      created: new Date('2025-12-01T12:00:00.000Z'),
      createdby: 'IdCreatedUpdated',
      updated: new Date('2025-12-01T12:00:00.000Z'),
      updatedby: 'IdCreatedUpdated',
      userid: 'userId-123',
    }

    let createTable = new UserCreatedUpdatedTable()
    expect(createTable).toBeInstanceOf(UserCreatedUpdatedTable)
    expect(createTable.createdby).toBe('IdUserCreatedUpdated')
    expect(createTable.created).toBeInstanceOf(Date)
    expect(createTable.updatedby).toBe('IdUserCreatedUpdated')
    expect(createTable.updated).toBeInstanceOf(Date)
    expect(createTable.userid).toBeUndefined()

    let ret = createTable.copyFromDatabase(icreatedTable)
    expect(ret).toBeUndefined()
    expect(createTable.createdby).toBe('IdCreatedUpdated')
    expect(createTable.created).toBeInstanceOf(Date)
    expect(createTable.updatedby).toBe('IdCreatedUpdated')
    expect(createTable.updated).toBeInstanceOf(Date)
    expect(createTable.userid).toBe('userId-123')

    createTable = new UserCreatedUpdatedTable()
    ret = createTable.copyFromDatabase({ ...icreatedTable, userid: '' })
    expect(ret).toBeUndefined()
    expect(createTable.createdby).toBe('IdCreatedUpdated')
    expect(createTable.created).toBeInstanceOf(Date)
    expect(createTable.updatedby).toBe('IdCreatedUpdated')
    expect(createTable.updated).toBeInstanceOf(Date)
    expect(createTable.userid).toBeUndefined()
  })

  describe('fixupForUpsert', () => {
    it('not an update', () => {
      const icreatedTable: IUserCreatedUpdatedTable = {
          created: new Date('2025-12-01T12:00:00.000Z'),
          createdby: '',
          updated: new Date('2025-12-01T12:00:00.000Z'),
          updatedby: '',
          userid: 'userId-123',
        },
        ret = UserCreatedUpdatedTable.fixupForUpsert(icreatedTable, 'tester')
      expect(ret).toBe(false)
      expect(icreatedTable.createdby).toBe('tester')
      expect(icreatedTable.created).toBeInstanceOf(Date)
      expect(icreatedTable.updatedby).toBe('tester')
      expect(icreatedTable.updated).toBeInstanceOf(Date)
    })

    it('empty object', () => {
      // Const icreatedTable: IUserCreatedUpdatedTable = {
      //   Userid: 'userId-123',
      //   Updatedby: '',
      //   Updated: new Date('2025-12-01T12:00:00.000Z'),
      //   Createdby: '',
      //   Created: new Date('2025-12-01T12:00:00.000Z'),
      // }

      const obj: AnyObject = {
          createdby: 'a',
        },
        ret = UserCreatedUpdatedTable.fixupForUpsert(obj, 'tester')
      expect(ret).toBe(false)
      expect(obj.createdby).toBe('a')
      expect(obj.created).toBeInstanceOf(Date)
      expect(obj.updatedby).toBe('tester')
      expect(obj.updated).toBeInstanceOf(Date)
    })

    it('fixupForUpsert with dateToSetTo', () => {
      const icreatedTable: IUserCreatedUpdatedTable = {
          created: new Date('2025-12-01T12:00:00.000Z'),
          createdby: '',
          updated: new Date('2025-12-01T12:00:00.000Z'),
          updatedby: '',
          userid: 'userId-123',
        },
        ret = UserCreatedUpdatedTable.fixupForUpsert(
          icreatedTable,
          'tester',
          new Date('2025-12-01T12:00:00.000Z')
        )
      expect(ret).toBe(false)
      expect(icreatedTable.createdby).toBe('tester')
      expect(icreatedTable.created).toBeInstanceOf(Date)
      expect(icreatedTable.updatedby).toBe('tester')
      expect(icreatedTable.updated).toBeInstanceOf(Date)
    })

    it('fixupForUpsert empty items', () => {
      const obj: AnyObject = {},
        ret = UserCreatedUpdatedTable.fixupForUpsert(obj, 'tester')
      expect(ret).toBe(false)
      expect(obj.createdby).toBe('tester')
      expect(obj.created).toBeInstanceOf(Date)
      expect(obj.updatedby).toBe('tester')
      expect(obj.updated).toBeInstanceOf(Date)
    })
    it('fixupForUpsert exception', () => {
      const createTable = null
      expect(() =>
        UserCreatedUpdatedTable.fixupForUpsert(
          createTable as unknown as AnyRecord,
          'tester'
        )
      ).toThrow()
    })
  })
})
