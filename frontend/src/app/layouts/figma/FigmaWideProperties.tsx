import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronRight,
  Layers,
  Square,
  Circle,
  Type,
  MousePointer2,
  Hand,
  ZoomIn,
  ZoomOut,
  Undo,
  Redo,
  Play,
  Share2,
  ArrowLeft,
  Move,
  PenTool,
  Sliders,
  Palette,
  Link2,
  Sparkles,
  FileText,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { ThemeColorBar } from '../shared/ThemeSwitcherDropdown'
import { mockWorkflows } from '@/mock-data/workflows'

export function FigmaWideProperties() {
  const [zoom, setZoom] = useState(100)
  const [activeTool, setActiveTool] = useState('select')
  const [selectedNode, setSelectedNode] = useState('intake')
  const selectedWorkflow = mockWorkflows[0]

  const tools = [
    { id: 'select', icon: MousePointer2 },
    { id: 'hand', icon: Hand },
    { id: 'move', icon: Move },
    { id: 'pen', icon: PenTool },
    { id: 'rect', icon: Square },
    { id: 'ellipse', icon: Circle },
    { id: 'text', icon: Type },
  ]

  const nodes = [
    { id: 'intake', name: 'Case Intake', type: 'CaseIntakeForm', category: 'Input' },
    { id: 'upload', name: 'Document Upload', type: 'FileUpload', category: 'Input' },
    { id: 'extract', name: 'Extract Facts', type: 'ExtractFactsTimeline', category: 'AI' },
    { id: 'issues', name: 'Spot Issues', type: 'SpotIssuesIRAC', category: 'AI' },
    { id: 'analysis', name: 'Legal Analysis', type: 'LegalAnalysis', category: 'AI' },
    { id: 'report', name: 'Generate Report', type: 'ReportGenerator', category: 'Output' },
  ]

  const selectedNodeData = nodes.find(n => n.id === selectedNode)

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <header className="h-11 flex items-center justify-between px-3 border-b bg-muted/30">
        <div className="flex items-center gap-3">
          <Link to="/layouts/figma" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Separator orientation="vertical" className="h-5" />
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-[10px]">J</span>
            </div>
            <span className="text-sm font-medium">Wide Properties</span>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{selectedWorkflow.name}</span>
          </div>
        </div>

        {/* Center Tools */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant="ghost"
              size="icon"
              className={cn('h-7 w-7', activeTool === tool.id && 'bg-background shadow-sm')}
              onClick={() => setActiveTool(tool.id)}
            >
              <tool.icon className="h-3.5 w-3.5" />
            </Button>
          ))}
          <Separator orientation="vertical" className="h-5 mx-1" />
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Undo className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Redo className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <ThemeColorBar />
          <Separator orientation="vertical" className="h-5" />
          <Button variant="ghost" size="sm" className="h-7">
            <Play className="h-3.5 w-3.5 mr-1" />
            Run
          </Button>
          <Button variant="ghost" size="sm" className="h-7">
            <Share2 className="h-3.5 w-3.5" />
          </Button>
          <Badge variant="outline" className="border-green-400 text-green-700 text-xs">
            Saved
          </Badge>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Narrow Layers Panel */}
        <aside className="w-48 border-r bg-muted/20 flex flex-col">
          <div className="p-2 border-b">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Layers</span>
          </div>
          <div className="flex-1 overflow-auto p-1">
            {nodes.map((node) => (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node.id)}
                className={cn(
                  'w-full flex items-center gap-2 py-1.5 px-2 rounded text-xs transition-colors',
                  selectedNode === node.id
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-muted text-foreground/80'
                )}
              >
                <Layers className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{node.name}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Canvas */}
        <main className="flex-1 bg-muted/40 relative overflow-hidden">
          {/* Zoom Controls */}
          <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-background rounded-lg shadow-md border p-1 z-10">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom(Math.max(25, zoom - 25))}>
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs w-10 text-center">{zoom}%</span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom(Math.min(200, zoom + 25))}>
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Canvas Content */}
          <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `scale(${zoom / 100})` }}>
            <div className="relative w-[600px] h-[400px]">
              {/* Grid */}
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'radial-gradient(circle, #64748b 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }} />

              {/* Nodes */}
              <div
                onClick={() => setSelectedNode('intake')}
                className={cn(
                  'absolute left-4 top-16 w-28 bg-background rounded-lg border-2 shadow-lg p-2.5 cursor-pointer transition-all',
                  selectedNode === 'intake' ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
                )}
              >
                <div className="text-xs font-medium">Case Intake</div>
                <div className="text-[10px] text-muted-foreground">Input</div>
              </div>

              <div
                onClick={() => setSelectedNode('extract')}
                className={cn(
                  'absolute left-40 top-24 w-28 bg-background rounded-lg border-2 shadow-md p-2.5 cursor-pointer transition-all',
                  selectedNode === 'extract' ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
                )}
              >
                <div className="text-xs font-medium">Extract Facts</div>
                <div className="text-[10px] text-muted-foreground">AI</div>
              </div>

              <div
                onClick={() => setSelectedNode('analysis')}
                className={cn(
                  'absolute left-[300px] top-24 w-28 bg-background rounded-lg border-2 shadow-md p-2.5 cursor-pointer transition-all',
                  selectedNode === 'analysis' ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
                )}
              >
                <div className="text-xs font-medium">Legal Analysis</div>
                <div className="text-[10px] text-muted-foreground">AI</div>
              </div>

              <div
                onClick={() => setSelectedNode('report')}
                className={cn(
                  'absolute right-4 top-24 w-28 bg-background rounded-lg border-2 shadow-md p-2.5 cursor-pointer transition-all',
                  selectedNode === 'report' ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
                )}
              >
                <div className="text-xs font-medium">Generate Report</div>
                <div className="text-[10px] text-muted-foreground">Output</div>
              </div>
            </div>
          </div>
        </main>

        {/* Wide Properties Panel */}
        <aside className="w-80 border-l bg-background flex flex-col">
          <Tabs defaultValue="config" className="flex-1 flex flex-col">
            <div className="border-b px-1">
              <TabsList className="h-10 w-full justify-start bg-transparent">
                <TabsTrigger value="config" className="text-xs data-[state=active]:bg-muted">
                  <Sliders className="h-3.5 w-3.5 mr-1" />
                  Config
                </TabsTrigger>
                <TabsTrigger value="style" className="text-xs data-[state=active]:bg-muted">
                  <Palette className="h-3.5 w-3.5 mr-1" />
                  Style
                </TabsTrigger>
                <TabsTrigger value="connections" className="text-xs data-[state=active]:bg-muted">
                  <Link2 className="h-3.5 w-3.5 mr-1" />
                  Links
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="config" className="flex-1 m-0 overflow-auto">
              <div className="p-4 space-y-5">
                {/* Node Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{selectedNodeData?.name}</h3>
                    <p className="text-xs text-muted-foreground">{selectedNodeData?.type}</p>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">{selectedNodeData?.category}</Badge>
                </div>

                <Separator />

                {/* Basic Settings */}
                <div className="space-y-3">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5" />
                    Basic Settings
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground">Display Name</label>
                      <Input className="h-8 text-sm mt-1" defaultValue={selectedNodeData?.name} />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Description</label>
                      <textarea
                        className="w-full mt-1 p-2 rounded-md border text-sm resize-none h-16"
                        placeholder="Add a description..."
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* AI Configuration (shown for AI nodes) */}
                {selectedNodeData?.category === 'AI' && (
                  <>
                    <div className="space-y-3">
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="h-3.5 w-3.5" />
                        AI Settings
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-muted-foreground">Model</label>
                          <Select defaultValue="gpt-4">
                            <SelectTrigger className="h-8 text-sm mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="gpt-4">GPT-4</SelectItem>
                              <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                              <SelectItem value="claude-3">Claude 3</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Temperature</label>
                          <Input className="h-8 text-sm mt-1" type="number" defaultValue="0.7" step="0.1" min="0" max="2" />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Max Tokens</label>
                          <Input className="h-8 text-sm mt-1" type="number" defaultValue="2000" />
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-xs">Require Approval</label>
                          <Switch />
                        </div>
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

                {/* Position */}
                <div className="space-y-3">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Position & Size</h4>
                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <label className="text-[10px] text-muted-foreground">X</label>
                      <Input className="h-7 text-xs mt-1" value="50" readOnly />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground">Y</label>
                      <Input className="h-7 text-xs mt-1" value="100" readOnly />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground">W</label>
                      <Input className="h-7 text-xs mt-1" value="112" readOnly />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground">H</label>
                      <Input className="h-7 text-xs mt-1" value="48" readOnly />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Validation */}
                <div className="space-y-3">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Validation
                  </h4>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-xs font-medium">Node configured correctly</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="style" className="flex-1 m-0 overflow-auto">
              <div className="p-4 space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground">Border Color</label>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-8 h-8 rounded border-2 border-primary bg-primary/10" />
                    <Input className="h-8 text-sm flex-1" value="#2563eb" readOnly />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Background</label>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-8 h-8 rounded border bg-background" />
                    <Input className="h-8 text-sm flex-1" value="#ffffff" readOnly />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Border Radius</label>
                  <Input className="h-8 text-sm mt-1" value="8px" readOnly />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Shadow</label>
                  <Select defaultValue="md">
                    <SelectTrigger className="h-8 text-sm mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="md">Medium</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="connections" className="flex-1 m-0 overflow-auto">
              <div className="p-4 space-y-4">
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-2">Inputs</h4>
                  <div className="space-y-2">
                    <div className="p-2 bg-muted rounded flex items-center justify-between">
                      <span className="text-xs">Document Upload</span>
                      <Badge variant="outline" className="text-[10px]">connected</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-2">Outputs</h4>
                  <div className="space-y-2">
                    <div className="p-2 bg-muted rounded flex items-center justify-between">
                      <span className="text-xs">Extract Facts</span>
                      <Badge variant="outline" className="text-[10px]">connected</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </aside>
      </div>
    </div>
  )
}
