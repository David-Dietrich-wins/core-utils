import { type IIdVal, IdVal } from './id-val.mjs'
import { describe, expect, it } from '@jest/globals'

describe('id val', () => {
  it('good', () => {
    expect.assertions(2)

    const id = 'id',
      ival = 'val',
      pr = new IdVal(id, ival)

    expect(pr.id).toBe(id)
    expect(pr.val).toBe(ival)
  })

  it('iIdVal interface', () => {
    expect.assertions(2)

    const pr: IIdVal = {
      id: 'id',
      val: 'val',
    }

    expect(pr.id).toBe('id')
    expect(pr.val).toBe('val')
  })

  it('createIdVal', () => {
    expect.assertions(2)

    const id = 'id',
      kval = 'val',
      pr = IdVal.toIIdVal(id, kval)

    expect(pr.id).toBe(id)
    expect(pr.val).toBe(kval)
  })

  it('fromNameAndVal', () => {
    expect.assertions(2)

    const id = 'id',
      ival = 'val',
      pr = IdVal.fromNameAndVal(id, ival)

    expect(pr.id).toBe(id)
    expect(pr.val).toBe(ival)
  })

  it('fromNameVal', () => {
    expect.assertions(2)

    const nameVal = { name: 'name', val: 'val' },
      pr = IdVal.fromNameVal(nameVal)

    expect(pr.id).toBe(nameVal.name)
    expect(pr.val).toBe(nameVal.val)
  })

  it('fromNameVal with empty name', () => {
    expect.assertions(2)

    const nameVal = { name: '', val: 'val' },
      pr = IdVal.fromNameVal(nameVal)

    expect(pr.id).toBe('')
    expect(pr.val).toBe(nameVal.val)
  })
})
