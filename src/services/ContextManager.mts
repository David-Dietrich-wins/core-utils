import * as z from 'zod'
import { DateHelper, type DateTypeAcceptable } from './DateHelper.mjs'
import { IIdRequired, IdManager } from '../models/IdManager.mjs'
import { IName, IValue } from '../models/interfaces.mjs'
import { IUpdated } from '../models/id-created-updated.mjs'
import { newGuid } from './general.mjs'
import { safeObject } from './object-helper.mjs'

export const zIconConfiguration = z.object({
  alt: z.string().min(1).max(100),
  maxWidth: z.number().int().nonnegative().optional(),
  src: z.string().min(1).max(1000),
})
export type IconConfiguration = z.infer<typeof zIconConfiguration>

// This was the original pre-zod version
// Export interface IContextUI {
//   Color?: string
//   Icon?: IconConfiguration
//   W?: number
//   H?: number
//   X?: number
//   Y?: number
//   Rows?: number
//   Cols?: number
// }
/**
 * Context UI configuration
 * @property {string} [color] - The color of the context
 * @property {IconConfiguration} [icon] - The icon configuration
 * @property {number} [w] - The width of the context
 * @property {number} [h] - The height of the context
 * @property {number} [x] - The x position of the context
 * @property {number} [y] - The y position of the context
 * @property {number} [rows] - The number of rows in the context
 * @property {number} [cols] - The number of columns in the context
 */
export type IContextUI = z.infer<typeof ContextManager.zContextUi>

export function updateContextUi<T extends IContextUI = IContextUI>(
  ctx: T,
  overrides?: Partial<T>
  // updated?: DateTypeAcceptable
): IContextUI {
  const contextUi: T = {
    ...safeObject(ctx),
    // updated: DateHelper.GetTime(updated),
    ...overrides,
  } as unknown as T

  return contextUi
}

type IIdUpdated = IIdRequired & IUpdated<number>
export interface IContext extends IIdUpdated, Partial<IName> {
  disabled?: boolean
  description?: string
  tags?: string[]
  ui?: IContextUI
  // [key: string]: unknown
}
export interface IContextValue<T> extends IContext, IValue<T> {}

export class ContextManager extends IdManager<IContext> implements IIdRequired {
  private static instance: ContextManager

  id = newGuid()

  // Private constructor to prevent instantiation
  private constructor() {
    super([], undefined)
  }

  static readonly zContextUi = z.object({
    color: z.string().optional(),
    cols: z.number().int().nonnegative().optional(),
    h: z.number().int().nonnegative().optional(),
    icon: zIconConfiguration.optional(),
    rows: z.number().int().nonnegative().optional(),
    w: z.number().int().nonnegative().optional(),
    x: z.number().int().nonnegative().optional(),
    y: z.number().int().nonnegative().optional(),
  })

  public static getInstance(): ContextManager {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!ContextManager.instance) {
      ContextManager.instance = new ContextManager()
    }

    return ContextManager.instance
  }
}

export function updateContext<T extends IIdUpdated = IIdUpdated>(
  ctx: T,
  overrides?: Partial<T>,
  updated?: DateTypeAcceptable
): T {
  const context: IContext = {
    ...safeObject(ctx),
    id: ctx.id || newGuid(),
    updated: DateHelper.GetTime(updated),
    ...overrides,
  }

  return context as T
}

export function updateContextKeyValue<T extends IIdUpdated = IIdUpdated>(
  ctx: T,
  key: keyof T,
  value: unknown,
  updated?: DateTypeAcceptable,
  overrides?: Partial<T>
): T {
  const context: IContext = updateContext(
    ctx,
    { [key]: value, ...overrides } as Partial<T>,
    updated
  )

  return context as T
}

export function updateContextValueValue<
  T = unknown,
  U extends IContextValue<T> = IContextValue<T>
>(
  ctx: U,
  value: T,
  updated?: DateTypeAcceptable,
  overrides?: Partial<U>
): IContextValue<T> {
  const context: IContext = updateContextKeyValue(
    ctx,
    'value',
    value,
    updated,
    overrides
  )

  // {
  //   ...safeObject(ctx),
  //   id: ctx.id || newGuid(),
  //   value,
  //   // eslint-disable-next-line sort-keys
  //   updated,
  //   // eslint-disable-next-line sort-keys
  //   overrides,
  // }

  return context as IContextValue<T>
}

export function updateContextValueToggleBoolean(
  ctx: IContextValue<boolean>,
  updated?: DateTypeAcceptable,
  overrides?: Partial<IContextValue<boolean>>
): IContextValue<boolean> {
  const context: IContextValue<boolean> = updateContextValueValue(
    ctx,
    !ctx.value,
    updated,
    overrides
  )

  return context
}
