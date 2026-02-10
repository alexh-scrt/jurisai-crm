import { Input } from '@/components/ui/input'
import type { ConfigFieldDefinition } from '@/lib/config-schema'

export interface FieldControlProps {
  field: ConfigFieldDefinition
  value: unknown
  onChange: (value: unknown) => void
}

export function StringField({ field, value, onChange }: FieldControlProps) {
  return (
    <Input
      className="h-8 text-xs border-primary/30"
      placeholder={field.placeholder}
      value={(value as string) ?? ''}
      readOnly={field.readOnly}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
