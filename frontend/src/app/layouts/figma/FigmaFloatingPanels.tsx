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
  Settings,
  X,
  GripVertical,
  Move,
  PenTool,
  Minimize2,
  Maximize2,
  Component,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { ThemeColorBar } from '../shared/ThemeSwitcherDropdown'
import { mockWorkflows } from '@/mock-data/workflows'

interface FloatingPanelProps {
  title: string
  icon: React.ElementType
  children: React.ReactNode
  defaultPosition: { x: number; y: number }
  onClose: () => void
  minimized?: boolean
  onMinimize?: () => void
}

function FloatingPanel({ title, icon: Icon, children, onClose, minimized, onMinimize }: FloatingPanelProps) {
  return (
    <div className="bg-background rounded-xl border shadow-2xl overflow-hidden min-w-[200px]">
      <div className="h-8 flex items-center justify-between px-2 bg-muted/50 border-b cursor-move">
        <div className="flex items-center gap-2">
          <GripVertical className="h-3 w-3 text-muted-foreground" />
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="icon" className="h-5 w-5" onClick={onMinimize}>
            {minimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-5 w-5" onClick={onClose}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
      {!minimized && <div className="max-h-[300px] overflow-auto">{children}</div>}
    </div>
  )
}

export function FigmaFloatingPanels() {
  const [zoom, setZoom] = useState(100)
  const [activeTool, setActiveTool] = useState('select')
  const [panels, setPanels] = useState({
    layers: true,
    properties: true,
    components: false,
  })
  const [minimized, setMinimized] = useState({
    layers: false,
    properties: false,
    components: false,
  })
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

  return (
    <div className="h-screen flex flex-col bg-muted/40">
      {/* Minimal Top Bar */}
      <header className="h-10 flex items-center justify-between px-3 bg-background border-b">
        <div className="flex items-center gap-3">
          <Link to="/layouts/figma" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Separator orientation="vertical" className="h-5" />
          <span className="text-sm font-medium">Floating Panels</span>
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{selectedWorkflow.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeColorBar />
          <Separator orientation="vertical" className="h-5" />
          {/* Panel Toggles */}
          <Button
            variant={panels.layers ? 'secondary' : 'ghost'}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setPanels(p => ({ ...p, layers: !p.layers }))}
          >
            <Layers className="h-3.5 w-3.5 mr-1" />
            Layers
          </Button>
          <Button
            variant={panels.properties ? 'secondary' : 'ghost'}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setPanels(p => ({ ...p, properties: !p.properties }))}
          >
            <Settings className="h-3.5 w-3.5 mr-1" />
            Props
          </Button>
          <Button
            variant={panels.components ? 'secondary' : 'ghost'}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setPanels(p => ({ ...p, components: !p.components }))}
          >
            <Component className="h-3.5 w-3.5 mr-1" />
            Nodes
          </Button>
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

      {/* Full Canvas with Floating Elements */}
      <div className="flex-1 relative overflow-hidden">
        {/* Floating Toolbar - Left Side */}
        <div className="absolute left-4 top-4 flex flex-col gap-1 bg-background rounded-xl shadow-lg border p-1 z-20">
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

        {/* Floating Layers Panel */}
        {panels.layers && (
          <div className="absolute left-20 top-4 z-20">
            <FloatingPanel
              title="Layers"
              icon={Layers}
              defaultPosition={{ x: 80, y: 16 }}
              onClose={() => setPanels(p => ({ ...p, layers: false }))}
              minimized={minimized.layers}
              onMinimize={() => setMinimized(m => ({ ...m, layers: !m.layers }))}
            >
              <div className="p-2 space-y-1 text-xs">
                <div className="p-2 rounded bg-primary/10 text-primary font-medium">Case Intake</div>
                <div className="p-2 rounded hover:bg-muted">Document Upload</div>
                <div className="p-2 rounded hover:bg-muted">Extract Facts</div>
                <div className="p-2 rounded hover:bg-muted">Spot Issues</div>
                <div className="p-2 rounded hover:bg-muted">Legal Analysis</div>
                <div className="p-2 rounded hover:bg-muted">Generate Report</div>
              </div>
            </FloatingPanel>
          </div>
        )}

        {/* Floating Properties Panel */}
        {panels.properties && (
          <div className="absolute right-4 top-4 z-20">
            <FloatingPanel
              title="Properties"
              icon={Settings}
              defaultPosition={{ x: 0, y: 16 }}
              onClose={() => setPanels(p => ({ ...p, properties: false }))}
              minimized={minimized.properties}
              onMinimize={() => setMinimized(m => ({ ...m, properties: !m.properties }))}
            >
              <div className="p-3 space-y-3 w-56">
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase">Selected</label>
                  <div className="text-sm font-medium">Case Intake</div>
                </div>
                <Separator />
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
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-muted-foreground">W</label>
                    <Input className="h-7 text-xs mt-1" value="140" readOnly />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground">H</label>
                    <Input className="h-7 text-xs mt-1" value="64" readOnly />
                  </div>
                </div>
              </div>
            </FloatingPanel>
          </div>
        )}

        {/* Floating Components Panel */}
        {panels.components && (
          <div className="absolute right-4 top-[200px] z-20">
            <FloatingPanel
              title="Node Library"
              icon={Component}
              defaultPosition={{ x: 0, y: 200 }}
              onClose={() => setPanels(p => ({ ...p, components: false }))}
              minimized={minimized.components}
              onMinimize={() => setMinimized(m => ({ ...m, components: !m.components }))}
            >
              <div className="p-2 w-48">
                <Input placeholder="Search nodes..." className="h-7 text-xs mb-2" />
                <div className="space-y-1 text-xs">
                  <div className="p-2 rounded border hover:border-primary hover:bg-primary/5 cursor-pointer">
                    <div className="font-medium">Case Intake</div>
                    <div className="text-muted-foreground text-[10px]">Input form</div>
                  </div>
                  <div className="p-2 rounded border hover:border-primary hover:bg-primary/5 cursor-pointer">
                    <div className="font-medium">Extract Facts</div>
                    <div className="text-muted-foreground text-[10px]">AI processing</div>
                  </div>
                  <div className="p-2 rounded border hover:border-primary hover:bg-primary/5 cursor-pointer">
                    <div className="font-medium">Approval Gate</div>
                    <div className="text-muted-foreground text-[10px]">Human review</div>
                  </div>
                </div>
              </div>
            </FloatingPanel>
          </div>
        )}

        {/* Floating Zoom Controls - Bottom Center */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-background rounded-xl shadow-lg border p-1 z-20">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.max(25, zoom - 25))}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm w-14 text-center font-medium">{zoom}%</span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.min(200, zoom + 25))}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        {/* Canvas Content */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `scale(${zoom / 100})` }}>
          <div className="relative w-[800px] h-[500px]">
            {/* Grid */}
            <div className="absolute inset-0 opacity-15" style={{
              backgroundImage: 'radial-gradient(circle, #64748b 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }} />

            {/* Nodes with glow effect */}
            <div className="absolute left-8 top-24 w-36 bg-background rounded-xl border-2 border-primary shadow-[0_0_20px_rgba(var(--primary),0.3)] p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Input</span>
              </div>
              <div className="text-sm font-semibold">Case Intake</div>
            </div>

            <div className="absolute left-8 top-52 w-36 bg-background rounded-xl border shadow-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Input</span>
              </div>
              <div className="text-sm font-semibold">Doc Upload</div>
            </div>

            <div className="absolute left-56 top-36 w-36 bg-background rounded-xl border shadow-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">AI</span>
              </div>
              <div className="text-sm font-semibold">Extract Facts</div>
            </div>

            <div className="absolute left-[400px] top-36 w-36 bg-background rounded-xl border shadow-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">AI</span>
              </div>
              <div className="text-sm font-semibold">Legal Analysis</div>
            </div>

            <div className="absolute right-8 top-36 w-36 bg-background rounded-xl border shadow-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Output</span>
              </div>
              <div className="text-sm font-semibold">Generate Report</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
