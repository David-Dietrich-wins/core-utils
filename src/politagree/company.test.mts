/* eslint-disable jest/no-conditional-expect */
import * as z from 'zod/v4'
import { describe, expect, it } from '@jest/globals'
import { Company } from './company.mjs'
import { GenerateRandomString } from '../primitives/string-helper.mjs'
import { getCurrentDate } from '../jest.setup.mjs'

describe('constructor', () => {
  it('default constructor', () => {
    expect.assertions(1)

    const company = new Company()

    expect(company).toStrictEqual(
      expect.objectContaining({
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
        phone: '',
        scales: undefined,
        state: '',
        status: 0,
        updated: getCurrentDate(),
        updatedby: 'IdCreatedUpdated',
        zip: '',
      })
    )
  })

  it('with ICompany', () => {
    expect.assertions(1)

    const aic = {
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
        phone: 'phone',
        scales: [],
        state: 'state',
        status: 1,
        updated: getCurrentDate(),
        updatedby: 'updatedby',
        zip: 'zip',
      },
      company = new Company(aic)

    expect(company).toStrictEqual(
      expect.objectContaining({
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
        phone: 'phone',
        scales: [],
        state: 'state',
        status: 1,
        updated: getCurrentDate(),
        updatedby: 'updatedby',
        zip: 'zip',
      })
    )
  })
})

describe('createICompany', () => {
  it('createICompany', () => {
    expect.assertions(1)

    const company = Company.createICompany()

    expect(company).toStrictEqual({
      // Id: 'TradePlotter',
      // Scales: undefined,
      address1: '',
      address2: '',
      city: '',
      created: getCurrentDate(),
      createdby: 'TradePlotter',
      description: '',
      email: '',
      imageuri: '',
      imageurihref: '',
      name: '',
      phone: '',
      state: '',
      status: 0,
      updated: getCurrentDate(),
      updatedby: 'TradePlotter',
      zip: '',
    })
  })
})

describe('zSchema', () => {
  it('zSchema', () => {
    expect.assertions(2)

    const schema = Company.zCompany

    expect(schema).toBeDefined()
    expect(schema).toBeInstanceOf(z.ZodObject)

    try {
      schema.parse({
        name: 'name',
      })
    } catch (err) {
      expect(err).toBeInstanceOf(z.ZodError)

      const zerr = err as z.ZodError

      expect(zerr.issues).toBeDefined()
      expect(zerr.issues.length).toBeGreaterThan(0)
      expect(zerr.issues[0].code).toBe('invalid_type')
      expect(zerr).toMatchObject(
        expect.arrayContaining([
          // Expect.objectContaining({
          //   Expected: 'number',
          //   Code: 'invalid_type',
          //   Path: ['status'],
          //   Message: 'Invalid input: expected number, received undefined',
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

  it('valid parse', () => {
    expect.assertions(1)

    const aschema = Company.zCompany,
      company = Company.createICompany({
        name: 'name',
      })

    expect(() => aschema.parse(company)).not.toThrow()
  })

  it('no name', () => {
    expect.assertions(1)

    const aschema = Company.zCompany,
      company = Company.createICompany()

    expect(() => aschema.parse(company)).toThrow(z.ZodError)
  })
})

describe('companyNamezSchema', () => {
  it('companyNamezSchema', () => {
    expect.assertions(2)

    const schema = Company.companyNamezSchema

    expect(schema).toBeDefined()
    expect(schema).toBeInstanceOf(z.ZodObject)
  })

  it('valid parse', () => {
    expect.assertions(1)

    const aschema = Company.companyNamezSchema,
      company = Company.createICompany({
        name: 'name',
      })

    expect(() => aschema.parse(company)).not.toThrow()
  })

  it('no name', () => {
    expect.assertions(1)

    const aschema = Company.companyNamezSchema,
      company = Company.createICompany()

    expect(() => aschema.parse(company)).toThrow(z.ZodError)
  })

  it('invalid name', () => {
    expect.assertions(1)

    expect(() =>
      Company.companyNamezSchema.parse({
        name: GenerateRandomString(126),
      })
    ).toThrow(
      new Error(`[
  {
    "origin": "string",
    "code": "too_big",
    "maximum": 125,
    "inclusive": true,
    "path": [
      "name"
    ],
    "message": "Too big: expected string to have <=125 characters"
  }
]`)
    )
  })
})
