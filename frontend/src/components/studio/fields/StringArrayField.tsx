import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'
import type { FieldControlProps } from './StringField'

export function StringArrayField({ field, value, onChange }: FieldControlProps) {
  const items = Array.isArray(value) ? (value as string[]) : []

  const updateItem = (index: number, newValue: string) => {
    const updated = [...items]
    updated[index] = newValue
    onChange(updated)
  }

  const addItem = () => {
    const maxItems = field.validation?.maxItems
    if (maxItems !== undefined && items.length >= maxItems) return
    onChange([...items, ''])
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-1.5">
      {items.map((item, index) => (
        <div key={index} className="flex gap-1">
          <Input
            className="h-8 text-xs border-primary/30 flex-1"
            placeholder={field.placeholder}
            value={item}
            readOnly={field.readOnly}
            onChange={(e) => updateItem(index, e.target.value)}
          />
          {!field.readOnly && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => removeItem(index)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      ))}
      {!field.readOnly && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 text-xs w-full border-dashed border-primary/30"
          onClick={addItem}
          disabled={
            field.validation?.maxItems !== undefined &&
            items.length >= field.validation.maxItems
          }
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Item
        </Button>
      )}
    </div>
  )
}
