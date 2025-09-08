import * as z from 'zod/v4'
import { describe, expect, it } from '@jest/globals'
import { ApiResponse } from './ApiResponse.mjs'
import { PagedResponse } from './PagedResponse.mjs'

describe('pagedResponse', () => {
  it('good', () => {
    expect.assertions(7)

    expect(new PagedResponse().dataPage).toStrictEqual([])

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
    expect.assertions(3)

    const pr = new PagedResponse<{ data: string }>([
      { data: 'hello' },
      { data: 'world' },
    ])

    expect(pr.dataPage[0].data).toBe('hello')
    expect(pr.dataPage[1].data).toBe('world')
    expect(pr.totalCount).toBe(2)
  })

  it('api response', () => {
    expect.assertions(4)

    let pr = new PagedResponse<{ data: 'hello' }>([{ data: 'hello' }], 1)

    const apiResponse = new ApiResponse(pr, 'result', 'message', 20)
    pr = PagedResponse.createFromApiResponse(apiResponse)

    expect(pr.totalCount).toBe(1)
    expect(pr.dataPage[0].data).toBe('hello')

    const mydata = PagedResponse.apiResponseGetData(apiResponse)

    expect(mydata).toHaveLength(1)
    expect(mydata[0].data).toBe('hello')
  })

  it('zPagedResponse', () => {
    expect.assertions(4)

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
    expect.assertions(17)

    const mockAPromise = Promise.resolve([
        { data: 'hello' },
        { data: 'world' },
      ]),
      mockCountPromise = Promise.resolve(2)
    let pagedResponse = await PagedResponse.createFromPromise(
      mockAPromise,
      mockCountPromise
    )

    expect(pagedResponse.dataPage).toHaveLength(2)
    expect(pagedResponse.dataPage[0].data).toBe('hello')
    expect(pagedResponse.dataPage[1].data).toBe('world')
    expect(pagedResponse.totalCount).toBe(2)
    expect(pagedResponse.rowCount).toBe(2)
    expect(
      pagedResponse.createNewFromMap((item) => item.data).dataPage
    ).toStrictEqual(['hello', 'world'])
    expect(pagedResponse.createNewFromMap((item) => item.data).totalCount).toBe(
      2
    )
    expect(pagedResponse.createNewFromMap((item) => item.data).rowCount).toBe(2)

    pagedResponse = await PagedResponse.createFromPromise(mockAPromise)

    expect(pagedResponse.dataPage).toHaveLength(2)
    expect(pagedResponse.dataPage[0].data).toBe('hello')
    expect(pagedResponse.dataPage[1].data).toBe('world')
    expect(pagedResponse.totalCount).toBe(2)
    expect(pagedResponse.rowCount).toBe(2)
    expect(
      pagedResponse.createNewFromMap((item) => item.data).dataPage
    ).toStrictEqual(['hello', 'world'])
    expect(pagedResponse.createNewFromMap((item) => item.data).totalCount).toBe(
      2
    )
    expect(pagedResponse.createNewFromMap((item) => item.data).rowCount).toBe(2)
    expect(
      pagedResponse.createNewFromMap((item) => item.data).dataPage
    ).toStrictEqual(['hello', 'world'])
  })

  it('toIPagedResponse with data', () => {
    expect.assertions(3)

    const apr = new PagedResponse<{ data: 'hello' }>([{ data: 'hello' }], 1),
      ipr = apr.toIPagedResponse()

    expect(ipr.dataPage[0].data).toBe('hello')
    expect(ipr.totalCount).toBe(1)
    expect(ipr.rowCount).toBe(1)
  })

  it('toIPagedResponse', () => {
    expect.assertions(23)

    const pr = new PagedResponse<{ data: 'hello' }>([{ data: 'hello' }], 1)

    expect(PagedResponse.toIPagedResponse(pr).dataPage[0].data).toBe('hello')
    expect(PagedResponse.toIPagedResponse(pr).totalCount).toBe(1)
    expect(PagedResponse.toIPagedResponse(pr).rowCount).toBe(1)
    expect(PagedResponse.toIPagedResponse(pr, 10, 5).dataPage[0].data).toBe(
      'hello'
    )
    expect(PagedResponse.toIPagedResponse(pr, 10, 5).totalCount).toBe(1)
    expect(PagedResponse.toIPagedResponse(pr, 10, 5).rowCount).toBe(1)
    expect(
      PagedResponse.toIPagedResponse(pr, undefined, 5).dataPage[0].data
    ).toBe('hello')
    expect(PagedResponse.toIPagedResponse(pr, undefined, 5).totalCount).toBe(1)
    expect(PagedResponse.toIPagedResponse(pr, undefined, 5).rowCount).toBe(1)
    expect(
      PagedResponse.toIPagedResponse(pr, 10, undefined).dataPage[0].data
    ).toBe('hello')
    expect(PagedResponse.toIPagedResponse(pr, 10, undefined).totalCount).toBe(1)
    expect(PagedResponse.toIPagedResponse(pr, 10, undefined).rowCount).toBe(1)
    expect(
      PagedResponse.toIPagedResponse(pr, undefined, undefined).dataPage[0].data
    ).toBe('hello')
    expect(
      PagedResponse.toIPagedResponse(pr, undefined, undefined).totalCount
    ).toBe(1)

    expect(PagedResponse.toIPagedResponse(null)).toStrictEqual({
      dataPage: [],
      rowCount: 0,
      totalCount: 0,
    })
    expect(PagedResponse.toIPagedResponse(undefined)).toStrictEqual({
      dataPage: [],
      rowCount: 0,
      totalCount: 0,
    })
    expect(PagedResponse.toIPagedResponse([])).toStrictEqual({
      dataPage: [],
      rowCount: 0,
      totalCount: 0,
    })
    expect(PagedResponse.toIPagedResponse(null, 10, 5)).toStrictEqual({
      dataPage: [],
      rowCount: 0,
      totalCount: 0,
    })
    expect(PagedResponse.toIPagedResponse(undefined, 10, 5)).toStrictEqual({
      dataPage: [],
      rowCount: 0,
      totalCount: 0,
    })
    expect(PagedResponse.toIPagedResponse([], 10, 5)).toStrictEqual({
      dataPage: [],
      rowCount: 5,
      totalCount: 10,
    })
    expect(
      PagedResponse.toIPagedResponse(
        ['a', 'b', 'c', 'd', 'e', 'f'],
        undefined,
        5
      )
    ).toStrictEqual({
      dataPage: ['a', 'b', 'c', 'd', 'e', 'f'],
      rowCount: 5,
      totalCount: 6,
    })
    expect(
      PagedResponse.toIPagedResponse(
        ['a', 'b', 'c', 'd', 'e', 'f'],
        10,
        undefined
      )
    ).toStrictEqual({
      dataPage: ['a', 'b', 'c', 'd', 'e', 'f'],
      rowCount: 6,
      totalCount: 10,
    })
    expect(
      PagedResponse.toIPagedResponse(['a', 'b', 'c', 'd', 'e', 'f'], 10, 5)
    ).toStrictEqual({
      dataPage: ['a', 'b', 'c', 'd', 'e', 'f'],
      rowCount: 5,
      totalCount: 10,
    })
  })
})
