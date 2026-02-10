import type { FieldControlProps } from './StringField'

export function SliderField({ field, value, onChange }: FieldControlProps) {
  const numValue = typeof value === 'number' ? value : (field.defaultValue as number) ?? 0
  const min = field.validation?.min ?? 0
  const max = field.validation?.max ?? 100
  const step = field.step ?? 1

  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        min={min}
        max={max}
        step={step}
        value={numValue}
        disabled={field.readOnly}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span className="text-xs font-mono text-muted-foreground w-10 text-right tabular-nums">
        {numValue}
      </span>
    </div>
  )
}
