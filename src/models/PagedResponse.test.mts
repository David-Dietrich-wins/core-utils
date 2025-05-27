import z from 'zod/v4'
import { ApiResponse } from './ApiResponse.mjs'
import { PagedResponse } from './PagedResponse.mjs'

test('PagedResponse good', () => {
  expect(new PagedResponse().dataPage).toEqual([])

  let pr = new PagedResponse<{ data: 'hello' }>([{ data: 'hello' }], 1)

  expect(pr.dataPage[0].data).toBe('hello')
  expect(pr.totalCount).toBe(1)

  pr = pr.createNewFromMap((pageIn) => {
    return { data: pageIn.data }
  })
  expect(pr.totalCount).toBe(1)
  expect(pr.dataPage[0].data).toBe('hello')

  pr = PagedResponse.CreateFromIPagedResponse(pr)
  expect(pr.totalCount).toBe(1)
  expect(pr.dataPage[0].data).toBe('hello')
})

test('auto total count', () => {
  const pr = new PagedResponse<{ data: string }>([
    { data: 'hello' },
    { data: 'world' },
  ])

  expect(pr.dataPage[0].data).toBe('hello')
  expect(pr.dataPage[1].data).toBe('world')
  expect(pr.totalCount).toBe(2)
})

test('API response', () => {
  let pr = new PagedResponse<{ data: 'hello' }>([{ data: 'hello' }], 1)

  const apiResponse = new ApiResponse(pr, 'result', 'message', 20)
  pr = PagedResponse.CreateFromApiResponse(apiResponse)
  expect(pr.totalCount).toBe(1)
  expect(pr.dataPage[0].data).toBe('hello')

  const mydata = PagedResponse.GetDataFromApiResponse(apiResponse)
  expect(mydata.length).toBe(1)
  expect(mydata[0].data).toBe('hello')
})

test('zPagedResponse', () => {
  const zPagedResponse = PagedResponse.zPagedResponse(
    z.object({ data: z.string() })
  )

  const validData = {
    rowCount: 2,
    totalCount: 5,
    dataPage: [{ data: 'hello' }, { data: 'world' }],
  }

  const result = zPagedResponse.safeParse(validData)
  expect(result.success).toBe(true)
  expect(result.data?.rowCount).toBe(2)
  expect(result.data?.totalCount).toBe(5)
  expect(result.data?.dataPage[0].data).toBe('hello')
})
