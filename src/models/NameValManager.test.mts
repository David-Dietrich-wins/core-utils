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

describe('NameValManager', () => {
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

  test('CreateNameValManager', () => {
    const name = 'name'
    const value = 'value'
    const type = 'type'
    const pr = new NameValType(name, value, type)
    const manager = NameValManager.CreateNameValManager([pr])

    expect(manager.list.length).toBe(1)
    expect(manager.list[0].name).toBe(name)
    expect(manager.list[0].val).toBe(value)
  })
  test('CreateNameValManager with null', () => {
    const manager = NameValManager.CreateNameValManager(null)

    expect(manager.list.length).toBe(0)
  })
  test('CreateNameValManager with undefined', () => {
    const manager = NameValManager.CreateNameValManager(undefined)

    expect(manager.list.length).toBe(0)
  })

  test('NameVal.CreateINameVal', () => {
    const name = 'name'
    const value = 'value'
    const item = NameVal.CreateINameVal(name, value)

    expect(item.name).toBe(name)
    expect(item.val).toBe(value)
    expect(item).toEqual({ name, val: value })

    const item2 = NameVal.CreateINameVal<{ id: number }>(name, {
      id: 123,
    })
    expect(item2.name).toBe(name)
    expect(item2.val).toEqual({ id: 123 })
  })

  test('NameValManager.CreateINameVal', () => {
    const name = 'name'
    const value = 'value'
    const item = NameValManager.CreateINameVal(name, value)

    expect(item.name).toBe(name)
    expect(item.val).toBe(value)
    expect(item).toEqual({ name, val: value })

    const item2 = NameValManager.CreateINameVal<{ id: number }>(name, {
      id: 123,
    })
    expect(item2.name).toBe(name)
    expect(item2.val).toEqual({ id: 123 })
  })
})
