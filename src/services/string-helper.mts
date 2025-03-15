import { hasData, safestr } from './general.mjs'

export function capitalizeFirstLetter(str?: string | null) {
  return str && hasData(str) ? str.charAt(0).toUpperCase() + str.slice(1) : ''
}

export function capitalizeWords(str?: string | null) {
  return safestr(str).split(' ').map(capitalizeFirstLetter).join(' ')
}
