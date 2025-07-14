import {
  getNewPolitiscales,
  PoliticalColorFromScales,
  PolitiscaleColor,
  PolitiscaleHeadings,
  PolitiscaleRating,
  PolitiscaleValue,
  PolitiscaleValueClimate,
  PolitiscaleValueFreeSpeech,
  PolitiscaleValueReligion,
  setPolitiscaleValue,
} from './politiscale-helper.mjs'
import { CreatePolitiscaleSearchParams, Politiscale } from './politiscale.mjs'

test('PoliticalColorFromScales', () => {
  const scales = [
    { name: 'climate', value: 0 },
    { name: 'freeSpeech', value: 0 },
    { name: 'religion', value: 0 },
  ]

  const userScales = [
    { name: 'climate', value: 20 },
    { name: 'freeSpeech', value: 20 },
    { name: 'religion', value: 20 },
  ]
  expect(PoliticalColorFromScales(scales, userScales)).toBe('#EEEEEE')
})

test('Politiscale', () => {
  const ps = new Politiscale('climate', 50)
  expect(ps.name).toBe('climate')
  expect(ps.value).toBe(50)

  const ps2 = new Politiscale('freeSpeech', 80)
  expect(ps2.name).toBe('freeSpeech')
  expect(ps2.value).toBe(80)

  const ps3 = new Politiscale('religion', 100)
  expect(ps3.name).toBe('religion')
  expect(ps3.value).toBe(100)
})

test('PolitiscaleColor', () => {
  expect(PolitiscaleColor('climate', 0)).toBe('#1900e6')
  expect(PolitiscaleColor('climate', 20)).toBe('#1400eb')
  expect(PolitiscaleColor('climate', 50)).toBe('#0d00f3')
  expect(PolitiscaleColor('climate', 80)).toBe('#0500fa')
  expect(PolitiscaleColor('climate', 100)).toBe('#0000ff')

  expect(PolitiscaleColor('freeSpeech', 0)).toBe('#660099')
  expect(PolitiscaleColor('freeSpeech', 20)).toBe('#70008f')
  expect(PolitiscaleColor('freeSpeech', 50)).toBe('#800080')
  expect(PolitiscaleColor('freeSpeech', 80)).toBe('#8f0070')
  expect(PolitiscaleColor('freeSpeech', 100)).toBe('#990066')

  expect(PolitiscaleColor('religion', 0)).toBe('#e60019')
  expect(PolitiscaleColor('religion', 20)).toBe('#eb0014')
  expect(PolitiscaleColor('religion', 50)).toBe('#f3000d')
  expect(PolitiscaleColor('religion', 80)).toBe('#fa0005')
  expect(PolitiscaleColor('religion', 100)).toBe('#ff0000')
})

test('PolitiscaleHeadings', () => {
  expect(PolitiscaleHeadings()).toStrictEqual([
    { heading: 'Climate Rating', name: 'climate' },
    { heading: 'Free Speech', name: 'freeSpeech' },
    { heading: 'Religious Freedom', name: 'religion' },
  ])
})

test('PolitiscaleRating', () => {
  expect(PolitiscaleRating()).toStrictEqual({
    left: { active: true, isPrimary: true, value: 0, weight: 0 },
    right: { active: true, isPrimary: false, value: 0, weight: 0 },
  })
  expect(PolitiscaleRating([{ name: 'climate', value: 0 }])).toStrictEqual({
    left: { active: true, isPrimary: true, value: 0, weight: 0 },
    right: { active: true, isPrimary: false, value: 0, weight: 0 },
  })
  expect(PolitiscaleRating([{ name: 'climate', value: 20 }])).toStrictEqual({
    left: { active: true, isPrimary: true, value: 20, weight: 0 },
    right: { active: true, isPrimary: false, value: 2, weight: 0 },
  })
  expect(PolitiscaleRating([{ name: 'climate', value: 50 }])).toStrictEqual({
    left: { active: true, isPrimary: true, value: 50, weight: 0 },
    right: { active: true, isPrimary: false, value: 5, weight: 0 },
  })
  expect(PolitiscaleRating([{ name: 'climate', value: 80 }])).toStrictEqual({
    left: { active: true, isPrimary: false, value: 80, weight: 0 },
    right: {
      active: true,
      isPrimary: false,
      value: Math.floor(80 / 10),
      weight: 0,
    },
  })

  expect(PolitiscaleRating([{ name: 'climate', value: 0 }])).toStrictEqual({
    left: { active: true, isPrimary: true, value: 0, weight: 0 },
    right: { active: true, isPrimary: false, value: 0, weight: 0 },
  })
  expect(PolitiscaleRating([{ name: 'climate', value: 20 }])).toStrictEqual({
    left: { active: true, isPrimary: true, value: 20, weight: 0 },
    right: { active: true, isPrimary: false, value: 2, weight: 0 },
  })
  expect(PolitiscaleRating([{ name: 'climate', value: 50 }])).toStrictEqual({
    left: { active: true, isPrimary: true, value: 50, weight: 0 },
    right: { active: true, isPrimary: false, value: 5, weight: 0 },
  })
  expect(PolitiscaleRating([{ name: 'climate', value: 80 }])).toStrictEqual({
    left: { active: true, isPrimary: false, value: 80, weight: 0 },
    right: {
      active: true,
      isPrimary: false,
      value: Math.floor(80 / 10),
      weight: 0,
    },
  })
  expect(PolitiscaleRating([{ name: 'climate', value: 100 }])).toStrictEqual({
    left: { active: true, isPrimary: false, value: 100, weight: 0 },
    right: { active: true, isPrimary: false, value: 10, weight: 0 },
  })

  expect(PolitiscaleRating([{ name: 'freeSpeech', value: 0 }])).toStrictEqual({
    left: { active: true, isPrimary: true, value: 0, weight: 0 },
    right: { active: true, isPrimary: false, value: 0, weight: 0 },
  })
  expect(PolitiscaleRating([{ name: 'freeSpeech', value: 20 }])).toStrictEqual({
    left: { active: true, isPrimary: true, value: 8, weight: 0 },
    right: { active: true, isPrimary: false, value: 10, weight: 0 },
  })
  expect(PolitiscaleRating([{ name: 'freeSpeech', value: 50 }])).toStrictEqual({
    left: { active: true, isPrimary: true, value: 20, weight: 0 },
    right: { active: true, isPrimary: false, value: 25, weight: 0 },
  })
  expect(PolitiscaleRating([{ name: 'freeSpeech', value: 80 }])).toStrictEqual({
    left: { active: true, isPrimary: true, value: 32, weight: 0 },
    right: {
      active: true,
      isPrimary: false,
      value: 40,
      weight: 0,
    },
  })
  expect(PolitiscaleRating([{ name: 'freeSpeech', value: 100 }])).toStrictEqual(
    {
      left: { active: true, isPrimary: true, value: 40, weight: 0 },
      right: { active: true, isPrimary: false, value: 50, weight: 0 },
    }
  )

  expect(PolitiscaleRating([{ name: 'religion', value: 0 }])).toStrictEqual({
    left: { active: true, isPrimary: true, value: 0, weight: 0 },
    right: { active: true, isPrimary: false, value: 0, weight: 0 },
  })
  expect(PolitiscaleRating([{ name: 'religion', value: 20 }])).toStrictEqual({
    left: { active: true, isPrimary: true, value: 2, weight: 0 },
    right: { active: true, isPrimary: false, value: 20, weight: 0 },
  })
  expect(PolitiscaleRating([{ name: 'religion', value: 50 }])).toStrictEqual({
    left: { active: true, isPrimary: true, value: 5, weight: 0 },
    right: { active: true, isPrimary: false, value: 50, weight: 0 },
  })
  expect(PolitiscaleRating([{ name: 'religion', value: 80 }])).toStrictEqual({
    left: { active: true, isPrimary: true, value: 8, weight: 0 },
    right: {
      active: true,
      isPrimary: true,
      value: 80,
      weight: 0,
    },
  })
  expect(PolitiscaleRating([{ name: 'religion', value: 100 }])).toStrictEqual({
    left: { active: true, isPrimary: true, value: 10, weight: 0 },
    right: { active: true, isPrimary: true, value: 100, weight: 0 },
  })

  expect(
    PolitiscaleRating([
      { name: 'climate', value: 20 },
      { name: 'freeSpeech', value: 50 },
    ])
  ).toStrictEqual({
    left: { active: true, isPrimary: true, value: 20, weight: 0 },
    right: { active: true, isPrimary: false, value: 14, weight: 0 },
  })

  expect(
    PolitiscaleRating([
      { name: 'climate', value: 0 },
      { name: 'freeSpeech', value: 0 },
      { name: 'religion', value: 0 },
    ])
  ).toStrictEqual({
    left: { active: true, isPrimary: true, value: 0, weight: 0 },
    right: { active: true, isPrimary: false, value: 0, weight: 0 },
  })
  expect(
    PolitiscaleRating([
      { name: 'climate', value: 20 },
      { name: 'freeSpeech', value: 20 },
      { name: 'religion', value: 20 },
    ])
  ).toStrictEqual({
    left: { active: true, isPrimary: true, value: 10, weight: 0 },
    right: { active: true, isPrimary: false, value: 11, weight: 0 },
  })
  expect(
    PolitiscaleRating([
      { name: 'climate', value: 50 },
      { name: 'freeSpeech', value: 50 },
      { name: 'religion', value: 50 },
    ])
  ).toStrictEqual({
    left: { active: true, isPrimary: true, value: 25, weight: 0 },
    right: { active: true, isPrimary: false, value: 27, weight: 0 },
  })
  expect(
    PolitiscaleRating([
      { name: 'climate', value: 80 },
      { name: 'freeSpeech', value: 80 },
      { name: 'religion', value: 80 },
    ])
  ).toStrictEqual({
    left: { active: true, isPrimary: true, value: 40, weight: 0 },
    right: { active: true, isPrimary: false, value: 43, weight: 0 },
  })
  expect(
    PolitiscaleRating([
      { name: 'climate', value: 100 },
      { name: 'freeSpeech', value: 100 },
      { name: 'religion', value: 100 },
    ])
  ).toStrictEqual({
    left: { active: true, isPrimary: true, value: 50, weight: 0 },
    right: { active: true, isPrimary: true, value: 53, weight: 0 },
  })
})

test('CreatePolitiscaleSearchParams', () => {
  const params = CreatePolitiscaleSearchParams({
    term: 'test',
    climate: 50,
    freeSpeech: 80,
    religion: 100,
  })

  expect(params.term).toBe('test')
  expect(params.climate).toBe(50)
  expect(params.freeSpeech).toBe(80)
  expect(params.religion).toBe(100)
})

test('PolitiscaleValue', () => {
  expect(
    PolitiscaleValue('climate', [{ name: 'religion', value: 50 }], 25)
  ).toBe(25)
  expect(PolitiscaleValue('climate', [{ name: 'climate', value: 50 }])).toBe(50)
  expect(PolitiscaleValue('climate', [{ name: 'freeSpeech', value: 50 }])).toBe(
    0
  )
  expect(PolitiscaleValue('climate', [{ name: 'religion', value: 50 }])).toBe(0)
  expect(
    PolitiscaleValue('climate', [
      { name: 'climate', value: 50 },
      { name: 'freeSpeech', value: 50 },
      { name: 'religion', value: 50 },
    ])
  ).toBe(50)
})

test('PolitiscaleValueClimate', () => {
  expect(PolitiscaleValueClimate([{ name: 'climate', value: 0 }])).toBe(0)
  expect(PolitiscaleValueClimate([{ name: 'climate', value: 20 }])).toBe(20)
  expect(PolitiscaleValueClimate([{ name: 'climate', value: 50 }])).toBe(50)
  expect(PolitiscaleValueClimate([{ name: 'climate', value: 80 }])).toBe(80)
  expect(PolitiscaleValueClimate([{ name: 'climate', value: 100 }])).toBe(100)
})

test('PolitiscaleValueFreeSpeech', () => {
  expect(PolitiscaleValueFreeSpeech([{ name: 'freeSpeech', value: 0 }])).toBe(0)
  expect(PolitiscaleValueFreeSpeech([{ name: 'freeSpeech', value: 20 }])).toBe(
    20
  )
  expect(PolitiscaleValueFreeSpeech([{ name: 'freeSpeech', value: 50 }])).toBe(
    50
  )
  expect(PolitiscaleValueFreeSpeech([{ name: 'freeSpeech', value: 80 }])).toBe(
    80
  )
  expect(PolitiscaleValueFreeSpeech([{ name: 'freeSpeech', value: 100 }])).toBe(
    100
  )
})

test('PolitiscaleValueReligion', () => {
  expect(PolitiscaleValueReligion([{ name: 'religion', value: 0 }])).toBe(0)
  expect(PolitiscaleValueReligion([{ name: 'religion', value: 20 }])).toBe(20)
  expect(PolitiscaleValueReligion([{ name: 'religion', value: 50 }])).toBe(50)
  expect(PolitiscaleValueReligion([{ name: 'religion', value: 80 }])).toBe(80)
  expect(PolitiscaleValueReligion([{ name: 'religion', value: 100 }])).toBe(100)
})

test('setPolitiscaleValue', () => {
  expect(setPolitiscaleValue({ name: 'climate', value: 25 }, 0)).toStrictEqual({
    name: 'climate',
    value: 0,
  })
  expect(
    setPolitiscaleValue({ name: 'freeSpeech', value: 50 }, 10)
  ).toStrictEqual({
    name: 'freeSpeech',
    value: 10,
  })
  expect(
    setPolitiscaleValue({ name: 'religion', value: 75 }, 77)
  ).toStrictEqual({
    name: 'religion',
    value: 77,
  })
})

test('getNewPolitiscales', () => {
  let scales: Politiscale[] = [
    { name: 'climate', value: 0 },
    { name: 'freeSpeech', value: 0 },
    { name: 'religion', value: 0 },
  ]
  let scale = new Politiscale('climate', 10)
  expect(getNewPolitiscales(scales, scale)).toStrictEqual([
    { name: 'climate', value: 10 },
    { name: 'freeSpeech', value: 0 },
    { name: 'religion', value: 0 },
  ])

  scales = [
    { name: 'climate', value: 20 },
    { name: 'freeSpeech', value: 20 },
    { name: 'religion', value: 20 },
  ]
  scale = new Politiscale('climate', 30)
  expect(getNewPolitiscales(scales, scale)).toStrictEqual([
    { name: 'climate', value: 30 },
    { name: 'freeSpeech', value: 20 },
    { name: 'religion', value: 20 },
  ])

  scales = [
    { name: 'climate', value: 20 },
    { name: 'freeSpeech', value: 20 },
  ]
  scale = new Politiscale('religion', 30)
  expect(getNewPolitiscales(scales, scale)).toStrictEqual([
    { name: 'climate', value: 20 },
    { name: 'freeSpeech', value: 20 },
    scale,
  ])
})
