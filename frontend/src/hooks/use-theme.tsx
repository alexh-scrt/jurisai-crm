import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Theme =
  | 'slate-professional'
  | 'warm-neutral'
  | 'cool-indigo'
  | 'forest-green'
  | 'minimal-gray'
  | 'ocean-blue'
  | 'rose-pink'

export const themes: { id: Theme; name: string; description: string; color: string }[] = [
  { id: 'slate-professional', name: 'Slate', description: 'Corporate, trustworthy', color: '#2563eb' },
  { id: 'warm-neutral', name: 'Amber', description: 'Warm, approachable', color: '#f59e0b' },
  { id: 'cool-indigo', name: 'Indigo', description: 'Tech-forward', color: '#6366f1' },
  { id: 'forest-green', name: 'Emerald', description: 'Fresh, professional', color: '#10b981' },
  { id: 'minimal-gray', name: 'Zinc', description: 'Ultra-minimal', color: '#71717a' },
  { id: 'ocean-blue', name: 'Cyan', description: 'Cool, modern', color: '#06b6d4' },
  { id: 'rose-pink', name: 'Rose', description: 'Bold, creative', color: '#f43f5e' },
]

type ThemeContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('jurisai-theme')
    return (saved as Theme) || 'slate-professional'
  })

  useEffect(() => {
    const root = document.documentElement

    // Remove all theme attributes
    root.removeAttribute('data-theme')

    // Set the theme attribute (slate-professional is default, no attribute needed)
    if (theme !== 'slate-professional') {
      root.setAttribute('data-theme', theme)
    }

    localStorage.setItem('jurisai-theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
