import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronRight,
  ChevronDown,
  ChevronUp,
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
  Settings,
  Layers,
  Palette,
  Link2,
  GripVertical,
  Move,
  PenTool,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ThemeColorBar } from '../shared/ThemeSwitcherDropdown'
import { mockWorkflows } from '@/mock-data/workflows'

interface StackedPanel {
  id: string
  title: string
  icon: React.ElementType
  expanded: boolean
}

export function FloatingStackedCards() {
  const [zoom, setZoom] = useState(100)
  const [activeTool, setActiveTool] = useState('select')
  const [panels, setPanels] = useState<StackedPanel[]>([
    { id: 'layers', title: 'Layers', icon: Layers, expanded: true },
    { id: 'properties', title: 'Properties', icon: Settings, expanded: true },
    { id: 'style', title: 'Style', icon: Palette, expanded: false },
    { id: 'connections', title: 'Connections', icon: Link2, expanded: false },
  ])
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

  const togglePanel = (panelId: string) => {
    setPanels(panels.map(p =>
      p.id === panelId ? { ...p, expanded: !p.expanded } : p
    ))
  }

  return (
    <div className="h-screen flex flex-col bg-muted/40">
      {/* Minimal Top Bar */}
      <header className="h-10 flex items-center justify-between px-3 bg-background border-b">
        <div className="flex items-center gap-3">
          <Link to="/layouts/floating" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Separator orientation="vertical" className="h-5" />
          <span className="text-sm font-medium">Stacked Cards</span>
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{selectedWorkflow.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeColorBar />
          <Separator orientation="vertical" className="h-5" />
          <Button variant="ghost" size="sm" className="h-7">
            <Play className="h-3.5 w-3.5 mr-1" />
            Run
          </Button>
          <Button variant="ghost" size="sm" className="h-7">
            <Share2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Stacked Panel Column */}
        <div className="absolute right-4 top-4 bottom-20 z-20 w-64 flex flex-col gap-2 overflow-auto">
          {panels.map((panel) => (
            <div
              key={panel.id}
              className={cn(
                'bg-background rounded-xl border shadow-lg overflow-hidden transition-all duration-200',
                panel.expanded ? 'flex-shrink-0' : 'flex-shrink-0'
              )}
            >
              {/* Panel Header */}
              <button
                onClick={() => togglePanel(panel.id)}
                className="w-full h-10 flex items-center justify-between px-3 bg-gradient-to-r from-primary/5 to-transparent border-b hover:bg-primary/10 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <GripVertical className="h-3 w-3 text-muted-foreground cursor-move" />
                  <panel.icon className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{panel.title}</span>
                </div>
                {panel.expanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>

              {/* Panel Content */}
              {panel.expanded && (
                <div className="p-3">
                  {panel.id === 'layers' && (
                    <div className="space-y-1 text-xs">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary font-medium flex items-center justify-between">
                        <span>Case Intake</span>
                        <Badge variant="secondary" className="text-[10px] h-4">input</Badge>
                      </div>
                      <div className="p-2 rounded-lg hover:bg-muted cursor-pointer flex items-center justify-between">
                        <span>Extract Facts</span>
                        <Badge variant="secondary" className="text-[10px] h-4">ai</Badge>
                      </div>
                      <div className="p-2 rounded-lg hover:bg-muted cursor-pointer flex items-center justify-between">
                        <span>Legal Analysis</span>
                        <Badge variant="secondary" className="text-[10px] h-4">ai</Badge>
                      </div>
                      <div className="p-2 rounded-lg hover:bg-muted cursor-pointer flex items-center justify-between">
                        <span>Generate Report</span>
                        <Badge variant="secondary" className="text-[10px] h-4">output</Badge>
                      </div>
                    </div>
                  )}

                  {panel.id === 'properties' && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] text-muted-foreground uppercase">Selected Node</label>
                        <div className="text-sm font-medium mt-1">Case Intake</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-muted-foreground">X</label>
                          <Input className="h-7 text-xs mt-1" value="50" readOnly />
                        </div>
                        <div>
                          <label className="text-[10px] text-muted-foreground">Y</label>
                          <Input className="h-7 text-xs mt-1" value="100" readOnly />
                        </div>
                      </div>
                    </div>
                  )}

                  {panel.id === 'style' && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-primary" />
                        <span className="text-xs">Primary Color</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded border-2 border-border bg-background" />
                        <span className="text-xs">Border Style</span>
                      </div>
                    </div>
                  )}

                  {panel.id === 'connections' && (
                    <div className="space-y-2 text-xs">
                      <div className="p-2 bg-muted rounded-lg">
                        <div className="text-muted-foreground">Input from:</div>
                        <div className="font-medium">None (Start node)</div>
                      </div>
                      <div className="p-2 bg-muted rounded-lg">
                        <div className="text-muted-foreground">Output to:</div>
                        <div className="font-medium">Extract Facts</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Floating Toolbar */}
        <div className="absolute top-4 left-4 flex flex-col gap-1 bg-background rounded-xl shadow-xl border p-1 z-20">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant="ghost"
              size="icon"
              className={cn('h-9 w-9 rounded-lg', activeTool === tool.id && 'bg-primary text-primary-foreground')}
              onClick={() => setActiveTool(tool.id)}
            >
              <tool.icon className="h-4 w-4" />
            </Button>
          ))}
          <Separator className="my-1" />
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        {/* Floating Zoom Controls */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-background rounded-xl shadow-xl border p-1 z-20">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.max(25, zoom - 25))}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm w-14 text-center font-medium">{zoom}%</span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.min(200, zoom + 25))}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        {/* Canvas */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `scale(${zoom / 100})` }}>
          <div className="relative w-[700px] h-[450px]">
            {/* Grid */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />

            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" className="fill-primary/50" />
                </marker>
              </defs>
              <path d="M 140 120 C 200 120, 200 160, 260 160" stroke="currentColor" strokeWidth="2" fill="none" className="text-primary/30" markerEnd="url(#arrow)" />
              <path d="M 380 160 L 460 160" stroke="currentColor" strokeWidth="2" fill="none" className="text-primary/30" markerEnd="url(#arrow)" />
              <path d="M 580 160 L 660 160" stroke="currentColor" strokeWidth="2" fill="none" className="text-primary/30" markerEnd="url(#arrow)" />
            </svg>

            {/* Nodes */}
            <div className="absolute left-4 top-20 w-32 bg-background rounded-xl border-2 border-primary shadow-xl p-3 hover:shadow-2xl transition-shadow cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center mb-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="text-xs font-semibold">Case Intake</div>
              <div className="text-[10px] text-muted-foreground">Input Node</div>
            </div>

            <div className="absolute left-44 top-28 w-32 bg-background rounded-xl border shadow-lg p-3 hover:shadow-xl transition-shadow cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center mb-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
              </div>
              <div className="text-xs font-semibold">Extract Facts</div>
              <div className="text-[10px] text-muted-foreground">AI Processing</div>
            </div>

            <div className="absolute left-[340px] top-28 w-32 bg-background rounded-xl border shadow-lg p-3 hover:shadow-xl transition-shadow cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center mb-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
              </div>
              <div className="text-xs font-semibold">Legal Analysis</div>
              <div className="text-[10px] text-muted-foreground">AI Processing</div>
            </div>

            <div className="absolute right-4 top-28 w-32 bg-background rounded-xl border shadow-lg p-3 hover:shadow-xl transition-shadow cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center mb-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
              </div>
              <div className="text-xs font-semibold">Generate Report</div>
              <div className="text-[10px] text-muted-foreground">Output Node</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
