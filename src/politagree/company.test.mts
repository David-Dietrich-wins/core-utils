import { Company } from './company.mjs'

test('constructor', () => {
  const dateNow = new Date(Date.now())

  const company = new Company()
  expect(company).toEqual({
    address1: '',
    address2: '',
    city: '',
    created: dateNow,
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
    updated: dateNow,
    updatedby: 'IdCreatedUpdated',
    zip: '',
  })
})

test('constructor with ICompany', () => {
  const dateNow = new Date(Date.now())

  const ic = {
    address1: 'address1',
    address2: 'address2',
    city: 'city',
    created: dateNow,
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
    updated: dateNow,
    updatedby: 'updatedby',
    zip: 'zip',
  }

  const company = new Company(ic)
  expect(company).toEqual({
    address1: 'address1',
    address2: 'address2',
    city: 'city',
    created: dateNow,
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
    updated: dateNow,
    updatedby: 'updatedby',
    zip: 'zip',
  })
})
