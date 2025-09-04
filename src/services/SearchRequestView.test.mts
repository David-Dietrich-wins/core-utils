import * as z from 'zod/v4'
import {
  type ISearchRequestView,
  SearchRequestView,
} from './SearchRequestView.mjs'
import { GenerateRandomString } from '../primitives/string-helper.mjs'
import { type IIdNameValue } from '../models/id-name.mjs'
import { numberToString } from '../primitives/number-helper.mjs'

it('constructor string', () => {
  const searchRequestView = new SearchRequestView(
    'test',
    'column',
    'asc',
    10,
    0,
    true
  )
  expect(searchRequestView.term).toBe('test')
  expect(searchRequestView.sortColumn).toBe('column')
  expect(searchRequestView.sortDirection).toBe('asc')
  expect(searchRequestView.limit).toBe(10)
  expect(searchRequestView.offset).toBe(0)
  expect(searchRequestView.exactMatch).toBe(true)
})

it('constructor term array', () => {
  const searchRequestView = new SearchRequestView(
    ['test', 'abc'],
    'column',
    'asc',
    10,
    0,
    true
  )
  expect(searchRequestView.term).toEqual(['test', 'abc'])
  expect(searchRequestView.sortColumn).toBe('column')
  expect(searchRequestView.sortDirection).toBe('asc')
  expect(searchRequestView.limit).toBe(10)
  expect(searchRequestView.offset).toBe(0)
  expect(searchRequestView.exactMatch).toBe(true)
})

it('constructor object', () => {
  const isrv: ISearchRequestView = {
      exactMatch: true,
      limit: 10,
      offset: 0,
      pageIndex: 0,
      pageSize: 20,
      sortColumn: 'column',
      sortDirection: 'asc',
      term: 'test',
    },
    srv = new SearchRequestView(isrv)
  expect(srv.term).toBe('test')
  expect(srv.sortColumn).toBe('column')
  expect(srv.sortDirection).toBe('asc')
  expect(srv.limit).toBe(10)
  expect(srv.offset).toBe(0)
  expect(srv.exactMatch).toBe(true)

  srv.clear()
  expect(srv.term).toBe('')
  expect(srv.sortColumn).toBe('')
  expect(srv.sortDirection).toBe('asc')
  expect(srv.limit).toBe(0)
  expect(srv.offset).toBe(0)
  expect(srv.exactMatch).toBe(false)
  expect(srv.pageIndex).toBe(0)
  expect(srv.pageSize).toBe(0)
  expect(srv.searchColumns).toBeUndefined()

  expect(srv.isAscending).toBe(true)
  expect(srv.isDescending).toBe(false)
})

it('pageIndex and pageSize', () => {
  const isrv: ISearchRequestView = {
      exactMatch: true,
      limit: 12,
      offset: 0,
      pageIndex: 2,
      pageSize: 20,
      sortColumn: 'column',
      sortDirection: 'asc',
      term: 'test',
    },
    srv = new SearchRequestView(isrv)
  expect(srv.pageIndex).toBe(2)
  expect(srv.pageSize).toBe(20)
  expect(srv.calculatedPageSize).toBe(20)
  srv.pageSize = 0
  expect(srv.calculatedPageSize).toBe(12)
  expect(srv.calculatedOffset).toBe(24)

  expect(srv.capLimit(10)).toBe(10)
  expect(srv.capLimit(20)).toBe(10)
  srv.limit = 0
  expect(srv.capLimit(10)).toBe(10)
  expect(srv.capLimit(20)).toBe(10)
})

describe('getItems', () => {
  it('limit', () => {
    const items: IIdNameValue<string, number>[] = []
    for (let i = 0; i < 100; i++) {
      const randomString = `${numberToString(i)}-${GenerateRandomString(10)}`

      items.push({
        id: i,
        name: i < 50 ? `xxxxX-${randomString}` : randomString,
        value: `Value ${numberToString(i)}`,
      })
    }

    const srv = new SearchRequestView('test', 'name', 'asc', 10, 0, true),
      [result, count] = srv.getItems(items, 10)
    expect(result.length).toBe(10)
    expect(count).toBe(100)

    srv.limit = 20
    const [result2, count2] = srv.getItems(items)
    expect(result2.length).toBe(20)
    expect(count2).toBe(100)

    srv.limit = 0
    srv.sortColumn = ''
    const [result3, count3] = srv.getItems(items, 30, 'value', false)
    expect(result3.length).toBe(30)
    expect(count3).toBe(100)
    expect(srv.sortColumn).toBe('value')
    expect(srv.sortDirection).toBe('asc')
    expect(srv.limit).toBe(30)
    expect(srv.offset).toBe(0)
    expect(srv.exactMatch).toBe(true)

    srv.exactMatch = false
    srv.term = 'xxxxX'
    srv.searchColumns = ['name']
    const [result4, count4] = srv.getItems(items, 30, 'name', true)
    expect(result4.length).toBe(30)
    expect(count4).toBe(50)

    srv.limit = 0
    const [result5, count5] = srv.getItems(items, 24, 'name', false)
    expect(result5.length).toBe(24)
    expect(count5).toBe(50)

    srv.pageIndex = 1
    srv.pageSize = 10
    const [result6, count6] = srv.getItems(items, 24, 'name', false)
    expect(result6.length).toBe(10)
    expect(count6).toBe(50)
    expect(srv.calculatedOffset).toBe(10)
    expect(srv.calculatedPageSize).toBe(10)
    expect(srv.pageIndex).toBe(1)
    expect(srv.pageSize).toBe(10)
    expect(srv.limit).toBe(24)
    expect(srv.sortColumn).toBe('value')
    expect(srv.sortDirection).toBe('asc')
    expect(srv.exactMatch).toBe(false)
    expect(srv.searchColumns).toEqual(['name'])
    expect(srv.term).toBe('xxxxX')
    expect(srv.isAscending).toBe(true)
    expect(srv.isDescending).toBe(false)
    expect(srv.capLimit(10)).toBe(10)

    srv.limit = 13
    srv.offset = 2
    srv.pageIndex = 0
    srv.pageSize = 0
    const [result7, count7] = srv.getItems(items, 24, 'name', false)
    expect(result7.length).toBe(13)
    expect(count7).toBe(50)
    expect(srv.calculatedOffset).toBe(2)
    expect(srv.calculatedPageSize).toBe(13)
    expect(srv.pageIndex).toBe(0)
    expect(srv.pageSize).toBe(0)
    expect(srv.limit).toBe(13)
    expect(srv.sortColumn).toBe('value')
    expect(srv.sortDirection).toBe('asc')
    expect(srv.exactMatch).toBe(false)
    expect(srv.searchColumns).toEqual(['name'])
    expect(srv.term).toBe('xxxxX')
    expect(srv.isAscending).toBe(true)
    expect(srv.isDescending).toBe(false)
    expect(srv.capLimit(10)).toBe(10)

    srv.limit = 0
    srv.offset = 2
    srv.pageIndex = 0
    srv.pageSize = 0
    const [result8, count8] = srv.getItems(items, 0, 'name', false)
    expect(result8.length).toBe(48)
    expect(count8).toBe(50)
    expect(srv.calculatedOffset).toBe(2)
    expect(srv.calculatedPageSize).toBe(0)
    expect(srv.pageIndex).toBe(0)
    expect(srv.pageSize).toBe(0)
    expect(srv.limit).toBe(0)
    expect(srv.sortColumn).toBe('value')
    expect(srv.sortDirection).toBe('asc')
    expect(srv.exactMatch).toBe(false)
    expect(srv.searchColumns).toEqual(['name'])
    expect(srv.term).toBe('xxxxX')
    expect(srv.isAscending).toBe(true)
    expect(srv.isDescending).toBe(false)
    expect(srv.capLimit(10)).toBe(10)

    // Trying to to test line 148
    items.push(items[0])
    srv.term = 'xxxxX'
    const [result9, count9] = srv.getItems(items, 0, 'name', true)
    expect(result9.length).toBe(10)
    expect(count9).toBe(51)
    expect(srv.calculatedOffset).toBe(2)
    expect(srv.calculatedPageSize).toBe(10)
    expect(srv.pageIndex).toBe(0)
    expect(srv.pageSize).toBe(0)
    expect(srv.limit).toBe(10)
    expect(srv.sortColumn).toBe('value')
    expect(srv.sortDirection).toBe('asc')
    expect(srv.exactMatch).toBe(false)
    expect(srv.searchColumns).toEqual(['name'])
    expect(srv.term).toBe('xxxxX')
    expect(srv.isAscending).toBe(true)
    expect(srv.isDescending).toBe(false)
    expect(srv.capLimit(10)).toBe(10)
  })

  it('found true', () => {
    const items: IIdNameValue<string, number>[] = []
    for (let i = 0; i < 10; i++) {
      const randomString = `${numberToString(i)}-${GenerateRandomString(10)}`

      items.push({
        id: i,
        name: randomString,
        value: randomString,
      })
      if (i === 5) {
        items.push({
          id: i,
          name: 'test',
          value: 'test',
        })
      }
    }

    const srv = new SearchRequestView('test', 'name', 'asc', 20, 0, true)
    srv.searchColumns = ['name', 'value']
    const [result, count] = srv.getItems(items, 11)
    expect(result.length).toBe(1)
    expect(count).toBe(1)
  })

  it('offset of 0 when no page size', () => {
    const items: IIdNameValue<string, number>[] = []
    for (let i = 0; i < 10; i++) {
      const randomString = `${numberToString(i)}-${GenerateRandomString(10)}`

      items.push({
        id: i,
        name: randomString,
        value: randomString,
      })
      if (i === 5) {
        items.push({
          id: i,
          name: 'test',
          value: 'test',
        })
      }
    }

    const srv = new SearchRequestView('test', 'name', 'asc', 0, 0, true)
    srv.offset = 0
    srv.searchColumns = ['name', 'value']
    const [result, count] = srv.getItems(items)
    expect(result.length).toBe(1)
    expect(count).toBe(1)
  })

  it('empty search column', () => {
    const items: IIdNameValue<string, number>[] = []
    for (let i = 0; i < 10; i++) {
      const randomString = `${numberToString(i)}-${GenerateRandomString(10)}`

      items.push({
        id: i,
        name: randomString,
        value: randomString,
      })
      if (i === 5) {
        items.push({
          id: i,
          name: 'test',
          value: 'test',
        })
      }
    }

    const srv = new SearchRequestView('test', '', 'asc', 5, 2, true),
      [result, count] = srv.getItems(items, 11)
    expect(result.length).toBe(5)
    expect(count).toBe(11)
  })

  it('numbers', () => {
    const items: IIdNameValue<number, number>[] = []
    for (let i = 0; i < 100; i++) {
      const randomString = `${numberToString(i)}-${GenerateRandomString(10)}`

      items.push({
        id: i,
        name: i < 50 ? `xxxxX-${randomString}` : randomString,
        value: i < 50 ? 100 + i : i,
      })
    }

    const srv = new SearchRequestView('test', 'name', 'asc', 10, 0, true),
      [result, count] = srv.getItems(items, 10)
    expect(result.length).toBe(10)
    expect(count).toBe(100)

    srv.limit = 20
    const [result2, count2] = srv.getItems(items)
    expect(result2.length).toBe(20)
    expect(count2).toBe(100)

    srv.limit = 0
    srv.sortColumn = ''
    const [result3, count3] = srv.getItems(items, 30, 'value', false)
    expect(result3.length).toBe(30)
    expect(count3).toBe(100)
    expect(srv.sortColumn).toBe('value')
    expect(srv.sortDirection).toBe('asc')
    expect(srv.limit).toBe(30)
    expect(srv.offset).toBe(0)
    expect(srv.exactMatch).toBe(true)

    srv.exactMatch = false
    srv.term = '100'
    srv.searchColumns = ['value']
    const [result4, count4] = srv.getItems(items, 30, 'name', true)
    expect(result4.length).toBe(0)
    expect(count4).toBe(0)

    srv.limit = 0
    const [result5, count5] = srv.getItems(items, 24, 'name', false)
    expect(result5.length).toBe(0)
    expect(count5).toBe(0)

    srv.pageIndex = 1
    srv.pageSize = 10
    const [result6, count6] = srv.getItems(items, 24, 'name', false)
    expect(result6.length).toBe(0)
    expect(count6).toBe(0)
    expect(srv.calculatedOffset).toBe(10)
    expect(srv.calculatedPageSize).toBe(10)
    expect(srv.pageIndex).toBe(1)
    expect(srv.pageSize).toBe(10)
    expect(srv.limit).toBe(24)
    expect(srv.sortColumn).toBe('value')
    expect(srv.sortDirection).toBe('asc')
    expect(srv.exactMatch).toBe(false)
    expect(srv.searchColumns).toEqual(['value'])
    expect(srv.term).toBe('100')
    expect(srv.isAscending).toBe(true)
    expect(srv.isDescending).toBe(false)
    expect(srv.capLimit(10)).toBe(10)

    srv.limit = 13
    srv.offset = 2
    srv.pageIndex = 0
    srv.pageSize = 0
    const [result7, count7] = srv.getItems(items, 24, 'name', false)
    expect(result7.length).toBe(0)
    expect(count7).toBe(0)
    expect(srv.calculatedOffset).toBe(2)
    expect(srv.calculatedPageSize).toBe(13)
    expect(srv.pageIndex).toBe(0)
    expect(srv.pageSize).toBe(0)
    expect(srv.limit).toBe(13)
    expect(srv.sortColumn).toBe('value')
    expect(srv.sortDirection).toBe('asc')
    expect(srv.exactMatch).toBe(false)
    expect(srv.searchColumns).toEqual(['value'])
    expect(srv.term).toBe('100')
    expect(srv.isAscending).toBe(true)
    expect(srv.isDescending).toBe(false)
    expect(srv.capLimit(10)).toBe(10)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    srv.term = 100 as any
    srv.limit = 0
    srv.offset = 2
    srv.pageIndex = 0
    srv.pageSize = 0
    const [result8, count8] = srv.getItems(items, 0, 'name', false)
    expect(result8.length).toBe(0)
    expect(count8).toBe(1)
    expect(srv.calculatedOffset).toBe(2)
    expect(srv.calculatedPageSize).toBe(0)
    expect(srv.pageIndex).toBe(0)
    expect(srv.pageSize).toBe(0)
    expect(srv.limit).toBe(0)
    expect(srv.sortColumn).toBe('value')
    expect(srv.sortDirection).toBe('asc')
    expect(srv.exactMatch).toBe(false)
    expect(srv.searchColumns).toEqual(['value'])
    expect(srv.term).toBe(100)
    expect(srv.isAscending).toBe(true)
    expect(srv.isDescending).toBe(false)
    expect(srv.capLimit(10)).toBe(10)
  })
})

describe('zSchema', () => {
  it('zSchema', () => {
    const schema = SearchRequestView.zSearchRequestView

    expect(schema).toBeDefined()
    expect(schema).toBeInstanceOf(z.ZodType)
  })

  it('valid parse', () => {
    const schema = SearchRequestView.zSearchRequestView,
      srv: ISearchRequestView = {
        exactMatch: true,
        limit: 10,
        offset: 0,
        pageIndex: 0,
        pageSize: 20,
        sortColumn: 'name',
        sortDirection: 'asc',
        term: 'name',
      }

    expect(() => schema.parse(srv)).not.toThrow()
  })

  it('term array', () => {
    const schema = SearchRequestView.zSearchRequestView,
      srv: ISearchRequestView = {
        exactMatch: true,
        limit: 10,
        offset: 0,
        pageIndex: 0,
        pageSize: 20,
        sortColumn: 'name',
        sortDirection: 'asc',
        term: ['name', 'value'],
      }

    expect(() => schema.parse(srv)).not.toThrow()
  })

  it('bad limit', () => {
    const company: ISearchRequestView = {
        exactMatch: true,
        limit: 1011111111111,
        offset: 0,
        pageIndex: 0,
        pageSize: 20,
        sortColumn: 'name',
        sortDirection: 'asc',
        term: 'name',
      },
      schema = SearchRequestView.zSearchRequestView

    expect(() => schema.parse(company)).toThrow(
      new Error(`[
  {
    "origin": "number",
    "code": "too_big",
    "maximum": 10000,
    "inclusive": true,
    "path": [
      "limit"
    ],
    "message": "Too big: expected number to be <=10000"
  }
]`)
    )
  })
})

it(SearchRequestView.create.name, () => {
  expect(SearchRequestView.create()).toEqual({
    exactMatch: false,
    limit: 0,
    offset: 0,
    pageIndex: 0,
    pageSize: 0,
    sortColumn: '',
    sortDirection: 'asc',
    term: '',
  })

  expect(
    SearchRequestView.create({
      exactMatch: true,
      limit: 1,
      offset: 2,
      pageIndex: 3,
      pageSize: 4,
      sortColumn: 'filter',
      sortDirection: 'desc',
      term: 'term',
    })
  ).toStrictEqual({
    exactMatch: true,
    limit: 1,
    offset: 2,
    pageIndex: 3,
    pageSize: 4,
    sortColumn: 'filter',
    sortDirection: 'desc',
    term: 'term',
  })
})
