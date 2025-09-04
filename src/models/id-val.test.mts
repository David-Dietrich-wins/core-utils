import { type IIdVal, IdVal } from './id-val.mjs'

it('IdVal good', () => {
  const id = 'id',
    ival = 'val',
    pr = new IdVal(id, ival)

  expect(pr.id).toBe(id)
  expect(pr.val).toBe(ival)
})

it('IIdVal interface', () => {
  const pr: IIdVal = {
    id: 'id',
    val: 'val',
  }

  expect(pr.id).toBe('id')
  expect(pr.val).toBe('val')
})

it('CreateIdVal', () => {
  const id = 'id',
    kval = 'val',
    pr = IdVal.toIIdVal(id, kval)

  expect(pr.id).toBe(id)
  expect(pr.val).toBe(kval)
})

it('fromNameAndVal', () => {
  const id = 'id',
    ival = 'val',
    pr = IdVal.fromNameAndVal(id, ival)

  expect(pr.id).toBe(id)
  expect(pr.val).toBe(ival)
})

it('fromNameVal', () => {
  const nameVal = { name: 'name', val: 'val' },
    pr = IdVal.fromNameVal(nameVal)

  expect(pr.id).toBe(nameVal.name)
  expect(pr.val).toBe(nameVal.val)
})

it('fromNameVal with empty name', () => {
  const nameVal = { name: '', val: 'val' },
    pr = IdVal.fromNameVal(nameVal)

  expect(pr.id).toBe('')
  expect(pr.val).toBe(nameVal.val)
})
