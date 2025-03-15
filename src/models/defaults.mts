import { ISearchRequestView } from './interfaces.mjs'

export function DefaultSearchRequestView(
  overrides?: Partial<ISearchRequestView>
) {
  const DEFAULT_SearchRequestView: ISearchRequestView = {
    term: '',
    sortColumn: '',
    sortDirection: 'asc',
    limit: 0,
    offset: 0,
    exactMatch: false,
    pageIndex: 0,
    pageSize: 0,
  }

  const ret: ISearchRequestView = { ...DEFAULT_SearchRequestView, ...overrides }
  return ret
}
