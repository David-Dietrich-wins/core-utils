import { City, type ICity } from './city.mjs'

test('constructor', () => {
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

test('constructor with ICity', () => {
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

test('CreateICity', () => {
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
