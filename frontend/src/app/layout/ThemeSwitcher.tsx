import { Palette, Check } from 'lucide-react'
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

export function ThemeSwitcher({ collapsed }: { collapsed: boolean }) {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium w-full',
            'text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar transition-colors'
          )}
        >
          <Palette className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Theme</span>}
          {!collapsed && (
            <div className={cn('w-3 h-3 rounded-full ml-auto', themeColors[theme])} />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end" className="w-64">
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.id}
            onClick={() => setTheme(t.id)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className={cn('w-4 h-4 rounded-full', themeColors[t.id])} />
            <div className="flex-1">
              <div className="font-medium">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.description}</div>
            </div>
            {theme === t.id && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
