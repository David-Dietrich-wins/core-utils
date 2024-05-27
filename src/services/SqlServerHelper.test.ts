// import sql, { IResult } from 'mssql'
// import SqlServerHelper from './SqlServerHelper'

// const sqlConnectionStringKinectifyDatabase =
//   'Server=flight-manager-db.gameng.devtest.vegas;Database=Kinectify;User ID=Kinectify;Password=KinectifyR0ck$;TrustServerCertificate=True;'

test('empty tests for now', async () => {
  expect(true).toBeTruthy()
})

// test('connection pool concurrency', async () => {
//   const numIterationsToRun = 10
//   const poolRetryCount = 3
//   const minPoolSize = 3
//   const maxPoolSize = 3

//   const dbMgmKinectify = new SqlServerHelper(
//     sqlConnectionStringKinectifyDatabase,
//     poolRetryCount,
//     minPoolSize,
//     maxPoolSize
//   )
//   const sqlConnection = await dbMgmKinectify.connect()

//   const sqlQueryTest = 'SELECT * FROM [dbo].[PlayerProfile] WHERE playerID = @playerId'

//   const runQuery = async (sqlQuery: string, playerId: number) => {
//     const result = await sqlConnection
//       .request()
//       .input('playerId', sql.Int, playerId)
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
//         await dbMgmKinectify.close()
//       })
//   } finally {
//     await dbMgmKinectify.close()
//   }

//   expect(resultsGood).not.toBeUndefined()
//   expect(resultsExceptions).not.toBeUndefined()
//   expect(resultsExceptions).toHaveLength(0)
// })

// test('queryOne good', async () => {
//   const dbMgmKinectify = new SqlServerHelper(sqlConnectionStringKinectifyDatabase)
//   await dbMgmKinectify.connect()

//   try {
//     const ret = await dbMgmKinectify.queryTableForOne({
//       tableName: '[dbo].[GamingActivity]',
//       where: [['externalTransactionId', 'E436A469-E0B7-4603-8D78-31A0053D3C4C']],
//     })

//     expect(ret).not.toBeUndefined()
//   } finally {
//     await dbMgmKinectify.close()
//   }
// })

// test('queryByString good', async () => {
//   const externalTransactionId = 'E436A469-E0B7-4603-8D78-31A0053D3C4C'
//   const dbMgmKinectify = new SqlServerHelper(sqlConnectionStringKinectifyDatabase)
//   await dbMgmKinectify.connect()

//   const sql = 'SELECT * FROM [dbo].[GamingActivity] WHERE externalTransactionId = @value0'
//   try {
//     const ret = await dbMgmKinectify.queryOneByStringField(sql, 'value0', externalTransactionId)

//     expect(ret).not.toBeUndefined()
//     expect((ret as { externalTransactionId: string }).externalTransactionId).toEqual(
//       externalTransactionId
//     )
//   } finally {
//     await dbMgmKinectify.close()
//   }
// })
