import type { ConfigSchema, ConfigFieldDefinition } from './config-schema'
import { isFieldVisible } from './config-schema'

export function validateConfig(
  schema: ConfigSchema,
  values: Record<string, unknown>
): Record<string, string> {
  const errors: Record<string, string> = {}

  // Deduplicate by key — only validate the first visible field per key
  const seen = new Set<string>()

  for (const field of schema.fields) {
    if (seen.has(field.key)) continue
    if (!isFieldVisible(field, values)) continue
    seen.add(field.key)

    const value = values[field.key]
    const error = validateField(field, value)
    if (error) errors[field.key] = error
  }

  return errors
}

function validateField(field: ConfigFieldDefinition, value: unknown): string | undefined {
  const v = field.validation

  // Required check
  if (field.required) {
    if (value === undefined || value === null || value === '') {
      return `${field.label} is required`
    }
  }

  // Skip further validation if empty and not required
  if (value === undefined || value === null || value === '') return undefined

  // String validations
  if (typeof value === 'string') {
    if (v?.minLength !== undefined && value.length < v.minLength) {
      return `Minimum ${v.minLength} characters`
    }
    if (v?.maxLength !== undefined && value.length > v.maxLength) {
      return `Maximum ${v.maxLength} characters`
    }
    if (v?.pattern) {
      const regex = new RegExp(v.pattern)
      if (!regex.test(value)) {
        return v.patternMessage || 'Invalid format'
      }
    }
  }

  // Number validations
  if (typeof value === 'number') {
    if (v?.min !== undefined && value < v.min) {
      return `Minimum value is ${v.min}`
    }
    if (v?.max !== undefined && value > v.max) {
      return `Maximum value is ${v.max}`
    }
  }

  // Array validations
  if (Array.isArray(value)) {
    if (v?.minItems !== undefined && value.length < v.minItems) {
      return `At least ${v.minItems} items required`
    }
    if (v?.maxItems !== undefined && value.length > v.maxItems) {
      return `Maximum ${v.maxItems} items`
    }
  }

  // JSON validation
  if (v?.validJson && typeof value === 'string') {
    try {
      JSON.parse(value)
    } catch {
      return 'Invalid JSON'
    }
  }

  return undefined
}
