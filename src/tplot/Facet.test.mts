import { Facet, IFacet } from './Facet.mjs'

test('constructor', () => {
  const facet = new Facet('TestFacet', 'symbol', 'resolution', 42)
  expect(facet.name).toBe('TestFacet')
  expect(facet.symbol).toBe('symbol')
  expect(facet.resolution).toBe('resolution')
  expect(facet.val).toBe(42)
})

test('copyFromDatabase', () => {
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
    facet = new Facet(dbFacet, dbFacet.symbol, dbFacet.resolution, dbFacet.val)

  expect(facet.id).toBe('1')
  expect(facet.createdby).toBe('user1')
  expect(facet.updatedby).toBe('user1')
  expect(facet.created).toEqual(dbFacet.created)
  expect(facet.updated).toEqual(dbFacet.updated)
  expect(facet.name).toBe('TestFacet')
  expect(facet.symbol).toBe('symbol')
  expect(facet.resolution).toBe('resolution')
  expect(facet.val).toBe(42)
})
