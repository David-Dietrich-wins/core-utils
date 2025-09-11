/* eslint-disable one-var */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  NameValue,
  NameValueLineFormatManager,
  NameValueLineFormatter,
  NameValueManager,
  NameValueType,
  NameValueWithStyle,
} from './NameValueManager.mjs'
import { describe, expect, it } from '@jest/globals'
import { dollarFormatter } from '../primitives/number-helper.mjs'
import { safestr } from '../primitives/string-helper.mjs'

describe('name value', () => {
  it('good', () => {
    expect.assertions(2)

    const name = 'name',
      value = 'value',
      zpr = new NameValue(name, value)

    expect(zpr.name).toBe(name)
    expect(zpr.value).toBe(value)
  })

  it('nameValueType good', () => {
    expect.assertions(3)

    const name = 'name',
      type = 'type',
      value = 'value',
      zpr = new NameValueType(name, value, type)

    expect(zpr.name).toBe(name)
    expect(zpr.value).toBe(value)
    expect(zpr.type).toBe(type)
  })
})

describe('nameValueManager', () => {
  it('constructor', () => {
    expect.assertions(3)

    const name = 'name',
      type = 'type',
      value = 'value',
      zpr = new NameValueType(name, value, type),
      zzmanager = new NameValueManager([zpr])

    expect(zzmanager.list).toHaveLength(1)
    expect(zzmanager.list[0].name).toBe(name)
    expect(zzmanager.list[0].value).toBe(value)
  })

  it('constructor defaults', () => {
    expect.assertions(1)

    const manager = new NameValueManager()

    expect(manager.list).toHaveLength(0)
  })

  it('createNameValueManager', () => {
    expect.assertions(3)

    const name = 'name',
      type = 'type',
      value = 'value',
      zpr = new NameValueType(name, value, type),
      zzmanager = NameValueManager.createNameValueManager([zpr])

    expect(zzmanager.list).toHaveLength(1)
    expect(zzmanager.list[0].name).toBe(name)
    expect(zzmanager.list[0].value).toBe(value)
  })

  it('createNameValueManager with null', () => {
    expect.assertions(1)

    const manager = NameValueManager.createNameValueManager(null)

    expect(manager.list).toHaveLength(0)
  })

  it('with undefined', () => {
    expect.assertions(1)

    const manager = NameValueManager.createNameValueManager(undefined)

    expect(manager.list).toHaveLength(0)
  })

  it('createINameValue', () => {
    expect.assertions(2)

    const name = 'name',
      value = 'value',
      zitem = NameValueManager.createINameValue(name, value)

    expect(zitem.name).toBe(name)
    expect(zitem.value).toBe(value)
  })

  it('nameValueWithStyle', () => {
    expect.assertions(4)

    const name = 'name',
      tooltip = 'tooltip',
      value = 'value',
      zpr = new NameValueWithStyle(name, value, dollarFormatter, tooltip)

    expect(zpr.name).toBe(name)
    expect(zpr.value).toBe(value)
    expect(zpr.style).toBe(dollarFormatter)
    expect(zpr.tooltip).toBe(tooltip)
  })

  it('nameValueLineFormatter', () => {
    expect.assertions(22)

    const formatnumberOrString = (
        value: number | string | null | undefined
      ): string => {
        // eslint-disable-next-line jest/no-conditional-in-test
        if (typeof value === 'number') {
          return `$${value.toFixed(2)}`
        }

        return safestr(value)
      },
      formatter = dollarFormatter,
      key = 'key',
      keyDisplayValue = 'keyDisplayValue',
      order = 1,
      style = { color: 'red' },
      tooltip = 'tooltip',
      zpr = new NameValueLineFormatter(
        key,
        keyDisplayValue,
        order,
        formatter,
        tooltip,
        style,
        formatnumberOrString
      )

    expect(zpr.key).toBe(key)
    expect(zpr.keyDisplayValue).toBe(keyDisplayValue)
    expect(zpr.order).toBe(order)
    expect(zpr.formatter).toBe(formatter)
    expect(zpr.tooltip).toBe(tooltip)
    expect(zpr.style).toBe(style)
    expect(zpr.formatnumberOrString).toBe(formatnumberOrString)

    const nvf = zpr.fromStyle('testName', 100, true, 2)

    expect(nvf).toBeInstanceOf(NameValueWithStyle)
    expect(nvf.name).toBe(keyDisplayValue)
    expect(nvf.value).toBe('$100.00')
    expect(nvf.style).toBe(style)
    expect(nvf.tooltip).toBe(tooltip)

    const nors = zpr.numberOrString('testName', 200)

    expect(nors).toBeInstanceOf(NameValueWithStyle)

    expect(nors.name).toBe(keyDisplayValue)
    expect(nors.value).toBe('$200.00')
    expect(nors.style).toBe(style)
    expect(nors.tooltip).toBe(tooltip)

    zpr.formatter = undefined
    const nvfNoFormatter = zpr.fromStyle('testName', 'value', true, 2)

    expect(nvfNoFormatter).toBeInstanceOf(NameValueWithStyle)
    expect(nvfNoFormatter.name).toBe(keyDisplayValue)
    expect(nvfNoFormatter.value).toBe('value')
    expect(nvfNoFormatter.style).toBe(style)
    expect(nvfNoFormatter.tooltip).toBe(tooltip)
  })
})

describe('nameValueLineFormatManager', () => {
  it('with constructor arguments', () => {
    expect.assertions(64)

    const formatnumberOrString = (
        value: number | string | null | undefined
      ): string => {
        // eslint-disable-next-line jest/no-conditional-in-test
        if (typeof value === 'number') {
          return `$${value.toFixed(2)}`
        }

        return safestr(value)
      },
      formatter = dollarFormatter,
      key = 'key',
      keyDisplayValue = 'keyDisplayValue',
      order = 1,
      style = { color: 'red' },
      tooltip = 'tooltip',
      zpr = new NameValueLineFormatter(
        key,
        keyDisplayValue,
        order,
        formatter,
        tooltip,
        style,
        formatnumberOrString
      ),
      zzmgr = new NameValueLineFormatManager([zpr])

    expect(zzmgr).toBeInstanceOf(NameValueLineFormatManager)
    expect(zzmgr.nvlist).toHaveLength(1)
    expect(zzmgr.nvlist[0].key).toBe(key)
    expect(zzmgr.nvlist[0].keyDisplayValue).toBe(keyDisplayValue)
    expect(zzmgr.nvlist[0].order).toBe(order)
    expect(zzmgr.nvlist[0].formatter).toBe(formatter)
    expect(zzmgr.nvlist[0].tooltip).toBe(tooltip)
    expect(zzmgr.nvlist[0].style).toBe(style)
    expect(zzmgr.nvlist[0].formatnumberOrString).toBe(formatnumberOrString)

    const anv = new NameValue('testName', '100'),
      arrnvf = zzmgr.formatWithStyle([anv], 'name', true)

    expect(arrnvf).toBeInstanceOf(Array<NameValueWithStyle>)
    expect(arrnvf).toHaveLength(0)

    const anvkey = new NameValue('key', '100'),
      arrnvfName = zzmgr.formatWithStyle([anvkey], 'name', false)

    expect(arrnvfName).toBeInstanceOf(Array<NameValueWithStyle>)
    expect(arrnvfName).toHaveLength(1)
    expect(arrnvfName[0]).toBeInstanceOf(NameValueWithStyle)
    expect(arrnvfName[0].name).toBe(keyDisplayValue)
    expect(arrnvfName[0].value).toBe('$100.00')
    expect(arrnvfName[0].style).toBe(style)
    expect(arrnvfName[0].tooltip).toBe(tooltip)

    const arrnvfValue = zzmgr.formatWithStyle([anv], 'value', false)

    expect(arrnvfValue).toBeInstanceOf(Array<NameValueWithStyle>)
    expect(arrnvfValue).toHaveLength(0)

    zpr.order = undefined
    const arrnvf2 = zzmgr.formatWithStyle([anvkey], 'name', false)

    expect(arrnvf2).toBeInstanceOf(Array<NameValueWithStyle>)
    expect(arrnvf2).toHaveLength(1)
    expect(arrnvf2[0]).toBeInstanceOf(NameValueWithStyle)
    expect(arrnvf2[0].name).toBe(keyDisplayValue)
    expect(arrnvf2[0].value).toBe('$100.00')
    expect(arrnvf2[0].style).toBe(style)
    expect(arrnvf2[0].tooltip).toBe(tooltip)

    zzmgr.nvlist[0].order = 1

    const nvlf2 = new NameValueLineFormatter(
      'key',
      'keyDisplayValue',
      2,
      dollarFormatter,
      tooltip,
      style
    )
    zzmgr.nvlist.push(nvlf2)

    const arrnvf3 = zzmgr.formatWithStyle(
      [anvkey, new NameValue(anvkey.name, '200')],
      'name'
    )

    expect(arrnvf3).toBeInstanceOf(Array<NameValueWithStyle>)
    expect(arrnvf3).toHaveLength(2)
    expect(arrnvf3[0]).toBeInstanceOf(NameValueWithStyle)
    expect(arrnvf3[0].name).toBe(keyDisplayValue)
    expect(arrnvf3[0].value).toBe('$100.00')
    expect(arrnvf3[0].style).toBe(style)
    expect(arrnvf3[0].tooltip).toBe(tooltip)

    expect(arrnvf3[1]).toBeInstanceOf(NameValueWithStyle)
    expect(arrnvf3[1].name).toBe(keyDisplayValue)
    expect(arrnvf3[1].value).toBe('$200.00')
    expect(arrnvf3[1].style).toBe(style)
    expect(arrnvf3[1].tooltip).toBe(tooltip)

    zzmgr.nvlist[0].order = undefined
    zzmgr.nvlist[1].order = undefined

    const arrnvfSortValue = zzmgr.formatWithStyle(
        [anvkey, new NameValue(anvkey.name, '0')],
        'value'
      ),
      ret = zzmgr.fromObject({ key: 'value', key2: 'value2' }, 'key')

    expect(arrnvfSortValue).toBeInstanceOf(Array<NameValueWithStyle>)
    expect(arrnvfSortValue).toHaveLength(2)
    expect(arrnvfSortValue[0]).toBeInstanceOf(NameValueWithStyle)
    expect(arrnvfSortValue[0].name).toBe(keyDisplayValue)
    expect(arrnvfSortValue[0].value).toBe('$0.00')
    expect(arrnvfSortValue[0].style).toBe(style)
    expect(arrnvfSortValue[0].tooltip).toBe(tooltip)

    expect(arrnvfSortValue[1]).toBeInstanceOf(NameValueWithStyle)
    expect(arrnvfSortValue[1].name).toBe(keyDisplayValue)
    expect(arrnvfSortValue[1].value).toBe('$100.00')
    expect(arrnvfSortValue[1].style).toBe(style)
    expect(arrnvfSortValue[1].tooltip).toBe(tooltip)

    expect(ret).toBeInstanceOf(Array<NameValueWithStyle>)
    expect(ret).toHaveLength(1)
    expect(ret[0].name).toBe(keyDisplayValue)
    expect(ret[0].value).toBe('')
    expect(ret[0].style).toBe(style)
    expect(ret[0].tooltip).toBe(tooltip)

    zpr.formatnumberOrString = undefined

    const nors = zpr.numberOrString('testName', '200'),
      ret2 = zzmgr.fromObject()

    expect(nors).toBeInstanceOf(NameValueWithStyle)
    expect(nors.name).toBe(keyDisplayValue)
    expect(nors.value).toBe('200')
    expect(nors.style).toBe(style)
    expect(nors.tooltip).toBe(tooltip)

    expect(ret2).toBeInstanceOf(Array<NameValueWithStyle>)
    expect(ret2).toHaveLength(0)
  })

  it('without constructor arguments', () => {
    expect.assertions(4)

    const anv = new NameValue('testName', '100'),
      mgr = new NameValueLineFormatManager(),
      stylenvf = mgr.formatWithStyle([anv], 'name', true)

    expect(mgr).toBeInstanceOf(NameValueLineFormatManager)
    expect(mgr.nvlist).toHaveLength(0)

    expect(stylenvf).toBeInstanceOf(Array<NameValueWithStyle>)
    expect(stylenvf).toHaveLength(0)
  })

  it('no style found', () => {
    expect.assertions(4)

    const key = 'key',
      keyDisplayValue = 'keyDisplayValue',
      nv = new NameValue(key, '100'),
      nvNotFound = new NameValue(key, '200'),
      pr = new NameValueLineFormatter(key, keyDisplayValue),
      pr2 = new NameValueLineFormatter(key, keyDisplayValue)
    pr.fromStyle = undefined as any
    pr2.fromStyle = undefined as any

    const mgr = new NameValueLineFormatManager([pr, pr2]),
      zarrnvf = mgr.formatWithStyle([nv, nvNotFound], 'name', true)

    expect(mgr).toBeInstanceOf(NameValueLineFormatManager)
    expect(mgr.nvlist).toHaveLength(2)

    expect(zarrnvf).toBeInstanceOf(Array<NameValueWithStyle>)
    expect(zarrnvf).toHaveLength(2)
  })
})
