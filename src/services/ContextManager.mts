import { IIdRequired, IdManager } from '../models/IdManager.mjs'
import { IName, IValue } from '../models/interfaces.mjs'
import { IUpdated } from '../models/id-created-updated.mjs'
import { newGuid } from './general.mjs'
import { z } from 'zod/v4'

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

export interface IContext
  extends IIdRequired,
    IUpdated<number>,
    Partial<IName> {
  disabled?: boolean
  description?: string
  tags?: string[]
  ui?: IContextUI
  [key: string]: unknown
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
