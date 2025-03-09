import { ObjectId } from 'bson'
import { StringOrObjectId } from './interfaces.mjs'
import { IKeyValueShort } from './key-val.mjs'
import { INameVal, NameVal } from './name-val.mjs'
import {
  IUserCreatedUpdatedTable,
  UserCreatedUpdatedTable,
} from './UserCreatedUpdatedTable.mjs'
import { hasData, safestr } from '../services/general.mjs'
import { PermittedUserConfigs } from '../index.mjs'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IConfigTable<T = any>
  extends IUserCreatedUpdatedTable,
    IKeyValueShort<T> {}

export class ConfigTable<TValue = boolean>
  extends UserCreatedUpdatedTable
  implements IConfigTable<TValue>
{
  k = ''
  v: TValue

  constructor(
    userid: StringOrObjectId,
    key: string,
    val: TValue,
    updatedby = 'Config',
    updated = new Date(),
    createdby = 'Config',
    created = new Date()
  ) {
    super(userid, updatedby, updated, createdby, created)
    this.k = key
    this.v = val
  }

  static fromApi(
    currentConfig: IConfigTable | undefined,
    nameVal: INameVal,
    userid: StringOrObjectId,
    email: string
  ) {
    const config =
      currentConfig ?? ConfigTable.fromNameVal(nameVal, userid, email)

    config.k = nameVal.name
    config.v = nameVal.val

    return config
  }
  static fromNameVal(
    nv: INameVal,
    userid: StringOrObjectId,
    email: string,
    curDate?: Date
  ) {
    const fname = 'fromNameVal'

    curDate = curDate ?? new Date()
    const userEmail = safestr(email, fname)

    const config: IConfigTable = {
      k: nv.name,
      v: nv.val,
      userid: new ObjectId(userid),
      created: curDate,
      createdby: userEmail,
      updated: curDate,
      updatedby: userEmail,
    }

    return config
  }

  copyFromDatabase(dbtp: IConfigTable) {
    super.copyFromDatabase(dbtp)

    if (hasData(dbtp.k)) {
      this.k = dbtp.k
    }
    if (hasData(dbtp.v)) {
      this.v = dbtp.v
    }
  }

  api() {
    const nv: NameVal<TValue> = { name: this.k, val: this.v }

    return nv
  }
}

type PermittedConfigNames = keyof PermittedUserConfigs

export class ConfigManager {
  static readonly allowedConfigs: PermittedUserConfigs = {
    useMinusEight: true,
    openFirstPlot: true,
    hideTickerBar: false,
    showPriceChangeInTickerBar: false,
    headerTickerBarIndex: { showAsset: true, showCrypto: true },
    headerTickerBarUser: { tickers: ['AAPL'] },
    hideTooltips: false,
    chartColorUp: '#00ff00',
    chartColorDown: '#ff0000',
    dashboards: {
      screens: [
        {
          id: 'default',
          name: 'default',
          tiles: [
            {
              id: 'initial-tile-left',
              cols: 1,
              name: 'Trade Plotter',
              rows: 2,
              color: 'white',
              index: 0,
              value: 'initial-tile-left',
              typeid: 6,
            },
            {
              id: 'initial-tile-right',
              cols: 1,
              name: 'Trade Plotter',
              rows: 2,
              color: 'white',
              index: 0,
              value: 'initial-tile-right',
              typeid: 7,
            },
          ],
        },
        // Example for a chart and a plotlist.
        // [
        //   {
        //     id: 'AAPL',
        //     index: 0,
        //     typeid: 3,
        //     cols: 1,
        //     rows: 2
        //   },
        //   {
        //     id: 'Trade Plotter',
        //     index: 2,
        //     typeid: 1,
        //     cols: 2,
        //     rows: 2
        //   }
        // ],
      ],
    },
  }

  static readonly KEY_Dashboards = 'dashboards'

  static permittedConfigNames = Object.keys(
    ConfigManager.allowedConfigs
  ) as PermittedConfigNames[]
  static getDefaultValue(name: PermittedConfigNames) {
    return ConfigManager.allowedConfigs[name]
  }

  static getDefaultConfig(
    configName: PermittedConfigNames,
    userid: StringOrObjectId,
    updatedby?: string,
    updated?: Date,
    createdby?: string,
    created?: Date
  ) {
    return ConfigManager.getNewConfig(
      userid,
      configName,
      updatedby,
      updated,
      createdby,
      created
    )
  }
  static getNewConfig(
    userid: StringOrObjectId,
    name: PermittedConfigNames,
    updatedby?: string,
    updated?: Date,
    createdby?: string,
    created?: Date
  ) {
    const defval = ConfigManager.getDefaultValue(name)

    return new ConfigTable<typeof defval>(
      userid,
      name as string,
      defval,
      updatedby,
      updated,
      createdby,
      created
    )
  }
}
