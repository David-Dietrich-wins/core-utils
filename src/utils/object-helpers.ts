import { IId } from './interfaces.js'

export function CloneObjectWithId<T extends IId>(
  objectWithId: Readonly<T>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  overridesAndExtras?: Record<string, any>
) {
  const newq: T = { ...objectWithId, ...overridesAndExtras }

  return newq
}

export function UpdateFieldValue<T extends IId>(
  parentObject: Readonly<T>,
  fieldName: string,
  fieldValue: unknown
) {
  return CloneObjectWithId(parentObject, { [fieldName]: fieldValue })
}
