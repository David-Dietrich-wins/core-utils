import {
  CreatePolitiscaleSearchParams,
  type IPolitiscale,
  Politiscale,
  PolitiscalesCreateAll,
} from './politiscale.mjs'

test('constructor', () => {
  const politiscale = new Politiscale('freeSpeech', 10)
  expect(politiscale).toEqual({
    name: 'freeSpeech',
    value: 10,
  })
})

test('constructor with object', () => {
  const ip: IPolitiscale = { name: 'religion', value: 5 },
    politiscale = new Politiscale(ip, 0)
  expect(politiscale).toEqual({
    name: 'religion',
    value: 5,
  })
})

test('CreatePolitiscaleSearchParams', () => {
  const ret = CreatePolitiscaleSearchParams({
    sortDirection: 'desc',
    term: 'test',
  })

  expect(ret).toEqual({
    climate: 0,
    exactMatch: false,
    freeSpeech: 0,
    limit: 0,
    offset: 0,
    pageIndex: 0,
    pageSize: 0,
    religion: 0,
    sortColumn: '',
    sortDirection: 'desc',
    term: 'test',
  })
})

test('PolitiscalesCreateAll', () => {
  const ret = PolitiscalesCreateAll({
    climate: 5,
    freeSpeech: 10,
  })

  expect(ret).toEqual({
    climate: 5,
    freeSpeech: 10,
    religion: 0,
  })
})
