import { Input } from '@/components/ui/input'
import type { FieldControlProps } from './StringField'

export function NumberField({ field, value, onChange }: FieldControlProps) {
  return (
    <Input
      type="number"
      className="h-8 text-xs border-primary/30"
      placeholder={field.placeholder}
      value={value !== undefined && value !== null ? String(value) : ''}
      readOnly={field.readOnly}
      step={field.step}
      min={field.validation?.min}
      max={field.validation?.max}
      onChange={(e) => {
        const v = e.target.value
        onChange(v === '' ? undefined : Number(v))
      }}
    />
  )
}
