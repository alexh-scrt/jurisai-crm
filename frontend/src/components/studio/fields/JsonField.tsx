import { cn } from '@/lib/utils'
import type { FieldControlProps } from './StringField'

export function JsonField({ field, value, onChange }: FieldControlProps) {
  return (
    <textarea
      className={cn(
        'flex w-full rounded-md border border-primary/30 bg-background px-3 py-2 text-xs font-mono',
        'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        'min-h-[100px] resize-y'
      )}
      placeholder={field.placeholder || '{\n  \n}'}
      value={(value as string) ?? ''}
      readOnly={field.readOnly}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
