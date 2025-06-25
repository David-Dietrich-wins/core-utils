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

test('CreateIdVal', () => {
  const id = 'id'
  const val = 'val'
  const pr = IdVal.ToIIdVal(id, val)

  expect(pr.id).toBe(id)
  expect(pr.val).toBe(val)
})

test('FromNameAndVal', () => {
  const id = 'id'
  const val = 'val'
  const pr = IdVal.FromNameAndVal(id, val)

  expect(pr.id).toBe(id)
  expect(pr.val).toBe(val)
})

test('FromNameVal', () => {
  const nameVal = { name: 'name', val: 'val' }
  const pr = IdVal.FromNameVal(nameVal)

  expect(pr.id).toBe(nameVal.name)
  expect(pr.val).toBe(nameVal.val)
})

test('FromNameVal with empty name', () => {
  const nameVal = { name: '', val: 'val' }
  const pr = IdVal.FromNameVal(nameVal)

  expect(pr.id).toBe('')
  expect(pr.val).toBe(nameVal.val)
})
