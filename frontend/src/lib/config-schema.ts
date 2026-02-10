// ============================================================
// Config Schema Type System
// ============================================================

export type ConfigFieldType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'select'
  | 'textarea'
  | 'secret'
  | 'string-array'
  | 'json'
  | 'slider'

export interface SelectOption {
  label: string
  value: string
  description?: string
}

export interface FieldValidation {
  minLength?: number
  maxLength?: number
  pattern?: string
  patternMessage?: string
  min?: number
  max?: number
  minItems?: number
  maxItems?: number
  validJson?: boolean
}

export interface FieldVisibilityCondition {
  field: string
  value: string | string[]
  negate?: boolean
}

export interface ConfigFieldDefinition {
  key: string
  type: ConfigFieldType
  label: string
  description?: string
  placeholder?: string
  defaultValue?: unknown
  required?: boolean
  readOnly?: boolean
  options?: SelectOption[]
  step?: number
  validation?: FieldValidation
  visibleWhen?: FieldVisibilityCondition[]
  group?: string
}

export interface ConfigFieldGroup {
  key: string
  label: string
  description?: string
  order?: number
  collapsible?: boolean
  defaultCollapsed?: boolean
}

export interface ConfigSchema {
  fields: ConfigFieldDefinition[]
  groups?: ConfigFieldGroup[]
}

// ============================================================
// Helpers
// ============================================================

export function isFieldVisible(
  field: ConfigFieldDefinition,
  values: Record<string, unknown>
): boolean {
  if (!field.visibleWhen || field.visibleWhen.length === 0) return true

  return field.visibleWhen.every((condition) => {
    const currentValue = values[condition.field]
    const acceptedValues = Array.isArray(condition.value)
      ? condition.value
      : [condition.value]
    const matches = acceptedValues.includes(currentValue as string)
    return condition.negate ? !matches : matches
  })
}

export function getDefaultValues(schema: ConfigSchema): Record<string, unknown> {
  const defaults: Record<string, unknown> = {}
  for (const field of schema.fields) {
    if (field.defaultValue !== undefined) {
      defaults[field.key] = field.defaultValue
    }
  }
  return defaults
}
