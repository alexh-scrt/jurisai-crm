import { useState } from 'react'
import { Search, Sparkles, ArrowRight, ArrowLeft, Code } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { mockComponents, componentCategories, type ComponentDefinition } from '@/mock-data/components'

const kindColors: Record<string, string> = {
  page: 'bg-blue-100 text-blue-800 border-blue-200',
  widget: 'bg-purple-100 text-purple-800 border-purple-200',
  node: 'bg-green-100 text-green-800 border-green-200',
  gate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  automation: 'bg-gray-100 text-gray-800 border-gray-200',
  connector: 'bg-orange-100 text-orange-800 border-orange-200',
}

export function ComponentLibrary() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedComponent, setSelectedComponent] = useState<ComponentDefinition | null>(null)

  const filteredComponents = mockComponents.filter((component) => {
    const matchesSearch =
      component.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      selectedCategory === 'all' || component.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const groupedComponents = componentCategories.map((cat) => ({
    ...cat,
    components: filteredComponents.filter((c) => c.category === cat.id),
    count: mockComponents.filter((c) => c.category === cat.id).length,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Component Library</h1>
        <p className="text-muted-foreground">
          Browse and explore available components for your workflows
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{filteredComponents.length} components</Badge>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList>
          <TabsTrigger value="all">
            All ({mockComponents.length})
          </TabsTrigger>
          {componentCategories.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id}>
              {cat.name.split(' / ')[0]} ({groupedComponents.find((g) => g.id === cat.id)?.count || 0})
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          {selectedCategory === 'all' ? (
            // Show all categories
            <div className="space-y-8">
              {groupedComponents.map(
                (category) =>
                  category.components.length > 0 && (
                    <div key={category.id}>
                      <h3 className="text-lg font-semibold mb-4">{category.name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {category.components.map((component) => (
                          <ComponentCard
                            key={component.id}
                            component={component}
                            onClick={() => setSelectedComponent(component)}
                          />
                        ))}
                      </div>
                    </div>
                  )
              )}
            </div>
          ) : (
            // Show filtered category
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredComponents.map((component) => (
                <ComponentCard
                  key={component.id}
                  component={component}
                  onClick={() => setSelectedComponent(component)}
                />
              ))}
            </div>
          )}

          {filteredComponents.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No components found matching your criteria.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Component Detail Sheet */}
      <Sheet open={!!selectedComponent} onOpenChange={() => setSelectedComponent(null)}>
        <SheetContent className="w-[500px] sm:max-w-[500px]">
          {selectedComponent && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-2">
                  {selectedComponent.hasAI && (
                    <Sparkles className="h-5 w-5 text-primary" />
                  )}
                  <SheetTitle>{selectedComponent.displayName}</SheetTitle>
                </div>
                <SheetDescription>{selectedComponent.description}</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className={kindColors[selectedComponent.kind]}>
                    {selectedComponent.kind}
                  </Badge>
                  <Badge variant="secondary">v{selectedComponent.version}</Badge>
                  {selectedComponent.hasAI && (
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      AI-powered
                    </Badge>
                  )}
                </div>

                <Separator />

                {/* Technical Details */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Component ID
                  </h4>
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {selectedComponent.name}@{selectedComponent.version}
                  </code>
                </div>

                {/* Inputs */}
                {selectedComponent.inputs.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-green-500" />
                      Inputs
                    </h4>
                    <div className="space-y-2">
                      {selectedComponent.inputs.map((input) => (
                        <div
                          key={input.name}
                          className="flex items-center justify-between p-2 bg-muted rounded"
                        >
                          <div>
                            <span className="font-medium text-sm">{input.name}</span>
                            {input.required && (
                              <span className="text-destructive ml-1">*</span>
                            )}
                          </div>
                          <code className="text-xs text-muted-foreground">{input.type}</code>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Outputs */}
                {selectedComponent.outputs.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <ArrowLeft className="h-4 w-4 text-blue-500" />
                      Outputs
                    </h4>
                    <div className="space-y-2">
                      {selectedComponent.outputs.map((output) => (
                        <div
                          key={output.name}
                          className="flex items-center justify-between p-2 bg-muted rounded"
                        >
                          <span className="font-medium text-sm">{output.name}</span>
                          <code className="text-xs text-muted-foreground">{output.type}</code>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Toggles */}
                {selectedComponent.aiToggles && selectedComponent.aiToggles.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      AI Features
                    </h4>
                    <div className="space-y-2">
                      {selectedComponent.aiToggles.map((toggle) => (
                        <Badge key={toggle} variant="outline">
                          {toggle}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Actions */}
                <div className="flex gap-2">
                  <Button className="flex-1">Add to Workflow</Button>
                  <Button variant="outline">View Documentation</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function ComponentCard({
  component,
  onClick,
}: {
  component: ComponentDefinition
  onClick: () => void
}) {
  return (
    <Card
      className="cursor-pointer hover:border-primary/50 transition-colors"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {component.hasAI && <Sparkles className="h-4 w-4 text-primary" />}
            <CardTitle className="text-base">{component.displayName}</CardTitle>
          </div>
          <Badge variant="outline" className={kindColors[component.kind]}>
            {component.kind}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">{component.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {component.inputs.length} input{component.inputs.length !== 1 ? 's' : ''} •{' '}
            {component.outputs.length} output{component.outputs.length !== 1 ? 's' : ''}
          </span>
          <span>v{component.version}</span>
        </div>
      </CardContent>
    </Card>
  )
}
