export function parseBoolean(value: string): boolean {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'string') {
    const lowercaseValue = value.trim().toLowerCase()
    if (lowercaseValue === 'true') {
      return true
    }
    if (lowercaseValue === 'false') {
      return false
    }
  }

  throw new Error(`ERROR: failed convert value "'${value}" to boolean'`)
}
