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
  Move,
  PenTool,
  Layers,
  Settings,
  ChevronLeft,
  Grid3X3,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { ThemeColorBar } from '../shared/ThemeSwitcherDropdown'
import { mockWorkflows } from '@/mock-data/workflows'

export function BorderedMinimal() {
  const [zoom, setZoom] = useState(100)
  const [activeTool, setActiveTool] = useState('select')
  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const [rightCollapsed, setRightCollapsed] = useState(false)
  const [showGrid, setShowGrid] = useState(true)
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

  // Minimal style - thin borders, clean lines
  const minimalPanel = "bg-background border border-border"

  return (
    <div className="h-screen flex flex-col bg-muted/10">
      {/* Top Bar - Minimal */}
      <header className="h-10 flex items-center justify-between px-4 bg-background border-b">
        <div className="flex items-center gap-3">
          <Link to="/layouts/bordered" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-medium">Minimal Lines</span>
          <span className="text-xs text-muted-foreground">/ {selectedWorkflow.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeColorBar />
          <Separator orientation="vertical" className="h-4" />
          <Button
            variant={showGrid ? "secondary" : "ghost"}
            size="sm"
            className="h-6 text-xs"
            onClick={() => setShowGrid(!showGrid)}
          >
            <Grid3X3 className="h-3 w-3 mr-1" />
            Grid
          </Button>
          <Button variant="ghost" size="sm" className="h-6 text-xs">
            <Play className="h-3 w-3 mr-1" />
            Run
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Share2 className="h-3 w-3" />
          </Button>
        </div>
      </header>

      <div className="flex-1 relative overflow-hidden">
        {/* Left Panel - Minimal */}
        <div className={cn(
          'absolute left-3 top-3 z-20 transition-all duration-200',
          leftCollapsed ? 'w-10' : 'w-48'
        )}>
          <div className={cn(minimalPanel, "rounded-lg overflow-hidden")}>
            <div className="h-8 flex items-center justify-between px-2 border-b bg-muted/30">
              <div className="flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-primary" />
                {!leftCollapsed && <span className="text-xs font-medium">Layers</span>}
              </div>
              <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setLeftCollapsed(!leftCollapsed)}>
                {leftCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
              </Button>
            </div>
            {!leftCollapsed && (
              <div className="p-1.5 space-y-0.5">
                {['Case Intake', 'Extract Facts', 'Legal Analysis', 'Generate Report'].map((name, i) => (
                  <button
                    key={name}
                    className={cn(
                      'w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors',
                      i === 0 ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground/70'
                    )}
                  >
                    <div className={cn(
                      'w-1.5 h-1.5 rounded-full',
                      i === 0 ? 'bg-green-500' : i < 3 ? 'bg-blue-500' : 'bg-purple-500'
                    )} />
                    <span>{name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Minimal */}
        <div className={cn(
          'absolute right-3 top-3 z-20 transition-all duration-200',
          rightCollapsed ? 'w-10' : 'w-52'
        )}>
          <div className={cn(minimalPanel, "rounded-lg overflow-hidden")}>
            <div className="h-8 flex items-center justify-between px-2 border-b bg-muted/30">
              <div className="flex items-center gap-1.5">
                {!rightCollapsed && <span className="text-xs font-medium">Properties</span>}
                <Settings className="h-3.5 w-3.5 text-primary" />
              </div>
              <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setRightCollapsed(!rightCollapsed)}>
                {rightCollapsed ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </Button>
            </div>
            {!rightCollapsed && (
              <div className="p-2 space-y-2">
                <div className="flex items-center gap-2 p-1.5 rounded bg-muted/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-xs font-medium">Case Intake</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <div>
                    <label className="text-[9px] text-muted-foreground uppercase">X</label>
                    <Input className="h-6 text-xs mt-0.5" value="50" readOnly />
                  </div>
                  <div>
                    <label className="text-[9px] text-muted-foreground uppercase">Y</label>
                    <Input className="h-6 text-xs mt-0.5" value="100" readOnly />
                  </div>
                  <div>
                    <label className="text-[9px] text-muted-foreground uppercase">W</label>
                    <Input className="h-6 text-xs mt-0.5" value="140" readOnly />
                  </div>
                  <div>
                    <label className="text-[9px] text-muted-foreground uppercase">H</label>
                    <Input className="h-6 text-xs mt-0.5" value="64" readOnly />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Toolbar - Minimal */}
        <div className={cn("absolute top-3 left-1/2 -translate-x-1/2 rounded-lg p-1 z-20", minimalPanel)}>
          <div className="flex items-center gap-0.5">
            {tools.map((tool) => (
              <Button
                key={tool.id}
                variant="ghost"
                size="icon"
                className={cn(
                  'h-7 w-7 rounded',
                  activeTool === tool.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                )}
                onClick={() => setActiveTool(tool.id)}
              >
                <tool.icon className="h-3.5 w-3.5" />
              </Button>
            ))}
            <Separator orientation="vertical" className="h-4 mx-0.5" />
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded hover:bg-muted">
              <Undo className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded hover:bg-muted">
              <Redo className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Zoom - Minimal */}
        <div className={cn("absolute bottom-3 left-1/2 -translate-x-1/2 rounded-lg px-2 py-1 z-20", minimalPanel)}>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded" onClick={() => setZoom(Math.max(25, zoom - 25))}>
              <ZoomOut className="h-3 w-3" />
            </Button>
            <span className="text-xs w-10 text-center font-medium tabular-nums">{zoom}%</span>
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded" onClick={() => setZoom(Math.min(200, zoom + 25))}>
              <ZoomIn className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `scale(${zoom / 100})` }}>
          <div className="relative w-[800px] h-[500px]">
            {/* Grid - Minimal dots */}
            {showGrid && (
              <div className="absolute inset-0 opacity-[0.15]" style={{
                backgroundImage: 'radial-gradient(circle, currentColor 0.5px, transparent 0.5px)',
                backgroundSize: '20px 20px'
              }} />
            )}

            {/* Clean Line Arrows */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <marker id="arrowhead-minimal" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" className="fill-border" />
                </marker>
              </defs>

              {/* Thin connection lines */}
              <path d="M 165 130 L 165 160 L 255 160" stroke="currentColor" strokeWidth="1" fill="none" className="text-border" markerEnd="url(#arrowhead-minimal)" />
              <path d="M 355 160 L 445 160" stroke="currentColor" strokeWidth="1" fill="none" className="text-border" markerEnd="url(#arrowhead-minimal)" />
              <path d="M 545 160 L 635 160" stroke="currentColor" strokeWidth="1" fill="none" className="text-border" markerEnd="url(#arrowhead-minimal)" />
            </svg>

            {/* Minimal Nodes */}
            <div className={cn(
              "absolute left-6 top-20 w-32 rounded-lg p-3 cursor-pointer transition-shadow hover:shadow-md",
              minimalPanel,
              "border-l-2 border-l-green-500"
            )}>
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-[9px] text-muted-foreground uppercase">Input</span>
              </div>
              <div className="text-xs font-medium">Case Intake</div>
            </div>

            <div className={cn(
              "absolute left-52 top-32 w-32 rounded-lg p-3 cursor-pointer transition-shadow hover:shadow-md",
              minimalPanel,
              "border-l-2 border-l-blue-500"
            )}>
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="text-[9px] text-muted-foreground uppercase">AI</span>
              </div>
              <div className="text-xs font-medium">Extract Facts</div>
            </div>

            <div className={cn(
              "absolute left-[390px] top-32 w-32 rounded-lg p-3 cursor-pointer transition-shadow hover:shadow-md",
              minimalPanel,
              "border-l-2 border-l-blue-500"
            )}>
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="text-[9px] text-muted-foreground uppercase">AI</span>
              </div>
              <div className="text-xs font-medium">Legal Analysis</div>
            </div>

            <div className={cn(
              "absolute right-6 top-32 w-32 rounded-lg p-3 cursor-pointer transition-shadow hover:shadow-md",
              minimalPanel,
              "border-l-2 border-l-purple-500"
            )}>
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span className="text-[9px] text-muted-foreground uppercase">Output</span>
              </div>
              <div className="text-xs font-medium">Generate Report</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
