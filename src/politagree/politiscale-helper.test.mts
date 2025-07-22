import {
  CreatePolitiscaleSearchParams,
  type IHasPolitiscales,
  type IPolitiscale,
  Politiscale,
  type PolitiscaleName,
} from './politiscale.mjs'
import {
  type PolitiRatingLeftRight,
  PolitiscaleHelper,
} from './politiscale-helper.mjs'

test('UserColorFromScales', () => {
  const scales: IPolitiscale[] = [
      { name: 'climate', value: 0 },
      { name: 'freeSpeech', value: 0 },
      { name: 'religion', value: 0 },
    ],
    userScales: IPolitiscale[] = [
      { name: 'climate', value: 20 },
      { name: 'freeSpeech', value: 20 },
      { name: 'religion', value: 20 },
    ]

  expect(PolitiscaleHelper.UserColorFromScales(scales, userScales)).toBe(
    '#EEEEEE'
  )

  scales[0].value = 10
  scales[1].value = 10
  scales[2].value = 10
  expect(PolitiscaleHelper.UserColorFromScales(scales, userScales)).toBe(
    '#eb0014'
  )

  userScales[0].value = 80
  userScales[1].value = 10
  userScales[2].value = 10
  expect(PolitiscaleHelper.UserColorFromScales(scales, userScales)).toBe(
    '#d4002b'
  )
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
  expect(PolitiscaleHelper.PolitiscaleColor('climate', 0)).toBe('#1900e6')
  expect(PolitiscaleHelper.PolitiscaleColor('climate', 20)).toBe('#1400eb')
  expect(PolitiscaleHelper.PolitiscaleColor('climate', 50)).toBe('#0d00f3')
  expect(PolitiscaleHelper.PolitiscaleColor('climate', 80)).toBe('#0500fa')
  expect(PolitiscaleHelper.PolitiscaleColor('climate', 100)).toBe('#0000ff')

  expect(PolitiscaleHelper.PolitiscaleColor('freeSpeech', 0)).toBe('#660099')
  expect(PolitiscaleHelper.PolitiscaleColor('freeSpeech', 20)).toBe('#70008f')
  expect(PolitiscaleHelper.PolitiscaleColor('freeSpeech', 50)).toBe('#800080')
  expect(PolitiscaleHelper.PolitiscaleColor('freeSpeech', 80)).toBe('#8f0070')
  expect(PolitiscaleHelper.PolitiscaleColor('freeSpeech', 100)).toBe('#990066')

  expect(PolitiscaleHelper.PolitiscaleColor('religion', 0)).toBe('#e60019')
  expect(PolitiscaleHelper.PolitiscaleColor('religion', 20)).toBe('#eb0014')
  expect(PolitiscaleHelper.PolitiscaleColor('religion', 50)).toBe('#f3000d')
  expect(PolitiscaleHelper.PolitiscaleColor('religion', 80)).toBe('#fa0005')
  expect(PolitiscaleHelper.PolitiscaleColor('religion', 100)).toBe('#ff0000')
})

test('PolitiscaleHeadings', () => {
  expect(PolitiscaleHelper.PolitiscaleHeadings()).toStrictEqual([
    { heading: 'Climate Rating', name: 'climate' },
    { heading: 'Free Speech', name: 'freeSpeech' },
    { heading: 'Religious Freedom', name: 'religion' },
  ])
})

test('PolitiscaleRating', () => {
  expect(PolitiscaleHelper.PolitiscaleRating()).toStrictEqual({
    left: { active: true, isPrimary: true, value: 0, weight: 0 },
    right: { active: true, isPrimary: false, value: 0, weight: 0 },
  })
  expect(
    PolitiscaleHelper.PolitiscaleRating([{ name: 'climate', value: 0 }])
  ).toStrictEqual({
    left: { active: true, isPrimary: true, value: 0, weight: 0 },
    right: { active: true, isPrimary: false, value: 0, weight: 0 },
  })
  expect(
    PolitiscaleHelper.PolitiscaleRating([{ name: 'climate', value: 20 }])
  ).toStrictEqual({
    left: { active: true, isPrimary: true, value: 20, weight: 0 },
    right: { active: true, isPrimary: false, value: 2, weight: 0 },
  })
  expect(
    PolitiscaleHelper.PolitiscaleRating([{ name: 'climate', value: 50 }])
  ).toStrictEqual({
    left: { active: true, isPrimary: true, value: 50, weight: 0 },
    right: { active: true, isPrimary: false, value: 5, weight: 0 },
  })
  expect(
    PolitiscaleHelper.PolitiscaleRating([{ name: 'climate', value: 80 }])
  ).toStrictEqual({
    left: { active: true, isPrimary: false, value: 80, weight: 0 },
    right: {
      active: true,
      isPrimary: false,
      value: Math.floor(80 / 10),
      weight: 0,
    },
  })

  expect(
    PolitiscaleHelper.PolitiscaleRating([{ name: 'climate', value: 0 }])
  ).toStrictEqual({
    left: { active: true, isPrimary: true, value: 0, weight: 0 },
    right: { active: true, isPrimary: false, value: 0, weight: 0 },
  })
  expect(
    PolitiscaleHelper.PolitiscaleRating([{ name: 'climate', value: 20 }])
  ).toStrictEqual({
    left: { active: true, isPrimary: true, value: 20, weight: 0 },
    right: { active: true, isPrimary: false, value: 2, weight: 0 },
  })
  expect(
    PolitiscaleHelper.PolitiscaleRating([{ name: 'climate', value: 50 }])
  ).toStrictEqual({
    left: { active: true, isPrimary: true, value: 50, weight: 0 },
    right: { active: true, isPrimary: false, value: 5, weight: 0 },
  })
  expect(
    PolitiscaleHelper.PolitiscaleRating([{ name: 'climate', value: 80 }])
  ).toStrictEqual({
    left: { active: true, isPrimary: false, value: 80, weight: 0 },
    right: {
      active: true,
      isPrimary: false,
      value: Math.floor(80 / 10),
      weight: 0,
    },
  })
  expect(
    PolitiscaleHelper.PolitiscaleRating([{ name: 'climate', value: 100 }])
  ).toStrictEqual({
    left: { active: true, isPrimary: false, value: 100, weight: 0 },
    right: { active: true, isPrimary: false, value: 10, weight: 0 },
  })

  expect(
    PolitiscaleHelper.PolitiscaleRating([{ name: 'freeSpeech', value: 0 }])
  ).toStrictEqual({
    left: { active: true, isPrimary: true, value: 0, weight: 0 },
    right: { active: true, isPrimary: false, value: 0, weight: 0 },
  })
  expect(
    PolitiscaleHelper.PolitiscaleRating([{ name: 'freeSpeech', value: 20 }])
  ).toStrictEqual({
    left: { active: true, isPrimary: true, value: 8, weight: 0 },
    right: { active: true, isPrimary: false, value: 10, weight: 0 },
  })
  expect(
    PolitiscaleHelper.PolitiscaleRating([{ name: 'freeSpeech', value: 50 }])
  ).toStrictEqual({
    left: { active: true, isPrimary: true, value: 20, weight: 0 },
    right: { active: true, isPrimary: false, value: 25, weight: 0 },
  })
  expect(
    PolitiscaleHelper.PolitiscaleRating([{ name: 'freeSpeech', value: 80 }])
  ).toStrictEqual({
    left: { active: true, isPrimary: true, value: 32, weight: 0 },
    right: {
      active: true,
      isPrimary: false,
      value: 40,
      weight: 0,
    },
  })
  expect(
    PolitiscaleHelper.PolitiscaleRating([{ name: 'freeSpeech', value: 100 }])
  ).toStrictEqual({
    left: { active: true, isPrimary: true, value: 40, weight: 0 },
    right: { active: true, isPrimary: false, value: 50, weight: 0 },
  })

  expect(
    PolitiscaleHelper.PolitiscaleRating([{ name: 'religion', value: 0 }])
  ).toStrictEqual({
    left: { active: true, isPrimary: true, value: 0, weight: 0 },
    right: { active: true, isPrimary: false, value: 0, weight: 0 },
  })
  expect(
    PolitiscaleHelper.PolitiscaleRating([{ name: 'religion', value: 20 }])
  ).toStrictEqual({
    left: { active: true, isPrimary: true, value: 2, weight: 0 },
    right: { active: true, isPrimary: false, value: 20, weight: 0 },
  })
  expect(
    PolitiscaleHelper.PolitiscaleRating([{ name: 'religion', value: 50 }])
  ).toStrictEqual({
    left: { active: true, isPrimary: true, value: 5, weight: 0 },
    right: { active: true, isPrimary: false, value: 50, weight: 0 },
  })
  expect(
    PolitiscaleHelper.PolitiscaleRating([{ name: 'religion', value: 80 }])
  ).toStrictEqual({
    left: { active: true, isPrimary: true, value: 8, weight: 0 },
    right: {
      active: true,
      isPrimary: true,
      value: 80,
      weight: 0,
    },
  })
  expect(
    PolitiscaleHelper.PolitiscaleRating([{ name: 'religion', value: 100 }])
  ).toStrictEqual({
    left: { active: true, isPrimary: true, value: 10, weight: 0 },
    right: { active: true, isPrimary: true, value: 100, weight: 0 },
  })

  expect(
    PolitiscaleHelper.PolitiscaleRating([
      { name: 'climate', value: 20 },
      { name: 'freeSpeech', value: 50 },
    ])
  ).toStrictEqual({
    left: { active: true, isPrimary: true, value: 20, weight: 0 },
    right: { active: true, isPrimary: false, value: 14, weight: 0 },
  })

  expect(
    PolitiscaleHelper.PolitiscaleRating([
      { name: 'climate', value: 0 },
      { name: 'freeSpeech', value: 0 },
      { name: 'religion', value: 0 },
    ])
  ).toStrictEqual({
    left: { active: true, isPrimary: true, value: 0, weight: 0 },
    right: { active: true, isPrimary: false, value: 0, weight: 0 },
  })
  expect(
    PolitiscaleHelper.PolitiscaleRating([
      { name: 'climate', value: 20 },
      { name: 'freeSpeech', value: 20 },
      { name: 'religion', value: 20 },
    ])
  ).toStrictEqual({
    left: { active: true, isPrimary: true, value: 10, weight: 0 },
    right: { active: true, isPrimary: false, value: 11, weight: 0 },
  })
  expect(
    PolitiscaleHelper.PolitiscaleRating([
      { name: 'climate', value: 50 },
      { name: 'freeSpeech', value: 50 },
      { name: 'religion', value: 50 },
    ])
  ).toStrictEqual({
    left: { active: true, isPrimary: true, value: 25, weight: 0 },
    right: { active: true, isPrimary: false, value: 27, weight: 0 },
  })
  expect(
    PolitiscaleHelper.PolitiscaleRating([
      { name: 'climate', value: 80 },
      { name: 'freeSpeech', value: 80 },
      { name: 'religion', value: 80 },
    ])
  ).toStrictEqual({
    left: { active: true, isPrimary: true, value: 40, weight: 0 },
    right: { active: true, isPrimary: false, value: 43, weight: 0 },
  })
  expect(
    PolitiscaleHelper.PolitiscaleRating([
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
    climate: 50,
    freeSpeech: 80,
    religion: 100,
    term: 'test',
  })

  expect(params.term).toBe('test')
  expect(params.climate).toBe(50)
  expect(params.freeSpeech).toBe(80)
  expect(params.religion).toBe(100)
})

test('PolitiscaleValue', () => {
  expect(
    PolitiscaleHelper.PolitiscaleValue(
      'climate',
      [{ name: 'religion', value: 50 }],
      25
    )
  ).toBe(25)
  expect(
    PolitiscaleHelper.PolitiscaleValue('climate', [
      { name: 'climate', value: 50 },
    ])
  ).toBe(50)
  expect(
    PolitiscaleHelper.PolitiscaleValue('climate', [
      { name: 'freeSpeech', value: 50 },
    ])
  ).toBe(0)
  expect(
    PolitiscaleHelper.PolitiscaleValue('climate', [
      { name: 'religion', value: 50 },
    ])
  ).toBe(0)
  expect(
    PolitiscaleHelper.PolitiscaleValue('climate', [
      { name: 'climate', value: 50 },
      { name: 'freeSpeech', value: 50 },
      { name: 'religion', value: 50 },
    ])
  ).toBe(50)
})

test('PolitiscaleValueClimate', () => {
  expect(
    PolitiscaleHelper.PolitiscaleValueClimate([{ name: 'climate', value: 0 }])
  ).toBe(0)
  expect(
    PolitiscaleHelper.PolitiscaleValueClimate([{ name: 'climate', value: 20 }])
  ).toBe(20)
  expect(
    PolitiscaleHelper.PolitiscaleValueClimate([{ name: 'climate', value: 50 }])
  ).toBe(50)
  expect(
    PolitiscaleHelper.PolitiscaleValueClimate([{ name: 'climate', value: 80 }])
  ).toBe(80)
  expect(
    PolitiscaleHelper.PolitiscaleValueClimate([{ name: 'climate', value: 100 }])
  ).toBe(100)
})

test('PolitiscaleValueFreeSpeech', () => {
  expect(
    PolitiscaleHelper.PolitiscaleValueFreeSpeech([
      { name: 'freeSpeech', value: 0 },
    ])
  ).toBe(0)
  expect(
    PolitiscaleHelper.PolitiscaleValueFreeSpeech([
      { name: 'freeSpeech', value: 20 },
    ])
  ).toBe(20)
  expect(
    PolitiscaleHelper.PolitiscaleValueFreeSpeech([
      { name: 'freeSpeech', value: 50 },
    ])
  ).toBe(50)
  expect(
    PolitiscaleHelper.PolitiscaleValueFreeSpeech([
      { name: 'freeSpeech', value: 80 },
    ])
  ).toBe(80)
  expect(
    PolitiscaleHelper.PolitiscaleValueFreeSpeech([
      { name: 'freeSpeech', value: 100 },
    ])
  ).toBe(100)
})

test('PolitiscaleValueReligion', () => {
  expect(
    PolitiscaleHelper.PolitiscaleValueReligion([{ name: 'religion', value: 0 }])
  ).toBe(0)
  expect(
    PolitiscaleHelper.PolitiscaleValueReligion([
      { name: 'religion', value: 20 },
    ])
  ).toBe(20)
  expect(
    PolitiscaleHelper.PolitiscaleValueReligion([
      { name: 'religion', value: 50 },
    ])
  ).toBe(50)
  expect(
    PolitiscaleHelper.PolitiscaleValueReligion([
      { name: 'religion', value: 80 },
    ])
  ).toBe(80)
  expect(
    PolitiscaleHelper.PolitiscaleValueReligion([
      { name: 'religion', value: 100 },
    ])
  ).toBe(100)
})

test('setPolitiscaleValue', () => {
  expect(
    PolitiscaleHelper.setPolitiscaleValue({ name: 'climate', value: 25 }, 0)
  ).toStrictEqual({
    name: 'climate',
    value: 0,
  })
  expect(
    PolitiscaleHelper.setPolitiscaleValue({ name: 'freeSpeech', value: 50 }, 10)
  ).toStrictEqual({
    name: 'freeSpeech',
    value: 10,
  })
  expect(
    PolitiscaleHelper.setPolitiscaleValue({ name: 'religion', value: 75 }, 77)
  ).toStrictEqual({
    name: 'religion',
    value: 77,
  })
})

test('getNewPolitiscales', () => {
  let arrscales: Politiscale[] = [
      { name: 'climate', value: 0 },
      { name: 'freeSpeech', value: 0 },
      { name: 'religion', value: 0 },
    ],
    scale = new Politiscale('climate', 10)

  expect(PolitiscaleHelper.getNewPolitiscales(arrscales, scale)).toStrictEqual([
    { name: 'climate', value: 10 },
    { name: 'freeSpeech', value: 0 },
    { name: 'religion', value: 0 },
  ])

  arrscales = [
    { name: 'climate', value: 20 },
    { name: 'freeSpeech', value: 20 },
    { name: 'religion', value: 20 },
  ]
  scale = new Politiscale('climate', 30)
  expect(PolitiscaleHelper.getNewPolitiscales(arrscales, scale)).toStrictEqual([
    { name: 'climate', value: 30 },
    { name: 'freeSpeech', value: 20 },
    { name: 'religion', value: 20 },
  ])

  arrscales = [
    { name: 'climate', value: 20 },
    { name: 'freeSpeech', value: 20 },
  ]
  scale = new Politiscale('religion', 30)
  expect(PolitiscaleHelper.getNewPolitiscales(arrscales, scale)).toStrictEqual([
    { name: 'climate', value: 20 },
    { name: 'freeSpeech', value: 20 },
    scale,
  ])
})

test('PrimaryRating', () => {
  expect(PolitiscaleHelper.PrimaryRating('climate')).toBe(0)
  expect(PolitiscaleHelper.PrimaryRating('climate', 20)).toBe(20)
  expect(PolitiscaleHelper.PrimaryRating('freeSpeech')).toBe(0)
  expect(PolitiscaleHelper.PrimaryRating('freeSpeech', 50)).toBe(25)
  expect(PolitiscaleHelper.PrimaryRating('religion')).toBe(0)
  expect(PolitiscaleHelper.PrimaryRating('religion', 80)).toBe(80)
})

test('ColorRangeOfParty', () => {
  expect(PolitiscaleHelper.ColorRangeOfParty(true)).toStrictEqual([
    '#FF0000',
    '#0000FF',
  ])
  expect(PolitiscaleHelper.ColorRangeOfParty(false)).toStrictEqual([
    '#0000FF',
    '#FF0000',
  ])
})

test('CombineRatings', () => {
  const applied: PolitiRatingLeftRight = {
      left: { active: false, isPrimary: true, value: 0, weight: 0 },
      right: { active: false, isPrimary: false, value: 0, weight: 0 },
    },
    primary: PolitiRatingLeftRight = {
      left: { active: false, isPrimary: true, value: 0, weight: 0 },
      right: { active: false, isPrimary: false, value: 0, weight: 0 },
    }

  expect(PolitiscaleHelper.CombineRatings(primary, applied)).toStrictEqual({
    left: { active: false, isPrimary: true, value: 0, weight: 0 },
    right: { active: false, isPrimary: false, value: 0, weight: 0 },
  })

  primary.left.active = true
  primary.right.active = true
  applied.left.active = true
  applied.right.active = true

  expect(PolitiscaleHelper.CombineRatings(primary, applied)).toStrictEqual({
    left: { active: true, isPrimary: true, value: 0, weight: 0 },
    right: { active: true, isPrimary: false, value: 0, weight: 0 },
  })

  primary.left.value = 50
  primary.right.value = 50
  applied.left.value = 20
  applied.right.value = 20
  expect(PolitiscaleHelper.CombineRatings(primary, applied)).toStrictEqual({
    left: { active: true, isPrimary: true, value: 35, weight: 0 },
    right: { active: true, isPrimary: false, value: 35, weight: 0 },
  })

  primary.left.value = 80
  primary.right.value = 80
  applied.left.value = 30
  applied.right.value = 30
  expect(PolitiscaleHelper.CombineRatings(primary, applied)).toStrictEqual({
    left: { active: true, isPrimary: true, value: 55, weight: 0 },
    right: { active: true, isPrimary: false, value: 55, weight: 0 },
  })

  primary.left.isPrimary = false
  primary.right.isPrimary = true
  applied.left.isPrimary = false
  applied.right.isPrimary = true
  expect(PolitiscaleHelper.CombineRatings(primary, applied)).toStrictEqual({
    left: { active: true, isPrimary: false, value: 55, weight: 0 },
    right: { active: true, isPrimary: true, value: 55, weight: 0 },
  })

  primary.left.isPrimary = true
  primary.right.isPrimary = false
  applied.left.isPrimary = false
  applied.right.isPrimary = true
  expect(PolitiscaleHelper.CombineRatings(primary, applied)).toStrictEqual({
    left: { active: true, isPrimary: true, value: 55, weight: 0 },
    right: { active: true, isPrimary: false, value: 55, weight: 0 },
  })

  primary.left.active = false
  primary.left.isPrimary = true
  primary.right.isPrimary = false
  applied.left.isPrimary = false
  applied.right.isPrimary = true
  expect(PolitiscaleHelper.CombineRatings(primary, applied)).toStrictEqual({
    left: { active: false, isPrimary: true, value: 0, weight: 0 },
    right: { active: true, isPrimary: false, value: 55, weight: 0 },
  })

  primary.left.active = true
  primary.left.isPrimary = false
  primary.right.isPrimary = true
  applied.left.isPrimary = true
  applied.right.isPrimary = false
  expect(PolitiscaleHelper.CombineRatings(primary, applied)).toStrictEqual({
    left: { active: true, isPrimary: false, value: 55, weight: 0 },
    right: { active: true, isPrimary: true, value: 55, weight: 0 },
  })

  primary.left.isPrimary = false
  primary.right.isPrimary = true
  applied.left.isPrimary = true
  applied.right.isPrimary = false
  expect(PolitiscaleHelper.CombineRatings(primary, applied)).toStrictEqual({
    left: { active: true, isPrimary: false, value: 55, weight: 0 },
    right: { active: true, isPrimary: true, value: 55, weight: 0 },
  })

  primary.left.value = 55
  primary.right.value = 80
  primary.left.isPrimary = false
  primary.right.isPrimary = true
  applied.left.isPrimary = true
  applied.right.isPrimary = false
  expect(PolitiscaleHelper.CombineRatings(primary, applied)).toStrictEqual({
    left: { active: true, isPrimary: false, value: 43, weight: 0 },
    right: { active: true, isPrimary: true, value: 55, weight: 0 },
  })

  primary.left.value = 55
  primary.left.weight = 0.5
  primary.right.value = 80
  primary.left.isPrimary = false
  primary.right.isPrimary = true
  applied.left.isPrimary = true
  applied.right.isPrimary = false
  expect(PolitiscaleHelper.CombineRatings(primary, applied)).toStrictEqual({
    left: { active: true, isPrimary: false, value: 43, weight: 0.5 },
    right: { active: true, isPrimary: true, value: 55, weight: 0 },
  })

  primary.left.weight = 0
  primary.right.weight = 0.5
  expect(PolitiscaleHelper.CombineRatings(primary, applied)).toStrictEqual({
    left: { active: true, isPrimary: false, value: 43, weight: 0 },
    right: { active: true, isPrimary: true, value: 55, weight: 0.5 },
  })

  applied.left.weight = 0
  applied.right.weight = 0.5
  expect(PolitiscaleHelper.CombineRatings(primary, applied)).toStrictEqual({
    left: { active: true, isPrimary: false, value: 43, weight: 0 },
    right: { active: true, isPrimary: true, value: 55, weight: 0.25 },
  })

  applied.left.weight = 0.5
  applied.right.weight = 0
  expect(PolitiscaleHelper.CombineRatings(primary, applied)).toStrictEqual({
    left: { active: true, isPrimary: false, value: 43, weight: 0 },
    right: { active: true, isPrimary: true, value: 55, weight: 0.5 },
  })
})

test('UserRatingOverall', () => {
  const scales: IPolitiscale[] = [
      { name: 'climate', value: 20 },
      { name: 'freeSpeech', value: 50 },
      { name: 'religion', value: 80 },
    ],
    userRating = PolitiscaleHelper.UserRatingOverall(
      scales,
      'anything' as unknown as IHasPolitiscales
    )
  expect(userRating).toStrictEqual({
    left: { active: true, isPrimary: true, value: 16, weight: 0 },
    right: { active: true, isPrimary: false, value: 36, weight: 0 },
  })
  expect(PolitiscaleHelper.UserRatingOverall()).toStrictEqual({
    left: { active: true, isPrimary: true, value: 0, weight: 0 },
    right: { active: true, isPrimary: false, value: 0, weight: 0 },
  })

  const emptyScales: Politiscale[] = []
  expect(PolitiscaleHelper.UserRatingOverall(emptyScales)).toStrictEqual({
    left: { active: true, isPrimary: true, value: 0, weight: 0 },
    right: { active: true, isPrimary: false, value: 0, weight: 0 },
  })

  expect(
    PolitiscaleHelper.UserRatingOverall(scales, emptyScales)
  ).toStrictEqual({
    left: { active: true, isPrimary: true, value: 16, weight: 0 },
    right: { active: true, isPrimary: false, value: 36, weight: 0 },
  })
})

test('ratingForScaleRaw', () => {
  const scales: IPolitiscale[] = [
    { name: 'climate', value: 20 },
    { name: 'freeSpeech', value: 50 },
    { name: 'religion', value: 80 },
  ]
  expect(PolitiscaleHelper.ratingForScaleRaw('climate', scales)).toBe(20)
  expect(PolitiscaleHelper.ratingForScaleRaw('freeSpeech', scales)).toBe(50)
  expect(PolitiscaleHelper.ratingForScaleRaw('religion', scales)).toBe(80)
  expect(
    PolitiscaleHelper.ratingForScaleRaw(
      'unknown' as unknown as PolitiscaleName,
      scales
    )
  ).toBe(0)

  expect(PolitiscaleHelper.ratingForScaleRaw('climate', 50)).toBe(50)
  expect(PolitiscaleHelper.ratingForScaleRaw('freeSpeech', 50)).toBe(50)
  expect(PolitiscaleHelper.ratingForScaleRaw('religion', 50)).toBe(50)

  expect(PolitiscaleHelper.ratingForScaleRaw('climate', null)).toBe(0)
  expect(PolitiscaleHelper.ratingForScaleRaw('freeSpeech', null)).toBe(0)
  expect(PolitiscaleHelper.ratingForScaleRaw('religion', null)).toBe(0)

  expect(PolitiscaleHelper.ratingForScaleRaw('climate', undefined)).toBe(0)
  expect(PolitiscaleHelper.ratingForScaleRaw('freeSpeech', undefined)).toBe(0)
  expect(PolitiscaleHelper.ratingForScaleRaw('religion', undefined)).toBe(0)
})

test('ratingForScale', () => {
  const scales: IPolitiscale[] = [
    { name: 'climate', value: 20 },
    { name: 'freeSpeech', value: 50 },
    { name: 'religion', value: 80 },
  ]
  expect(PolitiscaleHelper.ratingForScale('climate', scales)).toBe(20)
  expect(PolitiscaleHelper.ratingForScale('freeSpeech', scales)).toBe(25)
  expect(PolitiscaleHelper.ratingForScale('religion', scales)).toBe(80)

  expect(PolitiscaleHelper.ratingForScale('climate', 50)).toBe(50)
  expect(PolitiscaleHelper.ratingForScale('freeSpeech', 50)).toBe(25)
  expect(PolitiscaleHelper.ratingForScale('religion', 50)).toBe(50)
})

test('ratingClimate', () => {
  expect(PolitiscaleHelper.ratingClimate(0)).toBe(0)
  expect(PolitiscaleHelper.ratingClimate(20)).toBe(20)
  expect(PolitiscaleHelper.ratingClimate(50)).toBe(50)
  expect(PolitiscaleHelper.ratingClimate(80)).toBe(80)
  expect(PolitiscaleHelper.ratingClimate(100)).toBe(100)

  const scales: IPolitiscale[] = [
    { name: 'climate', value: 20 },
    { name: 'freeSpeech', value: 50 },
    { name: 'religion', value: 80 },
  ]
  expect(PolitiscaleHelper.ratingClimate(scales)).toBe(20)
})

test('ratingFreeSpeech', () => {
  expect(PolitiscaleHelper.ratingFreeSpeech(0)).toBe(0)
  expect(PolitiscaleHelper.ratingFreeSpeech(20)).toBe(10)
  expect(PolitiscaleHelper.ratingFreeSpeech(50)).toBe(25)
  expect(PolitiscaleHelper.ratingFreeSpeech(80)).toBe(40)
  expect(PolitiscaleHelper.ratingFreeSpeech(100)).toBe(50)

  const scales: IPolitiscale[] = [
    { name: 'climate', value: 20 },
    { name: 'freeSpeech', value: 50 },
    { name: 'religion', value: 80 },
  ]
  expect(PolitiscaleHelper.ratingFreeSpeech(scales)).toBe(25)
})

test('ratingReligion', () => {
  expect(PolitiscaleHelper.ratingReligion(0)).toBe(0)
  expect(PolitiscaleHelper.ratingReligion(20)).toBe(20)
  expect(PolitiscaleHelper.ratingReligion(50)).toBe(50)
  expect(PolitiscaleHelper.ratingReligion(80)).toBe(80)
  expect(PolitiscaleHelper.ratingReligion(100)).toBe(100)

  const scales: IPolitiscale[] = [
    { name: 'climate', value: 20 },
    { name: 'freeSpeech', value: 50 },
    { name: 'religion', value: 80 },
  ]
  expect(PolitiscaleHelper.ratingReligion(scales)).toBe(80)
})

test('getScales', () => {
  const scales: Politiscale[] = [
      { name: 'climate', value: 20 },
      { name: 'freeSpeech', value: 50 },
      { name: 'religion', value: 80 },
    ],
    scalesHasPolitiscales: IHasPolitiscales = {
      scales,
    }

  expect(PolitiscaleHelper.getScales(scales)).toStrictEqual(scales)
  expect(PolitiscaleHelper.getScales(scalesHasPolitiscales)).toStrictEqual(
    scales
  )
  expect(
    PolitiscaleHelper.getScales(null as unknown as IHasPolitiscales)
  ).toStrictEqual([])
  expect(
    PolitiscaleHelper.getScales(undefined as unknown as IHasPolitiscales)
  ).toStrictEqual([])
  expect(PolitiscaleHelper.getScales([])).toStrictEqual([])
})

test('getRating', () => {
  const scales: Politiscale[] = [
    { name: 'climate', value: 20 },
    { name: 'freeSpeech', value: 50 },
    { name: 'religion', value: 80 },
  ]
  expect(PolitiscaleHelper.getRating(scales)).toBe(16)
  expect(PolitiscaleHelper.getRating(scales, true)).toBe(16)
  expect(PolitiscaleHelper.getRating(scales, false)).toBe(36)

  expect(PolitiscaleHelper.getRating([])).toBe(0)
  expect(PolitiscaleHelper.getRating(null as unknown as IHasPolitiscales)).toBe(
    0
  )
  expect(
    PolitiscaleHelper.getRating(undefined as unknown as IHasPolitiscales)
  ).toBe(0)
})

test('findSetting', () => {
  expect(PolitiscaleHelper.FindSetting('climate')).toStrictEqual({
    colorRange: ['#1900e6', '#0000ff'],
    heading: 'Climate Rating',
    name: 'climate',
    rating: {
      left: { active: true, isPrimary: true, value: 0, weight: 1 },
      right: { active: true, isPrimary: false, value: 0, weight: 0.1 },
    },
  })
  expect(PolitiscaleHelper.FindSetting('freeSpeech')).toStrictEqual({
    colorRange: ['#660099', '#990066'],
    heading: 'Free Speech',
    name: 'freeSpeech',
    rating: {
      left: { active: true, isPrimary: false, value: 0, weight: 0.4 },
      right: { active: true, isPrimary: true, value: 0, weight: 0.5 },
    },
  })
  expect(PolitiscaleHelper.FindSetting('religion')).toStrictEqual({
    colorRange: ['#e60019', '#ff0000'],
    heading: 'Religious Freedom',
    name: 'religion',
    rating: {
      left: { active: true, isPrimary: false, value: 0, weight: 0.1 },
      right: { active: true, isPrimary: true, value: 0, weight: 1 },
    },
  })
  expect(() =>
    PolitiscaleHelper.FindSetting('unknown' as unknown as PolitiscaleName)
  ).toThrow('Attempt to find setting for invalid name unknown.')
})

test('IsLeftLeaning', () => {
  expect(PolitiscaleHelper.IsLeftLeaning(undefined)).toBe(true)
  expect(PolitiscaleHelper.IsLeftLeaning(0)).toBe(true)
  expect(PolitiscaleHelper.IsLeftLeaning(20)).toBe(true)
  expect(PolitiscaleHelper.IsLeftLeaning(50)).toBe(true)
  expect(PolitiscaleHelper.IsLeftLeaning(80)).toBe(false)
  expect(PolitiscaleHelper.IsLeftLeaning(100)).toBe(false)
})
test('IsRightLeaning', () => {
  expect(PolitiscaleHelper.IsRightLeaning(undefined)).toBe(false)
  expect(PolitiscaleHelper.IsRightLeaning(0)).toBe(false)
  expect(PolitiscaleHelper.IsRightLeaning(20)).toBe(false)
  expect(PolitiscaleHelper.IsRightLeaning(50)).toBe(false)
  expect(PolitiscaleHelper.IsRightLeaning(80)).toBe(true)
  expect(PolitiscaleHelper.IsRightLeaning(100)).toBe(true)
})

test('CoreRatingValueTuple', () => {
  expect(PolitiscaleHelper.CoreRatingValueTuple('climate')).toStrictEqual([
    0, 0,
  ])
  expect(PolitiscaleHelper.CoreRatingValueTuple('climate', 20)).toStrictEqual([
    20, 2,
  ])
  expect(PolitiscaleHelper.CoreRatingValueTuple('climate', 50)).toStrictEqual([
    50, 5,
  ])
  expect(PolitiscaleHelper.CoreRatingValueTuple('climate', 50)).toStrictEqual([
    50, 5,
  ])
  expect(PolitiscaleHelper.CoreRatingValueTuple('climate', 50)).toStrictEqual([
    50, 5,
  ])
})

test('CoreRating', () => {
  expect(PolitiscaleHelper.CoreRating('climate')).toStrictEqual({
    left: { active: true, isPrimary: true, value: 0, weight: 1 },
    right: { active: true, isPrimary: false, value: 0, weight: 0.1 },
  })
  expect(PolitiscaleHelper.CoreRating('climate', 20)).toStrictEqual({
    left: { active: true, isPrimary: true, value: 20, weight: 1 },
    right: { active: true, isPrimary: false, value: 2, weight: 0.1 },
  })
})
