import { AnyRecord } from '../models/types.mjs'
import EventEmitter from 'events'

type EventKey<T extends AnyRecord> = string & keyof T
type EventReceiver<T> = (params: T) => void

interface Emitter<T extends AnyRecord> {
  on<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void
  off<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void
  emit<K extends EventKey<T>>(eventName: K, params: T[K]): void
}

class EmitterManager<T extends AnyRecord> implements Emitter<T> {
  private emitter = new EventEmitter()

  on<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>) {
    this.emitter.on(eventName, fn)
  }

  off<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>) {
    this.emitter.off(eventName, fn)
  }

  emit<K extends EventKey<T>>(eventName: K, params: T[K]) {
    this.emitter.emit(eventName, params)
  }
}

export function CreateEmitterManager<T>(name: string) {
  const emitterManager = new EmitterManager<{ [name]: T }>()

  return {
    emit(event: T) {
      emitterManager.emit(name, event)
    },

    off(fn: EventReceiver<T>) {
      emitterManager.off(name, fn)
    },
    on: (fn: EventReceiver<T>) => {
      emitterManager.on(name, fn)
    },
  }
}
