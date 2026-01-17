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

export function BorderedNeon() {
  const [zoom, setZoom] = useState(100)
  const [activeTool, setActiveTool] = useState('select')
  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const [rightCollapsed, setRightCollapsed] = useState(false)
  const [showGrid, setShowGrid] = useState(false)
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

  // Neon style - glowing borders
  const neonPanel = "bg-background/95 backdrop-blur-md border-2 shadow-lg"
  const neonGlow = "shadow-[0_0_15px_rgba(var(--primary),0.3)]"

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <header className={cn("h-11 flex items-center justify-between px-4 border-b-2 border-primary/40", neonGlow)}>
        <div className="flex items-center gap-3">
          <Link to="/layouts/bordered" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Separator orientation="vertical" className="h-5" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
            <span className="text-sm font-medium">Neon Borders</span>
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
        {/* Left Panel - Neon */}
        <div className={cn(
          'absolute left-4 top-4 z-20 transition-all duration-300',
          leftCollapsed ? 'w-12' : 'w-56'
        )}>
          <div className={cn(
            neonPanel,
            "border-primary/50 rounded-xl overflow-hidden",
            "shadow-[0_0_20px_rgba(var(--primary),0.2),inset_0_0_20px_rgba(var(--primary),0.05)]"
          )}>
            <div className="h-10 flex items-center justify-between px-3 border-b border-primary/30 bg-primary/5">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary drop-shadow-[0_0_4px_rgba(var(--primary),0.8)]" />
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
                      i === 0
                        ? 'bg-primary/20 text-primary font-medium shadow-[0_0_10px_rgba(var(--primary),0.3)]'
                        : 'hover:bg-primary/10 text-foreground/80'
                    )}
                  >
                    <div className={cn(
                      'w-2 h-2 rounded-full',
                      i === 0 ? 'bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]' :
                      i < 3 ? 'bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.8)]' :
                      'bg-purple-400 shadow-[0_0_6px_rgba(192,132,252,0.8)]'
                    )} />
                    <span>{name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Neon */}
        <div className={cn(
          'absolute right-4 top-4 z-20 transition-all duration-300',
          rightCollapsed ? 'w-12' : 'w-64'
        )}>
          <div className={cn(
            neonPanel,
            "border-primary/50 rounded-xl overflow-hidden",
            "shadow-[0_0_20px_rgba(var(--primary),0.2),inset_0_0_20px_rgba(var(--primary),0.05)]"
          )}>
            <div className="h-10 flex items-center justify-between px-3 border-b border-primary/30 bg-primary/5">
              <div className="flex items-center gap-2">
                {!rightCollapsed && <span className="text-sm font-medium">Properties</span>}
                <Settings className="h-4 w-4 text-primary drop-shadow-[0_0_4px_rgba(var(--primary),0.8)]" />
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setRightCollapsed(!rightCollapsed)}>
                {rightCollapsed ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </Button>
            </div>
            {!rightCollapsed && (
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-primary/10 border border-primary/30">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shadow-[0_0_10px_rgba(var(--primary),0.3)]">
                    <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Selected</div>
                    <div className="text-sm font-medium">Case Intake</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-muted-foreground">X</label>
                    <Input className="h-8 text-xs mt-1 border-primary/30 focus:shadow-[0_0_8px_rgba(var(--primary),0.4)]" value="50" readOnly />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground">Y</label>
                    <Input className="h-8 text-xs mt-1 border-primary/30 focus:shadow-[0_0_8px_rgba(var(--primary),0.4)]" value="100" readOnly />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Toolbar - Neon */}
        <div className={cn(
          "absolute top-4 left-1/2 -translate-x-1/2 rounded-xl p-1.5 z-20",
          neonPanel,
          "border-primary/50",
          "shadow-[0_0_20px_rgba(var(--primary),0.25)]"
        )}>
          <div className="flex items-center gap-1">
            {tools.map((tool) => (
              <Button
                key={tool.id}
                variant="ghost"
                size="icon"
                className={cn(
                  'h-9 w-9 rounded-lg transition-all',
                  activeTool === tool.id
                    ? 'bg-primary text-primary-foreground shadow-[0_0_12px_rgba(var(--primary),0.6)]'
                    : 'hover:bg-primary/15'
                )}
                onClick={() => setActiveTool(tool.id)}
              >
                <tool.icon className="h-4 w-4" />
              </Button>
            ))}
            <div className="w-px h-6 bg-primary/30 mx-1" />
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-primary/15">
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-primary/15">
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Zoom - Neon */}
        <div className={cn(
          "absolute bottom-4 left-1/2 -translate-x-1/2 rounded-xl p-1.5 z-20",
          neonPanel,
          "border-primary/50",
          "shadow-[0_0_20px_rgba(var(--primary),0.25)]"
        )}>
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
              <div className="absolute inset-0 opacity-[0.04]" style={{
                backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
                backgroundSize: '32px 32px'
              }} />
            )}

            {/* Neon Connection Arrows */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <marker id="arrowhead-neon" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" className="fill-primary" filter="url(#neon-glow)" />
                </marker>
              </defs>

              {/* Glowing connections */}
              <path d="M 175 140 C 220 140, 220 175, 265 175" stroke="currentColor" strokeWidth="2" fill="none" className="text-primary" filter="url(#neon-glow)" markerEnd="url(#arrowhead-neon)" />
              <path d="M 365 175 L 455 175" stroke="currentColor" strokeWidth="2" fill="none" className="text-primary" filter="url(#neon-glow)" markerEnd="url(#arrowhead-neon)" />
              <path d="M 555 175 L 645 175" stroke="currentColor" strokeWidth="2" fill="none" className="text-primary" filter="url(#neon-glow)" markerEnd="url(#arrowhead-neon)" />
            </svg>

            {/* Neon Nodes */}
            <div className={cn(
              "absolute left-8 top-24 w-36 rounded-xl p-4 cursor-pointer transition-all hover:scale-105",
              neonPanel,
              "border-green-400/60",
              "shadow-[0_0_20px_rgba(74,222,128,0.3)]",
              "hover:shadow-[0_0_30px_rgba(74,222,128,0.5)]"
            )}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Input</span>
              </div>
              <div className="text-sm font-semibold">Case Intake</div>
            </div>

            <div className={cn(
              "absolute left-56 top-36 w-36 rounded-xl p-4 cursor-pointer transition-all hover:scale-105",
              neonPanel,
              "border-blue-400/60",
              "shadow-[0_0_20px_rgba(96,165,250,0.3)]",
              "hover:shadow-[0_0_30px_rgba(96,165,250,0.5)]"
            )}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">AI</span>
              </div>
              <div className="text-sm font-semibold">Extract Facts</div>
            </div>

            <div className={cn(
              "absolute left-[400px] top-36 w-36 rounded-xl p-4 cursor-pointer transition-all hover:scale-105",
              neonPanel,
              "border-blue-400/60",
              "shadow-[0_0_20px_rgba(96,165,250,0.3)]",
              "hover:shadow-[0_0_30px_rgba(96,165,250,0.5)]"
            )}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">AI</span>
              </div>
              <div className="text-sm font-semibold">Legal Analysis</div>
            </div>

            <div className={cn(
              "absolute right-8 top-36 w-36 rounded-xl p-4 cursor-pointer transition-all hover:scale-105",
              neonPanel,
              "border-purple-400/60",
              "shadow-[0_0_20px_rgba(192,132,252,0.3)]",
              "hover:shadow-[0_0_30px_rgba(192,132,252,0.5)]"
            )}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
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
