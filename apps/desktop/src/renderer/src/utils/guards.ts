import { isBlank } from '@canvas-capture/canvas-api'

export function isKeyArray(value: unknown): value is React.Key[] {
  return Array.isArray(value)
}

isBlank({}) // true
