import { IdVal, IIdVal } from './id-val.mjs'

test('IdVal good', () => {
  const id = 'id'
  const val = 'val'
  const pr = new IdVal(id, val)

  expect(pr.id).toBe(id)
  expect(pr.val).toBe(val)
})

test('IIdVal interface', () => {
  const pr: IIdVal = {
    id: 'id',
    val: 'val',
  }

  expect(pr.id).toBe('id')
  expect(pr.val).toBe('val')
})
