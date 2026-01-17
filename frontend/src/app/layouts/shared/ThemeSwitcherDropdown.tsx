import { Palette, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme, themes, type Theme } from '@/hooks/use-theme'
import { cn } from '@/lib/utils'

const themeColors: Record<Theme, string> = {
  'slate-professional': 'bg-blue-600',
  'warm-neutral': 'bg-amber-500',
  'cool-indigo': 'bg-indigo-500',
  'forest-green': 'bg-emerald-500',
  'minimal-gray': 'bg-zinc-500',
  'ocean-blue': 'bg-cyan-500',
  'rose-pink': 'bg-rose-500',
}

export function ThemeSwitcherDropdown() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Palette className="h-5 w-5" />
          <div className={cn(
            'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background',
            themeColors[theme]
          )} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.id}
            onClick={() => setTheme(t.id)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className={cn('w-4 h-4 rounded-full', themeColors[t.id])} />
            <div className="flex-1">
              <div className="font-medium text-sm">{t.name}</div>
            </div>
            {theme === t.id && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Inline theme bar for Figma layouts
export function ThemeColorBar() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          className={cn(
            'w-6 h-6 rounded-md transition-all',
            themeColors[t.id],
            theme === t.id
              ? 'ring-2 ring-offset-2 ring-foreground scale-110'
              : 'hover:scale-105 opacity-70 hover:opacity-100'
          )}
          title={t.name}
        />
      ))}
    </div>
  )
}
