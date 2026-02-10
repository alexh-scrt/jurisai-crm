import { Switch } from '@/components/ui/switch'
import type { FieldControlProps } from './StringField'

export function BooleanField({ field, value, onChange }: FieldControlProps) {
  return (
    <Switch
      checked={Boolean(value)}
      disabled={field.readOnly}
      onCheckedChange={(checked) => onChange(checked)}
    />
  )
}
