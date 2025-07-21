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
    expect(schema.safeParse(str1001)).toEqual(
      ZodTestHelper.SuccessFalse([
        [expect.objectContaining(ZodTestHelper.StringTooBig(1000))],
        [expect.objectContaining(ZodTestHelper.InvalidTypeArrayString())],
      ])
    )

    expect(schema.safeParse('  hello  ')).toEqual({
      data: 'hello',
      success: true,
    })
    expect(schema.safeParse('hi')).toEqual(
      ZodTestHelper.SuccessFalse([
        [expect.objectContaining(ZodTestHelper.StringTooSmall(3))],
        [expect.objectContaining(ZodTestHelper.InvalidTypeArrayString())],
      ])
    )
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
    expect(schema.safeParse('hi')).toEqual(
      ZodTestHelper.SuccessFalse([
        [expect.objectContaining(ZodTestHelper.StringTooSmall(3))],
        [expect.objectContaining(ZodTestHelper.InvalidTypeArrayString())],
      ])
    )
    expect(schema.safeParse('this is a long string')).toEqual({
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'invalid_union',
            errors: expect.arrayContaining([
              [expect.objectContaining(ZodTestHelper.StringTooBig(10))],
              [expect.objectContaining(ZodTestHelper.InvalidTypeArrayString())],
            ]),
            message: 'Invalid input',
            path: [],
          }),
        ]),
      }),
      success: false,
    })
    expect(schema.safeParse('hello world')).toEqual(
      ZodTestHelper.SuccessFalse([
        [expect.objectContaining(ZodTestHelper.StringTooBig(10))],
        [expect.objectContaining(ZodTestHelper.InvalidTypeArrayString())],
      ])
    )
    expect(schema.safeParse(['hELlo', 'World'])).toEqual({
      data: ['hello', 'world'],
      success: true,
    })
    expect(schema.safeParse(['hi', 'there'])).toEqual(
      ZodTestHelper.SuccessFalse([
        [
          expect.objectContaining(ZodTestHelper.InvalidTypeStringArray()),
          expect.objectContaining(ZodTestHelper.ArrayTooSmall(3)),
        ],
        [expect.objectContaining(ZodTestHelper.StringTooSmall(3, [0]))],
      ])
    )
    expect(
      schema.safeParse(['this is a long string', 'another long string'])
    ).toEqual(
      ZodTestHelper.SuccessFalse([
        [
          expect.objectContaining(ZodTestHelper.InvalidTypeStringArray()),
          expect.objectContaining(ZodTestHelper.ArrayTooSmall(3)),
        ],
        [
          expect.objectContaining(ZodTestHelper.StringTooBig(10, [0])),
          expect.objectContaining(ZodTestHelper.StringTooBig(10, [1])),
        ],
      ])
    )
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
          expect.objectContaining({
            code: 'invalid_union',
            errors: expect.arrayContaining([
              [expect.objectContaining(ZodTestHelper.StringTooSmall(3))],
              [expect.objectContaining(ZodTestHelper.InvalidTypeArrayString())],
            ]),
            message: 'Invalid input',
            path: [],
          }),
        ]),
      }),
      success: false,
    })
    expect(schema.safeParse('this is a long string')).toEqual({
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'invalid_union',
            errors: expect.arrayContaining([
              [expect.objectContaining(ZodTestHelper.StringTooBig(10))],
              [expect.objectContaining(ZodTestHelper.InvalidTypeArrayString())],
            ]),
            message: 'Invalid input',
            path: [],
          }),
        ]),
      }),
      success: false,
    })
    expect(schema.safeParse('hello world')).toEqual({
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'invalid_union',
            errors: expect.arrayContaining([
              [expect.objectContaining(ZodTestHelper.StringTooBig(10))],
              [expect.objectContaining(ZodTestHelper.InvalidTypeArrayString())],
            ]),
            message: 'Invalid input',
            path: [],
          }),
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
          expect.objectContaining({
            code: 'invalid_union',
            errors: expect.arrayContaining([
              [
                expect.objectContaining(ZodTestHelper.InvalidTypeStringArray()),
                expect.objectContaining(ZodTestHelper.ArrayTooSmall(3)),
              ],
              [expect.objectContaining(ZodTestHelper.StringTooSmall(3, [0]))],
            ]),
            message: 'Invalid input',
            path: [],
          }),
        ]),
      }),
      success: false,
    })
    expect(
      schema.safeParse(['this is a long string', 'another long string'])
    ).toEqual({
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'invalid_union',
            errors: expect.arrayContaining([
              [
                expect.objectContaining(ZodTestHelper.InvalidTypeStringArray()),
                expect.objectContaining(ZodTestHelper.ArrayTooSmall(3)),
              ],
              [
                expect.objectContaining(ZodTestHelper.StringTooBig(10, [0])),
                expect.objectContaining(ZodTestHelper.StringTooBig(10, [1])),
              ],
            ]),
            message: 'Invalid input',
            path: [],
          }),
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
    expect(schema.safeParse(str1001)).toEqual({
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'invalid_union',
            errors: expect.arrayContaining([
              [expect.objectContaining(ZodTestHelper.StringTooBig(1000))],
              [expect.objectContaining(ZodTestHelper.InvalidTypeArrayString())],
            ]),
            message: 'Invalid input',
            path: [],
          }),
        ]),
      }),
      success: false,
    })

    expect(schema.safeParse('  hello  ')).toEqual({
      data: ['hello'],
      success: true,
    })
    expect(schema.safeParse('hi')).toEqual({
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'invalid_union',
            errors: expect.arrayContaining([
              [expect.objectContaining(ZodTestHelper.StringTooSmall(3))],
              [expect.objectContaining(ZodTestHelper.InvalidTypeArrayString())],
            ]),
            message: 'Invalid input',
            path: [],
          }),
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
    expect(schema.safeParse('hi')).toEqual({
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'invalid_union',
            errors: expect.arrayContaining([]),
            // Message: 'String must contain at least 3 character(s)',
          }),
        ]),
      }),
      success: false,
      //     [
      //       Expect.objectContaining({
      //         Code: 'too_small',
      //         Message: 'Too small: expected string to have >3 characters',
      //       }),
      //     ],
      //   ]),
      // }),
      // Path: [],
      // Message: 'Invalid input',
      // Issues: expect.arrayContaining([
      //   Expect.objectContaining({
      //     Code: 'invalid_union',
      //     // message: 'String must contain at least 3 character(s)',
      //   }),
      // ]),
    })
    expect(schema.safeParse('this is a long string')).toEqual({
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'invalid_union',
            errors: expect.arrayContaining([
              [expect.objectContaining(ZodTestHelper.StringTooBig(10))],
              [expect.objectContaining(ZodTestHelper.InvalidTypeArrayString())],
            ]),
            message: 'Invalid input',
            path: [],
          }),
        ]),
      }),
      success: false,
    })
    expect(schema.safeParse('hello world')).toEqual({
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'invalid_union',
            errors: expect.arrayContaining([
              [expect.objectContaining(ZodTestHelper.StringTooBig(10))],
              [expect.objectContaining(ZodTestHelper.InvalidTypeArrayString())],
            ]),
            message: 'Invalid input',
            path: [],
          }),
        ]),
      }),
      success: false,
    })
    expect(schema.safeParse(['hELlo', 'worLD'])).toEqual({
      data: ['hello', 'world'],
      success: true,
    })

    const ret = schema.safeParse(['hi', 'there'])
    expect(ret.success).toBe(false)
    expect(ret.error).toBeInstanceOf(ZodError)
    // Expect(ret.error?.issues).toEqual([])
    expect(schema.safeParse(['hi', 'there'])).toEqual({
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'invalid_union',
            errors: expect.arrayContaining([
              [
                expect.objectContaining(ZodTestHelper.InvalidTypeStringArray()),
                expect.objectContaining(ZodTestHelper.ArrayTooSmall(3)),
              ],
              [expect.objectContaining(ZodTestHelper.StringTooSmall(3, [0]))],
            ]),
            message: 'Invalid input',
            path: [],
          }),
        ]),
      }),
      success: false,
    })
    expect(
      schema.safeParse(['this is a long string', 'another long string'])
    ).toEqual({
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'invalid_union',
            errors: expect.arrayContaining([
              [
                expect.objectContaining(ZodTestHelper.InvalidTypeStringArray()),
                expect.objectContaining(ZodTestHelper.ArrayTooSmall(3)),
              ],
              [
                expect.objectContaining(ZodTestHelper.StringTooBig(10, [0])),
                expect.objectContaining(ZodTestHelper.StringTooBig(10, [1])),
              ],
            ]),
            message: 'Invalid input',
            path: [],
          }),
        ]),
      }),
      success: false,
    })
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
    expect(schema.safeParse('this is a long string')).toEqual({
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'invalid_union',
            errors: expect.arrayContaining([
              [
                expect.objectContaining({
                  code: 'too_big',
                  maximum: 10,
                  message: 'Too big: expected string to have <=10 characters',
                  origin: 'string',
                  path: [],
                }),
              ],
              [
                expect.objectContaining({
                  code: 'invalid_type',
                  expected: 'array',
                  message: 'Invalid input: expected array, received string',
                  path: [],
                }),
              ],
            ]),
          }),
        ]),
      }),
      success: false,
    })
    expect(schema.safeParse('hello world')).toEqual({
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'invalid_union',
            errors: expect.arrayContaining([
              [
                expect.objectContaining({
                  code: 'too_big',
                  maximum: 10,
                  message: 'Too big: expected string to have <=10 characters',
                  origin: 'string',
                  path: [],
                }),
              ],
              [
                expect.objectContaining({
                  code: 'invalid_type',
                  expected: 'array',
                  message: 'Invalid input: expected array, received string',
                  path: [],
                }),
              ],
            ]),
          }),
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
          expect.objectContaining({
            code: 'invalid_union',
            errors: expect.arrayContaining([
              // [
              //   Expect.objectContaining({
              //     Expected: 'string',
              //     Code: 'invalid_type',
              //     Path: [],
              //     Message: 'Invalid input: expected string, received array',
              //   }),
              // ],
              // [
              //   Expect.objectContaining({
              //     Origin: 'array',
              //     Code: 'too_small',
              //     Maximum: 3,
              //     Path: [],
              //     Message: 'Too small: expected array to have >3 items',
              //   }),
              // ],
              // [
              //   Expect.objectContaining({
              //     Expected: 'string',
              //     Code: 'too_small',
              //     Minimum: 3,
              //     Path: [0],
              //     Message: 'Too small: expected string to have >3 characters',
              //   }),
              // ],
            ]),
            message: 'Invalid input',
            path: [],
          }),
        ]),
      }),
      success: false,
    })

    const ret = schema.safeParse([
      'this is a long string',
      'another long string',
    ])
    expect(ret.success).toBe(false)
    expect(ret.error).toBeInstanceOf(ZodError)
    expect(ret.error?.issues).toEqual([
      {
        code: 'invalid_union',
        errors: [
          [
            {
              code: 'invalid_type',
              expected: 'string',
              message: 'Invalid input: expected string, received array',
              path: [],
            },
            {
              code: 'too_small',
              inclusive: true,
              message: 'Too small: expected array to have >=3 items',
              minimum: 3,
              origin: 'array',
              path: [],
            },
          ],
          [
            {
              code: 'too_big',
              inclusive: true,
              maximum: 10,
              message: 'Too big: expected string to have <=10 characters',
              origin: 'string',
              path: [0],
            },
            {
              code: 'too_big',
              inclusive: true,
              maximum: 10,
              message: 'Too big: expected string to have <=10 characters',
              origin: 'string',
              path: [1],
            },
          ],
        ],
        message: 'Invalid input',
        path: [],
      },
    ])
  })
})

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
