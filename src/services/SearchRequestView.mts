/* eslint-disable @typescript-eslint/no-explicit-any */
import * as z from 'zod/v4'
import {
  type AnyObject,
  type AnyRecord,
  type SortOrder,
  sortOrderAsBoolean,
} from '../models/types.mjs'
import {
  hasData,
  isNullOrUndefined,
  isObject,
  sortFunction,
} from '../primitives/object-helper.mjs'
import {
  includesAnyFromArray,
  isString,
  safestr,
  safestrLowercase,
  safestrTrim,
} from '../primitives/string-helper.mjs'
import { isArray, safeArray } from '../primitives/array-helper.mjs'
import { getAsNumber } from '../primitives/number-helper.mjs'

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

  // Additional query parameters for MongoDb.
  addToQuery?: any
  searchColumns?: ISearchRequestView['searchColumns']
  where?: SearchWhere

  term: ISearchRequestView['term'] = ''
  sortColumn: ISearchRequestView['sortColumn'] = ''
  sortDirection: ISearchRequestView['sortDirection'] = 1
  limit: ISearchRequestView['limit'] = 0
  offset: ISearchRequestView['offset'] = 0
  exactMatch: ISearchRequestView['exactMatch'] = false

  pageIndex: ISearchRequestView['pageIndex'] = 0
  pageSize: ISearchRequestView['pageSize'] = 0

  constructor(
    // Search term
    term?: ISearchRequestView['term'] | object,
    // ORDER BY column
    sortColumn = '',
    // ORDER BY direction
    sortDirection: SortOrder = 1,
    // LIMIT the result set to # of rows
    limit = 0,
    // Start at OFFSET
    offset = 0,
    exactMatch = false,
    pageIndex = 0,
    pageSize = 0
  ) {
    if (isObject(term)) {
      // Do this to ensure no extra properties are passed in.
      Object.assign(this, SearchRequestView.zSearchRequestView.parse(term))
    } else {
      const myterm =
        isNullOrUndefined(term) || isString(term)
          ? safestr(term)
          : safeArray(term)
      this.term = myterm
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

  static create(overrides?: Partial<ISearchRequestView>): ISearchRequestView {
    const iSearchRequestView: ISearchRequestView = {
      exactMatch: false,
      limit: 0,
      offset: 0,
      pageIndex: 0,
      pageSize: 0,
      sortColumn: '',
      sortDirection: 'asc',
      term: '',
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
        : this.term,
      searchColumns = safeArray(this.searchColumns)

    if (lterm && isArray(searchColumns, 1)) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      ret = ret.filter((x) => {
        let found = false

        searchColumns.forEach((scol) => {
          if (!found && x[scol]) {
            const s =
              isString(x[scol]) && lowerCaseSearch
                ? safestrLowercase(x[scol])
                : x[scol]

            found =
              this.exactMatch || !isString(s)
                ? lterm === s
                : includesAnyFromArray(s, safeArray(lterm))
          }
        })

        return found
      })
    }

    const numFound = ret.length,
      sortColumn = safestrTrim(this.sortColumn)
    if (hasData(sortColumn)) {
      const lsortDirection = sortOrderAsBoolean(this.sortDirection)

      ret = ret.sort((a: AnyObject, b: AnyObject) =>
        sortFunction(a[sortColumn], b[sortColumn], lsortDirection)
      )
    }

    const offset = this.calculatedOffset,
      pageSize = this.calculatedPageSize
    if (pageSize > 0) {
      ret = ret.slice(offset, offset + pageSize)
    } else if (offset > 0) {
      ret = ret.slice(offset)
    }

    return [ret, numFound]
  }

  get calculatedPageSize() {
    const pageSize = getAsNumber(this.pageSize)

    return pageSize ? pageSize : getAsNumber(this.limit)
  }

  get calculatedOffset() {
    const offset = this.calculatedPageSize * getAsNumber(this.pageIndex)
    if (offset > 0) {
      return offset
    }

    return getAsNumber(this.offset)
  }

  capLimit(maxlimit: number) {
    if (this.limit < 1 || this.limit > maxlimit) {
      this.limit = maxlimit
    }

    return this.limit
  }

  get isAscending() {
    return sortOrderAsBoolean(this.sortDirection)
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
        .union([
          z.literal(1),
          z.literal(-1),
          z.literal('a'),
          z.literal('d'),
          z.literal('asc'),
          z.literal('desc'),
          z.literal(1),
          z.literal(-1),
          z.boolean(),
        ])
        .default(1),

      term: z
        .union([
          z.string().max(SearchRequestView.TermMaxLength),
          z.array(z.string().max(SearchRequestView.TermMaxLength)),
        ])
        .default(''),
    })

    return schema
  }
}
