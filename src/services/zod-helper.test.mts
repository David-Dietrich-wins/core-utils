import * as z from 'zod/v4'
import { describe, expect, it } from '@jest/globals'
import {
  zDateTime,
  zFromStringOrStringArray,
  zStringMinMax,
  zToStringArray,
} from './zod-helper.mjs'
import { ZodTestHelper } from '../jest.setup.mjs'

describe('zStringMinMax', () => {
  it('default max', () => {
    expect.assertions(9)

    const schema = zStringMinMax(3),
      str1000 = 'a'.repeat(1000),
      str1001 = 'a'.repeat(1001)

    expect(schema.safeParse(str1000)).toStrictEqual({
      data: str1000,
      success: true,
    })

    let retzod = schema.safeParse(str1001)

    expect(retzod.success).toBe(false)
    expect(retzod.error).toBeInstanceOf(z.ZodError)
    expect(retzod.error?.issues).toStrictEqual([
      ZodTestHelper.stringTooBig(1000, undefined, true),
    ])

    expect(schema.safeParse('  hello  ')).toStrictEqual({
      data: '  hello  ',
      success: true,
    })

    retzod = schema.safeParse('hi')

    expect(retzod.success).toBe(false)
    expect(retzod.error).toBeInstanceOf(z.ZodError)
    expect(retzod.error?.issues).toStrictEqual([
      ZodTestHelper.stringTooSmall(3, undefined, true),
    ])

    expect(schema.safeParse('this is a long string')).toStrictEqual({
      data: 'this is a long string',
      success: true,
    })
  })

  it('default min', () => {
    expect.assertions(2)

    const schema = zStringMinMax()

    expect(schema.safeParse('  hello  ')).toStrictEqual({
      data: '  hello  ',
      success: true,
    })
    expect(schema.safeParse('hi')).toStrictEqual({
      data: 'hi',
      success: true,
    })
  })

  it('trim lowercase', () => {
    expect.assertions(11)

    const schema = zStringMinMax(3, 10, {
      lowercase: true,
      trim: true,
    })

    expect(schema.safeParse('  HELLO  ')).toStrictEqual({
      data: 'hello',
      success: true,
    })

    let retzod = schema.safeParse('Hi')

    expect(retzod.success).toBe(false)
    expect(retzod.error).toBeInstanceOf(z.ZodError)
    expect(retzod.error?.issues).toStrictEqual([
      ZodTestHelper.stringTooSmall(3, undefined, true),
    ])

    retzod = schema.safeParse('this is a long string')

    expect(retzod.success).toBe(false)
    expect(retzod.error).toBeInstanceOf(z.ZodError)
    expect(retzod.error?.issues).toStrictEqual([
      ZodTestHelper.stringTooBig(10, undefined, true),
    ])

    retzod = schema.safeParse('heLLO world')

    expect(retzod.success).toBe(false)
    expect(retzod.error).toBeInstanceOf(z.ZodError)
    expect(retzod.error?.issues).toStrictEqual([
      ZodTestHelper.stringTooBig(10, undefined, true),
    ])

    expect(schema.safeParse('heLLO Wd')).toStrictEqual({
      data: 'hello wd',
      success: true,
    })
  })

  it('trim uppercase', () => {
    expect.assertions(10)

    const schema = zStringMinMax(3, 10, { trim: true, uppercase: true })

    expect(schema.safeParse('  hello  ')).toStrictEqual({
      data: 'HELLO',
      success: true,
    })

    let retzod = schema.safeParse('hi')

    expect(retzod.success).toBe(false)
    expect(retzod.error).toBeInstanceOf(z.ZodError)
    expect(retzod.error?.issues).toStrictEqual([
      ZodTestHelper.stringTooSmall(3, undefined, true),
    ])

    retzod = schema.safeParse('this is a long string')

    expect(retzod.success).toBe(false)
    expect(retzod.error).toBeInstanceOf(z.ZodError)
    expect(retzod.error?.issues).toStrictEqual([
      ZodTestHelper.stringTooBig(10, undefined, true),
    ])

    retzod = schema.safeParse('hello world')

    expect(retzod.success).toBe(false)
    expect(retzod.error).toBeInstanceOf(z.ZodError)
    expect(retzod.error?.issues).toStrictEqual([
      ZodTestHelper.stringTooBig(10, undefined, true),
    ])
  })
})

describe('zFromStringOrStringArray', () => {
  it('commas', () => {
    expect.assertions(4)

    const schema = zFromStringOrStringArray(3, 100)

    expect(schema.safeParse('  hello, world  ')).toStrictEqual({
      data: ['hello', 'world'],
      success: true,
    })
    expect(schema.safeParse('  hello,   ')).toStrictEqual({
      data: 'hello',
      success: true,
    })
    expect(schema.safeParse('     ')).toStrictEqual({
      data: [],
      success: true,
    })
    expect(schema.safeParse(' ,   , ')).toStrictEqual({
      data: [],
      success: true,
    })
  })

  it('default max', () => {
    expect.assertions(10)

    const schema = zFromStringOrStringArray(3),
      str1000 = 'a'.repeat(1000),
      str1001 = 'a'.repeat(1001)

    expect(schema.safeParse(str1000)).toStrictEqual({
      data: str1000,
      success: true,
    })

    let retzod = schema.safeParse(str1001)

    expect(retzod.success).toBe(false)
    expect(retzod.error).toBeInstanceOf(z.ZodError)
    expect(retzod.error?.issues).toStrictEqual([
      ZodTestHelper.stringTooBig(1000, undefined, true),
    ])

    expect(schema.safeParse('  hello  ')).toStrictEqual({
      data: 'hello',
      success: true,
    })

    retzod = schema.safeParse('hi')

    expect(retzod.success).toBe(false)
    expect(retzod.error).toBeInstanceOf(z.ZodError)
    expect(retzod.error?.issues).toStrictEqual([
      ZodTestHelper.stringTooSmall(3, [], true),
    ])

    expect(schema.safeParse('this is a long string')).toStrictEqual({
      data: 'this is a long string',
      success: true,
    })

    expect(schema.safeParse(['hELlo', 'World'])).toStrictEqual({
      data: ['hELlo', 'World'],
      success: true,
    })
  })

  it('default min', () => {
    expect.assertions(3)

    const schema = zFromStringOrStringArray()

    expect(schema.safeParse('  hello  ')).toStrictEqual({
      data: 'hello',
      success: true,
    })
    expect(schema.safeParse('hi')).toStrictEqual({
      data: 'hi',
      success: true,
    })
    expect(schema.safeParse(['hELlo', 'World'])).toStrictEqual({
      data: ['hELlo', 'World'],
      success: true,
    })
  })

  it('lowercase', () => {
    expect.assertions(16)

    const schema = zFromStringOrStringArray(3, 10, {
      lowercase: true,
      trim: true,
    })

    expect(schema.safeParse('  HELLO  ')).toStrictEqual({
      data: 'hello',
      success: true,
    })

    let retzod = schema.safeParse('hi')

    expect(retzod.success).toBe(false)
    expect(retzod.error).toBeInstanceOf(z.ZodError)
    expect(retzod.error?.issues).toStrictEqual([
      ZodTestHelper.stringTooSmall(3, [], true),
    ])

    retzod = schema.safeParse('this is a long string')

    expect(retzod.success).toBe(false)
    expect(retzod.error).toBeInstanceOf(z.ZodError)
    expect(retzod.error?.issues).toStrictEqual([
      ZodTestHelper.stringTooBig(10, [], true),
    ])

    retzod = schema.safeParse('hello world')

    expect(retzod.success).toBe(false)
    expect(retzod.error).toBeInstanceOf(z.ZodError)
    expect(retzod.error?.issues).toStrictEqual([
      ZodTestHelper.stringTooBig(10, [], true),
    ])

    expect(schema.safeParse(['hELlo', 'World'])).toStrictEqual({
      data: ['hello', 'world'],
      success: true,
    })

    retzod = schema.safeParse(['hi', 'there'])

    expect(retzod.success).toBe(false)
    expect(retzod.error).toBeInstanceOf(z.ZodError)
    expect(retzod.error?.issues).toStrictEqual([
      ZodTestHelper.stringTooSmall(3, [0], true),
    ])

    expect(
      schema.safeParse(['this is a long string', 'another long string'])
    ).toStrictEqual({
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining(ZodTestHelper.stringTooBig(10, [0], true)),
          expect.objectContaining(ZodTestHelper.stringTooBig(10, [1], true)),
        ]),
      }),
      success: false,
    })

    expect(
      schema.safeParse(['this is a long string', 'another long string'])
    ).toStrictEqual({
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining(ZodTestHelper.stringTooBig(10, [0], true)),
          expect.objectContaining(ZodTestHelper.stringTooBig(10, [1], true)),
        ]),
      }),
      success: false,
    })
  })

  it('uppercase', () => {
    expect.assertions(15)

    const schema = zFromStringOrStringArray(3, 10, {
      trim: true,
      uppercase: true,
    })

    expect(schema.safeParse('  hello  ')).toStrictEqual({
      data: 'HELLO',
      success: true,
    })

    let retzod = schema.safeParse('hi')

    expect(retzod.success).toBe(false)
    expect(retzod.error).toBeInstanceOf(z.ZodError)
    expect(retzod.error?.issues).toStrictEqual([
      ZodTestHelper.stringTooSmall(3, [], true),
    ])

    retzod = schema.safeParse('this is a long string')

    expect(retzod.success).toBe(false)
    expect(retzod.error).toBeInstanceOf(z.ZodError)
    expect(retzod.error?.issues).toStrictEqual([
      ZodTestHelper.stringTooBig(10, [], true),
    ])

    retzod = schema.safeParse('hello world')

    expect(retzod.success).toBe(false)
    expect(retzod.error).toBeInstanceOf(z.ZodError)
    expect(retzod.error?.issues).toStrictEqual([
      ZodTestHelper.stringTooBig(10, [], true),
    ])

    expect(schema.safeParse(['hello', 'world'])).toStrictEqual({
      data: ['HELLO', 'WORLD'],
      success: true,
    })

    retzod = schema.safeParse(['hi', 'there'])

    expect(retzod.success).toBe(false)
    expect(retzod.error).toBeInstanceOf(z.ZodError)
    expect(retzod.error?.issues).toStrictEqual([
      ZodTestHelper.stringTooSmall(3, [0], true),
    ])

    retzod = schema.safeParse(['this is a long string', 'another long string'])

    expect(retzod).toStrictEqual({
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining(ZodTestHelper.stringTooBig(10, [0], true)),
          expect.objectContaining(ZodTestHelper.stringTooBig(10, [1], true)),
        ]),
      }),
      success: false,
    })
  })
})

describe('zToStringArray', () => {
  it('commas', () => {
    expect.assertions(4)

    const schema = zToStringArray(3, 100)

    expect(schema.safeParse('  hello, world  ')).toStrictEqual({
      data: ['hello', 'world'],
      success: true,
    })
    expect(schema.safeParse('  hello,   ')).toStrictEqual({
      data: ['hello'],
      success: true,
    })
    expect(schema.safeParse('     ')).toStrictEqual({
      data: [],
      success: true,
    })
    expect(schema.safeParse(' ,   , ')).toStrictEqual({
      data: [],
      success: true,
    })
  })

  it('default max', () => {
    expect.assertions(10)

    const schema = zToStringArray(3),
      str1000 = 'a'.repeat(1000),
      str1001 = 'a'.repeat(1001)

    expect(schema.safeParse(str1000)).toStrictEqual({
      data: [str1000],
      success: true,
    })

    let retzod = schema.safeParse(str1001)

    expect(retzod.success).toBe(false)
    expect(retzod.error).toBeInstanceOf(z.ZodError)
    expect(retzod.error?.issues).toStrictEqual([
      ZodTestHelper.stringTooBig(1000, [], true),
    ])

    expect(schema.safeParse('  hello  ')).toStrictEqual({
      data: ['hello'],
      success: true,
    })

    retzod = schema.safeParse('hi')

    expect(retzod.success).toBe(false)
    expect(retzod.error).toBeInstanceOf(z.ZodError)
    expect(retzod.error?.issues).toStrictEqual([
      ZodTestHelper.stringTooSmall(3, [], true),
    ])

    expect(schema.safeParse('this is a long string')).toStrictEqual({
      data: ['this is a long string'],
      success: true,
    })
    expect(schema.safeParse(['hELlo', 'World'])).toStrictEqual({
      data: ['hELlo', 'World'],
      success: true,
    })
  })

  it('default min', () => {
    expect.assertions(3)

    const schema = zToStringArray()

    expect(schema.safeParse('  hello  ')).toStrictEqual({
      data: ['hello'],
      success: true,
    })
    expect(schema.safeParse('hi')).toStrictEqual({
      data: ['hi'],
      success: true,
    })
    expect(schema.safeParse(['hELlo', 'World'])).toStrictEqual({
      data: ['hELlo', 'World'],
      success: true,
    })
  })

  it('lowercase', () => {
    expect.assertions(19)

    const schema = zToStringArray(3, 10, {
      lowercase: true,
      trim: true,
    })

    expect(schema.safeParse('  HEllo  ')).toStrictEqual({
      data: ['hello'],
      success: true,
    })

    let retzod = schema.safeParse('hi')

    expect(retzod.success).toBe(false)
    expect(retzod.error).toBeInstanceOf(z.ZodError)
    expect(retzod.error?.issues).toStrictEqual([
      ZodTestHelper.stringTooSmall(3, [], true),
    ])

    retzod = schema.safeParse('this is a long string')

    expect(retzod.success).toBe(false)
    expect(retzod.error).toBeInstanceOf(z.ZodError)
    expect(retzod.error?.issues).toStrictEqual([
      ZodTestHelper.stringTooBig(10, [], true),
    ])

    retzod = schema.safeParse('hello world')

    expect(retzod.success).toBe(false)
    expect(retzod.error).toBeInstanceOf(z.ZodError)
    expect(retzod.error?.issues).toStrictEqual([
      ZodTestHelper.stringTooBig(10, [], true),
    ])

    expect(schema.safeParse(['hELlo', 'worLD'])).toStrictEqual({
      data: ['hello', 'world'],
      success: true,
    })

    retzod = schema.safeParse(['hi', 'there'])

    expect(retzod.success).toBe(false)
    expect(retzod.error).toBeInstanceOf(z.ZodError)
    // Expect(ret.error?.issues).toStrictEqual([])

    retzod = schema.safeParse(['hi', 'there'])

    expect(retzod.success).toBe(false)
    expect(retzod.error).toBeInstanceOf(z.ZodError)
    expect(retzod.error?.issues).toStrictEqual([
      ZodTestHelper.stringTooSmall(3, [0], true),
    ])

    retzod = schema.safeParse(['this is a long string', 'another long string'])

    expect(retzod.success).toBe(false)
    expect(retzod.error).toBeInstanceOf(z.ZodError)
    expect(retzod.error?.issues).toStrictEqual([
      ZodTestHelper.stringTooBig(10, [0], true),
      ZodTestHelper.stringTooBig(10, [1], true),
    ])
  })

  it('uppercase', () => {
    expect.assertions(18)

    const schema = zToStringArray(3, 10, { trim: true, uppercase: true })

    expect(schema.safeParse('  hello  ')).toStrictEqual({
      data: ['HELLO'],
      success: true,
    })

    let retzod = schema.safeParse('hi')

    expect(retzod.success).toBe(false)
    expect(retzod.error).toBeInstanceOf(z.ZodError)
    expect(retzod.error?.issues).toStrictEqual([
      ZodTestHelper.stringTooSmall(3, [], true),
    ])
    // error: expect.objectContaining({
    // Code: 'invalid_union',
    // Errors: expect.arrayContaining([
    //   Expect.objectContaining({
    //     Code: 'too_small',
    //     Message: 'Too small: expected string to have >3 characters',
    //   }),
    //   Expect.objectContaining({
    //     Expected: 'array',
    //     Code: 'invalid_type',
    //     Path: [],
    //     Message: 'Invalid input: expected array, received string',
    //   }),
    // ]),
    //   }),
    //   success: false,
    // })

    retzod = schema.safeParse('this is a long string')

    expect(retzod.success).toBe(false)
    expect(retzod.error).toBeInstanceOf(z.ZodError)
    expect(retzod.error?.issues).toStrictEqual([
      ZodTestHelper.stringTooBig(10, [], true),
    ])

    retzod = schema.safeParse('hello world')

    expect(retzod.success).toBe(false)
    expect(retzod.error).toBeInstanceOf(z.ZodError)
    expect(retzod.error?.issues).toStrictEqual([
      ZodTestHelper.stringTooBig(10, [], true),
    ])

    expect(schema.safeParse(['hello', 'world'])).toStrictEqual({
      data: ['HELLO', 'WORLD'],
      success: true,
    })

    retzod = schema.safeParse(['hi', 'there'])

    expect(retzod.success).toBe(false)
    expect(retzod.error).toBeInstanceOf(z.ZodError)
    expect(retzod.error?.issues).toStrictEqual([
      ZodTestHelper.stringTooSmall(3, [0], true),
    ])

    retzod = schema.safeParse(['this is a long string', 'another long string'])

    expect(retzod).toStrictEqual({
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining(ZodTestHelper.stringTooBig(10, [0], true)),
          expect.objectContaining(ZodTestHelper.stringTooBig(10, [1], true)),
        ]),
      }),
      success: false,
    })
    expect(retzod.success).toBe(false)
    expect(retzod.error).toBeInstanceOf(z.ZodError)
    expect(retzod.error?.issues).toStrictEqual([
      ZodTestHelper.stringTooBig(10, [0], true),
      ZodTestHelper.stringTooBig(10, [1], true),
    ])
  })
})

// te st.only('debug-test', () => {
//   const schema = zToStringArray(3, 10, { trim: true, uppercase: true })
//   const ret = schema.safeParse('this is a long string')
//   expect(ret).toStrictEqual(
//     ZodTestHelper.successFalseSingle(ZodTestHelper.stringTooBig(10))
//   )
// })

describe('zDateTime', () => {
  it('should parse valid date inputs', () => {
    expect.assertions(8)

    const schema = zDateTime(),
      spret = schema.safeParse(null)

    expect(schema.safeParse(new Date('2023-01-01'))).toStrictEqual({
      data: new Date('2023-01-01'),
      success: true,
    })
    expect(schema.safeParse('2023-01-01')).toStrictEqual({
      data: new Date('2023-01-01'),
      success: true,
    })
    expect(schema.safeParse(1672531200000)).toStrictEqual({
      data: new Date(1672531200000),
      success: true,
    })
    expect(schema.safeParse('invalid date')).toStrictEqual({
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'invalid_type',
            expected: 'date',
            message: 'Invalid input: expected date, received Date',
            path: [],
            received: 'Invalid Date',
          }),
        ]),
      }),
      success: false,
    })

    expect(spret.success).toBe(false)
    expect(spret.error).toBeInstanceOf(z.ZodError)
    expect(spret.error?.issues).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'invalid_type',
          expected: 'date',
          message: 'Invalid input: expected date, received undefined',
          path: [],
        }),
      ])
    )

    expect(schema.safeParse(null)).toStrictEqual({
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'invalid_type',
            expected: 'date',
            message: 'Invalid input: expected date, received undefined',
            path: [],
          }),
        ]),
      }),
      success: false,
    })
  })
})
