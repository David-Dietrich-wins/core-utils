import { AppException } from '../models/AppException.mjs'
import { deepCloneJson, deepDiffMapper } from './general.mjs'

/* eslint-disable @typescript-eslint/no-unsafe-function-type */
export type ReducerChanges = {
  anyChangesFromLastOperation: boolean
  anyChangesSinceInitial: boolean
}

export type ReducerStateOnly<T extends object> = {
  initial: T
  current: T
}

export type ReducerState<T extends object> = ReducerChanges &
  ReducerStateOnly<T>

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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function wrap<T extends (...args: any[]) => any>(
  func: T,
  before?: Function,
  after?: Function
): T {
  return function wrappedFunction(...args: Parameters<T>): ReturnType<T> {
    before?.()
    const result = func(...args)
    after?.()

    return result
  } as T
}

export class ReducerHelper {
  static getChanges<T extends object>(
    state: ReducerState<T>,
    updated: T,
    funcIfAnyChangesSinceLastOperation?: (
      update: T,
      state: ReducerState<T>
    ) => void,
    funcIfAnyChangesSinceInitial?: (update: T, state: ReducerState<T>) => void
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

  static ChangesWrapper<T extends object>(
    state: ReducerState<T>,
    func: (update: T) => T,
    funcIfAnyChangesSinceLastOperation?: (
      update: T,
      state: ReducerState<T>
    ) => void,
    funcIfAnyChangesSinceInitial?: (update: T, state: ReducerState<T>) => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): (state: ReducerState<T>, ...args: any[]) => ReducerState<T> {
    let deepCopy: ReducerState<T>
    let updated: T

    const before = () => {
      const dc = deepCloneJson(state)

      if (!dc) {
        throw new AppException('ReducerState clone: Could not create a copy.')
      }

      const dcUpdated = deepCloneJson(dc.current)
      if (!dcUpdated) {
        throw new AppException(
          'ReducerState clone: Could not create a copy of the current state.'
        )
      }

      // Store the deep copy of the current state
      deepCopy = dc
      updated = dcUpdated
    }

    let newstate: ReducerState<T> | undefined = undefined
    const after = () => {
      const changes = ReducerHelper.getChanges(
        state,
        updated,
        funcIfAnyChangesSinceLastOperation,
        funcIfAnyChangesSinceInitial
      )

      newstate = {
        ...deepCopy,
        current: updated,
        ...changes,
      }

      return newstate
    }

    // Wrap the function with before and after callbacks
    wrap(() => func(updated), before, after)

    if (!newstate) {
      throw new AppException(
        'ReducerState: After function was not called. This should not happen.'
      )
    }

    return newstate
  }

  static updateCurrent<T extends object>(state: ReducerState<T>, updated: T) {
    const changes = ReducerHelper.getChanges(state, updated)

    const newstate: ReducerState<T> = {
      initial: state.initial,
      current: { ...updated },
      ...changes,
    }

    return newstate
  }
}
