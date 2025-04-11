import { IId } from '../models/IdManager.mjs'
import {
  AnyRecord,
  ConvertToType,
  DigicrewType,
  DigicrewTypes,
} from '../models/types.mjs'
import { isObject, newGuid } from './general.mjs'

export type FormStatusItem = DigicrewType & {
  hasError: boolean
  errors: string[]
}

export type FormStatusTopLevel = DigicrewType & {
  anyChangesSinceInitial: boolean
  anyChangesSinceLastOperation: boolean
  errorStatus: FormStatusItem
  messages: []
  resetEnabled: boolean
  saveEnabled: boolean
}
export type FormStatusChildLevel = Partial<FormStatusTopLevel>

/**
 * Takes any object and converts it to a FormItemStatus object
 *  with each item, except id, transformed into a FormItemStatus.
 */
export type FormStatusChild<
  T extends object,
  TChildAdd extends AnyRecord = { childStatus?: FormStatusChildLevel }
> = T extends IId
  ? ConvertToType<Omit<T, 'id'>, FormStatusItem, TChildAdd> &
      IId<T['id']> &
      TChildAdd
  : ConvertToType<T, FormStatusItem, TChildAdd> & TChildAdd

export type FormStatusManager<
  T extends object,
  TopLevelAdd extends AnyRecord = {
    topLevelStatus: FormStatusTopLevel
  },
  TChildAdd extends AnyRecord = { childStatus?: FormStatusChildLevel }
> = T extends IId
  ? ConvertToType<Omit<T, 'id'>, FormStatusItem, TChildAdd> &
      IId<T['id']> &
      TopLevelAdd
  : ConvertToType<T, FormStatusItem, TChildAdd> & TopLevelAdd

//   createFormStatusValueChart() {
//   const chart = this.value as TileConfigChart
//   const chartErrors: FormStatusChild<TileConfigChart> = {
//     ticker: this.tickerMustHaveValue(chart.ticker),
//     frequency: CreateFormStatusItem(),
//     frequencyType: CreateFormStatusItem(),
//     period: CreateFormStatusItem(),
//     periodType: CreateFormStatusItem(),
//     useProfileColors: CreateFormStatusItem(),
//   }

//   return chartErrors
// }

export function CreateFormStatusChild<T extends object = object>(
  obj: T,
  overrides?: Partial<FormStatusChild<T>>
) {
  const ret: FormStatusChild<T> = {
    // id: newGuid(),
    // name: DigicrewTypes.FormStatusChildLevel,
    // type: DigicrewTypes.FormStatusChildLevel,
    // value: '',
    // errorStatus: CreateFormStatusItem(),
    ...obj,
    ...overrides,
  }

  return ret
}

export function CreateFormStatusItem(overrides?: Partial<FormStatusItem>) {
  const formItemStatus: FormStatusItem = {
    id: newGuid(),
    name: DigicrewTypes.FormStatusItem,
    type: DigicrewTypes.FormStatusItem,
    value: '',
    hasError: false,
    errors: [],
    ...overrides,
  }

  return formItemStatus
}

export function CreateFormStatusTopLevel(
  overrides?: Partial<FormStatusTopLevel>
) {
  const topLevelStatus: FormStatusTopLevel = {
    id: newGuid(),
    name: DigicrewTypes.FormStatusTopLevel,
    type: DigicrewTypes.FormStatusTopLevel,
    value: '',

    anyChangesSinceInitial: false,
    anyChangesSinceLastOperation: false,
    messages: [],
    errorStatus: CreateFormStatusItem(),
    resetEnabled: false,
    saveEnabled: false,
    ...overrides,
  }

  return topLevelStatus
}

const FormStatusPropertiesToIgnore = ['topLevelStatus', 'id', 'digicrew']

/**
 * Aggregates all errors into a single FormStatusItem object
 * @param obj Any FormStatusIten object to search for all errors for every item, object and array in its properties
 * @returns A FormStatusItem object with all errors in the errors field
 */
export function FormStatusFindErrors(obj: Readonly<object>) {
  let fsiReturn = CreateFormStatusItem()

  Object.keys(obj).forEach((key) => {
    if (FormStatusPropertiesToIgnore.includes(key)) {
      return
    }

    const item = obj[key]
    if (item) {
      if (isObject(item) && 'hasError' in item && item.hasError) {
        fsiReturn = FormStatusItemsJoin(fsiReturn, item as FormStatusItem)
      } else if (isObject(item)) {
        fsiReturn = FormStatusItemsJoin(fsiReturn, FormStatusFindErrors(item))
      } else if (Array.isArray(item)) {
        item.forEach((child) => {
          fsiReturn = FormStatusItemsJoin(
            fsiReturn,
            FormStatusFindErrors(child)
          )
        })
      }
    }
  })

  return fsiReturn
}

export function FormStatusItemsJoin(fs1: FormStatusItem, fs2: FormStatusItem) {
  const hasError = fs1.hasError || fs2.hasError
  const errors = fs1.errors.concat(fs2.errors)

  return CreateFormStatusItem({ hasError, errors })
}
