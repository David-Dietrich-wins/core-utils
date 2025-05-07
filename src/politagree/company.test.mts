import { ZodSchema } from 'zod'
import { getCurrentDate } from '../jest.setup.mjs'
import { StringHelper } from '../services/string-helper.mjs'
import { Company } from './company.mjs'

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
    expect(schema).toBeInstanceOf(ZodSchema)
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
    expect(schema).toBeInstanceOf(ZodSchema)
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
    "code": "too_big",
    "maximum": 125,
    "type": "string",
    "inclusive": true,
    "exact": false,
    "message": "String must contain at most 125 character(s)",
    "path": [
      "name"
    ]
  }
]`)
    )
  })
})
