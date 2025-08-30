import * as z from 'zod/v4'
import { ApiResponse, IApiResponse } from './ApiResponse.mjs'
import { hasData, isNullOrUndefined } from '../services/general.mjs'
import { safeArray } from '../services/primitives/array-helper.mjs'

/*Export interface IPagedResponse<T> {
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

  static async CreateFromPromise<T>(
    prom: Promise<T[] | undefined>,
    promCounts?: Promise<number>
  ) {
    const aret = await Promise.all([prom, promCounts ?? Promise.resolve(0)]),
      arr = safeArray(aret[0])
    return new PagedResponse<T>(arr, aret[1] || arr.length)
  }

  static CreateFromIPagedResponse<T>(ret: IPagedResponse<T>) {
    return new PagedResponse<T>(ret.dataPage, ret.totalCount)
  }

  static CreateFromApiResponse<T>(ret: IApiResponse<IPagedResponse<T>>) {
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

  static ToIPagedResponse<T>(
    pagedResponse: T[] | null | undefined | IPagedResponse<T>,
    totalCount?: number,
    rowCount?: number
  ): IPagedResponse<T> {
    if (isNullOrUndefined(pagedResponse)) {
      return { dataPage: [], rowCount: 0, totalCount: 0 }
    }

    if (Array.isArray(pagedResponse)) {
      return {
        dataPage: pagedResponse,
        rowCount: rowCount ?? pagedResponse.length,
        totalCount: totalCount ?? pagedResponse.length,
      }
    }

    return (pagedResponse as PagedResponse<T>).toIPagedResponse()
  }

  toIPagedResponse(): IPagedResponse<T> {
    return {
      dataPage: this.dataPage,
      rowCount: this.rowCount,
      totalCount: this.totalCount,
    }
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
      // Ctx: IContext<unknown>,
      dataPage: z.array(recordSchema),
      rowCount: z.number().int().nonnegative().optional(),
      totalCount: z.number().int().nonnegative(),
    })
  }
}

export interface IPagedResponseWithTotalValue<T> extends IPagedResponse<T> {
  totalValue: number
}
