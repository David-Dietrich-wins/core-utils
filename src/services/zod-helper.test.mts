import { ZodError } from 'zod/v4'
import { ZodTestHelper } from '../jest.setup.mjs'
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
    expect(schema.safeParse(str1001)).toEqual(
      ZodTestHelper.SuccessFalseSingle(ZodTestHelper.StringTooBig(1000))
    )

    expect(schema.safeParse('  hello  ')).toEqual({
      success: true,
      data: '  hello  ',
    })
    expect(schema.safeParse('hi')).toEqual(
      ZodTestHelper.SuccessFalseSingle(ZodTestHelper.StringTooSmall(3))
    )
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
    expect(schema.safeParse(str1001)).toEqual(
      ZodTestHelper.SuccessFalse([
        [expect.objectContaining(ZodTestHelper.StringTooBig(1000))],
        [expect.objectContaining(ZodTestHelper.InvalidTypeArrayString())],
      ])
    )

    expect(schema.safeParse('  hello  ')).toEqual({
      success: true,
      data: 'hello',
    })
    expect(schema.safeParse('hi')).toEqual(
      ZodTestHelper.SuccessFalse([
        [expect.objectContaining(ZodTestHelper.StringTooSmall(3))],
        [expect.objectContaining(ZodTestHelper.InvalidTypeArrayString())],
      ])
    )
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
    expect(schema.safeParse('hi')).toEqual(
      ZodTestHelper.SuccessFalse([
        [expect.objectContaining(ZodTestHelper.StringTooSmall(3))],
        [expect.objectContaining(ZodTestHelper.InvalidTypeArrayString())],
      ])
    )
    expect(schema.safeParse('this is a long string')).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'invalid_union',
            path: [],
            message: 'Invalid input',
            errors: expect.arrayContaining([
              [expect.objectContaining(ZodTestHelper.StringTooBig(10))],
              [expect.objectContaining(ZodTestHelper.InvalidTypeArrayString())],
            ]),
          }),
        ]),
      }),
    })
    expect(schema.safeParse('hello world')).toEqual(
      ZodTestHelper.SuccessFalse([
        [expect.objectContaining(ZodTestHelper.StringTooBig(10))],
        [expect.objectContaining(ZodTestHelper.InvalidTypeArrayString())],
      ])
    )
    expect(schema.safeParse(['hELlo', 'World'])).toEqual({
      success: true,
      data: ['hello', 'world'],
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
      success: true,
      data: 'HELLO',
    })
    expect(schema.safeParse('hi')).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'invalid_union',
            path: [],
            message: 'Invalid input',
            errors: expect.arrayContaining([
              [expect.objectContaining(ZodTestHelper.StringTooSmall(3))],
              [expect.objectContaining(ZodTestHelper.InvalidTypeArrayString())],
            ]),
          }),
        ]),
      }),
    })
    expect(schema.safeParse('this is a long string')).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'invalid_union',
            path: [],
            message: 'Invalid input',
            errors: expect.arrayContaining([
              [expect.objectContaining(ZodTestHelper.StringTooBig(10))],
              [expect.objectContaining(ZodTestHelper.InvalidTypeArrayString())],
            ]),
          }),
        ]),
      }),
    })
    expect(schema.safeParse('hello world')).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'invalid_union',
            path: [],
            message: 'Invalid input',
            errors: expect.arrayContaining([
              [expect.objectContaining(ZodTestHelper.StringTooBig(10))],
              [expect.objectContaining(ZodTestHelper.InvalidTypeArrayString())],
            ]),
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
            code: 'invalid_union',
            path: [],
            message: 'Invalid input',
            errors: expect.arrayContaining([
              [
                expect.objectContaining(ZodTestHelper.InvalidTypeStringArray()),
                expect.objectContaining(ZodTestHelper.ArrayTooSmall(3)),
              ],
              [expect.objectContaining(ZodTestHelper.StringTooSmall(3, [0]))],
            ]),
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
            code: 'invalid_union',
            path: [],
            message: 'Invalid input',
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
            code: 'invalid_union',
            path: [],
            message: 'Invalid input',
            errors: expect.arrayContaining([
              [expect.objectContaining(ZodTestHelper.StringTooBig(1000))],
              [expect.objectContaining(ZodTestHelper.InvalidTypeArrayString())],
            ]),
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
            code: 'invalid_union',
            path: [],
            message: 'Invalid input',
            errors: expect.arrayContaining([
              [expect.objectContaining(ZodTestHelper.StringTooSmall(3))],
              [expect.objectContaining(ZodTestHelper.InvalidTypeArrayString())],
            ]),
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
            code: 'invalid_union',
            errors: expect.arrayContaining([]),
            // message: 'String must contain at least 3 character(s)',
          }),
        ]),
      }),
      //     [
      //       expect.objectContaining({
      //         code: 'too_small',
      //         message: 'Too small: expected string to have >3 characters',
      //       }),
      //     ],
      //   ]),
      // }),
      // path: [],
      // message: 'Invalid input',
      // issues: expect.arrayContaining([
      //   expect.objectContaining({
      //     code: 'invalid_union',
      //     // message: 'String must contain at least 3 character(s)',
      //   }),
      // ]),
    })
    expect(schema.safeParse('this is a long string')).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'invalid_union',
            path: [],
            message: 'Invalid input',
            errors: expect.arrayContaining([
              [expect.objectContaining(ZodTestHelper.StringTooBig(10))],
              [expect.objectContaining(ZodTestHelper.InvalidTypeArrayString())],
            ]),
          }),
        ]),
      }),
    })
    expect(schema.safeParse('hello world')).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'invalid_union',
            path: [],
            message: 'Invalid input',
            errors: expect.arrayContaining([
              [expect.objectContaining(ZodTestHelper.StringTooBig(10))],
              [expect.objectContaining(ZodTestHelper.InvalidTypeArrayString())],
            ]),
          }),
        ]),
      }),
    })
    expect(schema.safeParse(['hELlo', 'worLD'])).toEqual({
      success: true,
      data: ['hello', 'world'],
    })

    const ret = schema.safeParse(['hi', 'there'])
    expect(ret.success).toBe(false)
    expect(ret.error).toBeInstanceOf(ZodError)
    // expect(ret.error?.issues).toEqual([])
    expect(schema.safeParse(['hi', 'there'])).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'invalid_union',
            path: [],
            message: 'Invalid input',
            errors: expect.arrayContaining([
              [
                expect.objectContaining(ZodTestHelper.InvalidTypeStringArray()),
                expect.objectContaining(ZodTestHelper.ArrayTooSmall(3)),
              ],
              [expect.objectContaining(ZodTestHelper.StringTooSmall(3, [0]))],
            ]),
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
            code: 'invalid_union',
            path: [],
            message: 'Invalid input',
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
        // code: 'invalid_union',
        // errors: expect.arrayContaining([
        //   expect.objectContaining({
        //     code: 'too_small',
        //     message: 'Too small: expected string to have >3 characters',
        //   }),
        //   expect.objectContaining({
        //     expected: 'array',
        //     code: 'invalid_type',
        //     path: [],
        //     message: 'Invalid input: expected array, received string',
        //   }),
        // ]),
      }),
    })
    expect(schema.safeParse('this is a long string')).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'invalid_union',
            errors: expect.arrayContaining([
              [
                expect.objectContaining({
                  origin: 'string',
                  code: 'too_big',
                  maximum: 10,
                  path: [],
                  message: 'Too big: expected string to have <=10 characters',
                }),
              ],
              [
                expect.objectContaining({
                  expected: 'array',
                  code: 'invalid_type',
                  path: [],
                  message: 'Invalid input: expected array, received string',
                }),
              ],
            ]),
          }),
        ]),
      }),
    })
    expect(schema.safeParse('hello world')).toEqual({
      success: false,
      error: expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({
            code: 'invalid_union',
            errors: expect.arrayContaining([
              [
                expect.objectContaining({
                  origin: 'string',
                  code: 'too_big',
                  maximum: 10,
                  path: [],
                  message: 'Too big: expected string to have <=10 characters',
                }),
              ],
              [
                expect.objectContaining({
                  expected: 'array',
                  code: 'invalid_type',
                  path: [],
                  message: 'Invalid input: expected array, received string',
                }),
              ],
            ]),
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
            code: 'invalid_union',
            path: [],
            message: 'Invalid input',
            errors: expect.arrayContaining([
              // [
              //   expect.objectContaining({
              //     expected: 'string',
              //     code: 'invalid_type',
              //     path: [],
              //     message: 'Invalid input: expected string, received array',
              //   }),
              // ],
              // [
              //   expect.objectContaining({
              //     origin: 'array',
              //     code: 'too_small',
              //     maximum: 3,
              //     path: [],
              //     message: 'Too small: expected array to have >3 items',
              //   }),
              // ],
              // [
              //   expect.objectContaining({
              //     expected: 'string',
              //     code: 'too_small',
              //     minimum: 3,
              //     path: [0],
              //     message: 'Too small: expected string to have >3 characters',
              //   }),
              // ],
            ]),
          }),
        ]),
      }),
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
          expected: 'date',
          code: 'invalid_type',
          received: 'Invalid Date',
          path: [],
          message: 'Invalid input: expected date, received Date',
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
        message: 'Invalid input: expected date, received undefined',
        path: [],
      }),
    ])
  )

  expect(schema.safeParse(null)).toEqual({
    success: false,
    error: expect.objectContaining({
      issues: expect.arrayContaining([
        expect.objectContaining({
          expected: 'date',
          code: 'invalid_type',
          path: [],
          message: 'Invalid input: expected date, received undefined',
        }),
      ]),
    }),
  })
})
