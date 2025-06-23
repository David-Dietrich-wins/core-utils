import * as z from 'zod/v4'
import {
  IdCreatedUpdated,
  IIdCreatedUpdated,
} from '../models/id-created-updated.mjs'
import { isObject } from '../services/object-helper.mjs'
import { IHasPolitiscales, Politiscale } from './politiscale.mjs'

export interface ICompany extends IIdCreatedUpdated, IHasPolitiscales {
  name: string
  status: number
  imageuri: string
  imageurihref: string
  description?: string | null
  phone: string
  email: string
  address1: string
  address2?: string | null
  city: string
  state: string
  zip: string
}

export class Company extends IdCreatedUpdated implements ICompany {
  name = ''
  status = 0
  imageuri = ''
  imageurihref = ''
  description = ''
  phone = ''
  email = ''
  address1 = ''
  address2 = ''
  city = ''
  state = ''
  zip = ''
  scales?: Politiscale[]

  constructor(obj?: ICompany) {
    super('TradePlotter')

    if (isObject(obj)) {
      Object.assign(this, obj)
    }
  }

  static CreateICompany(overrides?: Partial<ICompany>): ICompany {
    const company: ICompany = {
      name: '',
      status: 0,
      imageuri: '',
      imageurihref: '',
      description: '',
      phone: '',
      email: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      created: new Date(),
      createdby: 'TradePlotter',
      updated: new Date(),
      updatedby: 'TradePlotter',
      ...overrides,
    }

    return company
  }

  static get CompanyNamezSchema() {
    const schema = z.object({
      name: z.string().min(1, 'Name is required').max(125),
    })

    return schema
  }

  static get zCompany() {
    // https://medium.com/@charuwaka/supercharge-your-react-forms-with-react-hook-form-zod-and-mui-a-powerful-trio-47b653e7dce0
    // Define Zod schema for form validation
    const schema = z.object({
      id: z.string().optional(),
      name: z.string().min(1, 'Name is required'),
      status: z.number(),
      // .min(0, 'Status must be 0 or 1')
      imageuri: z.url('Invalid URL').optional().or(z.literal('')),
      imageurihref: z.url('Invalid URL').optional().or(z.literal('')),
      description: z.string().nullable().optional(),
      phone: z
        .string()
        .min(10, 'Phone number must be at least 10 digits')
        .max(10)
        .optional()
        .or(z.literal('')),
      email: z
        .email('Invalid email')
        .min(1, 'Email is required')
        .optional()
        .or(z.literal('')),
      address1: z.string().optional(),
      address2: z.string().nullish().optional(),
      city: z.string().optional(),
      state: z
        .string()
        .min(2, 'State is required')
        .optional()
        .or(z.literal('')),
      zip: z
        .string()
        .min(5, 'Zip code must be at least 5 characters long')
        .refine((value) => /^\d+$/.test(value), {
          message: 'Zip code must contain only numeric characters',
        })
        .or(z.literal('')),
    })

    return schema
  }
}
