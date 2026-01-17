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
  ChevronLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { ThemeColorBar } from '../shared/ThemeSwitcherDropdown'
import { mockWorkflows } from '@/mock-data/workflows'

type DockPosition = 'left' | 'right' | 'top' | 'bottom' | 'floating'

interface Panel {
  id: string
  title: string
  docked: DockPosition
  minimized: boolean
}

export function FloatingDockedIslands() {
  const [zoom, setZoom] = useState(100)
  const [activeTool, setActiveTool] = useState('select')
  const [panels, setPanels] = useState<Panel[]>([
    { id: 'layers', title: 'Layers', docked: 'left', minimized: false },
    { id: 'properties', title: 'Properties', docked: 'right', minimized: false },
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
    <div className="h-screen flex flex-col bg-muted/40">
      {/* Minimal Top Bar */}
      <header className="h-10 flex items-center justify-between px-3 bg-background border-b">
        <div className="flex items-center gap-3">
          <Link to="/layouts/floating" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Separator orientation="vertical" className="h-5" />
          <span className="text-sm font-medium">Docked Islands</span>
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
        {/* Left Docked Panel */}
        {leftPanel && (
          <div className={cn(
            'absolute left-4 top-4 z-20 transition-all duration-300',
            leftPanel.minimized ? 'w-10' : 'w-52'
          )}>
            <div className="bg-background rounded-xl border shadow-xl overflow-hidden">
              <div className="h-9 flex items-center justify-between px-2 bg-primary/5 border-b">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-3 w-3 text-muted-foreground cursor-move" />
                  {!leftPanel.minimized && (
                    <span className="text-xs font-medium">{leftPanel.title}</span>
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
                <div className="p-2 space-y-1 text-xs max-h-[300px] overflow-auto">
                  <div className="p-2 rounded bg-primary/10 text-primary font-medium">Case Intake</div>
                  <div className="p-2 rounded hover:bg-muted cursor-pointer">Document Upload</div>
                  <div className="p-2 rounded hover:bg-muted cursor-pointer">Extract Facts</div>
                  <div className="p-2 rounded hover:bg-muted cursor-pointer">Spot Issues</div>
                  <div className="p-2 rounded hover:bg-muted cursor-pointer">Legal Analysis</div>
                  <div className="p-2 rounded hover:bg-muted cursor-pointer">Generate Report</div>
                </div>
              )}
            </div>
            {/* Dock indicator */}
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-16 bg-primary/30 rounded-full" />
          </div>
        )}

        {/* Right Docked Panel */}
        {rightPanel && (
          <div className={cn(
            'absolute right-4 top-4 z-20 transition-all duration-300',
            rightPanel.minimized ? 'w-10' : 'w-56'
          )}>
            <div className="bg-background rounded-xl border shadow-xl overflow-hidden">
              <div className="h-9 flex items-center justify-between px-2 bg-primary/5 border-b">
                <div className="flex items-center gap-2">
                  {!rightPanel.minimized && (
                    <span className="text-xs font-medium">{rightPanel.title}</span>
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
                <div className="p-3 space-y-3">
                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase">Node</label>
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
              )}
            </div>
            {/* Dock indicator */}
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-16 bg-primary/30 rounded-full" />
          </div>
        )}

        {/* Floating Panels */}
        {floatingPanels.map((panel, index) => (
          <div
            key={panel.id}
            className="absolute z-20"
            style={{ left: `${200 + index * 50}px`, top: `${100 + index * 30}px` }}
          >
            <div className="bg-background rounded-xl border shadow-2xl overflow-hidden w-48">
              <div className="h-8 flex items-center justify-between px-2 bg-muted/50 border-b cursor-move">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-medium">{panel.title}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => cycleDock(panel.id)}>
                  <Minimize2 className="h-3 w-3" />
                </Button>
              </div>
              <div className="p-2 text-xs text-muted-foreground">
                Floating panel content
              </div>
            </div>
          </div>
        ))}

        {/* Floating Toolbar */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-background rounded-xl shadow-xl border p-1 z-20">
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
          <Separator orientation="vertical" className="h-6 mx-1" />
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        {/* Floating Zoom Controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-background rounded-xl shadow-xl border p-1 z-20">
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
          <div className="relative w-[800px] h-[500px]">
            {/* Grid */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }} />

            {/* Nodes */}
            <div className="absolute left-8 top-24 w-36 bg-background rounded-xl border-2 border-primary shadow-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] text-muted-foreground uppercase">Input</span>
              </div>
              <div className="text-sm font-semibold">Case Intake</div>
            </div>

            <div className="absolute left-56 top-36 w-36 bg-background rounded-xl border shadow-md p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[10px] text-muted-foreground uppercase">AI</span>
              </div>
              <div className="text-sm font-semibold">Extract Facts</div>
            </div>

            <div className="absolute left-[400px] top-36 w-36 bg-background rounded-xl border shadow-md p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[10px] text-muted-foreground uppercase">AI</span>
              </div>
              <div className="text-sm font-semibold">Legal Analysis</div>
            </div>

            <div className="absolute right-8 top-36 w-36 bg-background rounded-xl border shadow-md p-4">
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
