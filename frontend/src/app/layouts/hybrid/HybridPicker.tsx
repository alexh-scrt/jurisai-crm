import { Link } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Snowflake, Droplets, Square, PanelLeft, Wind } from 'lucide-react'
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
    id: 'frosted-docks',
    name: 'Frosted Docks',
    description: 'Frosted glass panels with docking behavior. Panels snap to edges with visual indicators.',
    features: ['Backdrop blur', 'Dock to edges', 'Rounded corners', 'Soft shadows'],
    icon: Snowflake,
    preview: 'bg-primary/20',
  },
  {
    id: 'clean-glass',
    name: 'Clean Glass',
    description: 'Minimal glass effect with subtle shadows. Focus on clean lines and readability.',
    features: ['Light blur', 'Minimal borders', 'Clean typography', 'Subtle depth'],
    icon: Droplets,
    preview: 'bg-primary/15',
  },
  {
    id: 'matte-islands',
    name: 'Matte Islands',
    description: 'Soft matte finish with no shine. Multiple collapsible island panels.',
    features: ['No gloss', 'Card-based', 'Collapsible', 'Soft edges'],
    icon: Square,
    preview: 'bg-primary/10',
  },
  {
    id: 'bordered-glass',
    name: 'Bordered Glass',
    description: 'Glass panels with strong accent borders. Visual hierarchy through color accents.',
    features: ['Accent borders', 'Color coding', 'Semi-transparent', 'Bold accents'],
    icon: PanelLeft,
    preview: 'bg-primary/25',
  },
  {
    id: 'subtle-blur',
    name: 'Subtle Blur',
    description: 'Light blur with mostly solid panels. Emphasis on content clarity over effect.',
    features: ['Minimal blur', 'High contrast', 'Readable', 'Professional'],
    icon: Wind,
    preview: 'bg-primary/8',
  },
]

export function HybridPicker() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-muted/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/layouts/floating" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold">Hybrid Glass Layouts</h1>
                <p className="text-sm text-muted-foreground">Docked Islands + Glassmorphism blend</p>
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
            <Badge variant="secondary" className="mb-4">Hybrid Style</Badge>
            <h2 className="text-2xl font-bold mb-3">Choose a Hybrid Variation</h2>
            <p className="text-muted-foreground">
              Combinations of docked island functionality with glass aesthetics.
              No gradients - clean, professional appearance across all 7 themes.
            </p>
          </div>

          <div className="grid gap-4">
            {layoutVariations.map((layout) => (
              <Link key={layout.id} to={`/layouts/hybrid/${layout.id}`}>
                <Card className="group hover:border-primary/50 hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden">
                  <div className="flex">
                    {/* Preview */}
                    <div className={`w-40 ${layout.preview} flex items-center justify-center border-r`}>
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

          {/* Bordered Glass Link */}
          <Link to="/layouts/bordered">
            <Card className="mt-6 group hover:border-primary hover:shadow-lg transition-all duration-200 cursor-pointer bg-primary/5 border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-base">Bordered Glass Variations</CardTitle>
                    <Badge className="bg-primary">5 New</Badge>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <CardDescription className="text-sm">
                  5 variations of bordered glass with grid toggle and connection arrows. Animated paths, neon glow, minimal lines, and gradient connections.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {/* Info Section */}
          <div className="mt-10 p-6 bg-muted/50 rounded-lg">
            <h3 className="font-semibold mb-3">Design Principles</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span><strong>No gradients</strong> - Clean, solid color foundations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span><strong>Docking behavior</strong> - Panels snap to edges or float freely</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span><strong>Glass effects</strong> - Subtle blur and transparency for depth</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span><strong>Theme aware</strong> - All 7 color themes supported</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
