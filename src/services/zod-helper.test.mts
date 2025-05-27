import { ZodError } from 'zod'
import {
  zDateTime,
  zFromStringOrStringArray,
  zStringMinMax,
  zToStringArray,
} from './zod-helper.mjs'

describe('zStringMinMax', () => {
  test('default max', () => {
    const schema = zStringMinMax(3)
    const str1000 = 'a'.repeat(1000)
    const str1001 = 'a'.repeat(1001)

    expect(schema.safeParse(str1000)).toEqual({
      success: true,
      data: str1000,
    })
    expect(schema.safeParse(str1001)).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'too_big',
            message: 'String must contain at most 1000 character(s)',
          }),
        ]),
      }),
    })

    expect(schema.safeParse('  hello  ')).toEqual({
      success: true,
      data: '  hello  ',
    })
    expect(schema.safeParse('hi')).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'too_small',
            message: 'String must contain at least 3 character(s)',
          }),
        ]),
      }),
    })
    expect(schema.safeParse('this is a long string')).toEqual({
      success: true,
      data: 'this is a long string',
    })
  })

  test('default min', () => {
    const schema = zStringMinMax()
    expect(schema.safeParse('  hello  ')).toEqual({
      success: true,
      data: '  hello  ',
    })
    expect(schema.safeParse('hi')).toEqual({
      success: true,
      data: 'hi',
    })
  })

  test('trim lowercase', () => {
    const schema = zStringMinMax(3, 10, { trim: true, lowercase: true })
    expect(schema.safeParse('  HELLO  ')).toEqual({
      success: true,
      data: 'hello',
    })
    expect(schema.safeParse('Hi')).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'too_small',
            message: 'String must contain at least 3 character(s)',
          }),
        ]),
      }),
    })
    expect(schema.safeParse('this IS a long string')).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'too_big',
            message: 'String must contain at most 10 character(s)',
          }),
        ]),
      }),
    })
    expect(schema.safeParse('heLLO world')).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'too_big',
            message: 'String must contain at most 10 character(s)',
          }),
        ]),
      }),
    })
    expect(schema.safeParse('heLLO Wd')).toEqual({
      success: true,
      data: 'hello wd',
    })
  })

  test('trim uppercase', () => {
    const schema = zStringMinMax(3, 10, { trim: true, uppercase: true })
    expect(schema.safeParse('  hello  ')).toEqual({
      success: true,
      data: 'HELLO',
    })
    expect(schema.safeParse('hi')).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'too_small',
            message: 'String must contain at least 3 character(s)',
          }),
        ]),
      }),
    })
    expect(schema.safeParse('this is a long string')).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'too_big',
            message: 'String must contain at most 10 character(s)',
          }),
        ]),
      }),
    })
    expect(schema.safeParse('hello world')).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'too_big',
            message: 'String must contain at most 10 character(s)',
          }),
        ]),
      }),
    })
  })
})

describe('zFromStringOrStringArray', () => {
  test('commas', () => {
    const schema = zFromStringOrStringArray(3, 100)
    expect(schema.safeParse('  hello, world  ')).toEqual({
      success: true,
      data: ['hello', 'world'],
    })
    expect(schema.safeParse('  hello,   ')).toEqual({
      success: true,
      data: 'hello',
    })
    expect(schema.safeParse('     ')).toEqual({
      success: true,
      data: [],
    })
    expect(schema.safeParse(' ,   , ')).toEqual({
      success: true,
      data: [],
    })
  })

  test('default max', () => {
    const schema = zFromStringOrStringArray(3)
    const str1000 = 'a'.repeat(1000)
    const str1001 = 'a'.repeat(1001)

    expect(schema.safeParse(str1000)).toEqual({
      success: true,
      data: str1000,
    })
    expect(schema.safeParse(str1001)).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'too_big',
            message: 'String must contain at most 1000 character(s)',
          }),
        ]),
      }),
    })

    expect(schema.safeParse('  hello  ')).toEqual({
      success: true,
      data: 'hello',
    })
    expect(schema.safeParse('hi')).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'too_small',
            message: 'String must contain at least 3 character(s)',
          }),
        ]),
      }),
    })
    expect(schema.safeParse('this is a long string')).toEqual({
      success: true,
      data: 'this is a long string',
    })
    expect(schema.safeParse(['hELlo', 'World'])).toEqual({
      success: true,
      data: ['hELlo', 'World'],
    })
  })

  test('default min', () => {
    const schema = zFromStringOrStringArray()
    expect(schema.safeParse('  hello  ')).toEqual({
      success: true,
      data: 'hello',
    })
    expect(schema.safeParse('hi')).toEqual({
      success: true,
      data: 'hi',
    })
    expect(schema.safeParse(['hELlo', 'World'])).toEqual({
      success: true,
      data: ['hELlo', 'World'],
    })
  })

  test('lowercase', () => {
    const schema = zFromStringOrStringArray(3, 10, {
      trim: true,
      lowercase: true,
    })
    expect(schema.safeParse('  HELLO  ')).toEqual({
      success: true,
      data: 'hello',
    })
    expect(schema.safeParse('hi')).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'too_small',
            message: 'String must contain at least 3 character(s)',
          }),
        ]),
      }),
    })
    expect(schema.safeParse('this is a long string')).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'too_big',
            message: 'String must contain at most 10 character(s)',
          }),
        ]),
      }),
    })
    expect(schema.safeParse('hello world')).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'too_big',
            message: 'String must contain at most 10 character(s)',
          }),
        ]),
      }),
    })
    expect(schema.safeParse(['hELlo', 'World'])).toEqual({
      success: true,
      data: ['hello', 'world'],
    })
    expect(schema.safeParse(['hi', 'there'])).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'too_small',
            message: 'String must contain at least 3 character(s)',
          }),
        ]),
      }),
    })
    expect(
      schema.safeParse(['this is a long string', 'another long string'])
    ).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'too_big',
            message: 'String must contain at most 10 character(s)',
          }),
        ]),
      }),
    })
  })

  test('uppercase', () => {
    const schema = zFromStringOrStringArray(3, 10, {
      trim: true,
      uppercase: true,
    })
    expect(schema.safeParse('  hello  ')).toEqual({
      success: true,
      data: 'HELLO',
    })
    expect(schema.safeParse('hi')).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'too_small',
            message: 'String must contain at least 3 character(s)',
          }),
        ]),
      }),
    })
    expect(schema.safeParse('this is a long string')).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'too_big',
            message: 'String must contain at most 10 character(s)',
          }),
        ]),
      }),
    })
    expect(schema.safeParse('hello world')).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'too_big',
            message: 'String must contain at most 10 character(s)',
          }),
        ]),
      }),
    })
    expect(schema.safeParse(['hello', 'world'])).toEqual({
      success: true,
      data: ['HELLO', 'WORLD'],
    })
    expect(schema.safeParse(['hi', 'there'])).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'too_small',
            message: 'String must contain at least 3 character(s)',
          }),
        ]),
      }),
    })
    expect(
      schema.safeParse(['this is a long string', 'another long string'])
    ).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'too_big',
            message: 'String must contain at most 10 character(s)',
          }),
        ]),
      }),
    })
  })
})

describe('zToStringArray', () => {
  test('commas', () => {
    const schema = zToStringArray(3, 100)
    expect(schema.safeParse('  hello, world  ')).toEqual({
      success: true,
      data: ['hello', 'world'],
    })
    expect(schema.safeParse('  hello,   ')).toEqual({
      success: true,
      data: ['hello'],
    })
    expect(schema.safeParse('     ')).toEqual({
      success: true,
      data: [],
    })
    expect(schema.safeParse(' ,   , ')).toEqual({
      success: true,
      data: [],
    })
  })

  test('default max', () => {
    const schema = zToStringArray(3)
    const str1000 = 'a'.repeat(1000)
    const str1001 = 'a'.repeat(1001)

    expect(schema.safeParse(str1000)).toEqual({
      success: true,
      data: [str1000],
    })
    expect(schema.safeParse(str1001)).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'too_big',
            message: 'String must contain at most 1000 character(s)',
          }),
        ]),
      }),
    })

    expect(schema.safeParse('  hello  ')).toEqual({
      success: true,
      data: ['hello'],
    })
    expect(schema.safeParse('hi')).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'too_small',
            message: 'String must contain at least 3 character(s)',
          }),
        ]),
      }),
    })
    expect(schema.safeParse('this is a long string')).toEqual({
      success: true,
      data: ['this is a long string'],
    })
    expect(schema.safeParse(['hELlo', 'World'])).toEqual({
      success: true,
      data: ['hELlo', 'World'],
    })
  })

  test('default min', () => {
    const schema = zToStringArray()
    expect(schema.safeParse('  hello  ')).toEqual({
      success: true,
      data: ['hello'],
    })
    expect(schema.safeParse('hi')).toEqual({
      success: true,
      data: ['hi'],
    })
    expect(schema.safeParse(['hELlo', 'World'])).toEqual({
      success: true,
      data: ['hELlo', 'World'],
    })
  })

  test('lowercase', () => {
    const schema = zToStringArray(3, 10, { trim: true, lowercase: true })
    expect(schema.safeParse('  HEllo  ')).toEqual({
      success: true,
      data: ['hello'],
    })
    expect(schema.safeParse('hi')).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'too_small',
            message: 'String must contain at least 3 character(s)',
          }),
        ]),
      }),
    })
    expect(schema.safeParse('this is a long string')).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'too_big',
            message: 'String must contain at most 10 character(s)',
          }),
        ]),
      }),
    })
    expect(schema.safeParse('hello world')).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'too_big',
            message: 'String must contain at most 10 character(s)',
          }),
        ]),
      }),
    })
    expect(schema.safeParse(['hELlo', 'worLD'])).toEqual({
      success: true,
      data: ['hello', 'world'],
    })
    expect(schema.safeParse(['hi', 'there'])).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'too_small',
            message: 'String must contain at least 3 character(s)',
          }),
        ]),
      }),
    })
    expect(
      schema.safeParse(['this is a long string', 'another long string'])
    ).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'too_big',
            message: 'String must contain at most 10 character(s)',
          }),
        ]),
      }),
    })
  })

  test('uppercase', () => {
    const schema = zToStringArray(3, 10, { trim: true, uppercase: true })
    expect(schema.safeParse('  hello  ')).toEqual({
      success: true,
      data: ['HELLO'],
    })
    expect(schema.safeParse('hi')).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'too_small',
            message: 'String must contain at least 3 character(s)',
          }),
        ]),
      }),
    })
    expect(schema.safeParse('this is a long string')).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'too_big',
            message: 'String must contain at most 10 character(s)',
          }),
        ]),
      }),
    })
    expect(schema.safeParse('hello world')).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'too_big',
            message: 'String must contain at most 10 character(s)',
          }),
        ]),
      }),
    })
    expect(schema.safeParse(['hello', 'world'])).toEqual({
      success: true,
      data: ['HELLO', 'WORLD'],
    })
    expect(schema.safeParse(['hi', 'there'])).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'too_small',
            message: 'String must contain at least 3 character(s)',
          }),
        ]),
      }),
    })
    expect(
      schema.safeParse(['this is a long string', 'another long string'])
    ).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'too_big',
            message: 'String must contain at most 10 character(s)',
          }),
        ]),
      }),
    })
  })
})

test('zDateTime', () => {
  const schema = zDateTime()
  expect(schema.safeParse(new Date('2023-01-01'))).toEqual({
    success: true,
    data: new Date('2023-01-01'),
  })
  expect(schema.safeParse('2023-01-01')).toEqual({
    success: true,
    data: new Date('2023-01-01'),
  })
  expect(schema.safeParse(1672531200000)).toEqual({
    success: true,
    data: new Date(1672531200000),
  })
  expect(schema.safeParse('invalid date')).toEqual({
    success: false,
    error: expect.objectContaining({
      issues: expect.arrayContaining([
        expect.objectContaining({
          code: 'invalid_date',
          message: 'Invalid date',
        }),
      ]),
    }),
  })

  const ret = schema.safeParse(null)
  expect(ret.success).toBe(false)
  expect(ret.error).toBeInstanceOf(ZodError)
  expect(ret.error?.issues).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        code: 'invalid_type',
        expected: 'date',
        message: 'Required',
        path: [],
        received: 'undefined',
      }),
    ])
  )

  expect(schema.safeParse(null)).toEqual({
    success: false,
    error: expect.objectContaining({
      issues: expect.arrayContaining([
        expect.objectContaining({
          code: 'invalid_type',
          expected: 'date',
          message: 'Required',
          path: [],
          received: 'undefined',
        }),
      ]),
    }),
  })
})
