import { NameVal, NameValManager, NameValType } from './NameValManager.mjs'

it('NameVal good', () => {
  const name = 'name',
    val = 'val',
    zpr = new NameVal(name, val)

  expect(zpr.name).toBe(name)
  expect(zpr.val).toBe(val)
})

it('NameValType good', () => {
  const name = 'name',
    type = 'type',
    val = 'value',
    zpr = new NameValType(name, val, type)

  expect(zpr.name).toBe(name)
  expect(zpr.val).toBe(val)
  expect(zpr.type).toBe(type)
})

describe('NameValManager', () => {
  it('constructor', () => {
    const name = 'name',
      type = 'type',
      value = 'value',
      vpr = new NameValType(name, value, type),
      zmanager = new NameValManager([vpr])

    expect(zmanager.list).toHaveLength(1)
    expect(zmanager.list[0].name).toBe(name)
    expect(zmanager.list[0].val).toBe(value)
  })
  it('constructor defaults', () => {
    const manager = new NameValManager()

    expect(manager.list).toHaveLength(0)
  })

  it('CreateNameValManager', () => {
    const name = 'name',
      type = 'type',
      value = 'value',
      vpr = new NameValType(name, value, type),
      zmanager = NameValManager.CreateNameValManager([vpr])

    expect(zmanager.list).toHaveLength(1)
    expect(zmanager.list[0].name).toBe(name)
    expect(zmanager.list[0].val).toBe(value)
  })
  it('CreateNameValManager with null', () => {
    const manager = NameValManager.CreateNameValManager(null)

    expect(manager.list).toHaveLength(0)
  })
  it('CreateNameValManager with undefined', () => {
    const manager = NameValManager.CreateNameValManager(undefined)

    expect(manager.list).toHaveLength(0)
  })

  it('NameVal.CreateINameVal', () => {
    const name = 'name',
      value = 'value',
      zitem = NameVal.CreateINameVal(name, value)

    expect(zitem.name).toBe(name)
    expect(zitem.val).toBe(value)
    expect(zitem).toStrictEqual({ name, val: value })

    const item2 = NameVal.CreateINameVal<{ id: number }>(name, {
      id: 123,
    })
    expect(item2.name).toBe(name)
    expect(item2.val).toStrictEqual({ id: 123 })
  })

  it('NameValManager.CreateINameVal', () => {
    const name = 'name',
      value = 'value',
      zitem = NameValManager.ToINameVal(name, value)

    expect(zitem.name).toBe(name)
    expect(zitem.val).toBe(value)
    expect(zitem).toStrictEqual({ name, val: value })

    const item2 = NameValManager.ToINameVal<{ id: number }>(name, {
      id: 123,
    })
    expect(item2.name).toBe(name)
    expect(item2.val).toStrictEqual({ id: 123 })
  })
})
