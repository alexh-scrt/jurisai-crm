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
  PanelLeftClose,
  PanelRightClose,
  Move,
  PenTool,
  Maximize2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { ThemeColorBar } from '../shared/ThemeSwitcherDropdown'
import { mockWorkflows } from '@/mock-data/workflows'

export function FigmaCanvasFocus() {
  const [zoom, setZoom] = useState(100)
  const [leftPanelOpen, setLeftPanelOpen] = useState(false)
  const [rightPanelOpen, setRightPanelOpen] = useState(false)
  const [activeTool, setActiveTool] = useState('select')
  const selectedWorkflow = mockWorkflows[0]

  const tools = [
    { id: 'select', icon: MousePointer2, label: 'Select (V)' },
    { id: 'hand', icon: Hand, label: 'Hand (H)' },
    { id: 'move', icon: Move, label: 'Move (M)' },
    { id: 'pen', icon: PenTool, label: 'Pen (P)' },
    { id: 'rect', icon: Square, label: 'Rectangle (R)' },
    { id: 'ellipse', icon: Circle, label: 'Ellipse (O)' },
    { id: 'text', icon: Type, label: 'Text (T)' },
  ]

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Minimal Top Bar */}
      <header className="h-10 flex items-center justify-between px-2 border-b bg-sidebar text-sidebar-foreground">
        <div className="flex items-center gap-2">
          <Link to="/layouts/figma" className="p-1.5 rounded hover:bg-sidebar-hover">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Separator orientation="vertical" className="h-5 bg-sidebar-border" />
          <span className="text-sm font-medium">Canvas Focus</span>
          <ChevronRight className="h-3 w-3 opacity-50" />
          <span className="text-xs opacity-70">{selectedWorkflow.name}</span>
        </div>

        <div className="flex items-center gap-1">
          <ThemeColorBar />
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs border-green-400/50 text-green-400">
            Saved
          </Badge>
          <Button variant="ghost" size="sm" className="h-7 text-sidebar-foreground hover:bg-sidebar-hover">
            <Share2 className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" className="h-7">
            <Play className="h-3.5 w-3.5 mr-1" />
            Run
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Floating Left Panel Toggle */}
        <div className={cn(
          'absolute left-0 top-0 bottom-0 z-20 transition-all duration-200',
          leftPanelOpen ? 'w-52' : 'w-10'
        )}>
          {leftPanelOpen ? (
            <div className="h-full bg-background border-r shadow-lg flex flex-col">
              <div className="p-2 border-b flex items-center justify-between">
                <span className="text-xs font-medium">Layers</span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setLeftPanelOpen(false)}>
                  <PanelLeftClose className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 overflow-auto p-2 text-xs space-y-1">
                <div className="p-2 rounded bg-primary/10 text-primary">Case Intake</div>
                <div className="p-2 rounded hover:bg-muted">Document Upload</div>
                <div className="p-2 rounded hover:bg-muted">Extract Facts</div>
                <div className="p-2 rounded hover:bg-muted">Spot Issues</div>
                <div className="p-2 rounded hover:bg-muted">Legal Analysis</div>
                <div className="p-2 rounded hover:bg-muted">Generate Report</div>
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 left-2 h-8 w-8 bg-background shadow-md border"
              onClick={() => setLeftPanelOpen(true)}
            >
              <Layers className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Floating Right Panel Toggle */}
        <div className={cn(
          'absolute right-0 top-0 bottom-0 z-20 transition-all duration-200',
          rightPanelOpen ? 'w-56' : 'w-10'
        )}>
          {rightPanelOpen ? (
            <div className="h-full bg-background border-l shadow-lg flex flex-col">
              <div className="p-2 border-b flex items-center justify-between">
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setRightPanelOpen(false)}>
                  <PanelRightClose className="h-4 w-4" />
                </Button>
                <span className="text-xs font-medium">Properties</span>
              </div>
              <div className="flex-1 overflow-auto p-3 space-y-3">
                <div>
                  <label className="text-[10px] text-muted-foreground">Node</label>
                  <div className="text-sm font-medium">Case Intake</div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-muted rounded">X: 32</div>
                  <div className="p-2 bg-muted rounded">Y: 80</div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-muted rounded">W: 128</div>
                  <div className="p-2 bg-muted rounded">H: 56</div>
                </div>
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 bg-background shadow-md border"
              onClick={() => setRightPanelOpen(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Full Canvas */}
        <main className="flex-1 bg-muted/30 relative overflow-hidden">
          {/* Floating Toolbar */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-background rounded-xl shadow-lg border p-1 z-10">
            {tools.map((tool) => (
              <Button
                key={tool.id}
                variant="ghost"
                size="icon"
                className={cn('h-9 w-9 rounded-lg', activeTool === tool.id && 'bg-primary text-primary-foreground')}
                onClick={() => setActiveTool(tool.id)}
                title={tool.label}
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
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-background rounded-xl shadow-lg border p-1 z-10">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.max(25, zoom - 25))}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm w-14 text-center font-medium">{zoom}%</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.min(200, zoom + 25))}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-5" />
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(100)}>
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Canvas Content */}
          <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `scale(${zoom / 100})` }}>
            <div className="relative w-[900px] h-[600px]">
              {/* Subtle Grid */}
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }} />

              {/* Connection Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" className="fill-primary/60" />
                  </marker>
                </defs>
                <path d="M 160 130 C 220 130, 220 180, 280 180" stroke="currentColor" strokeWidth="2" fill="none" className="text-primary/40" markerEnd="url(#arrowhead)" />
                <path d="M 160 250 C 220 250, 220 180, 280 180" stroke="currentColor" strokeWidth="2" fill="none" className="text-primary/40" markerEnd="url(#arrowhead)" />
                <path d="M 420 180 L 520 180" stroke="currentColor" strokeWidth="2" fill="none" className="text-primary/40" markerEnd="url(#arrowhead)" />
                <path d="M 660 180 L 760 180" stroke="currentColor" strokeWidth="2" fill="none" className="text-primary/40" markerEnd="url(#arrowhead)" />
              </svg>

              {/* Nodes */}
              <div className="absolute left-6 top-24 w-36 bg-background rounded-xl border-2 border-primary shadow-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs text-muted-foreground">Input</span>
                </div>
                <div className="text-sm font-semibold">Case Intake</div>
              </div>

              <div className="absolute left-6 top-56 w-36 bg-background rounded-xl border shadow-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs text-muted-foreground">Input</span>
                </div>
                <div className="text-sm font-semibold">Doc Upload</div>
              </div>

              <div className="absolute left-64 top-36 w-36 bg-background rounded-xl border shadow-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-xs text-muted-foreground">AI</span>
                </div>
                <div className="text-sm font-semibold">Extract Facts</div>
              </div>

              <div className="absolute left-[520px] top-36 w-36 bg-background rounded-xl border shadow-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-xs text-muted-foreground">AI</span>
                </div>
                <div className="text-sm font-semibold">Legal Analysis</div>
              </div>

              <div className="absolute right-6 top-36 w-36 bg-background rounded-xl border shadow-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="text-xs text-muted-foreground">Output</span>
                </div>
                <div className="text-sm font-semibold">Generate Report</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
