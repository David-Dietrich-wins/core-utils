import type { ICity, IdNameSlugWithScales } from './city.mjs'
import {
  type IHasPolitiscales,
  type IPolitiscale,
  Politiscale,
  type PolitiscaleName,
  createPolitiscaleSearchParams,
} from './politiscale.mjs'
import type { ISymbolDetail, ITickerSearch } from '../models/ticker-info.mjs'
import {
  type PolitiRatingLeftRight,
  PolitiscaleHelper,
  mapCityToPolitiscaleCardProps,
  mapSlugWithScalesToIdNameValue,
  mapSymbolDetailToPolitiscaleCardProps,
  mapTickerSearchToIdNameValue,
} from './politiscale-helper.mjs'
import { describe, expect, it } from '@jest/globals'

describe('politiscale-helper', () => {
  it('userColorFromScales', () => {
    expect.assertions(3)

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

    expect(PolitiscaleHelper.userColorFromScales(scales, userScales)).toBe(
      '#EEEEEE'
    )

    scales[0].value = 10
    scales[1].value = 10
    scales[2].value = 10

    expect(PolitiscaleHelper.userColorFromScales(scales, userScales)).toBe(
      '#eb0014'
    )

    userScales[0].value = 80
    userScales[1].value = 10
    userScales[2].value = 10

    expect(PolitiscaleHelper.userColorFromScales(scales, userScales)).toBe(
      '#d4002b'
    )
  })

  it('politiscale', () => {
    expect.assertions(6)

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

  it('politiscaleColor', () => {
    expect.assertions(15)

    expect(PolitiscaleHelper.politiscaleColor('climate', 0)).toBe('#1900e6')
    expect(PolitiscaleHelper.politiscaleColor('climate', 20)).toBe('#1400eb')
    expect(PolitiscaleHelper.politiscaleColor('climate', 50)).toBe('#0d00f3')
    expect(PolitiscaleHelper.politiscaleColor('climate', 80)).toBe('#0500fa')
    expect(PolitiscaleHelper.politiscaleColor('climate', 100)).toBe('#0000ff')

    expect(PolitiscaleHelper.politiscaleColor('freeSpeech', 0)).toBe('#660099')
    expect(PolitiscaleHelper.politiscaleColor('freeSpeech', 20)).toBe('#70008f')
    expect(PolitiscaleHelper.politiscaleColor('freeSpeech', 50)).toBe('#800080')
    expect(PolitiscaleHelper.politiscaleColor('freeSpeech', 80)).toBe('#8f0070')
    expect(PolitiscaleHelper.politiscaleColor('freeSpeech', 100)).toBe(
      '#990066'
    )

    expect(PolitiscaleHelper.politiscaleColor('religion', 0)).toBe('#e60019')
    expect(PolitiscaleHelper.politiscaleColor('religion', 20)).toBe('#eb0014')
    expect(PolitiscaleHelper.politiscaleColor('religion', 50)).toBe('#f3000d')
    expect(PolitiscaleHelper.politiscaleColor('religion', 80)).toBe('#fa0005')
    expect(PolitiscaleHelper.politiscaleColor('religion', 100)).toBe('#ff0000')
  })

  it('politiscaleHeadings', () => {
    expect.assertions(1)

    expect(PolitiscaleHelper.politiscaleHeadings()).toStrictEqual([
      { heading: 'Climate Rating', name: 'climate' },
      { heading: 'Free Speech', name: 'freeSpeech' },
      { heading: 'Religious Freedom', name: 'religion' },
    ])
  })

  it('politiscaleRating', () => {
    expect.assertions(26)

    expect(PolitiscaleHelper.politiscaleRating()).toStrictEqual({
      left: { active: true, isPrimary: true, value: 0, weight: 0 },
      right: { active: true, isPrimary: false, value: 0, weight: 0 },
    })
    expect(
      PolitiscaleHelper.politiscaleRating([{ name: 'climate', value: 0 }])
    ).toStrictEqual({
      left: { active: true, isPrimary: true, value: 0, weight: 0 },
      right: { active: true, isPrimary: false, value: 0, weight: 0 },
    })
    expect(
      PolitiscaleHelper.politiscaleRating([{ name: 'climate', value: 20 }])
    ).toStrictEqual({
      left: { active: true, isPrimary: true, value: 20, weight: 0 },
      right: { active: true, isPrimary: false, value: 2, weight: 0 },
    })
    expect(
      PolitiscaleHelper.politiscaleRating([{ name: 'climate', value: 50 }])
    ).toStrictEqual({
      left: { active: true, isPrimary: true, value: 50, weight: 0 },
      right: { active: true, isPrimary: false, value: 5, weight: 0 },
    })
    expect(
      PolitiscaleHelper.politiscaleRating([{ name: 'climate', value: 80 }])
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
      PolitiscaleHelper.politiscaleRating([{ name: 'climate', value: 0 }])
    ).toStrictEqual({
      left: { active: true, isPrimary: true, value: 0, weight: 0 },
      right: { active: true, isPrimary: false, value: 0, weight: 0 },
    })
    expect(
      PolitiscaleHelper.politiscaleRating([{ name: 'climate', value: 20 }])
    ).toStrictEqual({
      left: { active: true, isPrimary: true, value: 20, weight: 0 },
      right: { active: true, isPrimary: false, value: 2, weight: 0 },
    })
    expect(
      PolitiscaleHelper.politiscaleRating([{ name: 'climate', value: 50 }])
    ).toStrictEqual({
      left: { active: true, isPrimary: true, value: 50, weight: 0 },
      right: { active: true, isPrimary: false, value: 5, weight: 0 },
    })
    expect(
      PolitiscaleHelper.politiscaleRating([{ name: 'climate', value: 80 }])
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
      PolitiscaleHelper.politiscaleRating([{ name: 'climate', value: 100 }])
    ).toStrictEqual({
      left: { active: true, isPrimary: false, value: 100, weight: 0 },
      right: { active: true, isPrimary: false, value: 10, weight: 0 },
    })

    expect(
      PolitiscaleHelper.politiscaleRating([{ name: 'freeSpeech', value: 0 }])
    ).toStrictEqual({
      left: { active: true, isPrimary: true, value: 0, weight: 0 },
      right: { active: true, isPrimary: false, value: 0, weight: 0 },
    })
    expect(
      PolitiscaleHelper.politiscaleRating([{ name: 'freeSpeech', value: 20 }])
    ).toStrictEqual({
      left: { active: true, isPrimary: true, value: 8, weight: 0 },
      right: { active: true, isPrimary: false, value: 10, weight: 0 },
    })
    expect(
      PolitiscaleHelper.politiscaleRating([{ name: 'freeSpeech', value: 50 }])
    ).toStrictEqual({
      left: { active: true, isPrimary: true, value: 20, weight: 0 },
      right: { active: true, isPrimary: false, value: 25, weight: 0 },
    })
    expect(
      PolitiscaleHelper.politiscaleRating([{ name: 'freeSpeech', value: 80 }])
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
      PolitiscaleHelper.politiscaleRating([{ name: 'freeSpeech', value: 100 }])
    ).toStrictEqual({
      left: { active: true, isPrimary: true, value: 40, weight: 0 },
      right: { active: true, isPrimary: false, value: 50, weight: 0 },
    })

    expect(
      PolitiscaleHelper.politiscaleRating([{ name: 'religion', value: 0 }])
    ).toStrictEqual({
      left: { active: true, isPrimary: true, value: 0, weight: 0 },
      right: { active: true, isPrimary: false, value: 0, weight: 0 },
    })
    expect(
      PolitiscaleHelper.politiscaleRating([{ name: 'religion', value: 20 }])
    ).toStrictEqual({
      left: { active: true, isPrimary: true, value: 2, weight: 0 },
      right: { active: true, isPrimary: false, value: 20, weight: 0 },
    })
    expect(
      PolitiscaleHelper.politiscaleRating([{ name: 'religion', value: 50 }])
    ).toStrictEqual({
      left: { active: true, isPrimary: true, value: 5, weight: 0 },
      right: { active: true, isPrimary: false, value: 50, weight: 0 },
    })
    expect(
      PolitiscaleHelper.politiscaleRating([{ name: 'religion', value: 80 }])
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
      PolitiscaleHelper.politiscaleRating([{ name: 'religion', value: 100 }])
    ).toStrictEqual({
      left: { active: true, isPrimary: true, value: 10, weight: 0 },
      right: { active: true, isPrimary: true, value: 100, weight: 0 },
    })

    expect(
      PolitiscaleHelper.politiscaleRating([
        { name: 'climate', value: 20 },
        { name: 'freeSpeech', value: 50 },
      ])
    ).toStrictEqual({
      left: { active: true, isPrimary: true, value: 20, weight: 0 },
      right: { active: true, isPrimary: false, value: 14, weight: 0 },
    })

    expect(
      PolitiscaleHelper.politiscaleRating([
        { name: 'climate', value: 0 },
        { name: 'freeSpeech', value: 0 },
        { name: 'religion', value: 0 },
      ])
    ).toStrictEqual({
      left: { active: true, isPrimary: true, value: 0, weight: 0 },
      right: { active: true, isPrimary: false, value: 0, weight: 0 },
    })
    expect(
      PolitiscaleHelper.politiscaleRating([
        { name: 'climate', value: 20 },
        { name: 'freeSpeech', value: 20 },
        { name: 'religion', value: 20 },
      ])
    ).toStrictEqual({
      left: { active: true, isPrimary: true, value: 10, weight: 0 },
      right: { active: true, isPrimary: false, value: 11, weight: 0 },
    })
    expect(
      PolitiscaleHelper.politiscaleRating([
        { name: 'climate', value: 50 },
        { name: 'freeSpeech', value: 50 },
        { name: 'religion', value: 50 },
      ])
    ).toStrictEqual({
      left: { active: true, isPrimary: true, value: 25, weight: 0 },
      right: { active: true, isPrimary: false, value: 27, weight: 0 },
    })
    expect(
      PolitiscaleHelper.politiscaleRating([
        { name: 'climate', value: 80 },
        { name: 'freeSpeech', value: 80 },
        { name: 'religion', value: 80 },
      ])
    ).toStrictEqual({
      left: { active: true, isPrimary: true, value: 40, weight: 0 },
      right: { active: true, isPrimary: false, value: 43, weight: 0 },
    })
    expect(
      PolitiscaleHelper.politiscaleRating([
        { name: 'climate', value: 100 },
        { name: 'freeSpeech', value: 100 },
        { name: 'religion', value: 100 },
      ])
    ).toStrictEqual({
      left: { active: true, isPrimary: true, value: 50, weight: 0 },
      right: { active: true, isPrimary: true, value: 53, weight: 0 },
    })
  })

  it('createPolitiscaleSearchParams', () => {
    expect.assertions(4)

    const params = createPolitiscaleSearchParams({
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

  it('politiscaleValue', () => {
    expect.assertions(5)

    expect(
      PolitiscaleHelper.politiscaleValue(
        'climate',
        [{ name: 'religion', value: 50 }],
        25
      )
    ).toBe(25)
    expect(
      PolitiscaleHelper.politiscaleValue('climate', [
        { name: 'climate', value: 50 },
      ])
    ).toBe(50)
    expect(
      PolitiscaleHelper.politiscaleValue('climate', [
        { name: 'freeSpeech', value: 50 },
      ])
    ).toBe(0)
    expect(
      PolitiscaleHelper.politiscaleValue('climate', [
        { name: 'religion', value: 50 },
      ])
    ).toBe(0)
    expect(
      PolitiscaleHelper.politiscaleValue('climate', [
        { name: 'climate', value: 50 },
        { name: 'freeSpeech', value: 50 },
        { name: 'religion', value: 50 },
      ])
    ).toBe(50)
  })

  it('politiscaleValueClimate', () => {
    expect.assertions(5)

    expect(
      PolitiscaleHelper.politiscaleValueClimate([{ name: 'climate', value: 0 }])
    ).toBe(0)
    expect(
      PolitiscaleHelper.politiscaleValueClimate([
        { name: 'climate', value: 20 },
      ])
    ).toBe(20)
    expect(
      PolitiscaleHelper.politiscaleValueClimate([
        { name: 'climate', value: 50 },
      ])
    ).toBe(50)
    expect(
      PolitiscaleHelper.politiscaleValueClimate([
        { name: 'climate', value: 80 },
      ])
    ).toBe(80)
    expect(
      PolitiscaleHelper.politiscaleValueClimate([
        { name: 'climate', value: 100 },
      ])
    ).toBe(100)
  })

  it('politiscaleValueFreeSpeech', () => {
    expect.assertions(5)

    expect(
      PolitiscaleHelper.politiscaleValueFreeSpeech([
        { name: 'freeSpeech', value: 0 },
      ])
    ).toBe(0)
    expect(
      PolitiscaleHelper.politiscaleValueFreeSpeech([
        { name: 'freeSpeech', value: 20 },
      ])
    ).toBe(20)
    expect(
      PolitiscaleHelper.politiscaleValueFreeSpeech([
        { name: 'freeSpeech', value: 50 },
      ])
    ).toBe(50)
    expect(
      PolitiscaleHelper.politiscaleValueFreeSpeech([
        { name: 'freeSpeech', value: 80 },
      ])
    ).toBe(80)
    expect(
      PolitiscaleHelper.politiscaleValueFreeSpeech([
        { name: 'freeSpeech', value: 100 },
      ])
    ).toBe(100)
  })

  it('politiscaleValueReligion', () => {
    expect.assertions(5)

    expect(
      PolitiscaleHelper.politiscaleValueReligion([
        { name: 'religion', value: 0 },
      ])
    ).toBe(0)
    expect(
      PolitiscaleHelper.politiscaleValueReligion([
        { name: 'religion', value: 20 },
      ])
    ).toBe(20)
    expect(
      PolitiscaleHelper.politiscaleValueReligion([
        { name: 'religion', value: 50 },
      ])
    ).toBe(50)
    expect(
      PolitiscaleHelper.politiscaleValueReligion([
        { name: 'religion', value: 80 },
      ])
    ).toBe(80)
    expect(
      PolitiscaleHelper.politiscaleValueReligion([
        { name: 'religion', value: 100 },
      ])
    ).toBe(100)
  })

  it('setpolitiscaleValue', () => {
    expect.assertions(3)

    expect(
      PolitiscaleHelper.setpolitiscaleValue({ name: 'climate', value: 25 }, 0)
    ).toStrictEqual({
      name: 'climate',
      value: 0,
    })
    expect(
      PolitiscaleHelper.setpolitiscaleValue(
        { name: 'freeSpeech', value: 50 },
        10
      )
    ).toStrictEqual({
      name: 'freeSpeech',
      value: 10,
    })
    expect(
      PolitiscaleHelper.setpolitiscaleValue({ name: 'religion', value: 75 }, 77)
    ).toStrictEqual({
      name: 'religion',
      value: 77,
    })
  })

  it('getNewPolitiscales', () => {
    expect.assertions(3)

    let arrscales: Politiscale[] = [
        { name: 'climate', value: 0 },
        { name: 'freeSpeech', value: 0 },
        { name: 'religion', value: 0 },
      ],
      scale = new Politiscale('climate', 10)

    expect(
      PolitiscaleHelper.getNewPolitiscales(arrscales, scale)
    ).toStrictEqual([
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

    expect(
      PolitiscaleHelper.getNewPolitiscales(arrscales, scale)
    ).toStrictEqual([
      { name: 'climate', value: 30 },
      { name: 'freeSpeech', value: 20 },
      { name: 'religion', value: 20 },
    ])

    arrscales = [
      { name: 'climate', value: 20 },
      { name: 'freeSpeech', value: 20 },
    ]
    scale = new Politiscale('religion', 30)

    expect(
      PolitiscaleHelper.getNewPolitiscales(arrscales, scale)
    ).toStrictEqual([
      { name: 'climate', value: 20 },
      { name: 'freeSpeech', value: 20 },
      scale,
    ])
  })

  it('primaryRating', () => {
    expect.assertions(6)

    expect(PolitiscaleHelper.primaryRating('climate')).toBe(0)
    expect(PolitiscaleHelper.primaryRating('climate', 20)).toBe(20)
    expect(PolitiscaleHelper.primaryRating('freeSpeech')).toBe(0)
    expect(PolitiscaleHelper.primaryRating('freeSpeech', 50)).toBe(25)
    expect(PolitiscaleHelper.primaryRating('religion')).toBe(0)
    expect(PolitiscaleHelper.primaryRating('religion', 80)).toBe(80)
  })

  it('colorRangeOfParty', () => {
    expect.assertions(2)

    expect(PolitiscaleHelper.colorRangeOfParty(true)).toStrictEqual([
      '#FF0000',
      '#0000FF',
    ])
    expect(PolitiscaleHelper.colorRangeOfParty(false)).toStrictEqual([
      '#0000FF',
      '#FF0000',
    ])
  })
})

describe('mapping', () => {
  it('combineRatings', () => {
    expect.assertions(14)

    const applied: PolitiRatingLeftRight = {
        left: { active: false, isPrimary: true, value: 0, weight: 0 },
        right: { active: false, isPrimary: false, value: 0, weight: 0 },
      },
      primary: PolitiRatingLeftRight = {
        left: { active: false, isPrimary: true, value: 0, weight: 0 },
        right: { active: false, isPrimary: false, value: 0, weight: 0 },
      }

    expect(PolitiscaleHelper.combineRatings(primary, applied)).toStrictEqual({
      left: { active: false, isPrimary: true, value: 0, weight: 0 },
      right: { active: false, isPrimary: false, value: 0, weight: 0 },
    })

    primary.left.active = true
    primary.right.active = true
    applied.left.active = true
    applied.right.active = true

    expect(PolitiscaleHelper.combineRatings(primary, applied)).toStrictEqual({
      left: { active: true, isPrimary: true, value: 0, weight: 0 },
      right: { active: true, isPrimary: false, value: 0, weight: 0 },
    })

    primary.left.value = 50
    primary.right.value = 50
    applied.left.value = 20
    applied.right.value = 20

    expect(PolitiscaleHelper.combineRatings(primary, applied)).toStrictEqual({
      left: { active: true, isPrimary: true, value: 35, weight: 0 },
      right: { active: true, isPrimary: false, value: 35, weight: 0 },
    })

    primary.left.value = 80
    primary.right.value = 80
    applied.left.value = 30
    applied.right.value = 30

    expect(PolitiscaleHelper.combineRatings(primary, applied)).toStrictEqual({
      left: { active: true, isPrimary: true, value: 55, weight: 0 },
      right: { active: true, isPrimary: false, value: 55, weight: 0 },
    })

    primary.left.isPrimary = false
    primary.right.isPrimary = true
    applied.left.isPrimary = false
    applied.right.isPrimary = true

    expect(PolitiscaleHelper.combineRatings(primary, applied)).toStrictEqual({
      left: { active: true, isPrimary: false, value: 55, weight: 0 },
      right: { active: true, isPrimary: true, value: 55, weight: 0 },
    })

    primary.left.isPrimary = true
    primary.right.isPrimary = false
    applied.left.isPrimary = false
    applied.right.isPrimary = true

    expect(PolitiscaleHelper.combineRatings(primary, applied)).toStrictEqual({
      left: { active: true, isPrimary: true, value: 55, weight: 0 },
      right: { active: true, isPrimary: false, value: 55, weight: 0 },
    })

    primary.left.active = false
    primary.left.isPrimary = true
    primary.right.isPrimary = false
    applied.left.isPrimary = false
    applied.right.isPrimary = true

    expect(PolitiscaleHelper.combineRatings(primary, applied)).toStrictEqual({
      left: { active: false, isPrimary: true, value: 0, weight: 0 },
      right: { active: true, isPrimary: false, value: 55, weight: 0 },
    })

    primary.left.active = true
    primary.left.isPrimary = false
    primary.right.isPrimary = true
    applied.left.isPrimary = true
    applied.right.isPrimary = false

    expect(PolitiscaleHelper.combineRatings(primary, applied)).toStrictEqual({
      left: { active: true, isPrimary: false, value: 55, weight: 0 },
      right: { active: true, isPrimary: true, value: 55, weight: 0 },
    })

    primary.left.isPrimary = false
    primary.right.isPrimary = true
    applied.left.isPrimary = true
    applied.right.isPrimary = false

    expect(PolitiscaleHelper.combineRatings(primary, applied)).toStrictEqual({
      left: { active: true, isPrimary: false, value: 55, weight: 0 },
      right: { active: true, isPrimary: true, value: 55, weight: 0 },
    })

    primary.left.value = 55
    primary.right.value = 80
    primary.left.isPrimary = false
    primary.right.isPrimary = true
    applied.left.isPrimary = true
    applied.right.isPrimary = false

    expect(PolitiscaleHelper.combineRatings(primary, applied)).toStrictEqual({
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

    expect(PolitiscaleHelper.combineRatings(primary, applied)).toStrictEqual({
      left: { active: true, isPrimary: false, value: 43, weight: 0.5 },
      right: { active: true, isPrimary: true, value: 55, weight: 0 },
    })

    primary.left.weight = 0
    primary.right.weight = 0.5

    expect(PolitiscaleHelper.combineRatings(primary, applied)).toStrictEqual({
      left: { active: true, isPrimary: false, value: 43, weight: 0 },
      right: { active: true, isPrimary: true, value: 55, weight: 0.5 },
    })

    applied.left.weight = 0
    applied.right.weight = 0.5

    expect(PolitiscaleHelper.combineRatings(primary, applied)).toStrictEqual({
      left: { active: true, isPrimary: false, value: 43, weight: 0 },
      right: { active: true, isPrimary: true, value: 55, weight: 0.25 },
    })

    applied.left.weight = 0.5
    applied.right.weight = 0

    expect(PolitiscaleHelper.combineRatings(primary, applied)).toStrictEqual({
      left: { active: true, isPrimary: false, value: 43, weight: 0 },
      right: { active: true, isPrimary: true, value: 55, weight: 0.5 },
    })
  })

  it('userratingOverall', () => {
    expect.assertions(4)

    const scales: IPolitiscale[] = [
        { name: 'climate', value: 20 },
        { name: 'freeSpeech', value: 50 },
        { name: 'religion', value: 80 },
      ],
      userRating = PolitiscaleHelper.userRatingOverall(
        scales,
        'anything' as unknown as IHasPolitiscales
      )

    expect(userRating).toStrictEqual({
      left: { active: true, isPrimary: true, value: 16, weight: 0 },
      right: { active: true, isPrimary: false, value: 36, weight: 0 },
    })
    expect(PolitiscaleHelper.userRatingOverall()).toStrictEqual({
      left: { active: true, isPrimary: true, value: 0, weight: 0 },
      right: { active: true, isPrimary: false, value: 0, weight: 0 },
    })

    const emptyScales: Politiscale[] = []

    expect(PolitiscaleHelper.userRatingOverall(emptyScales)).toStrictEqual({
      left: { active: true, isPrimary: true, value: 0, weight: 0 },
      right: { active: true, isPrimary: false, value: 0, weight: 0 },
    })

    expect(
      PolitiscaleHelper.userRatingOverall(scales, emptyScales)
    ).toStrictEqual({
      left: { active: true, isPrimary: true, value: 16, weight: 0 },
      right: { active: true, isPrimary: false, value: 36, weight: 0 },
    })
  })

  it('ratingForScaleRaw', () => {
    expect.assertions(13)

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

  it('ratingForScale', () => {
    expect.assertions(6)

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

  it('ratingClimate', () => {
    expect.assertions(6)

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

  it('ratingFreeSpeech', () => {
    expect.assertions(6)

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

  it('ratingReligion', () => {
    expect.assertions(6)

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

  it('getScales', () => {
    expect.assertions(5)

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

  it('getRating', () => {
    expect.assertions(6)

    const scales: Politiscale[] = [
      { name: 'climate', value: 20 },
      { name: 'freeSpeech', value: 50 },
      { name: 'religion', value: 80 },
    ]

    expect(PolitiscaleHelper.getRating(scales)).toBe(16)
    expect(PolitiscaleHelper.getRating(scales, true)).toBe(16)
    expect(PolitiscaleHelper.getRating(scales, false)).toBe(36)

    expect(PolitiscaleHelper.getRating([])).toBe(0)
    expect(
      PolitiscaleHelper.getRating(null as unknown as IHasPolitiscales)
    ).toBe(0)
    expect(
      PolitiscaleHelper.getRating(undefined as unknown as IHasPolitiscales)
    ).toBe(0)
  })

  it('findSetting', () => {
    expect.assertions(4)

    expect(PolitiscaleHelper.findSetting('climate')).toStrictEqual({
      colorRange: ['#1900e6', '#0000ff'],
      heading: 'Climate Rating',
      name: 'climate',
      rating: {
        left: { active: true, isPrimary: true, value: 0, weight: 1 },
        right: { active: true, isPrimary: false, value: 0, weight: 0.1 },
      },
    })
    expect(PolitiscaleHelper.findSetting('freeSpeech')).toStrictEqual({
      colorRange: ['#660099', '#990066'],
      heading: 'Free Speech',
      name: 'freeSpeech',
      rating: {
        left: { active: true, isPrimary: false, value: 0, weight: 0.4 },
        right: { active: true, isPrimary: true, value: 0, weight: 0.5 },
      },
    })
    expect(PolitiscaleHelper.findSetting('religion')).toStrictEqual({
      colorRange: ['#e60019', '#ff0000'],
      heading: 'Religious Freedom',
      name: 'religion',
      rating: {
        left: { active: true, isPrimary: false, value: 0, weight: 0.1 },
        right: { active: true, isPrimary: true, value: 0, weight: 1 },
      },
    })
    expect(() =>
      PolitiscaleHelper.findSetting('unknown' as unknown as PolitiscaleName)
    ).toThrow('Attempt to find setting for invalid name unknown.')
  })

  it('isLeftLeaning', () => {
    expect.assertions(6)

    expect(PolitiscaleHelper.isLeftLeaning(undefined)).toBe(true)
    expect(PolitiscaleHelper.isLeftLeaning(0)).toBe(true)
    expect(PolitiscaleHelper.isLeftLeaning(20)).toBe(true)
    expect(PolitiscaleHelper.isLeftLeaning(50)).toBe(true)
    expect(PolitiscaleHelper.isLeftLeaning(80)).toBe(false)
    expect(PolitiscaleHelper.isLeftLeaning(100)).toBe(false)
  })

  it('isRightLeaning', () => {
    expect.assertions(6)

    expect(PolitiscaleHelper.isRightLeaning(undefined)).toBe(false)
    expect(PolitiscaleHelper.isRightLeaning(0)).toBe(false)
    expect(PolitiscaleHelper.isRightLeaning(20)).toBe(false)
    expect(PolitiscaleHelper.isRightLeaning(50)).toBe(false)
    expect(PolitiscaleHelper.isRightLeaning(80)).toBe(true)
    expect(PolitiscaleHelper.isRightLeaning(100)).toBe(true)
  })

  it('coreRatingValueTuple', () => {
    expect.assertions(5)

    expect(PolitiscaleHelper.coreRatingValueTuple('climate')).toStrictEqual([
      0, 0,
    ])
    expect(PolitiscaleHelper.coreRatingValueTuple('climate', 20)).toStrictEqual(
      [20, 2]
    )
    expect(PolitiscaleHelper.coreRatingValueTuple('climate', 50)).toStrictEqual(
      [50, 5]
    )
    expect(PolitiscaleHelper.coreRatingValueTuple('climate', 50)).toStrictEqual(
      [50, 5]
    )
    expect(PolitiscaleHelper.coreRatingValueTuple('climate', 50)).toStrictEqual(
      [50, 5]
    )
  })

  it('coreRating', () => {
    expect.assertions(2)

    expect(PolitiscaleHelper.coreRating('climate')).toStrictEqual({
      left: { active: true, isPrimary: true, value: 0, weight: 1 },
      right: { active: true, isPrimary: false, value: 0, weight: 0.1 },
    })
    expect(PolitiscaleHelper.coreRating('climate', 20)).toStrictEqual({
      left: { active: true, isPrimary: true, value: 20, weight: 1 },
      right: { active: true, isPrimary: false, value: 2, weight: 0.1 },
    })
  })

  it('mapSlugWithScalesToIdNameValue', () => {
    expect.assertions(3)

    const scales: IdNameSlugWithScales[] = [
      {
        id: 'climate',
        name: 'climate',
        scales: [{ name: 'climate', value: 20 }],
        slug: 'climate',
      },
      {
        id: 'freeSpeech',
        name: 'freeSpeech',
        scales: [{ name: 'freeSpeech', value: 50 }],
        slug: 'freeSpeech',
      },
      {
        id: 'religion',
        name: 'religion',
        scales: [{ name: 'religion', value: 80 }],
        slug: 'religion',
      },
    ]

    // const scales: IPolitiscale[] = [
    //   { name: 'climate', value: 20 },
    //   { name: 'freeSpeech', value: 50 },
    //   { name: 'religion', value: 80 },
    // ]
    const result = mapSlugWithScalesToIdNameValue(scales[0])

    expect(result).toStrictEqual({
      id: 'climate',
      name: 'climate',
      value: '#cc0033',
    })

    expect(mapSlugWithScalesToIdNameValue(scales[1])).toStrictEqual({
      id: 'freeSpeech',
      name: 'freeSpeech',
      value: '#cc0033',
    })

    expect(mapSlugWithScalesToIdNameValue(scales[2])).toStrictEqual({
      id: 'religion',
      name: 'religion',
      value: '#eb0014',
    })
  })

  it('mapTickerSearchToIdNameValue', () => {
    expect.assertions(1)

    const its: ITickerSearch = {
      description: 'Apple Inc.',
      exchange: 'NASDAQ',
      full_name: 'Apple Inc.',
      id: 'climate',
      name: 'climate',
      scales: [{ name: 'climate', value: 20 }],
      symbol: 'AAPL',
      ticker: 'AAPL',
      type: 'stock',
    }
    const result = mapTickerSearchToIdNameValue(its)

    expect(result).toStrictEqual({
      id: 'AAPL',
      name: 'climate',
      value: '#cc0033',
    })
  })

  it('mapSymbolDetailToPolitiscaleCardProps', () => {
    expect.assertions(1)

    const symbolDetail: ISymbolDetail = {
      createdby: 'user123',
      description: 'Apple Inc.',
      exchange: 'NASDAQ',
      id: 'AAPL',
      industry: 'Technology',
      minmov: 1,
      minmov2: 0,
      name: 'Apple Inc.',
      pricescale: 100,
      scales: [{ name: 'climate', value: 20 }],
      sector: 'Technology',
      slug: 'climate',
      ticker: 'AAPL',
      type: 'stock',
      updatedby: 'user456',
      val: {
        exchange: 'NASDAQ',
        exchangeShortName: 'NASDAQ',
        name: 'Apple Inc.',
        price: 150.0,
        symbol: 'AAPL',
      },
    }

    const result = mapSymbolDetailToPolitiscaleCardProps(symbolDetail)

    expect(result).toStrictEqual({
      description: '',
      name: 'Apple Inc.',
      scales: [{ name: 'climate', value: 20 }],
      slug: 'AAPL',
      titleHref: '/company/aapl',
      titleImageSrc: '',
      visitText: 'Open company website in new window',
    })
  })

  it('mapCityToPolitiscaleCardProps', () => {
    expect.assertions(1)

    const city: ICity = {
      city: 'New York',
      city_img: '',
      description: '',
      name: 'New York',
      scales: [{ name: 'climate', value: 20 }],
      slug: '1',
      sourceUrl: '',
    }

    const result = mapCityToPolitiscaleCardProps(city)

    expect(result).toStrictEqual({
      description: '',
      name: 'New York',
      scales: [{ name: 'climate', value: 20 }],
      slug: '1',
      titleHref: '/city/1',
      titleImageSrc: '',
      visitText: 'Link to more details',
    })
  })
})
