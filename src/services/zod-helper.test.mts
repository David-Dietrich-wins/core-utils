/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  zDateTime,
  zFromStringOrStringArray,
  zStringMinMax,
  zToStringArray,
} from './zod-helper.mjs'
import { ZodError } from 'zod/v4'
import { ZodTestHelper } from '../jest.setup.mjs'

describe('zStringMinMax', () => {
  test('default max', () => {
    const schema = zStringMinMax(3),
      str1000 = 'a'.repeat(1000),
      str1001 = 'a'.repeat(1001)

    expect(schema.safeParse(str1000)).toEqual({
      data: str1000,
      success: true,
    })
    expect(schema.safeParse(str1001)).toEqual(
      ZodTestHelper.SuccessFalseSingle(ZodTestHelper.StringTooBig(1000))
    )

    expect(schema.safeParse('  hello  ')).toEqual({
      data: '  hello  ',
      success: true,
    })
    expect(schema.safeParse('hi')).toEqual(
      ZodTestHelper.SuccessFalseSingle(ZodTestHelper.StringTooSmall(3))
    )
    expect(schema.safeParse('this is a long string')).toEqual({
      data: 'this is a long string',
      success: true,
    })
  })

  test('default min', () => {
    const schema = zStringMinMax()
    expect(schema.safeParse('  hello  ')).toEqual({
      data: '  hello  ',
      success: true,
    })
    expect(schema.safeParse('hi')).toEqual({
      data: 'hi',
      success: true,
    })
  })

  test('trim lowercase', () => {
    const schema = zStringMinMax(3, 10, {
      lowercase: true,
      trim: true,
    })
    expect(schema.safeParse('  HELLO  ')).toEqual({
      data: 'hello',
      success: true,
    })
    expect(schema.safeParse('Hi')).toEqual(
      ZodTestHelper.SuccessFalseSingle(ZodTestHelper.StringTooSmall(3))
    )
    expect(schema.safeParse('this IS a long string')).toEqual(
      ZodTestHelper.SuccessFalseSingle(ZodTestHelper.StringTooBig(10))
    )
    expect(schema.safeParse('heLLO world')).toEqual(
      ZodTestHelper.SuccessFalseSingle(ZodTestHelper.StringTooBig(10))
    )
    expect(schema.safeParse('heLLO Wd')).toEqual({
      data: 'hello wd',
      success: true,
    })
  })

  test('trim uppercase', () => {
    const schema = zStringMinMax(3, 10, { trim: true, uppercase: true })
    expect(schema.safeParse('  hello  ')).toEqual({
      data: 'HELLO',
      success: true,
    })
    expect(schema.safeParse('hi')).toEqual(
      ZodTestHelper.SuccessFalseSingle(ZodTestHelper.StringTooSmall(3))
    )

    expect(schema.safeParse('this is a long string')).toEqual(
      ZodTestHelper.SuccessFalseSingle(ZodTestHelper.StringTooBig(10))
    )
    expect(schema.safeParse('hello world')).toEqual(
      ZodTestHelper.SuccessFalseSingle(ZodTestHelper.StringTooBig(10))
    )
  })
})

describe('zFromStringOrStringArray', () => {
  test('commas', () => {
    const schema = zFromStringOrStringArray(3, 100)
    expect(schema.safeParse('  hello, world  ')).toEqual({
      data: ['hello', 'world'],
      success: true,
    })
    expect(schema.safeParse('  hello,   ')).toEqual({
      data: 'hello',
      success: true,
    })
    expect(schema.safeParse('     ')).toEqual({
      data: [],
      success: true,
    })
    expect(schema.safeParse(' ,   , ')).toEqual({
      data: [],
      success: true,
    })
  })

  test('default max', () => {
    const schema = zFromStringOrStringArray(3),
      str1000 = 'a'.repeat(1000),
      str1001 = 'a'.repeat(1001)

    expect(schema.safeParse(str1000)).toEqual({
      data: str1000,
      success: true,
    })

    expect(schema.safeParse(str1001)).toEqual({
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining(ZodTestHelper.StringTooBig(1000)),
        ]),
      }),
      success: false,
    })

    expect(schema.safeParse('  hello  ')).toEqual({
      data: 'hello',
      success: true,
    })
    expect(schema.safeParse('hi')).toEqual({
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining(ZodTestHelper.StringTooSmall(3)),
        ]),
      }),
      success: false,
    })

    expect(schema.safeParse('this is a long string')).toEqual({
      data: 'this is a long string',
      success: true,
    })

    expect(schema.safeParse(['hELlo', 'World'])).toEqual({
      data: ['hELlo', 'World'],
      success: true,
    })
  })

  test('default min', () => {
    const schema = zFromStringOrStringArray()
    expect(schema.safeParse('  hello  ')).toEqual({
      data: 'hello',
      success: true,
    })
    expect(schema.safeParse('hi')).toEqual({
      data: 'hi',
      success: true,
    })
    expect(schema.safeParse(['hELlo', 'World'])).toEqual({
      data: ['hELlo', 'World'],
      success: true,
    })
  })

  test('lowercase', () => {
    const schema = zFromStringOrStringArray(3, 10, {
      lowercase: true,
      trim: true,
    })
    expect(schema.safeParse('  HELLO  ')).toEqual({
      data: 'hello',
      success: true,
    })
    expect(schema.safeParse('hi')).toEqual({
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining(ZodTestHelper.StringTooSmall(3)),
        ]),
      }),
      success: false,
    })
    expect(schema.safeParse('this is a long string')).toEqual({
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining(ZodTestHelper.StringTooBig(10)),
        ]),
      }),
      success: false,
    })

    expect(schema.safeParse('hello world')).toEqual({
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining(ZodTestHelper.StringTooBig(10)),
        ]),
      }),
      success: false,
    })

    expect(schema.safeParse(['hELlo', 'World'])).toEqual({
      data: ['hello', 'world'],
      success: true,
    })
    expect(schema.safeParse(['hi', 'there'])).toEqual({
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining(ZodTestHelper.StringTooSmall(3, [0], true)),
        ]),
      }),
      success: false,
    })

    expect(
      schema.safeParse(['this is a long string', 'another long string'])
    ).toEqual({
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining(ZodTestHelper.StringTooBig(10, [0], true)),
          expect.objectContaining(ZodTestHelper.StringTooBig(10, [1], true)),
        ]),
      }),
      success: false,
    })

    expect(
      schema.safeParse(['this is a long string', 'another long string'])
    ).toEqual({
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining(ZodTestHelper.StringTooBig(10, [0], true)),
          expect.objectContaining(ZodTestHelper.StringTooBig(10, [1], true)),
        ]),
      }),
      success: false,
    })
  })

  test('uppercase', () => {
    const schema = zFromStringOrStringArray(3, 10, {
      trim: true,
      uppercase: true,
    })
    expect(schema.safeParse('  hello  ')).toEqual({
      data: 'HELLO',
      success: true,
    })
    expect(schema.safeParse('hi')).toEqual({
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining(ZodTestHelper.StringTooSmall(3)),
        ]),
      }),
      success: false,
    })

    expect(schema.safeParse('this is a long string')).toEqual({
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining(ZodTestHelper.StringTooBig(10)),
        ]),
      }),
      success: false,
    })

    expect(schema.safeParse('hello world')).toEqual({
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining(ZodTestHelper.StringTooBig(10)),
        ]),
      }),
      success: false,
    })

    expect(schema.safeParse(['hello', 'world'])).toEqual({
      data: ['HELLO', 'WORLD'],
      success: true,
    })
    expect(schema.safeParse(['hi', 'there'])).toEqual({
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining(ZodTestHelper.StringTooSmall(3, [0], true)),
        ]),
      }),
      success: false,
    })

    expect(
      schema.safeParse(['this is a long string', 'another long string'])
    ).toEqual({
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining(ZodTestHelper.StringTooBig(10, [0], true)),
          expect.objectContaining(ZodTestHelper.StringTooBig(10, [1], true)),
        ]),
      }),
      success: false,
    })
  })
})

describe('zToStringArray', () => {
  test('commas', () => {
    const schema = zToStringArray(3, 100)
    expect(schema.safeParse('  hello, world  ')).toEqual({
      data: ['hello', 'world'],
      success: true,
    })
    expect(schema.safeParse('  hello,   ')).toEqual({
      data: ['hello'],
      success: true,
    })
    expect(schema.safeParse('     ')).toEqual({
      data: [],
      success: true,
    })
    expect(schema.safeParse(' ,   , ')).toEqual({
      data: [],
      success: true,
    })
  })

  test('default max', () => {
    const schema = zToStringArray(3),
      str1000 = 'a'.repeat(1000),
      str1001 = 'a'.repeat(1001)

    expect(schema.safeParse(str1000)).toEqual({
      data: [str1000],
      success: true,
    })

    const ret = schema.safeParse(str1001)
    expect(ret.success).toBe(false)
    expect(ret.error).toBeInstanceOf(ZodError)
    expect(ret.error?.issues).toEqual([
      ZodTestHelper.StringTooBig(1000, [], true),
    ])

    expect(schema.safeParse('  hello  ')).toEqual({
      data: ['hello'],
      success: true,
    })
    expect(schema.safeParse('hi')).toEqual({
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining(ZodTestHelper.StringTooSmall(3)),
        ]),
      }),
      success: false,
    })
    expect(schema.safeParse('this is a long string')).toEqual({
      data: ['this is a long string'],
      success: true,
    })
    expect(schema.safeParse(['hELlo', 'World'])).toEqual({
      data: ['hELlo', 'World'],
      success: true,
    })
  })

  test('default min', () => {
    const schema = zToStringArray()
    expect(schema.safeParse('  hello  ')).toEqual({
      data: ['hello'],
      success: true,
    })
    expect(schema.safeParse('hi')).toEqual({
      data: ['hi'],
      success: true,
    })
    expect(schema.safeParse(['hELlo', 'World'])).toEqual({
      data: ['hELlo', 'World'],
      success: true,
    })
  })

  test('lowercase', () => {
    const schema = zToStringArray(3, 10, {
      lowercase: true,
      trim: true,
    })
    expect(schema.safeParse('  HEllo  ')).toEqual({
      data: ['hello'],
      success: true,
    })
    expect(schema.safeParse('hi')).toEqual(
      ZodTestHelper.SuccessFalseSingle(ZodTestHelper.StringTooSmall(3))
    )
    expect(schema.safeParse('this is a long string')).toEqual(
      ZodTestHelper.SuccessFalseSingle(ZodTestHelper.StringTooBig(10))
    )
    expect(schema.safeParse('hello world')).toEqual(
      ZodTestHelper.SuccessFalseSingle(ZodTestHelper.StringTooBig(10))
    )
    expect(schema.safeParse(['hELlo', 'worLD'])).toEqual({
      data: ['hello', 'world'],
      success: true,
    })

    let ret = schema.safeParse(['hi', 'there'])
    expect(ret.success).toBe(false)
    expect(ret.error).toBeInstanceOf(ZodError)
    // Expect(ret.error?.issues).toEqual([])
    expect(schema.safeParse(['hi', 'there'])).toEqual(
      ZodTestHelper.SuccessFalseSingle(ZodTestHelper.StringTooSmall(3, [0]))
    )

    ret = schema.safeParse(['this is a long string', 'another long string'])
    expect(ret.success).toBe(false)
    expect(ret.error).toBeInstanceOf(ZodError)
    expect(ret.error?.issues).toEqual([
      ZodTestHelper.StringTooBig(10, [0], true),
      ZodTestHelper.StringTooBig(10, [1], true),
    ])
  })

  test('uppercase', () => {
    const schema = zToStringArray(3, 10, { trim: true, uppercase: true })
    expect(schema.safeParse('  hello  ')).toEqual({
      data: ['HELLO'],
      success: true,
    })
    expect(schema.safeParse('hi')).toEqual({
      error: expect.objectContaining({
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
      }),
      success: false,
    })
    expect(schema.safeParse('this is a long string')).toEqual(
      ZodTestHelper.SuccessFalseSingle(ZodTestHelper.StringTooBig(10))
    )
    expect(schema.safeParse('hello world')).toEqual(
      ZodTestHelper.SuccessFalseSingle(ZodTestHelper.StringTooBig(10))
    )
    expect(schema.safeParse(['hello', 'world'])).toEqual({
      data: ['HELLO', 'WORLD'],
      success: true,
    })
    expect(schema.safeParse(['hi', 'there'])).toEqual(
      ZodTestHelper.SuccessFalseSingle(ZodTestHelper.StringTooSmall(3, [0]))
    )

    const ret = schema.safeParse([
      'this is a long string',
      'another long string',
    ])
    expect(ret).toEqual({
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining(ZodTestHelper.StringTooBig(10, [0], true)),
          expect.objectContaining(ZodTestHelper.StringTooBig(10, [1], true)),
        ]),
      }),
      success: false,
    })
    expect(ret.success).toBe(false)
    expect(ret.error).toBeInstanceOf(ZodError)
    expect(ret.error?.issues).toEqual([
      ZodTestHelper.StringTooBig(10, [0], true),
      ZodTestHelper.StringTooBig(10, [1], true),
    ])
  })
})

// test.only('debug-test', () => {
//   const schema = zToStringArray(3, 10, { trim: true, uppercase: true })
//   const ret = schema.safeParse('this is a long string')
//   expect(ret).toEqual(
//     ZodTestHelper.SuccessFalseSingle(ZodTestHelper.StringTooBig(10))
//   )
// })

test('zDateTime', () => {
  const schema = zDateTime()
  expect(schema.safeParse(new Date('2023-01-01'))).toEqual({
    data: new Date('2023-01-01'),
    success: true,
  })
  expect(schema.safeParse('2023-01-01')).toEqual({
    data: new Date('2023-01-01'),
    success: true,
  })
  expect(schema.safeParse(1672531200000)).toEqual({
    data: new Date(1672531200000),
    success: true,
  })
  expect(schema.safeParse('invalid date')).toEqual({
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

  const ret = schema.safeParse(null)
  expect(ret.success).toBe(false)
  expect(ret.error).toBeInstanceOf(ZodError)
  expect(ret.error?.issues).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        code: 'invalid_type',
        expected: 'date',
        message: 'Invalid input: expected date, received undefined',
        path: [],
      }),
    ])
  )

  expect(schema.safeParse(null)).toEqual({
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
