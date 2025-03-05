// import { jest } from '@jest/globals'
// import {
//   getGlobalLogger,
//   mockLoggerDebug,
//   mockLoggerError,
//   mockLoggerInfo,
//   mockLoggerLog,
//   mockLoggerSilly,
//   mockLoggerWarn,
// } from '../jest.setup.mjs'

// const mockExecute = jest.fn()
// const mockInput = jest.fn(() => ({ execute: mockExecute }))
// const mockRequest = jest.fn(() => ({ input: mockInput }))
// const mockConnectionPool = jest.fn(() => {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   return Promise.resolve({ request: mockRequest } as any)
// })

// const mockConnect = jest.fn((config: string | config) => {
//   console.log(config)
//   const pool = {
//     query: jest.fn(() => ({ recordset: [] })),
//     close: jest.fn(),
//   } as unknown as ConnectionPool

//   return Promise.resolve(pool)
// })

// jest.unstable_mockModule('mssql', () => ({
//   connect: mockConnect,
//   // connect: jest.fn((config: string | config) => {
//   //   console.log(config)
//   //   return Promise.resolve({
//   //     request: mockRequest,
//   //   }) as unknown as Promise<ConnectionPool>
//   // }),
//   ConnectionPool: mockConnectionPool,
//   Int: jest.fn(),

//   NVarChar: jest.fn(),
// }))
// const sql = await import('mssql')
// import type { config, ConnectionPool, IResult } from 'mssql'

// const sshelper = await import('./SqlServerHelper.mjs')
// const { SqlServerHelper } = sshelper

// const sqlConnectionString =
//   'Server=localhost;Database=mydb;User ID=user;Password=whatever;TrustServerCertificate=True;'

test('empty tests for now', async () => {
  expect(true).toBeTruthy()
})

// test('connection pool concurrency', async () => {
//   const numIterationsToRun = 10
//   const poolRetryCount = 3
//   const minPoolSize = 3
//   const maxPoolSize = 3

//   const dbTest = new SqlServerHelper(
//     sqlConnectionString,
//     poolRetryCount,
//     minPoolSize,
//     maxPoolSize
//   )
//   const sqlConnection = await dbTest.connect()

//   const sqlQueryTest = 'SELECT * FROM [dbo].[mytable] WHERE userID = @userId'

//   const runQuery = async (sqlQuery: string, userId: number) => {
//     const result = await sqlConnection
//       .request()
//       .input('userId', sql.Int, userId)
//       .query(sqlQuery)

//     console.log(
//       'pool - size:',
//       sqlConnection.size,
//       'available:',
//       sqlConnection.available,
//       'borrowed:',
//       sqlConnection.borrowed
//     )

//     return result
//   }

//   const resultsGood: unknown[] = []
//   const resultsExceptions: unknown[] = []

//   try {
//     await runQuery(sqlQueryTest, 1)

//     console.log(
//       'pool - size:',
//       sqlConnection.size,
//       'available:',
//       sqlConnection.available,
//       'borrowed:',
//       sqlConnection.borrowed
//     )

//     expect(sqlConnection.available).toBe(1)
//     expect(sqlConnection.borrowed).toBe(0)

//     const promises: Promise<IResult<unknown>>[] = []
//     for (let i = 0; i < numIterationsToRun; i++) {
//       promises.push(runQuery(sqlQueryTest, 100000 + i))
//     }

//     await Promise.all(promises)
//       .then((ret) => {
//         console.log(ret)
//         resultsGood.push(ret)
//       })
//       .catch((error) => {
//         console.log(error)
//         resultsExceptions.push(error)
//       })
//       .finally(async () => {
//         await dbTest.close()
//       })
//   } finally {
//     await dbTest.close()
//   }

//   expect(resultsGood).not.toBeUndefined()
//   expect(resultsExceptions).not.toBeUndefined()
//   expect(resultsExceptions).toHaveLength(0)
// })

// test('queryOne good', async () => {
//   const dbTest = new SqlServerHelper(sqlConnectionString)
//   await dbTest.connect()

//   try {
//     const ret = await dbTest.queryTableForOne({
//       tableName: '[dbo].[mytable]',
//       where: [['myUserId', 'E436A469-E0B7-4603-8D78-31A0053D3C4C']],
//     })

//     expect(ret).not.toBeUndefined()
//   } finally {
//     await dbTest.close()
//   }
// })

// test('queryByString good', async () => {
//   const externalTransactionId = 'E436A469-E0B7-4603-8D78-31A0053D3C4C'
//   const dbTest = new SqlServerHelper(sqlConnectionString)
//   await dbTest.connect()

//   const sql = 'SELECT * FROM [dbo].[mytable] WHERE externalTransactionId = @value0'
//   try {
//     const ret = await dbTest.queryOneByStringField(sql, 'value0', externalTransactionId)

//     expect(ret).not.toBeUndefined()
//     expect((ret as { externalTransactionId: string }).externalTransactionId).toEqual(
//       externalTransactionId
//     )
//   } finally {
//     await dbTest.close()
//   }
// })
