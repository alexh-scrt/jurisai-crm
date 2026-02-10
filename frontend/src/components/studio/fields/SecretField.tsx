import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'
import type { FieldControlProps } from './StringField'

export function SecretField({ field, value, onChange }: FieldControlProps) {
  const [revealed, setRevealed] = useState(false)

  return (
    <div className="relative">
      <Input
        type={revealed ? 'text' : 'password'}
        className="h-8 text-xs border-primary/30 pr-8"
        placeholder={field.placeholder}
        value={(value as string) ?? ''}
        readOnly={field.readOnly}
        onChange={(e) => onChange(e.target.value)}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-8 w-8"
        onClick={() => setRevealed(!revealed)}
      >
        {revealed ? (
          <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </Button>
    </div>
  )
}
