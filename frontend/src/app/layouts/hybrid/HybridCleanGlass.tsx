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
  X,
  Layers,
  Settings,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { ThemeColorBar } from '../shared/ThemeSwitcherDropdown'
import { mockWorkflows } from '@/mock-data/workflows'

export function HybridCleanGlass() {
  const [zoom, setZoom] = useState(100)
  const [activeTool, setActiveTool] = useState('select')
  const [layersOpen, setLayersOpen] = useState(true)
  const [propsOpen, setPropsOpen] = useState(true)
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

  // Clean glass - minimal, subtle shadows, no heavy blur
  const cleanPanel = "bg-background/95 backdrop-blur-sm border border-border shadow-lg"

  return (
    <div className="h-screen flex flex-col bg-muted/20">
      {/* Top Bar - Clean */}
      <header className={cn("h-11 flex items-center justify-between px-4 border-b", cleanPanel, "rounded-none border-t-0 border-x-0")}>
        <div className="flex items-center gap-3">
          <Link to="/layouts/hybrid" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Separator orientation="vertical" className="h-5" />
          <span className="text-sm font-medium">Clean Glass</span>
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
        {/* Left Panel - Clean Glass */}
        {layersOpen && (
          <div className="absolute left-4 top-4 z-20 w-52">
            <div className={cn(cleanPanel, "rounded-xl overflow-hidden")}>
              <div className="h-10 flex items-center justify-between px-3 border-b border-border/50 bg-muted/30">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Layers</span>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setLayersOpen(false)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <div className="p-2 space-y-0.5 max-h-[300px] overflow-auto">
                {['Case Intake', 'Document Upload', 'Extract Facts', 'Legal Analysis', 'Generate Report'].map((name, i) => (
                  <button
                    key={name}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors',
                      i === 0
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'hover:bg-muted/60 text-foreground/80'
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
            </div>
          </div>
        )}

        {/* Right Panel - Clean Glass */}
        {propsOpen && (
          <div className="absolute right-4 top-4 z-20 w-60">
            <div className={cn(cleanPanel, "rounded-xl overflow-hidden")}>
              <div className="h-10 flex items-center justify-between px-3 border-b border-border/50 bg-muted/30">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Properties</span>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setPropsOpen(false)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Node</label>
                  <div className="text-sm font-medium mt-1">Case Intake</div>
                </div>

                <Separator />

                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2 block">Position</label>
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

                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2 block">Size</label>
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
              </div>
            </div>
          </div>
        )}

        {/* Panel Toggle Buttons */}
        {!layersOpen && (
          <Button
            variant="outline"
            size="icon"
            className={cn("absolute left-4 top-4 h-9 w-9 rounded-lg z-20", cleanPanel)}
            onClick={() => setLayersOpen(true)}
          >
            <Layers className="h-4 w-4" />
          </Button>
        )}
        {!propsOpen && (
          <Button
            variant="outline"
            size="icon"
            className={cn("absolute right-4 top-4 h-9 w-9 rounded-lg z-20", cleanPanel)}
            onClick={() => setPropsOpen(true)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        )}

        {/* Floating Toolbar - Clean */}
        <div className={cn("absolute top-4 left-1/2 -translate-x-1/2 rounded-xl p-1 z-20", cleanPanel)}>
          <div className="flex items-center gap-0.5">
            {tools.map((tool) => (
              <Button
                key={tool.id}
                variant="ghost"
                size="icon"
                className={cn(
                  'h-8 w-8 rounded-lg transition-colors',
                  activeTool === tool.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                )}
                onClick={() => setActiveTool(tool.id)}
              >
                <tool.icon className="h-4 w-4" />
              </Button>
            ))}
            <Separator orientation="vertical" className="h-5 mx-1" />
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted">
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted">
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Floating Zoom Controls - Clean */}
        <div className={cn("absolute bottom-4 left-1/2 -translate-x-1/2 rounded-xl p-1 z-20", cleanPanel)}>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-muted" onClick={() => setZoom(Math.max(25, zoom - 25))}>
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs w-12 text-center font-medium">{zoom}%</span>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-muted" onClick={() => setZoom(Math.min(200, zoom + 25))}>
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `scale(${zoom / 100})` }}>
          <div className="relative w-[800px] h-[500px]">
            {/* Minimal Grid */}
            <div className="absolute inset-0 opacity-[0.04]" style={{
              backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />

            {/* Clean Nodes */}
            <div className={cn(
              "absolute left-8 top-24 w-36 rounded-xl p-4 cursor-pointer transition-shadow hover:shadow-xl",
              cleanPanel,
              "border-2 border-primary/50"
            )}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-[10px] text-muted-foreground uppercase">Input</span>
              </div>
              <div className="text-sm font-semibold">Case Intake</div>
            </div>

            <div className={cn(
              "absolute left-56 top-36 w-36 rounded-xl p-4 cursor-pointer transition-shadow hover:shadow-xl",
              cleanPanel
            )}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[10px] text-muted-foreground uppercase">AI</span>
              </div>
              <div className="text-sm font-semibold">Extract Facts</div>
            </div>

            <div className={cn(
              "absolute left-[400px] top-36 w-36 rounded-xl p-4 cursor-pointer transition-shadow hover:shadow-xl",
              cleanPanel
            )}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[10px] text-muted-foreground uppercase">AI</span>
              </div>
              <div className="text-sm font-semibold">Legal Analysis</div>
            </div>

            <div className={cn(
              "absolute right-8 top-36 w-36 rounded-xl p-4 cursor-pointer transition-shadow hover:shadow-xl",
              cleanPanel
            )}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
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
