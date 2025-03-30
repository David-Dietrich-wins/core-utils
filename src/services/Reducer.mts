import { IId } from '../index.mjs'
import { deepCloneJson, deepDiffMapper } from './general.mjs'

export type ReducerChanges = {
  anyChangesFromLastOperation: boolean
  anyChangesSinceInitial: boolean
}

export type ReducerStateOnly<T extends IId> = {
  initial: T
  current: T
}

export type ReducerState<T extends IId> = ReducerChanges & ReducerStateOnly<T>

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

export class ReducerHelper {
  // e slint-disable-next-line @typescript-eslint/no-explicit-any
  static RunWithDeepCopy<T extends object>(
    state: ReducerState<T>,
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
    const dcState = deepCloneJson(state)

    const tupdates = func(deepCloneJson(dcState.current))

    return ReducerHelper.CheckForChangesAndReturnNewState(
      state,
      tupdates,
      funcIfAnyChangesSinceLastOperation,
      funcIfAnyChangesSinceInitial
    )
  }

  static getChanges<T extends object>(
    state: ReducerState<T>,
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
      state,
      updated
    )

    if (anyChangesFromLastOperation) {
      funcIfAnyChangesSinceLastOperation?.(updated, state)
    }

    const anyChangesSinceInitial = deepDiffMapper().anyChanges(
      state.initial,
      updated
    )

    if (anyChangesSinceInitial) {
      funcIfAnyChangesSinceInitial?.(updated, state)
    }

    console.log(
      'changes: From This Operation:',
      anyChangesFromLastOperation,
      ', changesSinceLastSave:',
      deepDiffMapper().getChanges(state.initial, updated)
    )

    const changes: ReducerChanges = {
      anyChangesFromLastOperation,
      anyChangesSinceInitial,
    }

    return changes
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

  static CheckForChangesAndReturnNewState<T extends object>(
    state: ReducerState<T>,
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
    const changes = ReducerHelper.getChanges(
      state,
      updated,
      funcIfAnyChangesSinceLastOperation,
      funcIfAnyChangesSinceInitial
    )

    // Create a new state object with the updated values and changes.
    const newstate: ReducerState<T> = {
      ...state,
      current: { ...updated },
      ...changes,
    }

    return newstate
  }
}
