import { InstrumentationStatistics } from './InstrumentationStatistics.mjs'

test('String message', () => {
  const msg = 'string'

  const istats = new InstrumentationStatistics()
  istats.addProcessed(msg)

  expect(istats.messageString()).toContain('Processed 1')
  expect(istats.messageString()).toContain(`
Messages:
`)
  expect(istats.messageString()).toContain('string')
})

test('String array message', () => {
  const msg = ['string', 'array']

  const istats = new InstrumentationStatistics()
  istats.addProcessed(msg)

  expect(istats.messageString()).toContain('Processed 1')
  expect(istats.messageString()).toContain(`
Messages:
`)
  expect(istats.messageString()).toContain(`string
`)
  expect(istats.messageString()).toContain('array')
})

test('Object message', () => {
  const msg = { id: 'string', ts: 2234443 }

  const istats = new InstrumentationStatistics()
  istats.addProcessed(msg)

  expect(istats.messageString()).toContain('Processed 1')
  expect(istats.messageString()).toContain(`
Messages:
`)
  expect(istats.messageString()).toContain('"string"')
  expect(istats.messageString()).toContain('"ts":2234443')
})
