import {
  CreatePolitiscaleSearchParams,
  type IPolitiscale,
  Politiscale,
  PolitiscalesCreateAll,
} from './politiscale.mjs'
import { describe, expect, it } from '@jest/globals'

describe('constructor', () => {
  it('with params', () => {
    expect.assertions(1)

    const politiscale = new Politiscale('freeSpeech', 10)

    expect(politiscale).toStrictEqual(
      expect.objectContaining({
        name: 'freeSpeech',
        value: 10,
      })
    )
  })

  it('with object', () => {
    expect.assertions(1)

    const ip: IPolitiscale = { name: 'religion', value: 5 },
      politiscale = new Politiscale(ip, 0)

    expect(politiscale).toStrictEqual(
      expect.objectContaining({
        name: 'religion',
        value: 5,
      })
    )
  })
})

describe('createPolitiscaleSearchParams', () => {
  it('no params', () => {
    expect.assertions(1)

    const ret = CreatePolitiscaleSearchParams({
      sortDirection: 'desc',
      term: 'test',
    })

    expect(ret).toStrictEqual({
      climate: 0,
      exactMatch: false,
      freeSpeech: 0,
      limit: 0,
      offset: 0,
      pageIndex: 0,
      pageSize: 0,
      religion: 0,
      sortColumn: '',
      sortDirection: 'desc',
      term: 'test',
    })
  })
})

describe('politiscalesCreateAll', () => {
  it('creates all politiscales', () => {
    expect.assertions(1)

    const ret = PolitiscalesCreateAll({
      climate: 5,
      freeSpeech: 10,
    })

    expect(ret).toStrictEqual({
      climate: 5,
      freeSpeech: 10,
      religion: 0,
    })
  })
})
