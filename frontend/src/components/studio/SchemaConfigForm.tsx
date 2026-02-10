import { useState, useMemo } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ConfigSchema, ConfigFieldDefinition, ConfigFieldGroup } from '@/lib/config-schema'
import { isFieldVisible } from '@/lib/config-schema'
import { validateConfig } from '@/lib/validate-config'
import { FieldRenderer } from './FieldRenderer'

interface SchemaConfigFormProps {
  schema: ConfigSchema
  values: Record<string, unknown>
  onChange: (key: string, value: unknown) => void
}

export function SchemaConfigForm({ schema, values, onChange }: SchemaConfigFormProps) {
  // Track collapsed state per group
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    for (const group of schema.groups ?? []) {
      if (group.collapsible && group.defaultCollapsed) {
        initial[group.key] = true
      }
    }
    return initial
  })

  // Validation errors
  const errors = useMemo(() => validateConfig(schema, values), [schema, values])

  // Get visible fields, deduplicated by key (first visible match wins)
  const visibleFields = useMemo(() => {
    const seen = new Set<string>()
    const result: ConfigFieldDefinition[] = []
    for (const field of schema.fields) {
      if (seen.has(field.key)) continue
      if (!isFieldVisible(field, values)) continue
      seen.add(field.key)
      result.push(field)
    }
    return result
  }, [schema.fields, values])

  // Sort groups by order
  const sortedGroups = useMemo(() => {
    const groups = [...(schema.groups ?? [])]
    groups.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    return groups
  }, [schema.groups])

  // Partition fields into groups
  const ungroupedFields = visibleFields.filter((f) => !f.group)
  const groupedFieldsMap = useMemo(() => {
    const map = new Map<string, ConfigFieldDefinition[]>()
    for (const field of visibleFields) {
      if (!field.group) continue
      const list = map.get(field.group) ?? []
      list.push(field)
      map.set(field.group, list)
    }
    return map
  }, [visibleFields])

  const toggleGroup = (key: string) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const renderField = (field: ConfigFieldDefinition) => (
    <FieldRenderer
      key={field.key}
      field={field}
      value={values[field.key]}
      onChange={(v) => onChange(field.key, v)}
      error={errors[field.key]}
    />
  )

  const renderGroup = (group: ConfigFieldGroup) => {
    const fields = groupedFieldsMap.get(group.key)
    if (!fields || fields.length === 0) return null

    const isCollapsed = collapsed[group.key] ?? false

    return (
      <div key={group.key} className="space-y-2">
        {group.collapsible ? (
          <button
            type="button"
            className="flex items-center gap-1.5 w-full text-left"
            onClick={() => toggleGroup(group.key)}
          >
            {isCollapsed ? (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            )}
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              {group.label}
            </span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-primary/50 rounded-full" />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              {group.label}
            </span>
          </div>
        )}
        {group.description && !isCollapsed && (
          <p className="text-[10px] text-muted-foreground/70 pl-5">{group.description}</p>
        )}
        {!isCollapsed && (
          <div className={cn('space-y-3', group.collapsible && 'pl-5')}>
            {fields.map(renderField)}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Ungrouped fields first */}
      {ungroupedFields.length > 0 && (
        <div className="space-y-3">
          {ungroupedFields.map(renderField)}
        </div>
      )}
      {/* Groups */}
      {sortedGroups.map(renderGroup)}
    </div>
  )
}
