import { Config, ConfigShort, IConfig, IConfigShort } from './config.mjs'

test('constructor', () => {
  const config = new Config(1, 1, 'name', true)

  expect(config.id).toBe(1)
  expect(config.userid).toBe(1)
  expect(config.name).toBe('name')
  expect(config.val).toBe(true)
  expect(config.createdby).toBe('Config')
  expect(config.updatedby).toBe('Config')
})

test('constructor with IConfig', () => {
  const ic: IConfig<number> = {
    id: 1,
    userid: 1,
    name: 'name',
    val: true,
    created: new Date(),
    createdby: 'test',
    updated: new Date(),
    updatedby: 'test',
  }
  const config = new Config(ic, 0, '', false)

  expect(config.id).toBe(1)
  expect(config.userid).toBe(1)
  expect(config.name).toBe('name')
  expect(config.val).toBe(true)
  expect(config.createdby).toBe('test')
  expect(config.updatedby).toBe('test')

  expect(config.created).toBe(ic.created)
  expect(config.createdby).toBe(ic.createdby)
  expect(config.updated).toBe(ic.updated)
  expect(config.updatedby).toBe(ic.updatedby)

  expect(config.api()).toEqual({ name: 'name', val: true })
})

describe('ConfigShort', () => {
  test('constructor', () => {
    const config = new ConfigShort('1', '1', 'name', true)

    expect(config.id).toBe('1')
    expect(config.userid).toBe('1')
    expect(config.k).toBe('name')
    expect(config.v).toBe(true)
    expect(config.createdby).toBe('Config')
    expect(config.updatedby).toBe('Config')
  })

  test('constructor with IConfig', () => {
    const ic: IConfigShort<number> = {
      id: 1,
      userid: 1,
      k: 1,
      v: 1,
      created: new Date(),
      createdby: 'test',
      updated: new Date(),
      updatedby: 'test',
    }
    const config = new ConfigShort(ic, 0, 1, false)

    expect(config.id).toBe(1)
    expect(config.userid).toBe(1)
    expect(config.k).toBe(1)
    expect(config.v).toBe(1)
    expect(config.createdby).toBe('test')
    expect(config.updatedby).toBe('test')

    expect(config.created).toBe(ic.created)
    expect(config.createdby).toBe(ic.createdby)
    expect(config.updated).toBe(ic.updated)
    expect(config.updatedby).toBe(ic.updatedby)

    expect(config.api()).toEqual({ name: '1', val: 1 })
  })
})
