import { City, ICity } from './city.mjs'

test('constructor', () => {
  const city = new City()
  expect(city).toEqual({
    name: '',
    city: '',
    description: '',
    sourceUrl: '',
    city_img: '',
    slug: '',
    scales: [],
  })
})

test('constructor with ICity', () => {
  const ic: ICity = {
    name: 'name',
    city: 'city',
    description: 'description',
    sourceUrl: 'sourceUrl',
    city_img: 'city_img',
    slug: 'slug',
    scales: [],
  },

   city = new City(ic)
  expect(city).toEqual({
    name: 'name',
    city: 'city',
    description: 'description',
    sourceUrl: 'sourceUrl',
    city_img: 'city_img',
    slug: 'slug',
    scales: [],
  })
})

test('CreateICity', () => {
  const ic: ICity = {
    name: 'name',
    city: 'city',
    description: 'description',
    sourceUrl: 'sourceUrl',
    city_img: 'city_img',
    slug: 'slug',
    scales: [],
  },

   city = City.CreateICity(ic)
  expect(city).toEqual({
    name: 'name',
    city: 'city',
    description: 'description',
    sourceUrl: 'sourceUrl',
    city_img: 'city_img',
    slug: 'slug',
    scales: [],
  })
})
