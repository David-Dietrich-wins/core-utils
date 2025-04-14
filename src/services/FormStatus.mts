import { IdManager, IId } from '../models/IdManager.mjs'
import {
  AnyRecord,
  ConvertToType,
  DigicrewType,
  DigicrewTypes,
} from '../models/types.mjs'
import { isArray, isObject, newGuid } from './general.mjs'
import { ReducerState } from './ReducerHelperBase.mjs'

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

export type FormStatusErrorContext = {
  formStatusItem: FormStatusItem
  foundInCurrentState: object
  foundInFormStatus: object
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
//     frequency: FormStatus.CreateItem(),
//     frequencyType: FormStatus.CreateItem(),
//     period: FormStatus.CreateItem(),
//     periodType: FormStatus.CreateItem(),
//     useProfileColors: FormStatus.CreateItem(),
//   }

//   return chartErrors
// }

// type FormStatusRemoveIdField<T> = {
//   [Property in keyof T as Exclude<Property, 'id'>]: FormStatusItem
// }

export class FormStatus {
  static CreateChild<T extends object = object>(
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
      // errorStatus: FormStatus.CreateItem(),
      // ...children,
      ...overrides,
    } as unknown as FormStatusChild<T>

    return ret
  }

  static CreateItem(
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

  static CreateTopLevel(overrides?: Partial<FormStatusTopLevel>) {
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

  static readonly PropertiesToIgnore = ['topLevelStatus', 'id', 'digicrew']

  /**
   * Aggregates all errors into a single FormStatusItem object
   * @param obj Any FormStatusIten object to search for all errors for every item, object and array in its properties
   * @returns A FormStatusItem object with all errors in the errors field
   */
  static FindAllErrorsFromChildren(obj: Readonly<object>) {
    return Object.entries(obj).reduce((acc: FormStatusItem[], [key, prop]) => {
      if (FormStatus.PropertiesToIgnore.includes(key)) {
        return acc
      }

      if (isObject(prop) && 'hasError' in prop && prop.hasError) {
        acc.push(prop as FormStatusItem)
      } else if (isObject(prop)) {
        acc = acc.concat(FormStatus.FindAllErrorsFromChildren(prop))
      } else if (isArray(prop, 1)) {
        prop.forEach((child) => {
          acc = acc.concat(FormStatus.FindAllErrorsFromChildren(child))
        })
      }

      return acc
    }, [])
  }

  // static JoinItems(fs1: FormStatusItem, fs2: FormStatusItem) {
  //   const hasError = fs1.hasError || fs2.hasError
  //   const errors = fs1.errors.concat(fs2.errors)

  //   return FormStatus.CreateItem({ hasError, errors })
  // }
  static FindErrorInForm<T extends IId<Tid>, Tid = T['id']>(
    state: Readonly<ReducerState<T>>,
    x: FormStatusItem
  ) {
    let foundInFormStatus = IdManager.FindObjectWithId(state.formStatus, x.id)
    if (foundInFormStatus) {
      let found: object | undefined = foundInFormStatus
      let id = x.value
      let parentId = (foundInFormStatus as { parentId: string }).parentId

      while (foundInFormStatus && id) {
        parentId = (foundInFormStatus as { parentId: string }).parentId

        found = IdManager.FindObjectWithId(state.current, id)
        if (found) {
          break
        } else {
          foundInFormStatus = IdManager.FindObjectWithId(
            state.formStatus,
            parentId
          )

          id = (foundInFormStatus as { id: string })?.id
        }
      }

      if (foundInFormStatus && found) {
        const ret: FormStatusErrorContext = {
          foundInCurrentState: found,
          formStatusItem: x,
          foundInFormStatus,
        }

        return ret
      }
    }
  }
}
