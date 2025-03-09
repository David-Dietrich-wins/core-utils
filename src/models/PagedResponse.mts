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

  static CreateFromApiResponse<T>(ret: ApiResponse<IPagedResponse<T>>) {
    return new PagedResponse<T>(ret.obj?.dataPage, ret.obj?.totalCount)
  }

  static GetDataFromApiResponse<T>(ret: ApiResponse<IPagedResponse<T>>) {
    return safeArray(ret.obj?.dataPage)
  }
}

export interface IPagedResponseWithTotalValue<T> extends IPagedResponse<T> {
  totalValue: number
}
