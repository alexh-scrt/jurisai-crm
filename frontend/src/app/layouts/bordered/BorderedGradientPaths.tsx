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

export function BorderedGradientPaths() {
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

  const borderedPanel = "bg-background/90 backdrop-blur-md border-2 border-primary/30 shadow-lg"

  return (
    <div className="h-screen flex flex-col bg-muted/20">
      {/* Top Bar */}
      <header className="h-11 flex items-center justify-between px-4 bg-background/95 backdrop-blur-sm border-b-2 border-primary/20">
        <div className="flex items-center gap-3">
          <Link to="/layouts/bordered" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Separator orientation="vertical" className="h-5" />
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-full" />
            <span className="text-sm font-medium">Gradient Paths</span>
          </div>
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{selectedWorkflow.name}</span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeColorBar />
          <Separator orientation="vertical" className="h-5" />
          <Button
            variant={showGrid ? "secondary" : "ghost"}
            size="sm"
            className="h-7"
            onClick={() => setShowGrid(!showGrid)}
          >
            <Grid3X3 className="h-3.5 w-3.5 mr-1" />
            Grid
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

      <div className="flex-1 relative overflow-hidden">
        {/* Left Panel */}
        <div className={cn(
          'absolute left-4 top-4 z-20 transition-all duration-300',
          leftCollapsed ? 'w-12' : 'w-56'
        )}>
          <div className={cn(borderedPanel, "rounded-xl overflow-hidden border-l-4 border-l-primary")}>
            <div className="h-10 flex items-center justify-between px-3 bg-primary/5 border-b border-primary/10">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                {!leftCollapsed && <span className="text-sm font-medium">Layers</span>}
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setLeftCollapsed(!leftCollapsed)}>
                {leftCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
              </Button>
            </div>
            {!leftCollapsed && (
              <div className="p-2 space-y-1">
                {['Case Intake', 'Extract Facts', 'Legal Analysis', 'Generate Report'].map((name, i) => (
                  <button
                    key={name}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs transition-all',
                      i === 0 ? 'bg-primary/15 text-primary font-medium' : 'hover:bg-muted/60 text-foreground/80'
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

        {/* Right Panel */}
        <div className={cn(
          'absolute right-4 top-4 z-20 transition-all duration-300',
          rightCollapsed ? 'w-12' : 'w-64'
        )}>
          <div className={cn(borderedPanel, "rounded-xl overflow-hidden border-r-4 border-r-primary")}>
            <div className="h-10 flex items-center justify-between px-3 bg-primary/5 border-b border-primary/10">
              <div className="flex items-center gap-2">
                {!rightCollapsed && <span className="text-sm font-medium">Properties</span>}
                <Settings className="h-4 w-4 text-primary" />
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setRightCollapsed(!rightCollapsed)}>
                {rightCollapsed ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </Button>
            </div>
            {!rightCollapsed && (
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500/20 to-green-500/5 flex items-center justify-center border border-green-500/30">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Selected</div>
                    <div className="text-sm font-medium">Case Intake</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-muted-foreground">X</label>
                    <Input className="h-8 text-xs mt-1 border-primary/20" value="50" readOnly />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground">Y</label>
                    <Input className="h-8 text-xs mt-1 border-primary/20" value="100" readOnly />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Toolbar */}
        <div className={cn("absolute top-4 left-1/2 -translate-x-1/2 rounded-xl p-1.5 z-20", borderedPanel)}>
          <div className="flex items-center gap-1">
            {tools.map((tool) => (
              <Button
                key={tool.id}
                variant="ghost"
                size="icon"
                className={cn(
                  'h-9 w-9 rounded-lg',
                  activeTool === tool.id ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/10'
                )}
                onClick={() => setActiveTool(tool.id)}
              >
                <tool.icon className="h-4 w-4" />
              </Button>
            ))}
            <div className="w-px h-6 bg-primary/20 mx-1" />
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-primary/10">
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-primary/10">
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Zoom */}
        <div className={cn("absolute bottom-4 left-1/2 -translate-x-1/2 rounded-xl p-1.5 z-20", borderedPanel)}>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setZoom(Math.max(25, zoom - 25))}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm w-12 text-center font-medium">{zoom}%</span>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setZoom(Math.min(200, zoom + 25))}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `scale(${zoom / 100})` }}>
          <div className="relative w-[800px] h-[500px]">
            {/* Grid */}
            {showGrid && (
              <div className="absolute inset-0 opacity-[0.06]" style={{
                backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
                backgroundSize: '32px 32px'
              }} />
            )}

            {/* Gradient Connection Arrows */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                {/* Gradient from green to blue */}
                <linearGradient id="grad-green-blue" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                {/* Gradient blue to blue */}
                <linearGradient id="grad-blue-blue" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                {/* Gradient blue to purple */}
                <linearGradient id="grad-blue-purple" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>

                <marker id="arrow-green" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                </marker>
                <marker id="arrow-blue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                </marker>
                <marker id="arrow-purple" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#a855f7" />
                </marker>
              </defs>

              {/* Gradient path connections */}
              <path
                d="M 175 140 C 220 140, 220 175, 265 175"
                stroke="url(#grad-green-blue)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                markerEnd="url(#arrow-green)"
              />
              <path
                d="M 365 175 L 455 175"
                stroke="url(#grad-blue-blue)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                markerEnd="url(#arrow-blue)"
              />
              <path
                d="M 555 175 L 645 175"
                stroke="url(#grad-blue-purple)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                markerEnd="url(#arrow-purple)"
              />
            </svg>

            {/* Nodes with gradient borders */}
            <div className={cn(
              "absolute left-8 top-24 w-36 rounded-xl p-4 cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02]",
              "bg-background/90 backdrop-blur-md shadow-lg",
              "border-2 border-green-500/50"
            )} style={{ borderImage: 'linear-gradient(135deg, #22c55e, #22c55e80) 1' }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Input</span>
              </div>
              <div className="text-sm font-semibold">Case Intake</div>
              {/* Connection dot */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
            </div>

            <div className={cn(
              "absolute left-56 top-36 w-36 rounded-xl p-4 cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02]",
              "bg-background/90 backdrop-blur-md shadow-lg",
              "border-2 border-blue-500/50"
            )}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">AI</span>
              </div>
              <div className="text-sm font-semibold">Extract Facts</div>
              {/* Connection dots */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-background" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-background" />
            </div>

            <div className={cn(
              "absolute left-[400px] top-36 w-36 rounded-xl p-4 cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02]",
              "bg-background/90 backdrop-blur-md shadow-lg",
              "border-2 border-blue-500/50"
            )}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">AI</span>
              </div>
              <div className="text-sm font-semibold">Legal Analysis</div>
              {/* Connection dots */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-background" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-background" />
            </div>

            <div className={cn(
              "absolute right-8 top-36 w-36 rounded-xl p-4 cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02]",
              "bg-background/90 backdrop-blur-md shadow-lg",
              "border-2 border-purple-500/50"
            )}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Output</span>
              </div>
              <div className="text-sm font-semibold">Generate Report</div>
              {/* Connection dot */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-purple-500 border-2 border-background" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
