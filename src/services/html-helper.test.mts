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
