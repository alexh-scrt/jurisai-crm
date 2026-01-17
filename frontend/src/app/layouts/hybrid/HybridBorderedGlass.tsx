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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { ThemeColorBar } from '../shared/ThemeSwitcherDropdown'
import { mockWorkflows } from '@/mock-data/workflows'

export function HybridBorderedGlass() {
  const [zoom, setZoom] = useState(100)
  const [activeTool, setActiveTool] = useState('select')
  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const [rightCollapsed, setRightCollapsed] = useState(false)
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

  // Bordered glass - translucent with strong accent borders
  const borderedPanel = "bg-background/90 backdrop-blur-md border-2 border-primary/30 shadow-lg"
  const accentBorder = "border-l-4 border-l-primary"

  return (
    <div className="h-screen flex flex-col bg-muted/25">
      {/* Top Bar - Bordered */}
      <header className="h-11 flex items-center justify-between px-4 bg-background/95 backdrop-blur-sm border-b-2 border-primary/20">
        <div className="flex items-center gap-3">
          <Link to="/layouts/hybrid" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Separator orientation="vertical" className="h-5" />
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-primary rounded-full" />
            <span className="text-sm font-medium">Bordered Glass</span>
          </div>
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
        {/* Left Panel - Bordered Glass */}
        <div className={cn(
          'absolute left-4 top-4 z-20 transition-all duration-300',
          leftCollapsed ? 'w-12' : 'w-56'
        )}>
          <div className={cn(borderedPanel, accentBorder, "rounded-xl overflow-hidden")}>
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
              <div className="p-2 space-y-1 max-h-[320px] overflow-auto">
                {['Case Intake', 'Document Upload', 'Extract Facts', 'Legal Analysis', 'Generate Report'].map((name, i) => (
                  <button
                    key={name}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs transition-all',
                      i === 0
                        ? 'bg-primary/15 text-primary font-medium border-l-2 border-l-primary'
                        : 'hover:bg-muted/60 text-foreground/80 border-l-2 border-l-transparent hover:border-l-primary/30'
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

        {/* Right Panel - Bordered Glass */}
        <div className={cn(
          'absolute right-4 top-4 z-20 transition-all duration-300',
          rightCollapsed ? 'w-12' : 'w-64'
        )}>
          <div className={cn(borderedPanel, "border-r-4 border-r-primary", "rounded-xl overflow-hidden")}>
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
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Selected</div>
                    <div className="text-sm font-medium">Case Intake</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-primary/50 rounded-full" />
                    <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Position</label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-muted-foreground">X</label>
                      <Input className="h-8 text-xs mt-1 border-primary/20 focus:border-primary" value="50" readOnly />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground">Y</label>
                      <Input className="h-8 text-xs mt-1 border-primary/20 focus:border-primary" value="100" readOnly />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-primary/50 rounded-full" />
                    <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Size</label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-muted-foreground">W</label>
                      <Input className="h-8 text-xs mt-1 border-primary/20 focus:border-primary" value="140" readOnly />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground">H</label>
                      <Input className="h-8 text-xs mt-1 border-primary/20 focus:border-primary" value="64" readOnly />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Collapsed Panel Buttons */}
        {leftCollapsed && (
          <Button
            className="absolute left-4 top-4 h-10 w-10 rounded-xl z-20 border-2 border-primary/30"
            variant="outline"
            onClick={() => setLeftCollapsed(false)}
          >
            <Layers className="h-4 w-4 text-primary" />
          </Button>
        )}

        {/* Floating Toolbar - Bordered */}
        <div className={cn("absolute top-4 left-1/2 -translate-x-1/2 rounded-xl p-1.5 z-20", borderedPanel)}>
          <div className="flex items-center gap-1">
            {tools.map((tool) => (
              <Button
                key={tool.id}
                variant="ghost"
                size="icon"
                className={cn(
                  'h-9 w-9 rounded-lg transition-all',
                  activeTool === tool.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-primary/10 hover:text-primary'
                )}
                onClick={() => setActiveTool(tool.id)}
              >
                <tool.icon className="h-4 w-4" />
              </Button>
            ))}
            <div className="w-px h-6 bg-primary/20 mx-1" />
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-primary/10 hover:text-primary">
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-primary/10 hover:text-primary">
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Floating Zoom Controls - Bordered */}
        <div className={cn("absolute bottom-4 left-1/2 -translate-x-1/2 rounded-xl p-1.5 z-20", borderedPanel)}>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10" onClick={() => setZoom(Math.max(25, zoom - 25))}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <div className="w-px h-5 bg-primary/20" />
            <span className="text-sm w-12 text-center font-medium">{zoom}%</span>
            <div className="w-px h-5 bg-primary/20" />
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10" onClick={() => setZoom(Math.min(200, zoom + 25))}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `scale(${zoom / 100})` }}>
          <div className="relative w-[800px] h-[500px]">
            {/* Grid */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }} />

            {/* Bordered Nodes */}
            <div className={cn(
              "absolute left-8 top-24 w-36 rounded-xl p-4 cursor-pointer transition-all hover:shadow-xl",
              borderedPanel,
              "border-l-4 border-l-green-500"
            )}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Input</span>
              </div>
              <div className="text-sm font-semibold">Case Intake</div>
            </div>

            <div className={cn(
              "absolute left-56 top-36 w-36 rounded-xl p-4 cursor-pointer transition-all hover:shadow-xl",
              borderedPanel,
              "border-l-4 border-l-blue-500"
            )}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">AI</span>
              </div>
              <div className="text-sm font-semibold">Extract Facts</div>
            </div>

            <div className={cn(
              "absolute left-[400px] top-36 w-36 rounded-xl p-4 cursor-pointer transition-all hover:shadow-xl",
              borderedPanel,
              "border-l-4 border-l-blue-500"
            )}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">AI</span>
              </div>
              <div className="text-sm font-semibold">Legal Analysis</div>
            </div>

            <div className={cn(
              "absolute right-8 top-36 w-36 rounded-xl p-4 cursor-pointer transition-all hover:shadow-xl",
              borderedPanel,
              "border-l-4 border-l-purple-500"
            )}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
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
