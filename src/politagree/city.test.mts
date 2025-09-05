import { City, type ICity } from './city.mjs'
import { describe, expect, it } from '@jest/globals'

describe('constructor', () => {
  it('no args', () => {
    expect.assertions(1)

    const city = new City()

    expect(city).toStrictEqual(
      expect.objectContaining({
        city: '',
        city_img: '',
        description: '',
        name: '',
        scales: [],
        slug: '',
        sourceUrl: '',
      })
    )
  })

  it('with ICity', () => {
    expect.assertions(1)

    const aic: ICity = {
        city: 'city',
        city_img: 'city_img',
        description: 'description',
        name: 'name',
        scales: [],
        slug: 'slug',
        sourceUrl: 'sourceUrl',
      },
      city = new City(aic)

    expect(city).toStrictEqual(
      expect.objectContaining({
        city: 'city',
        city_img: 'city_img',
        description: 'description',
        name: 'name',
        scales: [],
        slug: 'slug',
        sourceUrl: 'sourceUrl',
      })
    )
  })
})

describe('createICity', () => {
  it('should create an ICity object', () => {
    expect.assertions(1)

    const aic: ICity = {
        city: 'city',
        city_img: 'city_img',
        description: 'description',
        name: 'name',
        scales: [],
        slug: 'slug',
        sourceUrl: 'sourceUrl',
      },
      city = City.CreateICity(aic)

    expect(city).toStrictEqual({
      city: 'city',
      city_img: 'city_img',
      description: 'description',
      name: 'name',
      scales: [],
      slug: 'slug',
      sourceUrl: 'sourceUrl',
    })
  })
})
