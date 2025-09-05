import {
  ContextManager,
  type IContext,
  type IContextUI,
  type IContextValue,
  updateContext,
  updateContextKeyValue,
  updateContextUi,
  updateContextValueToggleBoolean,
  updateContextValueValue,
} from './ContextManager.mjs'
import { describe, expect, it } from '@jest/globals'

describe('getInstance', () => {
  it('should return the same instance', () => {
    expect.assertions(3)

    const cm = ContextManager.getInstance()

    expect(cm).toMatchObject({
      id: expect.any(String),
    })

    const cm2 = ContextManager.getInstance()

    expect(cm2).toBe(cm)
    expect(cm2.id).toBe(cm.id)
  })

  it('updateContextUi', () => {
    expect.assertions(1)

    const ctxui: IContextUI = {
      color: 'blue',
      cols: 3,
      h: 100,
      icon: { alt: 'test-icon', src: 'https://test-img.com' },
      rows: 2,
      w: 200,
      x: 10,
      y: 20,
    }

    const ctx = updateContextUi(ctxui, { color: 'red' })

    expect(ctx).toStrictEqual({
      color: 'red',
      cols: 3,
      h: 100,
      icon: { alt: 'test-icon', src: 'https://test-img.com' },
      rows: 2,
      w: 200,
      x: 10,
      y: 20,
    })
  })

  describe('updateContext', () => {
    it('default id', () => {
      expect.assertions(1)

      const ctx = {
        disabled: true,
        updated: Date.now(),
      } as IContext

      const newCtx = updateContext(ctx, { description: 'red' })

      expect(newCtx).toStrictEqual({
        description: 'red',
        disabled: true,
        id: expect.any(String),
        updated: Date.now(),
      })
    })

    it('existing id', () => {
      expect.assertions(1)

      const ctx: IContext = {
        disabled: true,
        id: 'test-id',
        updated: Date.now(),
      }
      const newCtx = updateContext(ctx, { description: 'red' })

      expect(newCtx).toStrictEqual({
        description: 'red',
        disabled: true,
        id: 'test-id',
        updated: Date.now(),
      })
    })
  })

  it('updateContextKeyValue', () => {
    expect.assertions(1)

    const ctx: IContext = {
      disabled: true,
      id: 'test-id',
      updated: Date.now(),
    }
    const key = 'description'
    const value = 'red'
    const newCtx = updateContextKeyValue(ctx, key, value)

    expect(newCtx).toStrictEqual({
      description: 'red',
      disabled: true,
      id: 'test-id',
      updated: Date.now(),
    })
  })

  it('updateContextValueValue', () => {
    expect.assertions(1)

    const ctx: IContextValue<{ a: string; b: string }> = {
      disabled: true,
      id: 'test-id',
      updated: Date.now(),
      value: { a: 'foo', b: 'bar' },
    }

    const value = { a: 'red', b: 'blue' }
    const newCtx = updateContextValueValue(ctx, value)

    expect(newCtx).toStrictEqual({
      disabled: true,
      id: 'test-id',
      updated: Date.now(),
      value: { a: 'red', b: 'blue' },
    })
  })

  it('updateContextValueToggleBoolean', () => {
    expect.assertions(1)

    const ctx: IContextValue<boolean> = {
      disabled: true,
      id: 'test-id',
      updated: Date.now(),
      value: false,
    }

    const newCtx = updateContextValueToggleBoolean(ctx)

    expect(newCtx).toStrictEqual({
      disabled: true,
      id: 'test-id',
      updated: Date.now(),
      value: true,
    })
  })
})
