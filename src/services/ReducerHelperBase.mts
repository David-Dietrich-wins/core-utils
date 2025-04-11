import { AppException } from '../models/AppException.mjs'
import { IId } from '../models/IdManager.mjs'
import { FormStatusManager } from './FormStatus.mjs'
import { deepCloneJson, deepDiffMapper } from './general.mjs'

export type ReducerState<T extends IId<Tid>, Tid = T['id']> = {
  initial: T
  current: T
  formStatus: FormStatusManager<T>
}

/*
    Example usage of the wrap function:
    This function takes another function and wraps it with before and after callbacks.

function add(a: number, b: number): number {
  return a + b;
}

const wrappedAdd = wrap(add, () => console.log('Before add'), () => console.log('After add'));

const result = wrappedAdd(2, 3); // Output: Before add, After add, 5
*/

/**
 * Wraps a function with before and after callbacks.
 * This allows you to execute additional logic before and after the original function is called.
 */
// e slint-disable-next-line @typescript-eslint/no-explicit-any
// function wrap<T extends (...args: any[]) => any>(
//   func: T,
//   before: Function,
//   after: Function
// ) {
//   return function wrappedFunction(...args: Parameters<T>): ReturnType<T> {
//     before()
//     const result = func(...args)
//     after()

//     return result
//   } as T
// }

export class ReducerHelperBase<T extends object> {
  state: ReducerState<T>

  public constructor(state: ReducerState<T>) {
    this.state = deepCloneJson(state)
  }

  // static ChangesWrapper<T extends object>(
  //   state: ReducerState<T>,
  //   func: (update: T) => T,
  //   funcIfAnyChangesSinceLastOperation?: (
  //     update: T,
  //     state: ReducerState<T>
  //   ) => void,
  //   funcIfAnyChangesSinceInitial?: (update: T, state: ReducerState<T>) => void
  // ) {
  //   let deepCopy: ReducerState<T>
  //   let updated: T

  //   const before = () => {
  //     const dc = deepCloneJson(state)

  //     if (!dc) {
  //       throw new AppException('ReducerState clone: Could not create a copy.')
  //     }

  //     const dcUpdated = deepCloneJson(dc.current)
  //     if (!dcUpdated) {
  //       throw new AppException(
  //         'ReducerState clone: Could not create a copy of the current state.'
  //       )
  //     }

  //     // Store the deep copy of the current state
  //     deepCopy = dc
  //     updated = dcUpdated
  //   }

  //   const after = () => {
  //     const changes = ReducerHelper.getChanges(
  //       state,
  //       updated,
  //       funcIfAnyChangesSinceLastOperation,
  //       funcIfAnyChangesSinceInitial
  //     )

  //     const newstate: ReducerState<T> = {
  //       ...deepCopy,
  //       current: updated,
  //       ...changes,
  //     }

  //     return newstate
  //   }

  //   // Wrap the function with before and after callbacks
  //   const ret = wrapReducer(() => func(state.current), before, after)

  //   return ret
  // }

  checkForChangesAndReturnNewState(
    updated: T,
    funcIfAnyChangesSinceLastOperation?: (
      update: T,
      state: ReducerState<T>
    ) => boolean,
    funcIfAnyChangesSinceInitial?: (
      update: T,
      state: ReducerState<T>
    ) => boolean
  ) {
    // This method will return the changes along with the new state.
    // It will call the getChanges method to determine if there are any changes.
    const formStatus = this.getChanges(
      updated,
      funcIfAnyChangesSinceLastOperation,
      funcIfAnyChangesSinceInitial
    )

    // Create a new state object with the updated values and changes.
    const newstate: ReducerState<T> = {
      ...this.state,
      current: { ...updated },
      formStatus,
    }

    return newstate
  }

  getChanges(
    updated: T,
    funcIfAnyChangesSinceLastOperation?: (
      update: T,
      state: ReducerState<T>
    ) => boolean,
    funcIfAnyChangesSinceInitial?: (
      update: T,
      state: ReducerState<T>
    ) => boolean
  ) {
    const anyChangesFromLastOperation = deepDiffMapper().anyChanges(
      this.state,
      updated
    )

    if (anyChangesFromLastOperation) {
      funcIfAnyChangesSinceLastOperation?.(updated, this.state)
    }

    const anyChangesSinceInitial = deepDiffMapper().anyChanges(
      this.state.initial,
      updated
    )

    if (anyChangesSinceInitial) {
      funcIfAnyChangesSinceInitial?.(updated, this.state)
    }

    console.log(
      'changes: From This Operation:',
      anyChangesFromLastOperation,
      ', changesSinceLastSave:',
      deepDiffMapper().getChanges(this.state.initial, updated)
    )

    const formStatus = this.createFormStatusManager(updated)

    formStatus.topLevelStatus.anyChangesSinceLastOperation =
      anyChangesFromLastOperation
    formStatus.topLevelStatus.anyChangesSinceInitial = anyChangesSinceInitial

    formStatus.topLevelStatus.resetEnabled = anyChangesSinceInitial
    if (formStatus.topLevelStatus.errorStatus.length) {
      formStatus.topLevelStatus.saveEnabled = false
    } else {
      formStatus.topLevelStatus.saveEnabled = anyChangesSinceInitial
    }

    return formStatus
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createFormStatusManager(update: T): FormStatusManager<T> {
    throw new AppException(
      'createFormStatusManager: Not implemented in base class.',
      'ReducerHelperBase.createFormStatusManager'
    )
  }

  reset(item: T) {
    const newstate: ReducerState<T> = {
      initial: deepCloneJson(item),
      current: deepCloneJson(item),
      formStatus: this.createFormStatusManager(item),

      // anyChangesFromLastOperation: false, // Reset to false since we're resetting the state
      // anyChangesSinceInitial: false, // Reset to false since we're resetting the state
    }

    this.state = newstate
    return newstate
  }

  resetToInitial() {
    // This method resets the current state to the initial state.
    // It will create a new state object with the initial values and reset the changes.
    // Create a new state object with the initial values.
    const newstate: ReducerState<T> = {
      ...this.state, // Spread the existing state to keep any other properties
      current: deepCloneJson(this.state.initial), // Set the current state to the initial state
      formStatus: this.createFormStatusManager(this.state.initial),
    }

    this.state = newstate

    // Update the state with the new state object.
    // Return the new state object.
    // This allows you to see the new state after the reset.
    return newstate
  }

  runWithDeepCopy(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    func: (currentState: T, ...args: any[]) => T,
    funcIfAnyChangesSinceLastOperation?: (
      update: T,
      state: ReducerState<T>
    ) => boolean,
    funcIfAnyChangesSinceInitial?: (
      update: T,
      state: ReducerState<T>
    ) => boolean
  ) {
    const tupdates = func(deepCloneJson(this.state.current))

    return this.checkForChangesAndReturnNewState(
      tupdates,
      funcIfAnyChangesSinceLastOperation,
      funcIfAnyChangesSinceInitial
    )
  }
}
