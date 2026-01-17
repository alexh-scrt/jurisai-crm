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
  ChevronLeft,
  Layers,
  Settings,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { ThemeColorBar } from '../shared/ThemeSwitcherDropdown'
import { mockWorkflows } from '@/mock-data/workflows'

type DockPosition = 'left' | 'right' | 'floating'

interface Panel {
  id: string
  title: string
  icon: React.ElementType
  docked: DockPosition
  minimized: boolean
}

export function HybridFrostedDocks() {
  const [zoom, setZoom] = useState(100)
  const [activeTool, setActiveTool] = useState('select')
  const [panels, setPanels] = useState<Panel[]>([
    { id: 'layers', title: 'Layers', icon: Layers, docked: 'left', minimized: false },
    { id: 'properties', title: 'Properties', icon: Settings, docked: 'right', minimized: false },
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

  // Frosted glass style - no gradients
  const glassPanel = "bg-background/80 backdrop-blur-xl border border-border/50 shadow-xl"

  const toggleMinimize = (panelId: string) => {
    setPanels(panels.map(p =>
      p.id === panelId ? { ...p, minimized: !p.minimized } : p
    ))
  }

  const cycleDock = (panelId: string) => {
    const positions: DockPosition[] = ['left', 'right', 'floating']
    setPanels(panels.map(p => {
      if (p.id === panelId) {
        const currentIndex = positions.indexOf(p.docked)
        const nextIndex = (currentIndex + 1) % positions.length
        return { ...p, docked: positions[nextIndex] }
      }
      return p
    }))
  }

  const leftPanel = panels.find(p => p.docked === 'left')
  const rightPanel = panels.find(p => p.docked === 'right')
  const floatingPanels = panels.filter(p => p.docked === 'floating')

  return (
    <div className="h-screen flex flex-col bg-muted/30">
      {/* Top Bar - Frosted */}
      <header className={cn("h-11 flex items-center justify-between px-4", glassPanel, "rounded-none border-t-0 border-x-0")}>
        <div className="flex items-center gap-3">
          <Link to="/layouts/hybrid" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Separator orientation="vertical" className="h-5" />
          <span className="text-sm font-medium">Frosted Docks</span>
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
        {/* Left Docked Panel - Frosted */}
        {leftPanel && (
          <div className={cn(
            'absolute left-4 top-4 z-20 transition-all duration-300',
            leftPanel.minimized ? 'w-12' : 'w-56'
          )}>
            <div className={cn(glassPanel, "rounded-2xl overflow-hidden")}>
              <div className="h-10 flex items-center justify-between px-3 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-3 w-3 text-muted-foreground cursor-move" />
                  <leftPanel.icon className="h-4 w-4 text-primary" />
                  {!leftPanel.minimized && (
                    <span className="text-sm font-medium">{leftPanel.title}</span>
                  )}
                </div>
                <div className="flex items-center gap-0.5">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => cycleDock('layers')}>
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleMinimize('layers')}>
                    {leftPanel.minimized ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
                  </Button>
                </div>
              </div>
              {!leftPanel.minimized && (
                <div className="p-3 space-y-1 max-h-[320px] overflow-auto">
                  {['Case Intake', 'Document Upload', 'Extract Facts', 'Spot Issues', 'Legal Analysis', 'Generate Report'].map((name, i) => (
                    <button
                      key={name}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all',
                        i === 0
                          ? 'bg-primary/15 text-primary font-medium'
                          : 'hover:bg-muted/50 text-foreground/80'
                      )}
                    >
                      <div className={cn(
                        'w-2 h-2 rounded-full',
                        i === 0 ? 'bg-green-500' : i < 4 ? 'bg-blue-500' : 'bg-purple-500'
                      )} />
                      <span>{name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Dock indicator */}
            <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1 h-12 bg-primary/40 rounded-full" />
          </div>
        )}

        {/* Right Docked Panel - Frosted */}
        {rightPanel && (
          <div className={cn(
            'absolute right-4 top-4 z-20 transition-all duration-300',
            rightPanel.minimized ? 'w-12' : 'w-64'
          )}>
            <div className={cn(glassPanel, "rounded-2xl overflow-hidden")}>
              <div className="h-10 flex items-center justify-between px-3 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <rightPanel.icon className="h-4 w-4 text-primary" />
                  {!rightPanel.minimized && (
                    <span className="text-sm font-medium">{rightPanel.title}</span>
                  )}
                </div>
                <div className="flex items-center gap-0.5">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => cycleDock('properties')}>
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleMinimize('properties')}>
                    {rightPanel.minimized ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                  </Button>
                </div>
              </div>
              {!rightPanel.minimized && (
                <div className="p-4 space-y-4">
                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Selected Node</label>
                    <div className="text-sm font-medium mt-1">Case Intake</div>
                  </div>

                  <div className="p-3 rounded-xl bg-muted/30 border border-border/30">
                    <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-2">Position</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-muted-foreground">X</label>
                        <Input className="h-8 text-xs mt-1 bg-background/50" value="50" readOnly />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground">Y</label>
                        <Input className="h-8 text-xs mt-1 bg-background/50" value="100" readOnly />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-muted/30 border border-border/30">
                    <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-2">Size</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-muted-foreground">W</label>
                        <Input className="h-8 text-xs mt-1 bg-background/50" value="140" readOnly />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground">H</label>
                        <Input className="h-8 text-xs mt-1 bg-background/50" value="64" readOnly />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Dock indicator */}
            <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-1 h-12 bg-primary/40 rounded-full" />
          </div>
        )}

        {/* Floating Panels */}
        {floatingPanels.map((panel, index) => (
          <div
            key={panel.id}
            className="absolute z-20"
            style={{ left: `${220 + index * 60}px`, top: `${120 + index * 40}px` }}
          >
            <div className={cn(glassPanel, "rounded-2xl overflow-hidden w-52")}>
              <div className="h-9 flex items-center justify-between px-3 border-b border-border/30 cursor-move">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-3 w-3 text-muted-foreground" />
                  <panel.icon className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-medium">{panel.title}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => cycleDock(panel.id)}>
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
              <div className="p-3 text-xs text-muted-foreground">
                Floating panel - click arrow to dock
              </div>
            </div>
          </div>
        ))}

        {/* Floating Toolbar - Frosted */}
        <div className={cn("absolute top-4 left-1/2 -translate-x-1/2 rounded-2xl p-1.5 z-20", glassPanel)}>
          <div className="flex items-center gap-1">
            {tools.map((tool) => (
              <Button
                key={tool.id}
                variant="ghost"
                size="icon"
                className={cn(
                  'h-9 w-9 rounded-xl transition-all',
                  activeTool === tool.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted/50'
                )}
                onClick={() => setActiveTool(tool.id)}
              >
                <tool.icon className="h-4 w-4" />
              </Button>
            ))}
            <Separator orientation="vertical" className="h-6 mx-1" />
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-muted/50">
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-muted/50">
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Floating Zoom Controls - Frosted */}
        <div className={cn("absolute bottom-4 left-1/2 -translate-x-1/2 rounded-2xl p-1.5 z-20", glassPanel)}>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-muted/50" onClick={() => setZoom(Math.max(25, zoom - 25))}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm w-14 text-center font-medium">{zoom}%</span>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-muted/50" onClick={() => setZoom(Math.min(200, zoom + 25))}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `scale(${zoom / 100})` }}>
          <div className="relative w-[800px] h-[500px]">
            {/* Subtle Grid */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }} />

            {/* Frosted Nodes */}
            <div className={cn(
              "absolute left-8 top-24 w-36 rounded-2xl p-4 cursor-pointer transition-all hover:scale-105",
              glassPanel,
              "border-2 border-primary/40"
            )}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Input</span>
              </div>
              <div className="text-sm font-semibold">Case Intake</div>
            </div>

            <div className={cn(
              "absolute left-56 top-36 w-36 rounded-2xl p-4 cursor-pointer transition-all hover:scale-105",
              glassPanel
            )}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">AI</span>
              </div>
              <div className="text-sm font-semibold">Extract Facts</div>
            </div>

            <div className={cn(
              "absolute left-[400px] top-36 w-36 rounded-2xl p-4 cursor-pointer transition-all hover:scale-105",
              glassPanel
            )}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">AI</span>
              </div>
              <div className="text-sm font-semibold">Legal Analysis</div>
            </div>

            <div className={cn(
              "absolute right-8 top-36 w-36 rounded-2xl p-4 cursor-pointer transition-all hover:scale-105",
              glassPanel
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
