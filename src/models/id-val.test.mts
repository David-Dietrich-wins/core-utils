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
    pr = IdVal.toIIdVal(id, kval)

  expect(pr.id).toBe(id)
  expect(pr.val).toBe(kval)
})

test('fromNameAndVal', () => {
  const id = 'id',
    ival = 'val',
    pr = IdVal.fromNameAndVal(id, ival)

  expect(pr.id).toBe(id)
  expect(pr.val).toBe(ival)
})

test('fromNameVal', () => {
  const nameVal = { name: 'name', val: 'val' },
    pr = IdVal.fromNameVal(nameVal)

  expect(pr.id).toBe(nameVal.name)
  expect(pr.val).toBe(nameVal.val)
})

test('fromNameVal with empty name', () => {
  const nameVal = { name: '', val: 'val' },
    pr = IdVal.fromNameVal(nameVal)

  expect(pr.id).toBe('')
  expect(pr.val).toBe(nameVal.val)
})
