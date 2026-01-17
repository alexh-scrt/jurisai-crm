import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronRight,
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
  GripVertical,
  Move,
  PenTool,
  Minimize2,
  Maximize2,
  Layers,
  Settings,
  Palette,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { ThemeColorBar } from '../shared/ThemeSwitcherDropdown'
import { mockWorkflows } from '@/mock-data/workflows'

interface Panel {
  id: string
  title: string
  icon: React.ElementType
  minimized: boolean
}

export function HybridMatteIslands() {
  const [zoom, setZoom] = useState(100)
  const [activeTool, setActiveTool] = useState('select')
  const [panels, setPanels] = useState<Panel[]>([
    { id: 'layers', title: 'Layers', icon: Layers, minimized: false },
    { id: 'properties', title: 'Properties', icon: Settings, minimized: false },
    { id: 'styles', title: 'Styles', icon: Palette, minimized: true },
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

  // Matte style - soft, no shine, subtle depth
  const mattePanel = "bg-card border border-border/60 shadow-sm"
  const matteHeader = "bg-muted/40"

  const toggleMinimize = (panelId: string) => {
    setPanels(panels.map(p =>
      p.id === panelId ? { ...p, minimized: !p.minimized } : p
    ))
  }

  return (
    <div className="h-screen flex flex-col bg-muted/50">
      {/* Top Bar - Matte */}
      <header className={cn("h-11 flex items-center justify-between px-4 border-b bg-card")}>
        <div className="flex items-center gap-3">
          <Link to="/layouts/hybrid" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Separator orientation="vertical" className="h-5" />
          <span className="text-sm font-medium">Matte Islands</span>
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{selectedWorkflow.name}</span>
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
        </div>
      </header>

      <div className="flex-1 relative overflow-hidden">
        {/* Left Island - Layers */}
        <div className="absolute left-4 top-4 z-20">
          <div className={cn(mattePanel, "rounded-xl overflow-hidden", panels[0].minimized ? 'w-12' : 'w-52')}>
            <div className={cn("h-10 flex items-center justify-between px-3", matteHeader)}>
              <div className="flex items-center gap-2">
                <GripVertical className="h-3 w-3 text-muted-foreground cursor-move" />
                <Layers className="h-4 w-4 text-primary" />
                {!panels[0].minimized && <span className="text-sm font-medium">{panels[0].title}</span>}
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleMinimize('layers')}>
                {panels[0].minimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
              </Button>
            </div>
            {!panels[0].minimized && (
              <div className="p-2 space-y-0.5">
                {['Case Intake', 'Document Upload', 'Extract Facts', 'Legal Analysis', 'Generate Report'].map((name, i) => (
                  <button
                    key={name}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors',
                      i === 0
                        ? 'bg-primary/10 text-primary font-medium border border-primary/20'
                        : 'hover:bg-muted text-foreground/80'
                    )}
                  >
                    <div className={cn(
                      'w-2 h-2 rounded-full',
                      i === 0 ? 'bg-green-500' : i < 3 ? 'bg-blue-500' : 'bg-purple-500'
                    )} />
                    <span>{name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Island - Properties */}
        <div className="absolute right-4 top-4 z-20">
          <div className={cn(mattePanel, "rounded-xl overflow-hidden", panels[1].minimized ? 'w-12' : 'w-60')}>
            <div className={cn("h-10 flex items-center justify-between px-3", matteHeader)}>
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-primary" />
                {!panels[1].minimized && <span className="text-sm font-medium">{panels[1].title}</span>}
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleMinimize('properties')}>
                {panels[1].minimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
              </Button>
            </div>
            {!panels[1].minimized && (
              <div className="p-3 space-y-3">
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase">Node</label>
                  <div className="text-sm font-medium mt-0.5">Case Intake</div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-muted-foreground">X</label>
                    <Input className="h-7 text-xs mt-1 bg-muted/50" value="50" readOnly />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground">Y</label>
                    <Input className="h-7 text-xs mt-1 bg-muted/50" value="100" readOnly />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-muted-foreground">W</label>
                    <Input className="h-7 text-xs mt-1 bg-muted/50" value="140" readOnly />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground">H</label>
                    <Input className="h-7 text-xs mt-1 bg-muted/50" value="64" readOnly />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Right Island - Styles (collapsed by default) */}
        <div className="absolute right-4 bottom-16 z-20">
          <div className={cn(mattePanel, "rounded-xl overflow-hidden", panels[2].minimized ? 'w-12' : 'w-48')}>
            <div className={cn("h-9 flex items-center justify-between px-3", matteHeader)}>
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-primary" />
                {!panels[2].minimized && <span className="text-xs font-medium">{panels[2].title}</span>}
              </div>
              <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => toggleMinimize('styles')}>
                {panels[2].minimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
              </Button>
            </div>
            {!panels[2].minimized && (
              <div className="p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded border-2 border-primary" />
                  <span className="text-xs">Primary</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-muted border" />
                  <span className="text-xs">Background</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Floating Toolbar - Matte */}
        <div className={cn("absolute top-4 left-1/2 -translate-x-1/2 rounded-xl p-1 z-20", mattePanel)}>
          <div className="flex items-center gap-0.5">
            {tools.map((tool) => (
              <Button
                key={tool.id}
                variant="ghost"
                size="icon"
                className={cn(
                  'h-9 w-9 rounded-lg transition-colors',
                  activeTool === tool.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                )}
                onClick={() => setActiveTool(tool.id)}
              >
                <tool.icon className="h-4 w-4" />
              </Button>
            ))}
            <Separator orientation="vertical" className="h-6 mx-1" />
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-muted">
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-muted">
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Floating Zoom Controls - Matte */}
        <div className={cn("absolute bottom-4 left-1/2 -translate-x-1/2 rounded-xl p-1 z-20", mattePanel)}>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted" onClick={() => setZoom(Math.max(25, zoom - 25))}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm w-12 text-center font-medium">{zoom}%</span>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted" onClick={() => setZoom(Math.min(200, zoom + 25))}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `scale(${zoom / 100})` }}>
          <div className="relative w-[800px] h-[500px]">
            {/* Dot Grid */}
            <div className="absolute inset-0 opacity-[0.06]" style={{
              backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }} />

            {/* Matte Nodes */}
            <div className={cn(
              "absolute left-8 top-24 w-36 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md",
              mattePanel,
              "border-2 border-primary"
            )}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-[10px] text-muted-foreground uppercase">Input</span>
              </div>
              <div className="text-sm font-semibold">Case Intake</div>
            </div>

            <div className={cn(
              "absolute left-56 top-36 w-36 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md",
              mattePanel
            )}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-[10px] text-muted-foreground uppercase">AI</span>
              </div>
              <div className="text-sm font-semibold">Extract Facts</div>
            </div>

            <div className={cn(
              "absolute left-[400px] top-36 w-36 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md",
              mattePanel
            )}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-[10px] text-muted-foreground uppercase">AI</span>
              </div>
              <div className="text-sm font-semibold">Legal Analysis</div>
            </div>

            <div className={cn(
              "absolute right-8 top-36 w-36 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md",
              mattePanel
            )}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span className="text-[10px] text-muted-foreground uppercase">Output</span>
              </div>
              <div className="text-sm font-semibold">Generate Report</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
