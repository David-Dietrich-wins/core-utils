import { DefaultWithOverrides } from '../services/object-helper.mjs'
import { ISearchRequestView } from '../services/SearchRequestView.mjs'

export function SearchRequestViewDefault(
  overrides?: Partial<ISearchRequestView> | null
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

  return DefaultWithOverrides(DEFAULT_SearchRequestView, overrides)
}
