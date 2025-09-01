import {
  type IUserCreatedUpdatedTable,
  UserCreatedUpdatedTable,
} from '../models/UserCreatedUpdatedTable.mjs'
import { type ISymbolName } from '../models/ticker-info.mjs'
import { isObject } from '../primitives/object-helper.mjs'

export interface ITvChartLayout extends IUserCreatedUpdatedTable, ISymbolName {
  publish_request_id: string
  description: string
  resolution: string
  symbol_type: string
  exchange: string
  listed_exchange: string
  short_name: string
  legs: string
  is_realtime: string
  content: string
}

export class TvChartLayout
  extends UserCreatedUpdatedTable
  implements ITvChartLayout
{
  publish_request_id = ''
  name = ''
  description = ''
  resolution = ''
  symbol = ''
  symbol_type = ''
  exchange = ''
  listed_exchange = ''
  short_name = ''
  legs = ''
  is_realtime = ''
  content = ''

  constructor(
    userid?: string | ITvChartLayout,
    updatedby = 'TvChartLayout',
    updated = new Date(),
    createdby = 'TvChartLayout',
    created = new Date()
  ) {
    super(userid, updatedby, updated, createdby, created)

    if (isObject(userid)) {
      this.copyFromDatabase(userid)
    }
  }

  /**
   * Copies the properties from a database object to this instance.
   * @param dbtp The database object to copy from.
   */
  copyFromDatabase(dbtp: ITvChartLayout) {
    super.copyFromDatabase(dbtp)

    this.publish_request_id = dbtp.publish_request_id
    this.name = dbtp.name
    this.description = dbtp.description
    this.resolution = dbtp.resolution
    this.symbol = dbtp.symbol
    this.symbol_type = dbtp.symbol_type
    this.exchange = dbtp.exchange
    this.listed_exchange = dbtp.listed_exchange
    this.short_name = dbtp.short_name
    this.legs = dbtp.legs
    this.is_realtime = dbtp.is_realtime
    this.content = dbtp.content
  }
}
