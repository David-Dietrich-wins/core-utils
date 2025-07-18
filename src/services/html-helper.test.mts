import type { ArrayOrSingle } from '../index.mjs'
import { HtmlHelper } from './html-helper.mjs'

test('ParamsEncoder', () => {
  expect(HtmlHelper.ParamsEncoder()).toBe('')

  expect(HtmlHelper.ParamsEncoder({ foo: 'bar', baz: 'qux' })).toBe(
    'foo=bar&baz=qux'
  )
  expect(
    HtmlHelper.ParamsEncoder({ foo: 'bar', baz: 'qux', quux: 'corge' })
  ).toBe('foo=bar&baz=qux&quux=corge')

  expect(
    HtmlHelper.ParamsEncoder({
      url: 'https://we.com/?a=bc&d=ef#bar',
      baz: 'qux',
      quux: 'corge',
      grault: 'garply',
    })
  ).toBe(
    'url=https%3A%2F%2Fwe.com%2F%3Fa%3Dbc%26d%3Def%23bar&baz=qux&quux=corge&grault=garply'
  )
})

test('getHttpHeaderJson', () => {
  const headers = HtmlHelper.getHttpHeaderJson('my-token', [
    ['X-Custom-Header', 'CustomValue'],
  ])
  expect(headers.get('Content-Type')).toBe('application/json')
  expect(headers.get('Authorization')).toBe('Bearer my-token')
  expect(headers.get('X-Custom-Header')).toBe('CustomValue')

  const headersWithoutToken = HtmlHelper.getHttpHeaderJson(undefined, [
    ['X-Custom-Header', 'CustomValue'],
  ])
  expect(headersWithoutToken.get('Authorization')).toBeNull()
})

test('GetHttpHeaderApplicationName', () => {
  const headers = HtmlHelper.GetHttpHeaderApplicationName('MyApp')
  expect(headers[0]).toBe('x-application-name')
  expect(headers[1]).toBe('MyApp')
})

test('GetHttpHeaders', () => {
  const headers = HtmlHelper.GetHttpHeaders([
    ['Content-Type', 'application/json'],
    ['Authorization', 'Bearer my-token'],
    ['x-test-header'],
  ] as ArrayOrSingle<Readonly<[string, string]>>)
  expect(headers.get('Content-Type')).toBe('application/json')
  expect(headers.get('Authorization')).toBe('Bearer my-token')
  expect(headers.get('x-test-header')).toBe(null)
})
