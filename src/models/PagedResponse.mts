import { z } from 'zod/v4'
import { safeArray } from '../services/array-helper.mjs'
import { ApiResponse } from './ApiResponse.mjs'
import { hasData } from '../services/general.mjs'

/*export interface IPagedResponse<T> {
  dataPage: T[]
  rowCount?: number
  totalCount: number
}
*/

export type IPagedResponse<T> = z.infer<
  ReturnType<typeof PagedResponse.zPagedResponse<z.ZodType<T>>>
>

export class PagedResponse<T> implements IPagedResponse<T> {
  dataPage: T[] = []
  rowCount?: number
  totalCount = 0

  constructor(dataPage?: T[], totalCount = 0, rowCount?: number) {
    this.dataPage = safeArray(dataPage)
    this.rowCount = rowCount ?? this.dataPage.length
    this.totalCount = hasData(totalCount) ? totalCount : this.dataPage.length
  }

  createNewFromMap<Tout>(mapper: (pageIn: T) => Tout) {
    return PagedResponse.CreateNewFromMap<T, Tout>(this, mapper)
  }

  /**
   * API response for paged data
   * @template T - Type of the data in the response
   * @property {T[]} dataPage - The current page of data
   * @property {number} rowCount - The number of rows in the current page
   * @property {number} totalCount - The total number of rows available
   */
  static zPagedResponse<T extends z.ZodType>(recordSchema: T) {
    return z.object({
      // ctx: IContext<unknown>,
      rowCount: z.number().int().nonnegative().optional(),
      totalCount: z.number().int().nonnegative(),
      dataPage: z.array(recordSchema),
    })
  }

  static CreateFromIPagedResponse<T>(ret: IPagedResponse<T>) {
    return new PagedResponse<T>(ret.dataPage, ret.totalCount)
  }

  static CreateFromApiResponse<T>(ret: ApiResponse<IPagedResponse<T>>) {
    return new PagedResponse<T>(ret.data.dataPage, ret.data.totalCount)
  }

  static CreateNewFromMap<Tin, Tout>(
    pagesIn: IPagedResponse<Tin>,
    map: (pageIn: Tin) => Tout
  ) {
    return new PagedResponse<Tout>(
      pagesIn.dataPage.map(map),
      pagesIn.totalCount
    )
  }

  static GetDataFromApiResponse<T>(ret: ApiResponse<IPagedResponse<T>>) {
    return safeArray(ret.data.dataPage)
  }
}

export interface IPagedResponseWithTotalValue<T> extends IPagedResponse<T> {
  totalValue: number
}
