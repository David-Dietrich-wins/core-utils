import { safeArray } from '../services/general.mjs'

export interface IPagedResponse<T> {
  dataPage: T[]
  totalCount: number
}

export class PagedResponse<T> implements IPagedResponse<T> {
  constructor(public dataPage: T[], public totalCount = 0) {
    if (!totalCount) {
      this.totalCount = safeArray(dataPage).length
    }
  }
}

export interface IPagedResponseWithTotalValue<T> extends IPagedResponse<T> {
  totalValue: number
}
