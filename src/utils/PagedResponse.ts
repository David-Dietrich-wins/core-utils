export interface IPagedResponse<T> {
  dataPage: T[]
  totalCount: number
}

export default class PagedResponse<T> implements IPagedResponse<T> {
  dataPage: T[] = []
  totalCount = 0

  constructor(dataPage: T[], totalCount: number) {
    this.dataPage = dataPage
    this.totalCount = totalCount
  }
}

export interface IPagedResponseWithTotalValue<T> extends IPagedResponse<T> {
  totalValue: number
}
