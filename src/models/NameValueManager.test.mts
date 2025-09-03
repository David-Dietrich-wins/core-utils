/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  NameValue,
  NameValueLineFormatManager,
  NameValueLineFormatter,
  NameValueManager,
  NameValueType,
  NameValueWithStyle,
} from './NameValueManager.mjs'
import { dollarFormatter } from '../primitives/number-helper.mjs'

test('NameValue good', () => {
  const name = 'name',
    value = 'value',
    zpr = new NameValue(name, value)

  expect(zpr.name).toBe(name)
  expect(zpr.value).toBe(value)
})

test('NameValueType good', () => {
  const name = 'name',
    type = 'type',
    value = 'value',
    zpr = new NameValueType(name, value, type)

  expect(zpr.name).toBe(name)
  expect(zpr.value).toBe(value)
  expect(zpr.type).toBe(type)
})

describe('NameValueManager', () => {
  test('constructor', () => {
    const name = 'name',
      type = 'type',
      value = 'value',
      zpr = new NameValueType(name, value, type),
      zzmanager = new NameValueManager([zpr])

    expect(zzmanager.list.length).toBe(1)
    expect(zzmanager.list[0].name).toBe(name)
    expect(zzmanager.list[0].value).toBe(value)
  })
  test('constructor defaults', () => {
    const manager = new NameValueManager()

    expect(manager.list.length).toBe(0)
  })

  test('CreateNameValueManager', () => {
    const name = 'name',
      type = 'type',
      value = 'value',
      zpr = new NameValueType(name, value, type),
      zzmanager = NameValueManager.CreateNameValueManager([zpr])

    expect(zzmanager.list.length).toBe(1)
    expect(zzmanager.list[0].name).toBe(name)
    expect(zzmanager.list[0].value).toBe(value)
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
    const name = 'name',
      value = 'value',
      zitem = NameValueManager.CreateINameValue(name, value)

    expect(zitem.name).toBe(name)
    expect(zitem.value).toBe(value)
  })
})

test('NameValueWithStyle', () => {
  const name = 'name',
    tooltip = 'tooltip',
    value = 'value',
    zpr = new NameValueWithStyle(name, value, dollarFormatter, tooltip)

  expect(zpr.name).toBe(name)
  expect(zpr.value).toBe(value)
  expect(zpr.style).toBe(dollarFormatter)
  expect(zpr.tooltip).toBe(tooltip)
})

test('NameValueLineFormatter', () => {
  const formatNumberOrString = (
      value: number | string | null | undefined
    ): string => {
      if (typeof value === 'number') {
        return `$${value.toFixed(2)}`
      }

      return value || ''
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
      formatNumberOrString
    )

  expect(zpr.key).toBe(key)
  expect(zpr.keyDisplayValue).toBe(keyDisplayValue)
  expect(zpr.order).toBe(order)
  expect(zpr.formatter).toBe(formatter)
  expect(zpr.tooltip).toBe(tooltip)
  expect(zpr.style).toBe(style)
  expect(zpr.formatNumberOrString).toBe(formatNumberOrString)

  const nvf = zpr.FromStyle('testName', 100, true, 2)
  expect(nvf).toBeInstanceOf(NameValueWithStyle)
  expect(nvf.name).toBe(keyDisplayValue)
  expect(nvf.value).toBe('$100.00')
  expect(nvf.style).toBe(style)
  expect(nvf.tooltip).toBe(tooltip)

  const nors = zpr.NumberOrString('testName', 200)
  expect(nors).toBeInstanceOf(NameValueWithStyle)
  expect(nors.name).toBe(keyDisplayValue)
  expect(nors.value).toBe('$200.00')
  expect(nors.style).toBe(style)
  expect(nors.tooltip).toBe(tooltip)

  zpr.formatter = undefined
  const nvfNoFormatter = zpr.FromStyle('testName', 'value', true, 2)
  expect(nvfNoFormatter).toBeInstanceOf(NameValueWithStyle)
  expect(nvfNoFormatter.name).toBe(keyDisplayValue)
  expect(nvfNoFormatter.value).toBe('value')
  expect(nvfNoFormatter.style).toBe(style)
  expect(nvfNoFormatter.tooltip).toBe(tooltip)
})

describe('NameValueLineFormatManager', () => {
  test('with constructor arguments', () => {
    const formatNumberOrString = (
        value: number | string | null | undefined
      ): string => {
        if (typeof value === 'number') {
          return `$${value.toFixed(2)}`
        }

        return value || ''
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
        formatNumberOrString
      ),
      zzmgr = new NameValueLineFormatManager([zpr])
    expect(zzmgr).toBeInstanceOf(NameValueLineFormatManager)
    expect(zzmgr.nvlist.length).toBe(1)
    expect(zzmgr.nvlist[0].key).toBe(key)
    expect(zzmgr.nvlist[0].keyDisplayValue).toBe(keyDisplayValue)
    expect(zzmgr.nvlist[0].order).toBe(order)
    expect(zzmgr.nvlist[0].formatter).toBe(formatter)
    expect(zzmgr.nvlist[0].tooltip).toBe(tooltip)
    expect(zzmgr.nvlist[0].style).toBe(style)
    expect(zzmgr.nvlist[0].formatNumberOrString).toBe(formatNumberOrString)

    const anv = new NameValue('testName', '100'),
      arrnvf = zzmgr.FormatWithStyle([anv], 'name', true)
    expect(arrnvf).toBeInstanceOf(Array<NameValueWithStyle>)
    expect(arrnvf.length).toBe(0)

    const anvkey = new NameValue('key', '100'),
      arrnvfName = zzmgr.FormatWithStyle([anvkey], 'name', false)
    expect(arrnvfName).toBeInstanceOf(Array<NameValueWithStyle>)
    expect(arrnvfName.length).toBe(1)
    expect(arrnvfName[0]).toBeInstanceOf(NameValueWithStyle)
    expect(arrnvfName[0].name).toBe(keyDisplayValue)
    expect(arrnvfName[0].value).toBe('$100.00')
    expect(arrnvfName[0].style).toBe(style)
    expect(arrnvfName[0].tooltip).toBe(tooltip)

    const arrnvfValue = zzmgr.FormatWithStyle([anv], 'value', false)
    expect(arrnvfValue).toBeInstanceOf(Array<NameValueWithStyle>)
    expect(arrnvfValue.length).toBe(0)

    zpr.order = undefined
    const arrnvf2 = zzmgr.FormatWithStyle([anvkey], 'name', false)
    expect(arrnvf2).toBeInstanceOf(Array<NameValueWithStyle>)
    expect(arrnvf2.length).toBe(1)
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
    const arrnvf3 = zzmgr.FormatWithStyle(
      [anvkey, new NameValue(anvkey.name, '200')],
      'name'
    )
    expect(arrnvf3).toBeInstanceOf(Array<NameValueWithStyle>)
    expect(arrnvf3.length).toBe(2)
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
    const arrnvfSortValue = zzmgr.FormatWithStyle(
      [anvkey, new NameValue(anvkey.name, '0')],
      'value'
    )
    expect(arrnvfSortValue).toBeInstanceOf(Array<NameValueWithStyle>)
    expect(arrnvfSortValue.length).toBe(2)
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

    const ret = zzmgr.FromObject({ key: 'value', key2: 'value2' }, 'key')
    expect(ret).toBeInstanceOf(Array<NameValueWithStyle>)
    expect(ret.length).toBe(1)
    expect(ret[0].name).toBe(keyDisplayValue)
    expect(ret[0].value).toBe('')
    expect(ret[0].style).toBe(style)
    expect(ret[0].tooltip).toBe(tooltip)

    zpr.formatNumberOrString = undefined
    const nors = zpr.NumberOrString('testName', '200')
    expect(nors).toBeInstanceOf(NameValueWithStyle)
    expect(nors.name).toBe(keyDisplayValue)
    expect(nors.value).toBe('200')
    expect(nors.style).toBe(style)
    expect(nors.tooltip).toBe(tooltip)

    const ret2 = zzmgr.FromObject()
    expect(ret2).toBeInstanceOf(Array<NameValueWithStyle>)
    expect(ret2.length).toBe(0)
  })

  test('without constructor arguments', () => {
    const mgr = new NameValueLineFormatManager()
    expect(mgr).toBeInstanceOf(NameValueLineFormatManager)
    expect(mgr.nvlist.length).toBe(0)

    const anv = new NameValue('testName', '100'),
      arrnvf = mgr.FormatWithStyle([anv], 'name', true)
    expect(arrnvf).toBeInstanceOf(Array<NameValueWithStyle>)
    expect(arrnvf.length).toBe(0)
  })

  test('no style found', () => {
    const key = 'key',
      keyDisplayValue = 'keyDisplayValue',
      pr = new NameValueLineFormatter(key, keyDisplayValue),
      pr2 = new NameValueLineFormatter(key, keyDisplayValue)
    pr.FromStyle = undefined as any
    pr2.FromStyle = undefined as any

    const mgr = new NameValueLineFormatManager([pr, pr2])
    expect(mgr).toBeInstanceOf(NameValueLineFormatManager)
    expect(mgr.nvlist.length).toBe(2)

    const nv = new NameValue(key, '100'),
      nvNotFound = new NameValue(key, '200'),
      zarrnvf = mgr.FormatWithStyle([nv, nvNotFound], 'name', true)
    expect(zarrnvf).toBeInstanceOf(Array<NameValueWithStyle>)
    expect(zarrnvf.length).toBe(2)
  })
})
