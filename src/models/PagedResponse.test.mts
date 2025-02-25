import { PagedResponse } from './PagedResponse.mjs'

test('PagedResponse good', () => {
  const pr = new PagedResponse<{ data: 'hello' }>([{ data: 'hello' }], 1)

  expect(pr.dataPage[0].data).toBe('hello')
  expect(pr.totalCount).toBe(1)
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
