import type { ConfigFieldDefinition } from '@/lib/config-schema'
import { FIELD_RENDERERS } from './field-renderers'

interface FieldRendererProps {
  field: ConfigFieldDefinition
  value: unknown
  onChange: (value: unknown) => void
  error?: string
}

export function FieldRenderer({ field, value, onChange, error }: FieldRendererProps) {
  const Control = FIELD_RENDERERS[field.type]
  if (!Control) return null

  return (
    <div className="space-y-1">
      {/* Label — boolean fields show label inline next to the switch */}
      {field.type !== 'boolean' ? (
        <label className="text-[10px] text-muted-foreground">
          {field.label}
          {field.required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      ) : (
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium">
            {field.label}
            {field.required && <span className="text-red-400 ml-0.5">*</span>}
          </label>
          <Control field={field} value={value} onChange={onChange} />
        </div>
      )}

      {/* Description */}
      {field.description && (
        <p className="text-[10px] text-muted-foreground/70">{field.description}</p>
      )}

      {/* Control (non-boolean — boolean is rendered inline above) */}
      {field.type !== 'boolean' && (
        <Control field={field} value={value} onChange={onChange} />
      )}

      {/* Error */}
      {error && (
        <p className="text-[10px] text-red-400">{error}</p>
      )}
    </div>
  )
}
