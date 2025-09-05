import {
  Config,
  ConfigShort,
  type IConfig,
  type IConfigShort,
} from './config.mjs'
import { describe, expect, it } from '@jest/globals'

describe('constructor', () => {
  it('good', () => {
    expect.assertions(6)

    const config = new Config(1, 1, 'name', true)

    expect(config.id).toBe(1)
    expect(config.userid).toBe(1)
    expect(config.name).toBe('name')
    expect(config.val).toBe(true)
    expect(config.createdby).toBe('Config')
    expect(config.updatedby).toBe('Config')
  })

  it('with IConfig', () => {
    expect.assertions(11)

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

    expect(config.api()).toStrictEqual({ name: 'name', val: true })
  })
})

describe('config short', () => {
  it('constructor', () => {
    expect.assertions(6)

    const config = new ConfigShort('1', '1', 'name', true)

    expect(config.id).toBe('1')
    expect(config.userid).toBe('1')
    expect(config.k).toBe('name')
    expect(config.v).toBe(true)
    expect(config.createdby).toBe('Config')
    expect(config.updatedby).toBe('Config')
  })

  it('constructor with IConfig', () => {
    expect.assertions(11)

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

    expect(config.api()).toStrictEqual({ name: '1', val: 1 })
  })
})
