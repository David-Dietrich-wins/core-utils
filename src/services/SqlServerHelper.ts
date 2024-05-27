/* eslint-disable @typescript-eslint/no-unused-vars */
import sql, { ConnectionPool, IResult, connect } from 'mssql'
import { hasData, isString } from './general'
import { arrayFirst, arrayFirstNonEmpty } from './array-helper'

const CONST_DefaultMaxRetryCount = 3

export default class SqlServerHelper {
  pool: ConnectionPool | undefined

  retryCount = 0

  constructor(
    public connectionString = '',
    public maxRetryCount = CONST_DefaultMaxRetryCount,
    public minimumPooledConnections = 0,
    public maximumPooledConnections = 50
  ) {}

  async close() {
    try {
      await this.pool?.close()
      // console.log('Connection pool closed.')
    } catch (err) {
      console.error('Failed to close the connection pool:', err)

      throw err
    }
  }

  async connect() {
    if (!this.pool?.connected) {
      if (!this.connectionString) {
        throw new Error('Connection string is required for connecting to SQL Server.')
      }

      const poolOptions = ConnectionPool.parseConnectionString(this.connectionString)

      poolOptions.pool.min = this.minimumPooledConnections
      poolOptions.pool.max = this.maximumPooledConnections

      let retryCount = 0

      const connectWrapper = async () => {
        try {
          const ret = await connect(poolOptions)
          this.retryCount = 0 // Reset retry count upon successful connection

          return ret
        } catch (err) {
          retryCount++
          console.log(err)

          if (retryCount < this.maxRetryCount) {
            console.log(
              `Retrying connection to SQL Server. Attempt ${retryCount} of ${this.maxRetryCount}`
            )
          } else {
            throw err
          }
        }
      }

      while (!this.pool) {
        this.pool = await connectWrapper()
      }
    }

    return this.pool
  }

  async request() {
    const pool = await this.connect()

    return pool.request()
  }

  static getRow<T = unknown, TMapFrom = T>(
    dbrows: IResult<TMapFrom>,
    mapper?: (row: TMapFrom) => T
  ) {
    return arrayFirst(this.getRows(dbrows, mapper))
  }

  static getRows<T = unknown, TMapFrom = T>(
    dbrows: IResult<TMapFrom>,
    mapper?: (row: TMapFrom) => T
  ) {
    return Array.isArray(dbrows.recordsets) && dbrows.recordsets.length
      ? mapper
        ? arrayFirstNonEmpty(dbrows.recordsets as TMapFrom[][]).map(mapper)
        : arrayFirstNonEmpty(dbrows.recordsets as T[][])
      : []
  }

  async query<T = unknown, TMapFrom = T>(sqlQuery: string, mapper?: (row: TMapFrom) => T) {
    const request = await this.request()
    const dbrows = await request.query<TMapFrom>(sqlQuery)

    return SqlServerHelper.getRows(dbrows, mapper)
  }

  async queryOne<T = unknown, TMapFrom = T>(sqlQuery: string, mapper?: (row: TMapFrom) => T) {
    const request = await this.request()
    const dbrows = await request.query<TMapFrom>(sqlQuery)

    return SqlServerHelper.getRow(dbrows, mapper)
  }

  async queryByIntField<T = unknown, TMapFrom = T>(
    sqlQuery: string,
    fieldName: string,
    intValue: number,
    mapper?: (row: TMapFrom) => T
  ) {
    const request = await this.request()
    request.input(fieldName, sql.Int, intValue)
    const dbrows = await request.query<TMapFrom>(sqlQuery)

    return SqlServerHelper.getRows(dbrows, mapper)
  }

  async queryOneByIntField<T = unknown, TMapFrom = T>(
    sqlQuery: string,
    fieldName: string,
    intValue: number,
    mapper?: (row: TMapFrom) => T
  ) {
    return arrayFirst(await this.queryByIntField(sqlQuery, fieldName, intValue, mapper))
  }

  async queryByPlayerId<T = unknown, TMapFrom = T>(
    sqlQuery: string,
    intValue: number,
    mapper?: (row: TMapFrom) => T
  ) {
    return await this.queryByIntField(sqlQuery, 'playerId', intValue, mapper)
  }

  async queryOneByPlayerId<T = unknown, TMapFrom = T>(
    sqlQuery: string,
    intValue: number,
    mapper?: (row: TMapFrom) => T
  ) {
    return arrayFirst(await this.queryByIntField(sqlQuery, 'playerId', intValue, mapper))
  }

  async queryByPlayerIdString<T = unknown, TMapFrom = T>(
    sqlQuery: string,
    stringValue: string,
    mapper?: (row: TMapFrom) => T
  ) {
    return await this.queryByStringField<T, TMapFrom>(sqlQuery, 'playerId', stringValue, mapper)
  }

  async queryOneByPlayerIdString<T = unknown, TMapFrom = T>(
    sqlQuery: string,
    stringValue: string,
    mapper?: (row: TMapFrom) => T
  ) {
    return arrayFirst(
      await this.queryByStringField<T, TMapFrom>(sqlQuery, 'playerId', stringValue, mapper)
    )
  }

  async queryByStringField<T = unknown, TMapFrom = T>(
    sqlQuery: string,
    fieldName: string,
    stringValue: string,
    mapper?: (row: TMapFrom) => T
  ) {
    const request = await this.request()
    request.input(fieldName, sql.NVarChar, stringValue)
    const dbrows = await request.query<TMapFrom>(sqlQuery)

    return SqlServerHelper.getRows<T, TMapFrom>(dbrows, mapper)
  }

  async queryOneByStringField<T = unknown, TMapFrom = T>(
    sqlQuery: string,
    fieldName: string,
    stringValue: string,
    mapper?: (row: TMapFrom) => T
  ) {
    return arrayFirst(await this.queryByStringField(sqlQuery, fieldName, stringValue, mapper))
  }

  async queryTable<T = unknown, TMapFrom = T>({
    tableName,
    where = [],
    mapper,
  }: {
    tableName: string
    where: [string, unknown][]
    mapper?: (row: TMapFrom) => T
  }) {
    let sqlQuery = `SELECT * FROM ${tableName}${hasData(where) ? ' WHERE' : ''}`
    const request = await this.request()

    let value0

    let whereClause = ''
    for (let index = 0; index < where.length; index++) {
      const fieldName = where[index][0]
      const value = where[index][1]

      if (index > 0) {
        whereClause += ' AND'
      }
      switch (index) {
        case 0:
          value0 = value
          break
      }

      whereClause += ` ${fieldName}=@value${index}`
    }

    sqlQuery += whereClause

    for (let index = 0; index < where.length; index++) {
      const value = where[index][1]
      request.input(`value${index}`, isString(value) ? sql.NVarChar : sql.Int, `value${index}`)
    }

    const dbrows = await request.query<TMapFrom>(sqlQuery)

    return SqlServerHelper.getRows(dbrows, mapper)
  }

  async queryTableForOne<T = unknown, TMapFrom = T>({
    tableName,
    where = [],
    mapper,
  }: {
    tableName: string
    where: [string, unknown][]
    mapper?: (row: TMapFrom) => T
  }) {
    const rows = await this.queryTable<T, TMapFrom>({
      tableName,
      where,
      mapper,
    })

    return arrayFirst(rows)
  }
}
