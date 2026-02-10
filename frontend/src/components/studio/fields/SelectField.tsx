import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { FieldControlProps } from './StringField'

export function SelectField({ field, value, onChange }: FieldControlProps) {
  return (
    <Select
      value={(value as string) ?? ''}
      disabled={field.readOnly}
      onValueChange={(v) => onChange(v)}
    >
      <SelectTrigger className="h-8 text-xs border-primary/30">
        <SelectValue placeholder={field.placeholder || 'Select...'} />
      </SelectTrigger>
      <SelectContent>
        {field.options?.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            <div>
              <span>{opt.label}</span>
              {opt.description && (
                <span className="text-muted-foreground ml-2 text-[10px]">
                  {opt.description}
                </span>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
