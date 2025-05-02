import { NameVal, NameValManager, NameValType } from './NameValManager.mjs'

test('NameVal good', () => {
  const name = 'name'
  const val = 'val'
  const pr = new NameVal(name, val)

  expect(pr.name).toBe(name)
  expect(pr.val).toBe(val)
})

test('NameValType good', () => {
  const name = 'name'
  const val = 'value'
  const type = 'type'
  const pr = new NameValType(name, val, type)

  expect(pr.name).toBe(name)
  expect(pr.val).toBe(val)
  expect(pr.type).toBe(type)
})

describe('NameValueManager', () => {
  test('constructor', () => {
    const name = 'name'
    const value = 'value'
    const type = 'type'
    const pr = new NameValType(name, value, type)
    const manager = new NameValManager([pr])

    expect(manager.list.length).toBe(1)
    expect(manager.list[0].name).toBe(name)
    expect(manager.list[0].val).toBe(value)
  })
  test('constructor defaults', () => {
    const manager = new NameValManager()

    expect(manager.list.length).toBe(0)
  })

  test('CreateNameValueManager', () => {
    const name = 'name'
    const value = 'value'
    const type = 'type'
    const pr = new NameValType(name, value, type)
    const manager = NameValManager.CreateNameValManager([pr])

    expect(manager.list.length).toBe(1)
    expect(manager.list[0].name).toBe(name)
    expect(manager.list[0].val).toBe(value)
  })
  test('CreateNameValueManager with null', () => {
    const manager = NameValManager.CreateNameValManager(null)

    expect(manager.list.length).toBe(0)
  })
  test('CreateNameValueManager with undefined', () => {
    const manager = NameValManager.CreateNameValManager(undefined)

    expect(manager.list.length).toBe(0)
  })

  test('CreateINameValue', () => {
    const name = 'name'
    const value = 'value'
    const item = NameValManager.CreateINameVal(name, value)

    expect(item.name).toBe(name)
    expect(item.val).toBe(value)
  })
})
