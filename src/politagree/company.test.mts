import { getCurrentDate } from '../jest.setup.mjs'
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
