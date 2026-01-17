import { Link } from 'react-router-dom'
import { ArrowRight, Palette } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useTheme, themes } from '@/hooks/use-theme'
import { cn } from '@/lib/utils'

const layoutOptions = [
  {
    id: 'linear',
    name: 'Linear Style',
    description: 'Minimal sidebar, spacious content area, clean typography. Inspired by Linear\'s focused, distraction-free interface.',
    inspiration: 'Linear',
    features: ['Narrow icon sidebar', 'Expandable on hover', 'Full-width content', 'Floating action bar'],
    preview: 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-100',
  },
  {
    id: 'notion',
    name: 'Notion Style',
    description: 'Wide sidebar with nested navigation, document-centric layout, light and airy feel.',
    inspiration: 'Notion',
    features: ['Wide collapsible sidebar', 'Tree navigation', 'Breadcrumb header', 'Page-based content'],
    preview: 'bg-gradient-to-r from-stone-100 via-white to-stone-50',
  },
  {
    id: 'figma',
    name: 'Figma Style',
    description: 'Top toolbar, left panel for layers/components, canvas center, right panel for properties.',
    inspiration: 'Figma',
    features: ['Top toolbar', 'Left layers panel', 'Center canvas', 'Right properties panel'],
    preview: 'bg-gradient-to-r from-zinc-800 via-zinc-600 to-zinc-200',
  },
  {
    id: 'vscode',
    name: 'VS Code Style',
    description: 'Activity bar with icons, collapsible sidebar, tabbed editor area, bottom panel.',
    inspiration: 'VS Code',
    features: ['Activity bar', 'Explorer sidebar', 'Editor tabs', 'Bottom panel'],
    preview: 'bg-gradient-to-r from-slate-900 via-slate-700 to-slate-300',
  },
  {
    id: 'retool',
    name: 'Retool Style',
    description: 'Compact navigation, component tree sidebar, canvas with properties drawer.',
    inspiration: 'Retool',
    features: ['Compact header', 'Component tree', 'Grid canvas', 'Slide-out inspector'],
    preview: 'bg-gradient-to-r from-indigo-900 via-indigo-600 to-slate-100',
  },
]

const themeColors: Record<string, string> = {
  'slate-professional': 'bg-blue-600',
  'warm-neutral': 'bg-amber-500',
  'cool-indigo': 'bg-indigo-500',
  'forest-green': 'bg-emerald-500',
  'minimal-gray': 'bg-zinc-900',
}

export function LayoutPicker() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen bg-muted/30 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">JurisAI Studio Layout Exploration</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore 5 different layout approaches, each inspired by successful applications.
            Pick your preferred theme below, then click a layout to preview.
          </p>
        </div>

        {/* Theme Selector */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Palette className="h-5 w-5" />
            <span className="font-medium">Select Theme:</span>
          </div>
          <div className="flex justify-center gap-3">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all',
                  theme === t.id
                    ? 'border-primary bg-primary/10'
                    : 'border-transparent bg-card hover:border-muted-foreground/20'
                )}
              >
                <div className={cn('w-4 h-4 rounded-full', themeColors[t.id])} />
                <span className="text-sm font-medium">{t.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Layout Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {layoutOptions.map((layout) => (
            <Link key={layout.id} to={`/layouts/${layout.id}`}>
              <Card className="h-full hover:border-primary hover:shadow-lg transition-all cursor-pointer group">
                {/* Preview Strip */}
                <div className={cn('h-24 rounded-t-lg', layout.preview)} />

                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{layout.name}</CardTitle>
                    <Badge variant="secondary">{layout.inspiration}</Badge>
                  </div>
                  <CardDescription>{layout.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Key Features:</span>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {layout.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 flex items-center text-primary font-medium group-hover:gap-2 transition-all">
                    <span>Preview Layout</span>
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-12 text-center text-muted-foreground">
          <p>Click any layout card to see a full interactive prototype.</p>
          <p className="text-sm mt-2">Each layout includes the theme switcher for live color comparison.</p>
        </div>
      </div>
    </div>
  )
}
