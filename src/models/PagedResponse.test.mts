import { ApiResponse } from './ApiResponse.mjs'
import { PagedResponse } from './PagedResponse.mjs'
import z from 'zod'

it('PagedResponse good', () => {
  expect(new PagedResponse().dataPage).toEqual([])

  let pr = new PagedResponse<{ data: 'hello' }>([{ data: 'hello' }], 1)

  expect(pr.dataPage[0].data).toBe('hello')
  expect(pr.totalCount).toBe(1)

  pr = pr.createNewFromMap((pageIn) => ({ data: pageIn.data }))
  expect(pr.totalCount).toBe(1)
  expect(pr.dataPage[0].data).toBe('hello')

  pr = PagedResponse.createFromIPagedResponse(pr)
  expect(pr.totalCount).toBe(1)
  expect(pr.dataPage[0].data).toBe('hello')
})

it('auto total count', () => {
  const pr = new PagedResponse<{ data: string }>([
    { data: 'hello' },
    { data: 'world' },
  ])

  expect(pr.dataPage[0].data).toBe('hello')
  expect(pr.dataPage[1].data).toBe('world')
  expect(pr.totalCount).toBe(2)
})

it('API response', () => {
  let pr = new PagedResponse<{ data: 'hello' }>([{ data: 'hello' }], 1)

  const apiResponse = new ApiResponse(pr, 'result', 'message', 20)
  pr = PagedResponse.createFromApiResponse(apiResponse)
  expect(pr.totalCount).toBe(1)
  expect(pr.dataPage[0].data).toBe('hello')

  const mydata = PagedResponse.GetDataFromApiResponse(apiResponse)
  expect(mydata.length).toBe(1)
  expect(mydata[0].data).toBe('hello')
})

it('zPagedResponse', () => {
  const aPagedResponse = PagedResponse.zPagedResponse(
      z.object({ data: z.string() })
    ),
    validData = {
      dataPage: [{ data: 'hello' }, { data: 'world' }],
      rowCount: 2,
      totalCount: 5,
    },
    zresult = aPagedResponse.safeParse(validData)
  expect(zresult.success).toBe(true)
  expect(zresult.data?.rowCount).toBe(2)
  expect(zresult.data?.totalCount).toBe(5)
  expect(zresult.data?.dataPage[0].data).toBe('hello')
})

it('createFromPromise', async () => {
  const mockAPromise = Promise.resolve([{ data: 'hello' }, { data: 'world' }]),
    mockCountPromise = Promise.resolve(2)
  let pagedResponse = await PagedResponse.createFromPromise(
    mockAPromise,
    mockCountPromise
  )
  expect(pagedResponse.dataPage.length).toBe(2)
  expect(pagedResponse.dataPage[0].data).toBe('hello')
  expect(pagedResponse.dataPage[1].data).toBe('world')
  expect(pagedResponse.totalCount).toBe(2)
  expect(pagedResponse.rowCount).toBe(2)
  expect(pagedResponse.createNewFromMap((item) => item.data).dataPage).toEqual([
    'hello',
    'world',
  ])
  expect(pagedResponse.createNewFromMap((item) => item.data).totalCount).toBe(2)
  expect(pagedResponse.createNewFromMap((item) => item.data).rowCount).toBe(2)

  pagedResponse = await PagedResponse.createFromPromise(mockAPromise)
  expect(pagedResponse.dataPage.length).toBe(2)
  expect(pagedResponse.dataPage[0].data).toBe('hello')
  expect(pagedResponse.dataPage[1].data).toBe('world')
  expect(pagedResponse.totalCount).toBe(2)
  expect(pagedResponse.rowCount).toBe(2)
  expect(pagedResponse.createNewFromMap((item) => item.data).dataPage).toEqual([
    'hello',
    'world',
  ])
  expect(pagedResponse.createNewFromMap((item) => item.data).totalCount).toBe(2)
  expect(pagedResponse.createNewFromMap((item) => item.data).rowCount).toBe(2)
  expect(pagedResponse.createNewFromMap((item) => item.data).dataPage).toEqual([
    'hello',
    'world',
  ])
})

it('toIPagedResponse', () => {
  const apr = new PagedResponse<{ data: 'hello' }>([{ data: 'hello' }], 1),
    ipr = apr.toIPagedResponse()

  expect(ipr.dataPage[0].data).toBe('hello')
  expect(ipr.totalCount).toBe(1)
  expect(ipr.rowCount).toBe(1)
})

it('ToIPagedResponse', () => {
  const pr = new PagedResponse<{ data: 'hello' }>([{ data: 'hello' }], 1)

  expect(PagedResponse.ToIPagedResponse(pr).dataPage[0].data).toBe('hello')
  expect(PagedResponse.ToIPagedResponse(pr).totalCount).toBe(1)
  expect(PagedResponse.ToIPagedResponse(pr).rowCount).toBe(1)
  expect(PagedResponse.ToIPagedResponse(pr, 10, 5).dataPage[0].data).toBe(
    'hello'
  )
  expect(PagedResponse.ToIPagedResponse(pr, 10, 5).totalCount).toBe(1)
  expect(PagedResponse.ToIPagedResponse(pr, 10, 5).rowCount).toBe(1)
  expect(
    PagedResponse.ToIPagedResponse(pr, undefined, 5).dataPage[0].data
  ).toBe('hello')
  expect(PagedResponse.ToIPagedResponse(pr, undefined, 5).totalCount).toBe(1)
  expect(PagedResponse.ToIPagedResponse(pr, undefined, 5).rowCount).toBe(1)
  expect(
    PagedResponse.ToIPagedResponse(pr, 10, undefined).dataPage[0].data
  ).toBe('hello')
  expect(PagedResponse.ToIPagedResponse(pr, 10, undefined).totalCount).toBe(1)
  expect(PagedResponse.ToIPagedResponse(pr, 10, undefined).rowCount).toBe(1)
  expect(
    PagedResponse.ToIPagedResponse(pr, undefined, undefined).dataPage[0].data
  ).toBe('hello')
  expect(
    PagedResponse.ToIPagedResponse(pr, undefined, undefined).totalCount
  ).toBe(1)

  expect(PagedResponse.ToIPagedResponse(null)).toEqual({
    dataPage: [],
    rowCount: 0,
    totalCount: 0,
  })
  expect(PagedResponse.ToIPagedResponse(undefined)).toEqual({
    dataPage: [],
    rowCount: 0,
    totalCount: 0,
  })
  expect(PagedResponse.ToIPagedResponse([])).toEqual({
    dataPage: [],
    rowCount: 0,
    totalCount: 0,
  })
  expect(PagedResponse.ToIPagedResponse(null, 10, 5)).toEqual({
    dataPage: [],
    rowCount: 0,
    totalCount: 0,
  })
  expect(PagedResponse.ToIPagedResponse(undefined, 10, 5)).toEqual({
    dataPage: [],
    rowCount: 0,
    totalCount: 0,
  })
  expect(PagedResponse.ToIPagedResponse([], 10, 5)).toEqual({
    dataPage: [],
    rowCount: 5,
    totalCount: 10,
  })
  expect(
    PagedResponse.ToIPagedResponse(['a', 'b', 'c', 'd', 'e', 'f'], undefined, 5)
  ).toEqual({
    dataPage: ['a', 'b', 'c', 'd', 'e', 'f'],
    rowCount: 5,
    totalCount: 6,
  })
  expect(
    PagedResponse.ToIPagedResponse(
      ['a', 'b', 'c', 'd', 'e', 'f'],
      10,
      undefined
    )
  ).toEqual({
    dataPage: ['a', 'b', 'c', 'd', 'e', 'f'],
    rowCount: 6,
    totalCount: 10,
  })
  expect(
    PagedResponse.ToIPagedResponse(['a', 'b', 'c', 'd', 'e', 'f'], 10, 5)
  ).toEqual({
    dataPage: ['a', 'b', 'c', 'd', 'e', 'f'],
    rowCount: 5,
    totalCount: 10,
  })
})
