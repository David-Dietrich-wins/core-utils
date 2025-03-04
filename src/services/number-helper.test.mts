import {
  addNumbers,
  divideByNumbers,
  setMaxDecimalPlaces,
} from './number-helper.mjs'

test('addNumbers', () => {
  const io = { a: 2, b: 3, c: '4', d: '5', e: 'a', f: 'b' }

  const objRet = addNumbers(io, { a: 3, b: 4, c: '5', d: '6', e: 'c', f: 'd' })
  expect(objRet).toEqual({ a: 5, b: 7, c: 9, d: 11, e: 'a', f: 'b' })

  const io2 = { a: 2, b: 3, c: '4', d: '5', e: 'a', f: { a: 2 } }
  const objret2 = addNumbers(io2, {
    a: 3,
    b: 4,
    c: '5',
    d: '6',
    e: 'c',
    f: { a: 2 },
  })
  expect(objret2).toEqual({ a: 5, b: 7, c: 9, d: 11, e: 'a', f: { a: 2 } })

  const io3 = { a: [2], b: 3, c: '4', d: '5', e: 'a', f: { a: 2 } }
  const objret3 = addNumbers(io3, {
    a: [3],
    b: 4,
    c: '5',
    d: '6',
    e: 'c',
    f: { a: 2 },
  })
  expect(objret3).toEqual({ a: [2], b: 7, c: 9, d: 11, e: 'a', f: { a: 2 } })
})

test('divideByNumbers', () => {
  const io = { a: 2, b: 3, c: '4', d: '5', e: 'a', f: 'b' }

  const objRet = divideByNumbers(io, 2)

  expect(objRet).toEqual({ a: 1, b: 1.5, c: 2, d: 2.5, e: 'a', f: 'b' })
})

describe('maxDecimalPlaces', () => {
  test('good', () => {
    expect(setMaxDecimalPlaces(2.12, 2)).toEqual('2.00')
    expect(setMaxDecimalPlaces(34.9912, 2)).toEqual('35.00')
    expect(setMaxDecimalPlaces(234.499999912, 2)).toEqual('234.00')
    expect(setMaxDecimalPlaces(234.5000001, 2)).toEqual('235.00')
  })

  test('good obj', () => {
    const io = {
      a: 2.123456,
      b: 3.123456,
      c: '4.123456',
    }

    expect(setMaxDecimalPlaces(io, 2)).toEqual({
      a: '2.00',
      b: '3.00',
      c: '4.00',
    })
  })
})
