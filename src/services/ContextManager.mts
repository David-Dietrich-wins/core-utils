import { IdManager, IIdRequired } from '../models/IdManager.mjs'
import { IValue } from '../models/interfaces.mjs'
import { IUpdated } from '../models/id-created-updated.mjs'
import { newGuid } from './general.mjs'

export type IconConfiguration = {
  alt: string
  maxWidth?: number
  src: string
}

export interface IContextUI {
  color?: string
  icon?: IconConfiguration
  w?: number
  h?: number
  x?: number
  y?: number
  rows?: number
  cols?: number
}

export interface IContext extends IIdRequired<string>, IUpdated<number> {
  disabled?: boolean
  name?: string
  description?: string
  tags?: string[]
  ui?: IContextUI
  [key: string]: unknown
}

export interface IContextValue<T> extends IContext, IValue<T> {}

export class ContextManager
  extends IdManager<IContext>
  implements IIdRequired<string>
{
  private static instance: ContextManager

  id = newGuid()

  // Private constructor to prevent instantiation
  private constructor() {
    super([], undefined)
  }

  public static getInstance(): ContextManager {
    if (!ContextManager.instance) {
      ContextManager.instance = new ContextManager()
    }

    return ContextManager.instance
  }
}
