import {
  CreatePolitiscaleSearchParams,
  IPolitiscale,
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
  const ip: IPolitiscale = { name: 'religion', value: 5 }
  const politiscale = new Politiscale(ip, 0)
  expect(politiscale).toEqual({
    name: 'religion',
    value: 5,
  })
})

test('CreatePolitiscaleSearchParams', () => {
  const ret = CreatePolitiscaleSearchParams({
    term: 'test',
    sortDirection: 'desc',
  })

  expect(ret).toEqual({
    term: 'test',
    climate: 0,
    exactMatch: false,
    freeSpeech: 0,
    religion: 0,
    limit: 0,
    offset: 0,
    pageIndex: 0,
    pageSize: 0,
    sortColumn: '',
    sortDirection: 'desc',
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
