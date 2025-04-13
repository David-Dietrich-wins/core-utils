import { IId } from '../models/IdManager.mjs'
import {
  AnyRecord,
  ConvertToType,
  DigicrewType,
  DigicrewTypes,
} from '../models/types.mjs'
import { isArray, isObject, newGuid } from './general.mjs'

export type FormStatusItem = DigicrewType & {
  errors: string[]
  hasError: boolean
  parentId?: FormStatusItem['id']
  querySelector: string
}

export type FormStatusTopLevel = DigicrewType & {
  anyChangesSinceInitial: boolean
  anyChangesSinceLastOperation: boolean
  errorStatus: FormStatusItem[]
  messages: string[]
  resetEnabled: boolean
  saveEnabled: boolean
}
export type FormStatusChildLevel = Partial<FormStatusTopLevel> & {
  parentId: string
}

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

// type FormStatusRemoveIdField<T> = {
//   [Property in keyof T as Exclude<Property, 'id'>]: FormStatusItem
// }

export function CreateFormStatusChild<T extends object = object>(
  objectId: string,
  formStatusParentId: string,
  // children: FormStatusRemoveIdField<T>,
  overrides?: Partial<FormStatusChild<T>>
) {
  const ret: FormStatusChild<T> = {
    id: objectId,
    parentId: formStatusParentId,
    // name: DigicrewTypes.FormStatusChildLevel,
    // type: DigicrewTypes.FormStatusChildLevel,
    // value: '',
    // errorStatus: CreateFormStatusItem(),
    // ...children,
    ...overrides,
  } as unknown as FormStatusChild<T>

  return ret
}

export function CreateFormStatusItem(
  querySelector: string,
  formStatusParentId: FormStatusItem['id'],
  nearestFormId: string,
  overrides?: Partial<FormStatusItem>
) {
  const formItemStatus: FormStatusItem = {
    id: newGuid(),
    name: DigicrewTypes.FormStatusItem,
    type: DigicrewTypes.FormStatusItem,
    value: nearestFormId,
    errors: [],
    hasError: false,
    parentId: formStatusParentId,
    querySelector,
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
    errorStatus: [],
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
  return Object.entries(obj).reduce((acc: FormStatusItem[], [key, prop]) => {
    if (FormStatusPropertiesToIgnore.includes(key)) {
      return acc
    }

    if (isObject(prop) && 'hasError' in prop && prop.hasError) {
      acc.push(prop as FormStatusItem)
    } else if (isObject(prop)) {
      acc = acc.concat(FormStatusFindErrors(prop))
    } else if (isArray(prop, 1)) {
      prop.forEach((child) => {
        acc = acc.concat(FormStatusFindErrors(child))
      })
    }

    return acc
  }, [])
}

// export function FormStatusItemsJoin(fs1: FormStatusItem, fs2: FormStatusItem) {
//   const hasError = fs1.hasError || fs2.hasError
//   const errors = fs1.errors.concat(fs2.errors)

//   return CreateFormStatusItem({ hasError, errors })
// }
