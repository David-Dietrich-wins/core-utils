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
  const aic: IConfig<number> = {
      created: new Date(),
      createdby: 'test',
      id: 1,
      name: 'name',
      updated: new Date(),
      updatedby: 'test',
      userid: 1,
      val: true,
    },
    config = new Config(aic, 0, '', false)

  expect(config.id).toBe(1)
  expect(config.userid).toBe(1)
  expect(config.name).toBe('name')
  expect(config.val).toBe(true)
  expect(config.createdby).toBe('test')
  expect(config.updatedby).toBe('test')

  expect(config.created).toBe(aic.created)
  expect(config.createdby).toBe(aic.createdby)
  expect(config.updated).toBe(aic.updated)
  expect(config.updatedby).toBe(aic.updatedby)

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
    const aic: IConfigShort<number> = {
        created: new Date(),
        createdby: 'test',
        id: 1,
        k: 1,
        updated: new Date(),
        updatedby: 'test',
        userid: 1,
        v: 1,
      },
      config = new ConfigShort(aic, 0, 1, false)

    expect(config.id).toBe(1)
    expect(config.userid).toBe(1)
    expect(config.k).toBe(1)
    expect(config.v).toBe(1)
    expect(config.createdby).toBe('test')
    expect(config.updatedby).toBe('test')

    expect(config.created).toBe(aic.created)
    expect(config.createdby).toBe(aic.createdby)
    expect(config.updated).toBe(aic.updated)
    expect(config.updatedby).toBe(aic.updatedby)

    expect(config.api()).toEqual({ name: '1', val: 1 })
  })
})
