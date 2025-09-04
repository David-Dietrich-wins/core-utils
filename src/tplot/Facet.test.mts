import { Facet, type IFacet } from './Facet.mjs'
import { describe, expect, it } from '@jest/globals'

describe('constructor', () => {
  it('good', () => {
    expect.hasAssertions()

    const facet = new Facet('TestFacet', 'symbol', 'resolution', 42)

    expect(facet.name).toBe('TestFacet')
    expect(facet.symbol).toBe('symbol')
    expect(facet.resolution).toBe('resolution')
    expect(facet.val).toBe(42)
  })
})

describe('copyFromDatabase', () => {
  it('should copy properties from a database facet', () => {
    expect.hasAssertions()

    const dbFacet: IFacet<number> = {
        created: new Date(),
        createdby: 'user1',
        id: '1',
        name: 'TestFacet',
        resolution: 'resolution',
        symbol: 'symbol',
        updated: new Date(),
        updatedby: 'user1',
        val: 42,
      },
      facet = new Facet(
        dbFacet,
        dbFacet.symbol,
        dbFacet.resolution,
        dbFacet.val
      )

    expect(facet.id).toBe('1')
    expect(facet.createdby).toBe('user1')
    expect(facet.updatedby).toBe('user1')
    expect(facet.created).toStrictEqual(dbFacet.created)
    expect(facet.updated).toStrictEqual(dbFacet.updated)
    expect(facet.name).toBe('TestFacet')
    expect(facet.symbol).toBe('symbol')
    expect(facet.resolution).toBe('resolution')
    expect(facet.val).toBe(42)
  })
})
