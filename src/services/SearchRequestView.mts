import * as z from 'zod/v4'
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
import { isObject } from './object-helper.mjs'
import {
  isString,
  safestr,
  safestrLowercase,
  safestrTrim,
} from './string-helper.mjs'

export type ISearchRequestView = z.infer<
  typeof SearchRequestView.zSearchRequestView
>

export type SearchWhereOperator = {
  $in?: string[]
  $nin?: string[]
  $eq?: string | number
  $ne?: string | number
  $gt?: string | number
  $gte?: string | number
  $lt?: string | number
  $lte?: string | number
  $regex?: string
  $exists?: boolean
  $and?: SearchWhere[]
  $or?: SearchWhere[]
  $not?: SearchWhere
}

export type SearchWhere = Record<string, SearchWhereOperator>

export class SearchRequestView implements ISearchRequestView {
  static readonly TermMaxLength = 100
  static readonly LimitAndOffsetMax = 10000

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addToQuery?: any // Additional query parameters for MongoDb.
  searchColumns?: ISearchRequestView['searchColumns']
  where?: SearchWhere

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
      Object.assign(this, SearchRequestView.zSearchRequestView.parse(term))
    } else {
      this.term = safestr(term)
      this.sortColumn = sortColumn
      this.sortDirection = sortDirection
      this.limit = limit
      this.offset = offset
      this.exactMatch = exactMatch
      this.pageIndex = pageIndex
      this.pageSize = pageSize

      SearchRequestView.zSearchRequestView.parse(this)
    }
  }

  static Create(overrides?: Partial<ISearchRequestView> | null) {
    const iSearchRequestView: ISearchRequestView = {
      term: '',
      sortColumn: '',
      sortDirection: 'asc',
      limit: 0,
      offset: 0,
      exactMatch: false,
      pageIndex: 0,
      pageSize: 0,
      ...overrides,
    }

    return iSearchRequestView
  }

  clear() {
    this.addToQuery = undefined
    this.searchColumns = undefined
    this.where = undefined

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

  static get zSearchRequestView() {
    // https://medium.com/@charuwaka/supercharge-your-react-forms-with-react-hook-form-zod-and-mui-a-powerful-trio-47b653e7dce0
    // Define Zod schema for form validation
    const schema = z.object({
      exactMatch: z.boolean().default(false),
      limit: z
        .number()
        .min(0)
        .max(SearchRequestView.LimitAndOffsetMax)
        .default(0),
      offset: z
        .number()
        .min(0)
        .max(SearchRequestView.LimitAndOffsetMax)
        .default(0),
      pageIndex: z
        .number()
        .min(0)
        .max(SearchRequestView.LimitAndOffsetMax)
        .default(0),
      pageSize: z
        .number()
        .min(0)
        .max(SearchRequestView.LimitAndOffsetMax)
        .default(0),
      searchColumns: z
        .string()
        .max(10000)
        .or(z.array(z.string().max(SearchRequestView.TermMaxLength)))
        .optional(),
      sortColumn: z.string().max(SearchRequestView.TermMaxLength).default(''),
      sortDirection: z
        .number()
        .min(-1)
        .max(1)
        .or(z.literal('asc'))
        .or(z.literal('desc'))
        .or(z.literal(1))
        .or(z.literal(-1))
        .or(z.boolean())
        .default(1),

      term: z
        .string()
        .max(SearchRequestView.TermMaxLength)
        .or(z.array(z.string().max(SearchRequestView.TermMaxLength)))
        .optional(),
    })

    return schema
  }
}
