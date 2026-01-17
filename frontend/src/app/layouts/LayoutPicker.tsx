import { Link } from 'react-router-dom'
import { ArrowRight, Layers, Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ThemeColorBar } from './shared/ThemeSwitcherDropdown'

interface LayoutOption {
  id: string
  name: string
  inspiration: string
  description: string
  features: string[]
  gradient: string
  hasVariations?: boolean
}

const layoutOptions: LayoutOption[] = [
  {
    id: 'linear',
    name: 'Linear Style',
    inspiration: 'Linear.app',
    description: 'Minimal sidebar that expands on hover, spacious content area, clean aesthetics.',
    features: ['Compact navigation', 'Hover-expand sidebar', 'Full-width content', 'Keyboard-first'],
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    id: 'notion',
    name: 'Notion Style',
    inspiration: 'Notion.so',
    description: 'Wide sidebar with nested tree navigation, document-centric content layout.',
    features: ['Tree navigation', 'Collapsible sections', 'Document layout', 'Properties table'],
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 'figma',
    name: 'Figma Style',
    inspiration: 'Figma',
    description: 'Top toolbar with tools, left layers panel, center canvas, right properties. 5 layout variations available.',
    features: ['5 Variations', 'Tool palette', 'Layers panel', 'Canvas zoom'],
    gradient: 'from-pink-500 to-rose-600',
    hasVariations: true,
  },
  {
    id: 'vscode',
    name: 'VS Code Style',
    inspiration: 'VS Code',
    description: 'Activity bar, sidebar explorer, tabbed editor, bottom panel, status bar.',
    features: ['Activity bar', 'File explorer', 'Editor tabs', 'Problems panel'],
    gradient: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'retool',
    name: 'Retool Style',
    inspiration: 'Retool',
    description: 'Component palette, visual canvas builder, component tree, properties panel.',
    features: ['Component library', 'Visual builder', 'Property editor', 'Real-time preview'],
    gradient: 'from-emerald-500 to-teal-600',
  },
]

export function LayoutPicker() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-muted/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Layers className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">JurisAI Studio</h1>
                <p className="text-sm text-muted-foreground">Layout Exploration</p>
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
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Choose a Layout Style</h2>
            <p className="text-lg text-muted-foreground">
              Explore different layout approaches inspired by successful products.
              Each layout supports all 7 color themes.
            </p>
          </div>

          <div className="grid gap-6">
            {layoutOptions.map((layout) => (
              <Link key={layout.id} to={`/layouts/${layout.id}`}>
                <Card className="group hover:border-primary/50 hover:shadow-lg transition-all duration-200 cursor-pointer">
                  <div className="flex">
                    {/* Preview Gradient */}
                    <div
                      className={`w-48 rounded-l-lg bg-gradient-to-br ${layout.gradient} flex items-center justify-center`}
                    >
                      <div className="text-white/90 text-sm font-medium px-4 py-2 bg-black/20 rounded">
                        Preview
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CardTitle className="text-lg">{layout.name}</CardTitle>
                            <Badge variant="outline" className="text-xs">
                              {layout.inspiration}
                            </Badge>
                            {layout.hasVariations && (
                              <Badge className="text-xs bg-primary">
                                <Sparkles className="h-3 w-3 mr-1" />
                                5 Variations
                              </Badge>
                            )}
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                        <CardDescription>{layout.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {layout.features.map((feature) => (
                            <Badge key={feature} variant="secondary" className="text-xs">
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

          {/* Instructions */}
          <div className="mt-12 p-6 bg-muted/50 rounded-lg">
            <h3 className="font-semibold mb-2">How to evaluate</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>1. Click on a layout to view the full prototype</li>
              <li>2. Use the theme switcher (palette icon) to try different color schemes</li>
              <li>3. Consider which layout best fits the workflow editor use case</li>
              <li>4. Note which features feel most intuitive for managing workflows</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
