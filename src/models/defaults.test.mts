import { DefaultSearchRequestView } from './defaults.mjs'

test('DefaultSearchRequestView', () => {
  expect(DefaultSearchRequestView()).toEqual({
    term: '',
    sortColumn: '',
    sortDirection: 'asc',
    limit: 0,
    offset: 0,
    exactMatch: false,
    pageIndex: 0,
    pageSize: 0,
  })

  expect(
    DefaultSearchRequestView({
      term: 'term',
      sortColumn: 'filter',
      sortDirection: 'desc',
      limit: 1,
      offset: 2,
      exactMatch: true,
      pageIndex: 3,
      pageSize: 4,
    })
  ).toStrictEqual({
    term: 'term',
    sortColumn: 'filter',
    sortDirection: 'desc',
    limit: 1,
    offset: 2,
    exactMatch: true,
    pageIndex: 3,
    pageSize: 4,
  })
})
