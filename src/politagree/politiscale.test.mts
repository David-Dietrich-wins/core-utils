import { IPolitiscale, Politiscale } from './politiscale.mjs'

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
