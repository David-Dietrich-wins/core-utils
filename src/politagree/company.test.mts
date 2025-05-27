import { getCurrentDate } from '../jest.setup.mjs'
import { StringHelper } from '../services/string-helper.mjs'
import { Company } from './company.mjs'
import { ZodError, ZodObject } from 'zod/v4'

test('constructor', () => {
  const company = new Company()
  expect(company).toEqual({
    address1: '',
    address2: '',
    city: '',
    created: getCurrentDate(),
    createdby: 'IdCreatedUpdated',
    description: '',
    email: '',
    id: 'TradePlotter',
    imageuri: '',
    imageurihref: '',
    name: '',
    state: '',
    phone: '',
    scales: undefined,
    status: 0,
    updated: getCurrentDate(),
    updatedby: 'IdCreatedUpdated',
    zip: '',
  })
})

test('constructor with ICompany', () => {
  const ic = {
    address1: 'address1',
    address2: 'address2',
    city: 'city',
    created: getCurrentDate(),
    createdby: 'createdby',
    description: 'description',
    email: 'email',
    id: 'id',
    imageuri: 'imageuri',
    imageurihref: 'imageurihref',
    name: 'name',
    state: 'state',
    phone: 'phone',
    scales: [],
    status: 1,
    updated: getCurrentDate(),
    updatedby: 'updatedby',
    zip: 'zip',
  }

  const company = new Company(ic)
  expect(company).toEqual({
    address1: 'address1',
    address2: 'address2',
    city: 'city',
    created: getCurrentDate(),
    createdby: 'createdby',
    description: 'description',
    email: 'email',
    id: 'id',
    imageuri: 'imageuri',
    imageurihref: 'imageurihref',
    name: 'name',
    state: 'state',
    phone: 'phone',
    scales: [],
    status: 1,
    updated: getCurrentDate(),
    updatedby: 'updatedby',
    zip: 'zip',
  })
})

test('CreateICompany', () => {
  const company = Company.CreateICompany()

  expect(company).toEqual({
    address1: '',
    address2: '',
    city: '',
    created: getCurrentDate(),
    createdby: 'TradePlotter',
    description: '',
    email: '',
    // id: 'TradePlotter',
    imageuri: '',
    imageurihref: '',
    name: '',
    state: '',
    phone: '',
    // scales: undefined,
    status: 0,
    updated: getCurrentDate(),
    updatedby: 'TradePlotter',
    zip: '',
  })
})

describe('zSchema', () => {
  test('zSchema', () => {
    const schema = Company.zCompany

    expect(schema).toBeDefined()
    expect(schema).toBeInstanceOf(ZodObject)

    try {
      schema.parse({
        name: 'name',
      })
    } catch (err) {
      expect(err).toBeInstanceOf(ZodError)
      const zerr = err as ZodError
      expect(zerr.issues).toBeDefined()
      expect(zerr.issues.length).toBeGreaterThan(0)
      expect(zerr.issues[0].code).toBe('invalid_type')
      expect(zerr).toMatchObject(
        expect.arrayContaining([
          // expect.objectContaining({
          //   expected: 'number',
          //   code: 'invalid_type',
          //   path: ['status'],
          //   message: 'Invalid input: expected number, received undefined',
          //   // issues: [
          //   //   {
          //   //     code: 'invalid_type',
          //   //     expected: 'object',
          //   //     received: 'undefined',
          //   //   },
          //   // ],
          // }),
        ])
      )
    }

    expect.assertions(7)
  })

  test('valid parse', () => {
    const schema = Company.zCompany

    const company = Company.CreateICompany({
      name: 'name',
    })

    expect(() => schema.parse(company)).not.toThrow()
  })

  test('no name', () => {
    const schema = Company.zCompany

    const company = Company.CreateICompany()

    expect(() => schema.parse(company)).toThrow()
  })
})

describe('CompanyNamezSchema', () => {
  test('CompanyNamezSchema', () => {
    const schema = Company.CompanyNamezSchema

    expect(schema).toBeDefined()
    expect(schema).toBeInstanceOf(ZodObject)
  })

  test('valid parse', () => {
    const schema = Company.CompanyNamezSchema

    const company = Company.CreateICompany({
      name: 'name',
    })

    expect(() => schema.parse(company)).not.toThrow()
  })

  test('no name', () => {
    const schema = Company.CompanyNamezSchema

    const company = Company.CreateICompany()

    expect(() => schema.parse(company)).toThrow()
  })

  test('invalid name', () => {
    expect(() =>
      Company.CompanyNamezSchema.parse({
        name: StringHelper.GenerateRandomString(126),
      })
    ).toThrow(
      new Error(`[
  {
    "origin": "string",
    "code": "too_big",
    "maximum": 125,
    "path": [
      "name"
    ],
    "message": "Too big: expected string to have <125 characters"
  }
]`)
    )
  })
})
