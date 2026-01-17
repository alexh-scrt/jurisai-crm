import { Link } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Dock, Layers, Command, Sparkles, PanelBottom } from 'lucide-react'
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
}

const layoutVariations: LayoutVariation[] = [
  {
    id: 'docked-islands',
    name: 'Docked Islands',
    description: 'Panels that magnetically dock to canvas edges with smooth animations and snap-to-grid behavior.',
    features: ['Edge docking', 'Snap to grid', 'Auto-arrange', 'Resize handles'],
    icon: Dock,
    preview: 'bg-gradient-to-br from-blue-600 to-indigo-800',
  },
  {
    id: 'stacked-cards',
    name: 'Stacked Cards',
    description: 'Vertically stacked panels on the side with collapsible sections and drag-to-reorder.',
    features: ['Vertical stack', 'Collapse/expand', 'Drag reorder', 'Compact mode'],
    icon: Layers,
    preview: 'bg-gradient-to-br from-violet-600 to-purple-800',
  },
  {
    id: 'command-palette',
    name: 'Command Palette',
    description: 'Ultra-minimal canvas with command bar (Cmd+K) for quick actions and contextual panels.',
    features: ['Command bar', 'Quick actions', 'Context panels', 'Keyboard-first'],
    icon: Command,
    preview: 'bg-gradient-to-br from-zinc-600 to-zinc-900',
  },
  {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    description: 'Frosted glass effect panels with blur backdrop, subtle borders, and depth layering.',
    features: ['Glass effect', 'Blur backdrop', 'Depth layers', 'Soft shadows'],
    icon: Sparkles,
    preview: 'bg-gradient-to-br from-cyan-500 to-teal-700',
  },
  {
    id: 'tabbed-drawer',
    name: 'Tabbed Drawer',
    description: 'Bottom sheet style drawers with tabs, swipe gestures, and peek mode for quick access.',
    features: ['Bottom drawer', 'Tab navigation', 'Peek mode', 'Swipe gestures'],
    icon: PanelBottom,
    preview: 'bg-gradient-to-br from-rose-600 to-pink-800',
  },
]

export function FloatingPicker() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-muted/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/layouts/figma" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold">Floating Panels Layouts</h1>
                <p className="text-sm text-muted-foreground">5 variations of the floating panels approach</p>
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
            <Badge variant="secondary" className="mb-4">Floating Panels</Badge>
            <h2 className="text-2xl font-bold mb-3">Choose a Panel Style</h2>
            <p className="text-muted-foreground">
              Each variation offers a unique approach to floating UI panels.
              All support the 7 color themes.
            </p>
          </div>

          <div className="grid gap-4">
            {layoutVariations.map((layout) => (
              <Link key={layout.id} to={`/layouts/floating/${layout.id}`}>
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

          {/* Hybrid Link */}
          <Link to="/layouts/hybrid">
            <Card className="mt-6 group hover:border-primary hover:shadow-lg transition-all duration-200 cursor-pointer bg-primary/5 border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-base">Hybrid Variations</CardTitle>
                    <Badge className="bg-primary">5 New</Badge>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <CardDescription className="text-sm">
                  Blend of Docked Islands + Glassmorphism. No gradients - clean, professional glass effects with docking behavior.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {/* Info */}
          <div className="mt-10 p-6 bg-muted/50 rounded-lg">
            <h3 className="font-semibold mb-3">Design Philosophy</h3>
            <p className="text-sm text-muted-foreground">
              Floating panels maximize canvas space while keeping tools accessible. Each variation
              explores different interaction patterns - from edge docking to command palettes to
              glassmorphic overlays. Test each to find what works best for your workflow editing needs.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
