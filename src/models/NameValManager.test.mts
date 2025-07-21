import { NameVal, NameValManager, NameValType } from './NameValManager.mjs'

test('NameVal good', () => {
  const name = 'name',
    val = 'val',
    zpr = new NameVal(name, val)

  expect(zpr.name).toBe(name)
  expect(zpr.val).toBe(val)
})

test('NameValType good', () => {
  const name = 'name',
    type = 'type',
    val = 'value',
    zpr = new NameValType(name, val, type)

  expect(zpr.name).toBe(name)
  expect(zpr.val).toBe(val)
  expect(zpr.type).toBe(type)
})

describe('NameValManager', () => {
  test('constructor', () => {
    const name = 'name',
      type = 'type',
      value = 'value',
      vpr = new NameValType(name, value, type),
      zmanager = new NameValManager([vpr])

    expect(zmanager.list.length).toBe(1)
    expect(zmanager.list[0].name).toBe(name)
    expect(zmanager.list[0].val).toBe(value)
  })
  test('constructor defaults', () => {
    const manager = new NameValManager()

    expect(manager.list.length).toBe(0)
  })

  test('CreateNameValManager', () => {
    const name = 'name',
      type = 'type',
      value = 'value',
      vpr = new NameValType(name, value, type),
      zmanager = NameValManager.CreateNameValManager([vpr])

    expect(zmanager.list.length).toBe(1)
    expect(zmanager.list[0].name).toBe(name)
    expect(zmanager.list[0].val).toBe(value)
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
    const name = 'name',
      value = 'value',
      zitem = NameVal.CreateINameVal(name, value)

    expect(zitem.name).toBe(name)
    expect(zitem.val).toBe(value)
    expect(zitem).toEqual({ name, val: value })

    const item2 = NameVal.CreateINameVal<{ id: number }>(name, {
      id: 123,
    })
    expect(item2.name).toBe(name)
    expect(item2.val).toEqual({ id: 123 })
  })

  test('NameValManager.CreateINameVal', () => {
    const name = 'name',
      value = 'value',
      zitem = NameValManager.ToINameVal(name, value)

    expect(zitem.name).toBe(name)
    expect(zitem.val).toBe(value)
    expect(zitem).toEqual({ name, val: value })

    const item2 = NameValManager.ToINameVal<{ id: number }>(name, {
      id: 123,
    })
    expect(item2.name).toBe(name)
    expect(item2.val).toEqual({ id: 123 })
  })
})
