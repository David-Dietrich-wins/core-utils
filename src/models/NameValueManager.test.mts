import { DollarFormatter } from '../services/number-helper.mjs'
import {
  NameValue,
  NameValueLineFormatManager,
  NameValueLineFormatter,
  NameValueManager,
  NameValueType,
  NameValueWithStyle,
} from './NameValueManager.mjs'

test('NameValue good', () => {
  const name = 'name',
   value = 'value',
   pr = new NameValue(name, value)

  expect(pr.name).toBe(name)
  expect(pr.value).toBe(value)
})

test('NameValueType good', () => {
  const name = 'name',
   value = 'value',
   type = 'type',
   pr = new NameValueType(name, value, type)

  expect(pr.name).toBe(name)
  expect(pr.value).toBe(value)
  expect(pr.type).toBe(type)
})

describe('NameValueManager', () => {
  test('constructor', () => {
    const name = 'name',
     value = 'value',
     type = 'type',
     pr = new NameValueType(name, value, type),
     manager = new NameValueManager([pr])

    expect(manager.list.length).toBe(1)
    expect(manager.list[0].name).toBe(name)
    expect(manager.list[0].value).toBe(value)
  })
  test('constructor defaults', () => {
    const manager = new NameValueManager()

    expect(manager.list.length).toBe(0)
  })

  test('CreateNameValueManager', () => {
    const name = 'name',
     value = 'value',
     type = 'type',
     pr = new NameValueType(name, value, type),
     manager = NameValueManager.CreateNameValueManager([pr])

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
    const name = 'name',
     value = 'value',
     item = NameValueManager.CreateINameValue(name, value)

    expect(item.name).toBe(name)
    expect(item.value).toBe(value)
  })
})

test('NameValueWithStyle', () => {
  const name = 'name',
   value = 'value',
   tooltip = 'tooltip',
   pr = new NameValueWithStyle(name, value, DollarFormatter, tooltip)

  expect(pr.name).toBe(name)
  expect(pr.value).toBe(value)
  expect(pr.style).toBe(DollarFormatter)
  expect(pr.tooltip).toBe(tooltip)
})

test('NameValueLineFormatter', () => {
  const key = 'key',
   keyDisplayValue = 'keyDisplayValue',
   order = 1,
   formatter = DollarFormatter,
   tooltip = 'tooltip',
   style = { color: 'red' },
   formatNumberOrString = (
    value: number | string | null | undefined
  ): string => {
    if (typeof value === 'number') {
      return `$${value.toFixed(2)}`
    }

    return value || ''
  },
   pr = new NameValueLineFormatter(
    key,
    keyDisplayValue,
    order,
    formatter,
    tooltip,
    style,
    formatNumberOrString
  )

  expect(pr.key).toBe(key)
  expect(pr.keyDisplayValue).toBe(keyDisplayValue)
  expect(pr.order).toBe(order)
  expect(pr.formatter).toBe(formatter)
  expect(pr.tooltip).toBe(tooltip)
  expect(pr.style).toBe(style)
  expect(pr.formatNumberOrString).toBe(formatNumberOrString)

  const nvf = pr.FromStyle('testName', 100, true, 2)
  expect(nvf).toBeInstanceOf(NameValueWithStyle)
  expect(nvf.name).toBe(keyDisplayValue)
  expect(nvf.value).toBe('$100.00')
  expect(nvf.style).toBe(style)
  expect(nvf.tooltip).toBe(tooltip)

  const nors = pr.NumberOrString('testName', 200)
  expect(nors).toBeInstanceOf(NameValueWithStyle)
  expect(nors.name).toBe(keyDisplayValue)
  expect(nors.value).toBe('$200.00')
  expect(nors.style).toBe(style)
  expect(nors.tooltip).toBe(tooltip)

  pr.formatter = undefined
  const nvfNoFormatter = pr.FromStyle('testName', 'value', true, 2)
  expect(nvfNoFormatter).toBeInstanceOf(NameValueWithStyle)
  expect(nvfNoFormatter.name).toBe(keyDisplayValue)
  expect(nvfNoFormatter.value).toBe('value')
  expect(nvfNoFormatter.style).toBe(style)
  expect(nvfNoFormatter.tooltip).toBe(tooltip)
})

describe('NameValueLineFormatManager', () => {
  test('with constructor arguments', () => {
    const key = 'key',
     keyDisplayValue = 'keyDisplayValue',
     order = 1,
     formatter = DollarFormatter,
     tooltip = 'tooltip',
     style = { color: 'red' },
     formatNumberOrString = (
      value: number | string | null | undefined
    ): string => {
      if (typeof value === 'number') {
        return `$${value.toFixed(2)}`
      }

      return value || ''
    },
     pr = new NameValueLineFormatter(
      key,
      keyDisplayValue,
      order,
      formatter,
      tooltip,
      style,
      formatNumberOrString
    ),

     mgr = new NameValueLineFormatManager([pr])
    expect(mgr).toBeInstanceOf(NameValueLineFormatManager)
    expect(mgr.nvlist.length).toBe(1)
    expect(mgr.nvlist[0].key).toBe(key)
    expect(mgr.nvlist[0].keyDisplayValue).toBe(keyDisplayValue)
    expect(mgr.nvlist[0].order).toBe(order)
    expect(mgr.nvlist[0].formatter).toBe(formatter)
    expect(mgr.nvlist[0].tooltip).toBe(tooltip)
    expect(mgr.nvlist[0].style).toBe(style)
    expect(mgr.nvlist[0].formatNumberOrString).toBe(formatNumberOrString)

    const nv = new NameValue('testName', '100'),
     arrnvf = mgr.FormatWithStyle([nv], 'name', true)
    expect(arrnvf).toBeInstanceOf(Array<NameValueWithStyle>)
    expect(arrnvf.length).toBe(0)

    const nvkey = new NameValue('key', '100'),
     arrnvfName = mgr.FormatWithStyle([nvkey], 'name', false)
    expect(arrnvfName).toBeInstanceOf(Array<NameValueWithStyle>)
    expect(arrnvfName.length).toBe(1)
    expect(arrnvfName[0]).toBeInstanceOf(NameValueWithStyle)
    expect(arrnvfName[0].name).toBe(keyDisplayValue)
    expect(arrnvfName[0].value).toBe('$100.00')
    expect(arrnvfName[0].style).toBe(style)
    expect(arrnvfName[0].tooltip).toBe(tooltip)

    const arrnvfValue = mgr.FormatWithStyle([nv], 'value', false)
    expect(arrnvfValue).toBeInstanceOf(Array<NameValueWithStyle>)
    expect(arrnvfValue.length).toBe(0)

    pr.order = undefined
    const arrnvf2 = mgr.FormatWithStyle([nvkey], 'name', false)
    expect(arrnvf2).toBeInstanceOf(Array<NameValueWithStyle>)
    expect(arrnvf2.length).toBe(1)
    expect(arrnvf2[0]).toBeInstanceOf(NameValueWithStyle)
    expect(arrnvf2[0].name).toBe(keyDisplayValue)
    expect(arrnvf2[0].value).toBe('$100.00')
    expect(arrnvf2[0].style).toBe(style)
    expect(arrnvf2[0].tooltip).toBe(tooltip)

    mgr.nvlist[0].order = 1
    const nvlf2 = new NameValueLineFormatter(
      'key',
      'keyDisplayValue',
      2,
      DollarFormatter,
      tooltip,
      style
    )
    mgr.nvlist.push(nvlf2)
    const arrnvf3 = mgr.FormatWithStyle(
      [nvkey, new NameValue(nvkey.name, '200')],
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

    mgr.nvlist[0].order = undefined
    mgr.nvlist[1].order = undefined
    const arrnvfSortValue = mgr.FormatWithStyle(
      [nvkey, new NameValue(nvkey.name, '0')],
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

    const ret = mgr.FromObject({ key: 'value', key2: 'value2' }, 'key')
    expect(ret).toBeInstanceOf(Array<NameValueWithStyle>)
    expect(ret.length).toBe(1)
    expect(ret[0].name).toBe(keyDisplayValue)
    expect(ret[0].value).toBe('')
    expect(ret[0].style).toBe(style)
    expect(ret[0].tooltip).toBe(tooltip)

    pr.formatNumberOrString = undefined
    const nors = pr.NumberOrString('testName', '200')
    expect(nors).toBeInstanceOf(NameValueWithStyle)
    expect(nors.name).toBe(keyDisplayValue)
    expect(nors.value).toBe('200')
    expect(nors.style).toBe(style)
    expect(nors.tooltip).toBe(tooltip)

    const ret2 = mgr.FromObject()
    expect(ret2).toBeInstanceOf(Array<NameValueWithStyle>)
    expect(ret2.length).toBe(0)
  })

  test('without constructor arguments', () => {
    const mgr = new NameValueLineFormatManager()
    expect(mgr).toBeInstanceOf(NameValueLineFormatManager)
    expect(mgr.nvlist.length).toBe(0)

    const nv = new NameValue('testName', '100'),
     arrnvf = mgr.FormatWithStyle([nv], 'name', true)
    expect(arrnvf).toBeInstanceOf(Array<NameValueWithStyle>)
    expect(arrnvf.length).toBe(0)
  })

  test('no style found', () => {
    const key = 'key',
     keyDisplayValue = 'keyDisplayValue',
     pr = new NameValueLineFormatter(key, keyDisplayValue),
     pr2 = new NameValueLineFormatter(key, keyDisplayValue)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pr.FromStyle = undefined as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pr2.FromStyle = undefined as any

    const mgr = new NameValueLineFormatManager([pr, pr2])
    expect(mgr).toBeInstanceOf(NameValueLineFormatManager)
    expect(mgr.nvlist.length).toBe(2)

    const nv = new NameValue(key, '100'),
     nvNotFound = new NameValue(key, '200'),
     arrnvf = mgr.FormatWithStyle([nv, nvNotFound], 'name', true)
    expect(arrnvf).toBeInstanceOf(Array<NameValueWithStyle>)
    expect(arrnvf.length).toBe(2)
  })
})
