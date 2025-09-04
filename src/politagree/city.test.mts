import { City, type ICity } from './city.mjs'

it('constructor', () => {
  const city = new City()
  expect(city).toEqual({
    city: '',
    city_img: '',
    description: '',
    name: '',
    scales: [],
    slug: '',
    sourceUrl: '',
  })
})

it('constructor with ICity', () => {
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
  expect(city).toEqual({
    city: 'city',
    city_img: 'city_img',
    description: 'description',
    name: 'name',
    scales: [],
    slug: 'slug',
    sourceUrl: 'sourceUrl',
  })
})

it('CreateICity', () => {
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
  expect(city).toEqual({
    city: 'city',
    city_img: 'city_img',
    description: 'description',
    name: 'name',
    scales: [],
    slug: 'slug',
    sourceUrl: 'sourceUrl',
  })
})
