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
  Grip,
  Minus,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { ThemeColorBar } from '../shared/ThemeSwitcherDropdown'
import { mockWorkflows } from '@/mock-data/workflows'

export function HybridSubtleBlur() {
  const [zoom, setZoom] = useState(100)
  const [activeTool, setActiveTool] = useState('select')
  const [layersExpanded, setLayersExpanded] = useState(true)
  const [propsExpanded, setPropsExpanded] = useState(true)
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

  // Subtle blur - light blur, mostly solid with soft edges
  const subtlePanel = "bg-background/98 backdrop-blur-[2px] border border-border/80 shadow-md"

  return (
    <div className="h-screen flex flex-col bg-muted/15">
      {/* Top Bar */}
      <header className="h-11 flex items-center justify-between px-4 bg-background border-b">
        <div className="flex items-center gap-3">
          <Link to="/layouts/hybrid" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Separator orientation="vertical" className="h-5" />
          <span className="text-sm font-medium">Subtle Blur</span>
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
        {/* Left Panel - Subtle Blur */}
        <div className="absolute left-4 top-4 z-20 w-52">
          <div className={cn(subtlePanel, "rounded-lg overflow-hidden")}>
            <button
              onClick={() => setLayersExpanded(!layersExpanded)}
              className="w-full h-9 flex items-center justify-between px-3 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Grip className="h-3 w-3 text-muted-foreground" />
                <Layers className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Layers</span>
              </div>
              {layersExpanded ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
            </button>
            {layersExpanded && (
              <>
                <Separator />
                <div className="p-2 space-y-0.5 max-h-[280px] overflow-auto">
                  {['Case Intake', 'Document Upload', 'Extract Facts', 'Legal Analysis', 'Generate Report'].map((name, i) => (
                    <button
                      key={name}
                      className={cn(
                        'w-full flex items-center gap-2 px-2.5 py-2 rounded text-xs transition-colors text-left',
                        i === 0
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'hover:bg-muted/70 text-foreground/80'
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
              </>
            )}
          </div>
        </div>

        {/* Right Panel - Subtle Blur */}
        <div className="absolute right-4 top-4 z-20 w-56">
          <div className={cn(subtlePanel, "rounded-lg overflow-hidden")}>
            <button
              onClick={() => setPropsExpanded(!propsExpanded)}
              className="w-full h-9 flex items-center justify-between px-3 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Properties</span>
              </div>
              {propsExpanded ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
            </button>
            {propsExpanded && (
              <>
                <Separator />
                <div className="p-3 space-y-3">
                  <div className="p-2 rounded bg-muted/40">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-sm font-medium">Case Intake</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">Input Node</div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-muted-foreground uppercase">Position</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-muted-foreground w-3">X</span>
                        <Input className="h-6 text-xs flex-1" value="50" readOnly />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-muted-foreground w-3">Y</span>
                        <Input className="h-6 text-xs flex-1" value="100" readOnly />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-muted-foreground uppercase">Dimensions</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-muted-foreground w-3">W</span>
                        <Input className="h-6 text-xs flex-1" value="140" readOnly />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-muted-foreground w-3">H</span>
                        <Input className="h-6 text-xs flex-1" value="64" readOnly />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Floating Toolbar - Subtle */}
        <div className={cn("absolute top-4 left-1/2 -translate-x-1/2 rounded-lg p-1 z-20", subtlePanel)}>
          <div className="flex items-center gap-0.5">
            {tools.map((tool) => (
              <Button
                key={tool.id}
                variant="ghost"
                size="icon"
                className={cn(
                  'h-8 w-8 rounded transition-colors',
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
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded hover:bg-muted">
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded hover:bg-muted">
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Floating Zoom Controls - Subtle */}
        <div className={cn("absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg px-2 py-1 z-20", subtlePanel)}>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded hover:bg-muted" onClick={() => setZoom(Math.max(25, zoom - 25))}>
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs w-10 text-center font-medium tabular-nums">{zoom}%</span>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded hover:bg-muted" onClick={() => setZoom(Math.min(200, zoom + 25))}>
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `scale(${zoom / 100})` }}>
          <div className="relative w-[800px] h-[500px]">
            {/* Very Subtle Grid */}
            <div className="absolute inset-0 opacity-[0.025]" style={{
              backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
              backgroundSize: '48px 48px'
            }} />

            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path d="M 170 135 Q 260 135 260 165 T 340 165" stroke="currentColor" strokeWidth="1.5" fill="none" className="text-border" />
              <path d="M 450 165 L 540 165" stroke="currentColor" strokeWidth="1.5" fill="none" className="text-border" />
              <path d="M 650 165 L 740 165" stroke="currentColor" strokeWidth="1.5" fill="none" className="text-border" />
            </svg>

            {/* Subtle Nodes */}
            <div className={cn(
              "absolute left-8 top-24 w-36 rounded-lg p-4 cursor-pointer transition-shadow hover:shadow-lg",
              subtlePanel,
              "ring-2 ring-primary/50"
            )}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-[10px] text-muted-foreground uppercase">Input</span>
              </div>
              <div className="text-sm font-medium">Case Intake</div>
            </div>

            <div className={cn(
              "absolute left-56 top-32 w-36 rounded-lg p-4 cursor-pointer transition-shadow hover:shadow-lg",
              subtlePanel
            )}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[10px] text-muted-foreground uppercase">AI</span>
              </div>
              <div className="text-sm font-medium">Extract Facts</div>
            </div>

            <div className={cn(
              "absolute left-[400px] top-32 w-36 rounded-lg p-4 cursor-pointer transition-shadow hover:shadow-lg",
              subtlePanel
            )}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[10px] text-muted-foreground uppercase">AI</span>
              </div>
              <div className="text-sm font-medium">Legal Analysis</div>
            </div>

            <div className={cn(
              "absolute right-8 top-32 w-36 rounded-lg p-4 cursor-pointer transition-shadow hover:shadow-lg",
              subtlePanel
            )}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-[10px] text-muted-foreground uppercase">Output</span>
              </div>
              <div className="text-sm font-medium">Generate Report</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
