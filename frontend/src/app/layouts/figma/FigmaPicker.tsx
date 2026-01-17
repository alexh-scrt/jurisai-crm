import { Link } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Layers, PanelLeftClose, SplitSquareHorizontal, Move, PanelRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ThemeColorBar } from '../shared/ThemeSwitcherDropdown'

interface LayoutVariation {
  id: string
  name: string
  description: string
  features: string[]
  icon: React.ElementType
  preview: string
  hasSubVariations?: boolean
  link?: string
}

const layoutVariations: LayoutVariation[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional three-panel layout with layers on left, canvas in center, and properties on right.',
    features: ['Fixed panels', 'Layer tree', 'Detailed properties', 'Full toolbar'],
    icon: Layers,
    preview: 'bg-gradient-to-br from-slate-600 to-slate-800',
  },
  {
    id: 'canvas-focus',
    name: 'Canvas Focus',
    description: 'Maximized canvas with collapsible side panels and floating toolbar for distraction-free editing.',
    features: ['Floating toolbar', 'Collapsible panels', 'Full canvas', 'Minimal chrome'],
    icon: PanelLeftClose,
    preview: 'bg-gradient-to-br from-violet-600 to-purple-800',
  },
  {
    id: 'split-view',
    name: 'Split View',
    description: 'Side-by-side canvas and code view for developers who want to see both visual and JSON representation.',
    features: ['Canvas + Code', 'Toggle views', 'Syntax highlighting', 'Live sync'],
    icon: SplitSquareHorizontal,
    preview: 'bg-gradient-to-br from-cyan-600 to-blue-800',
  },
  {
    id: 'floating-panels',
    name: 'Floating Panels',
    description: 'Draggable floating panels over canvas. Click to explore 5 additional sub-variations.',
    features: ['5 Sub-Variations', 'Draggable', 'Minimize/close', 'Clean canvas'],
    icon: Move,
    preview: 'bg-gradient-to-br from-emerald-600 to-teal-800',
    hasSubVariations: true,
    link: '/layouts/floating',
  },
  {
    id: 'wide-properties',
    name: 'Wide Properties',
    description: 'Expanded right panel with tabbed sections for detailed node configuration and AI settings.',
    features: ['Tabbed properties', 'AI config', 'Validation', 'Narrow layers'],
    icon: PanelRight,
    preview: 'bg-gradient-to-br from-rose-600 to-pink-800',
  },
]

export function FigmaPicker() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-muted/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/layouts" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold">Figma-Style Layouts</h1>
                <p className="text-sm text-muted-foreground">5 variations of the Figma-inspired layout</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Theme:</span>
              <ThemeColorBar />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <Badge variant="secondary" className="mb-4">Figma-Inspired</Badge>
            <h2 className="text-2xl font-bold mb-3">Choose a Layout Variation</h2>
            <p className="text-muted-foreground">
              Each variation offers a different approach to organizing the workflow editor.
              All support the 7 color themes.
            </p>
          </div>

          <div className="grid gap-4">
            {layoutVariations.map((layout) => (
              <Link key={layout.id} to={layout.link || `/layouts/figma/${layout.id}`}>
                <Card className="group hover:border-primary/50 hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden">
                  <div className="flex">
                    {/* Preview */}
                    <div className={`w-40 ${layout.preview} flex items-center justify-center`}>
                      <layout.icon className="h-10 w-10 text-white/90" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{layout.name}</CardTitle>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                        <CardDescription className="text-sm">{layout.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex flex-wrap gap-1.5">
                          {layout.features.map((feature) => (
                            <Badge key={feature} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Color Theme Preview */}
          <div className="mt-10 p-6 bg-muted/50 rounded-lg">
            <h3 className="font-semibold mb-3">7 Color Themes Available</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Click the color dots above to preview any layout with different themes:
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-600" />
                <span className="text-sm">Slate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-amber-500" />
                <span className="text-sm">Amber</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-indigo-500" />
                <span className="text-sm">Indigo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-500" />
                <span className="text-sm">Emerald</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-zinc-500" />
                <span className="text-sm">Zinc</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-cyan-500" />
                <span className="text-sm">Cyan</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-rose-500" />
                <span className="text-sm">Rose</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
