import {
  NameValue,
  NameValueManager,
  NameValueType,
} from './NameValueManager.mjs'

test('NameValue good', () => {
  const name = 'name'
  const value = 'value'
  const pr = new NameValue(name, value)

  expect(pr.name).toBe(name)
  expect(pr.value).toBe(value)
})

test('NameValueType good', () => {
  const name = 'name'
  const value = 'value'
  const type = 'type'
  const pr = new NameValueType(name, value, type)

  expect(pr.name).toBe(name)
  expect(pr.value).toBe(value)
  expect(pr.type).toBe(type)
})

describe('NameValueManager', () => {
  test('constructor', () => {
    const name = 'name'
    const value = 'value'
    const type = 'type'
    const pr = new NameValueType(name, value, type)
    const manager = new NameValueManager([pr])

    expect(manager.list.length).toBe(1)
    expect(manager.list[0].name).toBe(name)
    expect(manager.list[0].value).toBe(value)
  })
  test('constructor defaults', () => {
    const manager = new NameValueManager()

    expect(manager.list.length).toBe(0)
  })

  test('CreateNameValueManager', () => {
    const name = 'name'
    const value = 'value'
    const type = 'type'
    const pr = new NameValueType(name, value, type)
    const manager = NameValueManager.CreateNameValueManager([pr])

    expect(manager.list.length).toBe(1)
    expect(manager.list[0].name).toBe(name)
    expect(manager.list[0].value).toBe(value)
  })
  test('CreateNameValueManager with null', () => {
    const manager = NameValueManager.CreateNameValueManager(null)

    expect(manager.list.length).toBe(0)
  })
  test('CreateNameValueManager with undefined', () => {
    const manager = NameValueManager.CreateNameValueManager(undefined)

    expect(manager.list.length).toBe(0)
  })

  test('CreateINameValue', () => {
    const name = 'name'
    const value = 'value'
    const item = NameValueManager.CreateINameValue(name, value)

    expect(item.name).toBe(name)
    expect(item.value).toBe(value)
  })
})
