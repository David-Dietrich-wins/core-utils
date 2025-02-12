import { PagedResponse } from './PagedResponse.mjs'

test('PagedResponse good', () => {
  const pr = new PagedResponse<{ data: 'hello' }>([{ data: 'hello' }], 1)

  expect(pr.dataPage[0].data).toBe('hello')
  expect(pr.totalCount).toBe(1)
})
