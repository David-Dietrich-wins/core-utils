import { safeArray } from '../services/general.mjs'
import { ApiResponse } from './ApiResponse.mjs'

export interface IPagedResponse<T> {
  dataPage: T[]
  totalCount: number
}

export class PagedResponse<T> implements IPagedResponse<T> {
  constructor(public dataPage: T[] = [], public totalCount = 0) {
    this.dataPage = safeArray(dataPage)

    if (!totalCount) {
      this.totalCount = this.dataPage.length
    }
  }

  createNewFromMap<Tout>(mapper: (pageIn: T) => Tout) {
    return PagedResponse.CreateNewFromMap<T, Tout>(this, mapper)
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
