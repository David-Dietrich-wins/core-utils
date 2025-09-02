import { type IIdVal, IdVal } from './id-val.mjs'

test('IdVal good', () => {
  const id = 'id',
    ival = 'val',
    pr = new IdVal(id, ival)

  expect(pr.id).toBe(id)
  expect(pr.val).toBe(ival)
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
  const id = 'id',
    kval = 'val',
    pr = IdVal.ToIIdVal(id, kval)

  expect(pr.id).toBe(id)
  expect(pr.val).toBe(kval)
})

test('FromNameAndVal', () => {
  const id = 'id',
    ival = 'val',
    pr = IdVal.FromNameAndVal(id, ival)

  expect(pr.id).toBe(id)
  expect(pr.val).toBe(ival)
})

test('FromNameVal', () => {
  const nameVal = { name: 'name', val: 'val' },
    pr = IdVal.FromNameVal(nameVal)

  expect(pr.id).toBe(nameVal.name)
  expect(pr.val).toBe(nameVal.val)
})

test('FromNameVal with empty name', () => {
  const nameVal = { name: '', val: 'val' },
    pr = IdVal.FromNameVal(nameVal)

  expect(pr.id).toBe('')
  expect(pr.val).toBe(nameVal.val)
})
