import * as z from 'zod'
import {
  AnyObject,
  AnyRecord,
  SortOrder,
  SortOrderAsBoolean,
  StringOrStringArray,
} from '../models/types.mjs'
import { safeArray, isArray } from './array-helper.mjs'
import { hasData, sortFunction } from './general.mjs'
import { getAsNumber } from './number-helper.mjs'
import { DefaultWithOverrides, isObject } from './object-helper.mjs'
import {
  isString,
  safestr,
  safestrLowercase,
  safestrTrim,
} from './string-helper.mjs'

export interface ISearchRequestView {
  term: StringOrStringArray
  sortColumn: string
  sortDirection: SortOrder
  limit: number
  offset: number
  exactMatch: boolean
  pageIndex: number
  pageSize: number
  searchColumns?: StringOrStringArray
}

export class SearchRequestView implements ISearchRequestView {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addToQuery?: any // Additional query parameters for MongoDb.
  searchColumns?: StringOrStringArray

  term = ''
  sortColumn = ''
  sortDirection: SortOrder = 1
  limit = 0
  offset = 0
  exactMatch = false

  pageIndex = 0
  pageSize = 0

  constructor(
    term?: StringOrStringArray | object, // Search term
    sortColumn = '', // ORDER BY column
    sortDirection: SortOrder = 1, // ORDER BY direction
    limit = 0, // LIMIT the result set to # of rows
    offset = 0, // Start at OFFSET
    exactMatch = false,
    pageIndex = 0,
    pageSize = 0
  ) {
    if (isObject(term)) {
      // Do this to ensure no extra properties are passed in.
      Object.assign(this, SearchRequestView.VerificationSchema.parse(term))
    } else {
      this.term = safestr(term)
      this.sortColumn = sortColumn
      this.sortDirection = sortDirection
      this.limit = limit
      this.offset = offset
      this.exactMatch = exactMatch
      this.pageIndex = pageIndex
      this.pageSize = pageSize

      SearchRequestView.VerificationSchema.parse(this)
    }
  }

  static Create(overrides?: Partial<ISearchRequestView> | null) {
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
    const offset = this.CalculatedPageSize * getAsNumber(this.pageIndex)
    if (offset > 0) {
      return offset
    }

    return getAsNumber(this.offset)
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

  static get VerificationSchema() {
    // https://medium.com/@charuwaka/supercharge-your-react-forms-with-react-hook-form-zod-and-mui-a-powerful-trio-47b653e7dce0
    // Define Zod schema for form validation
    const schema = z.object({
      exactMatch: z.boolean(),
      limit: z.number().min(0).max(1000000),
      offset: z.number().min(0).max(1000000),
      pageIndex: z.number().min(0).max(1000000),
      pageSize: z.number().min(0).max(1000000),
      searchColumns: z.string().max(1000000).or(z.array(z.string())).optional(),
      sortColumn: z.string().max(100).optional(),
      sortDirection: z
        .number()
        .max(10)
        .or(z.literal('asc'))
        .or(z.literal('desc'))
        .or(z.literal(1))
        .or(z.literal(-1)),
      term: z
        .string()
        .max(100)
        .or(z.array(z.string().max(100)))
        .optional(),
    })

    return schema
  }
}
