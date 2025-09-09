import { NameVal, NameValManager, NameValType } from './NameValManager.mjs'
import { describe, expect, it } from '@jest/globals'

describe('name val', () => {
  it('good', () => {
    expect.assertions(2)

    const name = 'name',
      val = 'val',
      zpr = new NameVal(name, val)

    expect(zpr.name).toBe(name)
    expect(zpr.val).toBe(val)
  })

  it('nameValType good', () => {
    expect.assertions(3)

    const name = 'name',
      type = 'type',
      val = 'value',
      zpr = new NameValType(name, val, type)

    expect(zpr.name).toBe(name)
    expect(zpr.val).toBe(val)
    expect(zpr.type).toBe(type)
  })
})

describe('nameValManager', () => {
  it('constructor', () => {
    expect.assertions(3)

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
    expect.assertions(1)

    const manager = new NameValManager()

    expect(manager.list).toHaveLength(0)
  })

  it('createNameValManager', () => {
    expect.assertions(3)

    const name = 'name',
      type = 'type',
      value = 'value',
      vpr = new NameValType(name, value, type),
      zmanager = NameValManager.createNameValManager([vpr])

    expect(zmanager.list).toHaveLength(1)
    expect(zmanager.list[0].name).toBe(name)
    expect(zmanager.list[0].val).toBe(value)
  })

  it('createNameValManager with null', () => {
    expect.assertions(1)

    const manager = NameValManager.createNameValManager(null)

    expect(manager.list).toHaveLength(0)
  })

  it('createNameValManager with undefined', () => {
    expect.assertions(1)

    const manager = NameValManager.createNameValManager(undefined)

    expect(manager.list).toHaveLength(0)
  })

  it('nameVal.createINameVal', () => {
    expect.assertions(5)

    const name = 'name',
      value = 'value',
      zitem = NameVal.createINameVal(name, value)

    expect(zitem.name).toBe(name)
    expect(zitem.val).toBe(value)
    expect(zitem).toStrictEqual({ name, val: value })

    const item2 = NameVal.createINameVal<{ id: number }>(name, {
      id: 123,
    })

    expect(item2.name).toBe(name)
    expect(item2.val).toStrictEqual({ id: 123 })
  })

  it('nameValManager.createINameVal', () => {
    expect.assertions(5)

    const name = 'name',
      value = 'value',
      zitem = NameValManager.toINameVal(name, value)

    expect(zitem.name).toBe(name)
    expect(zitem.val).toBe(value)
    expect(zitem).toStrictEqual({ name, val: value })

    const item2 = NameValManager.toINameVal<{ id: number }>(name, {
      id: 123,
    })

    expect(item2.name).toBe(name)
    expect(item2.val).toStrictEqual({ id: 123 })
  })
})
