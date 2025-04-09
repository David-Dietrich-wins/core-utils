import EventEmitter from 'events'
import { IIdNameValue } from '../models/id-name.mjs'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventMap = Record<string, any>

type EventKey<T extends EventMap> = string & keyof T
type EventReceiver<T> = (params: T) => void

interface Emitter<T extends EventMap> {
  on<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void
  off<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void
  emit<K extends EventKey<T>>(eventName: K, params: T[K]): void
}

class EventManager<T extends EventMap> implements Emitter<T> {
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

function CreateEventManager<T>(name: string) {
  const eventManager = new EventManager<{ [name]: T }>()

  return {
    on: (fn: EventReceiver<T>) => {
      eventManager.on(`${name}`, fn)
    },
    off(fn: EventReceiver<T>) {
      eventManager.off(name, fn)
    },

    emit(event: T) {
      eventManager.emit(name, event)
    },
  }
}

export const EventManagerIdNameValue =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CreateEventManager<IIdNameValue<any>>('idNameValue')
export const EventManagerLock = CreateEventManager<boolean>('lock')
