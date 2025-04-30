import {
  AnyObject,
  AnyRecord,
  ArrayOrSingle,
  SortOrder,
  SortOrderAsBoolean,
} from '../models/types.mjs'
import { safeArray, isArray } from './array-helper.mjs'
import { hasData, sortFunction } from './general.mjs'
import { getAsNumber } from './number-helper.mjs'
import { isObject } from './object-helper.mjs'
import {
  isString,
  safestr,
  safestrLowercase,
  safestrTrim,
} from './string-helper.mjs'

export interface ISearchRequestView {
  term: string
  sortColumn: string
  sortDirection: SortOrder
  limit: number
  offset: number
  exactMatch: boolean
  pageIndex: number
  pageSize: number
  searchColumns?: ArrayOrSingle<string>
}

export class SearchRequestView implements ISearchRequestView {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addToQuery?: any // Additional query parameters for MongoDb.
  searchColumns?: ArrayOrSingle<string> // The search column(s)

  term = ''
  sortColumn = ''
  sortDirection: SortOrder = 1
  limit = 0
  offset = 0
  exactMatch = false

  pageIndex = 0
  pageSize = 0

  constructor(
    term?: string | object, // Search term
    sortColumn = '', // ORDER BY column
    sortDirection: SortOrder = 1, // ORDER BY direction
    limit = 0, // LIMIT the result set to # of rows
    offset = 0, // Start at OFFSET
    exactMatch = false
  ) {
    if (isObject(term)) {
      Object.assign(this, term)
    } else {
      this.term = safestr(term)
      this.sortColumn = sortColumn
      this.sortDirection = sortDirection
      this.limit = limit
      this.offset = offset
      this.exactMatch = exactMatch
    }
  }

  clear() {
    this.addToQuery = undefined
    this.searchColumns = undefined

    this.term = ''
    this.sortColumn = ''
    this.sortDirection = 'asc'
    this.limit = 0
    this.offset = 0
    this.exactMatch = false

    this.pageIndex = 0
    this.pageSize = 0
  }

  getItems<T extends AnyRecord>(
    items: T[] | null | undefined,
    limitIfNone = 0,
    sortColumnIfNone = '',
    lowerCaseSearch = true
  ): [T[], number] {
    let ret = safeArray(items)

    if (!this.limit && limitIfNone) {
      this.limit = limitIfNone
    }
    if (!this.sortColumn && sortColumnIfNone) {
      this.sortColumn = sortColumnIfNone
    }

    const lterm = isString(this.term)
      ? lowerCaseSearch
        ? safestrLowercase(this.term, false)
        : safestr(this.term)
      : this.term

    const searchColumns = safeArray(this.searchColumns)

    if (lterm && isArray(searchColumns, 1)) {
      ret = ret.filter((x) => {
        let found = false

        searchColumns.forEach((sc) => {
          if (!found && x[sc]) {
            const s =
              isString(x[sc]) && lowerCaseSearch
                ? safestrLowercase(x[sc])
                : x[sc]

            found =
              this.exactMatch || !isString(s) ? lterm === s : s.includes(lterm)
          }
        })

        return found
      })
    }

    const numFound = ret.length

    const sortColumn = safestrTrim(this.sortColumn)
    if (hasData(sortColumn)) {
      const lsortDirection = SortOrderAsBoolean(this.sortDirection)

      ret = ret.sort((a: AnyObject, b: AnyObject) =>
        sortFunction(a[sortColumn], b[sortColumn], lsortDirection)
      )
    }

    const offset = this.CalculatedOffset
    const pageSize = this.CalculatedPageSize
    if (pageSize > 0) {
      ret = ret.slice(offset, offset + pageSize)
    } else if (offset > 0) {
      ret = ret.slice(offset)
    }

    return [ret, numFound]
  }

  get CalculatedPageSize() {
    const pageSize = getAsNumber(this.pageSize)

    return pageSize ? pageSize : getAsNumber(this.limit)
  }

  get CalculatedOffset() {
    return this.CalculatedPageSize * getAsNumber(this.pageIndex)
  }

  CapLimit(maxlimit: number) {
    if (this.limit < 1 || this.limit > maxlimit) {
      this.limit = maxlimit
    }

    return this.limit
  }

  get isAscending() {
    return SortOrderAsBoolean(this.sortDirection)
  }
  get isDescending() {
    return !this.isAscending
  }
}
