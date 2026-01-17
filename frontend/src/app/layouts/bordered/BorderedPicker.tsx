import { Link } from 'react-router-dom'
import { ArrowRight, ArrowLeft, PanelLeft, Zap, Sparkles, Minus, Palette } from 'lucide-react'
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
    id: 'classic',
    name: 'Classic Bordered',
    description: 'Original bordered glass with grid toggle and clean arrow connections between nodes.',
    features: ['Grid toggle', 'Arrow markers', 'Accent borders', 'Collapsible panels'],
    icon: PanelLeft,
    preview: 'bg-primary/15 border-l-4 border-l-primary',
  },
  {
    id: 'animated',
    name: 'Animated Connections',
    description: 'Flowing animated arrows with pulsing dots that show data flow direction.',
    features: ['Animated arrows', 'Flow dots', 'Pulse effects', 'Grid toggle'],
    icon: Zap,
    preview: 'bg-primary/15 border-l-4 border-l-blue-500',
  },
  {
    id: 'neon',
    name: 'Neon Borders',
    description: 'Glowing neon effect borders with shadow halos on panels and connections.',
    features: ['Glow effects', 'Neon shadows', 'Color halos', 'Dark theme optimized'],
    icon: Sparkles,
    preview: 'bg-primary/15 border-l-4 border-l-cyan-400',
  },
  {
    id: 'minimal',
    name: 'Minimal Lines',
    description: 'Ultra-thin borders and clean single-pixel connection lines. Maximum clarity.',
    features: ['Thin borders', 'Clean lines', 'Compact UI', 'Dot grid'],
    icon: Minus,
    preview: 'bg-muted/30 border-l-2 border-l-primary',
  },
  {
    id: 'gradient-paths',
    name: 'Gradient Paths',
    description: 'Colorful gradient connections that flow between nodes with color-coded stages.',
    features: ['Gradient arrows', 'Color coding', 'Connection dots', 'Visual flow'],
    icon: Palette,
    preview: 'bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20',
  },
]

export function BorderedPicker() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-muted/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/layouts/hybrid" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold">Bordered Glass Layouts</h1>
                <p className="text-sm text-muted-foreground">5 variations with grid toggle & connection arrows</p>
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
            <Badge variant="secondary" className="mb-4">Bordered Glass</Badge>
            <h2 className="text-2xl font-bold mb-3">Choose a Connection Style</h2>
            <p className="text-muted-foreground">
              All variations feature grid toggle and floating connection arrows between workflow nodes.
              Each offers a unique visual style across all 7 color themes.
            </p>
          </div>

          <div className="grid gap-4">
            {layoutVariations.map((layout) => (
              <Link key={layout.id} to={`/layouts/bordered/${layout.id}`}>
                <Card className="group hover:border-primary/50 hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden">
                  <div className="flex">
                    {/* Preview */}
                    <div className={`w-40 ${layout.preview} flex items-center justify-center`}>
                      <layout.icon className="h-10 w-10 text-primary/80" />
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

          {/* Features Info */}
          <div className="mt-10 p-6 bg-muted/50 rounded-lg">
            <h3 className="font-semibold mb-3">Common Features</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span><strong>Grid Toggle</strong> - Show/hide canvas grid for alignment</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span><strong>Arrow Connections</strong> - Visual flow between nodes</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span><strong>7 Themes</strong> - All color themes supported</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span><strong>Collapsible Panels</strong> - Save screen space</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
