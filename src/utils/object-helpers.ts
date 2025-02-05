import { Iid } from './interfaces.js'

export function CloneObjectWithId<T extends Iid>(
  objectWithId: Readonly<T>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  overridesAndExtras?: Record<string, any>
) {
  const newq: T = { ...objectWithId, ...overridesAndExtras }

  return newq
}

export function UpdateFieldValue<T extends Iid>(
  parentObject: Readonly<T>,
  fieldName: string,
  fieldValue: unknown
) {
  return CloneObjectWithId(parentObject, { [fieldName]: fieldValue })
}
