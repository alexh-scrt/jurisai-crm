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
  Layers,
  Settings,
  X,
  Move,
  PenTool,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { ThemeColorBar } from '../shared/ThemeSwitcherDropdown'
import { mockWorkflows } from '@/mock-data/workflows'

export function FloatingGlassmorphism() {
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

  // Glass panel styles
  const glassPanel = "bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl"

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-primary/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent" />

      {/* Top Bar - Glass */}
      <header className={cn("relative h-11 flex items-center justify-between px-4", glassPanel, "rounded-none border-t-0 border-x-0")}>
        <div className="flex items-center gap-3">
          <Link to="/layouts/floating" className="text-foreground/60 hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Separator orientation="vertical" className="h-5 bg-white/20" />
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Glassmorphism</span>
          </div>
          <ChevronRight className="h-3 w-3 text-foreground/40" />
          <span className="text-xs text-foreground/60">{selectedWorkflow.name}</span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeColorBar />
          <Separator orientation="vertical" className="h-5 bg-white/20" />
          <Button variant="ghost" size="sm" className="h-7 text-foreground/70 hover:text-foreground hover:bg-white/10">
            <Play className="h-3.5 w-3.5 mr-1" />
            Run
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-foreground/70 hover:text-foreground hover:bg-white/10">
            <Share2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </header>

      <div className="flex-1 relative overflow-hidden">
        {/* Floating Glass Layers Panel */}
        {layersOpen && (
          <div className={cn("absolute left-4 top-4 w-56 rounded-2xl z-20", glassPanel)}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Layers</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-white/10"
                onClick={() => setLayersOpen(false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="p-3 space-y-1">
              {['Case Intake', 'Extract Facts', 'Legal Analysis', 'Generate Report'].map((name, i) => (
                <button
                  key={name}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all',
                    i === 0
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'hover:bg-white/10 text-foreground/80'
                  )}
                >
                  <div className={cn(
                    'w-2 h-2 rounded-full',
                    i === 0 ? 'bg-green-400' : i < 3 ? 'bg-blue-400' : 'bg-purple-400'
                  )} />
                  <span>{name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Floating Glass Properties Panel */}
        {propsOpen && (
          <div className={cn("absolute right-4 top-4 w-64 rounded-2xl z-20", glassPanel)}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Properties</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-white/10"
                onClick={() => setPropsOpen(false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-[10px] text-foreground/50 uppercase tracking-wider">Selected Node</label>
                <div className="text-sm font-medium mt-1">Case Intake</div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <label className="text-[10px] text-foreground/50 uppercase tracking-wider block mb-2">Position</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-foreground/40">X</label>
                    <Input className="h-8 text-xs mt-1 bg-white/10 border-white/20" value="50" readOnly />
                  </div>
                  <div>
                    <label className="text-[10px] text-foreground/40">Y</label>
                    <Input className="h-8 text-xs mt-1 bg-white/10 border-white/20" value="100" readOnly />
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <label className="text-[10px] text-foreground/50 uppercase tracking-wider block mb-2">Size</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-foreground/40">W</label>
                    <Input className="h-8 text-xs mt-1 bg-white/10 border-white/20" value="140" readOnly />
                  </div>
                  <div>
                    <label className="text-[10px] text-foreground/40">H</label>
                    <Input className="h-8 text-xs mt-1 bg-white/10 border-white/20" value="64" readOnly />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Glass Toolbar */}
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
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'hover:bg-white/10 text-foreground/70'
                )}
                onClick={() => setActiveTool(tool.id)}
              >
                <tool.icon className="h-4 w-4" />
              </Button>
            ))}
            <Separator orientation="vertical" className="h-6 mx-1 bg-white/20" />
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white/10 text-foreground/70">
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white/10 text-foreground/70">
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Floating Glass Zoom Controls */}
        <div className={cn("absolute bottom-4 left-1/2 -translate-x-1/2 rounded-2xl p-1.5 z-20", glassPanel)}>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-xl hover:bg-white/10"
              onClick={() => setZoom(Math.max(25, zoom - 25))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm w-14 text-center font-medium">{zoom}%</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-xl hover:bg-white/10"
              onClick={() => setZoom(Math.min(200, zoom + 25))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Panel Toggle Buttons (when closed) */}
        {!layersOpen && (
          <Button
            variant="ghost"
            size="icon"
            className={cn("absolute left-4 top-4 h-10 w-10 rounded-xl z-20", glassPanel)}
            onClick={() => setLayersOpen(true)}
          >
            <Layers className="h-4 w-4" />
          </Button>
        )}
        {!propsOpen && (
          <Button
            variant="ghost"
            size="icon"
            className={cn("absolute right-4 top-4 h-10 w-10 rounded-xl z-20", glassPanel)}
            onClick={() => setPropsOpen(true)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        )}

        {/* Canvas */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `scale(${zoom / 100})` }}>
          <div className="relative w-[800px] h-[500px]">
            {/* Subtle Grid */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />

            {/* Connection Lines with Glow */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <path
                d="M 170 140 C 250 140, 250 170, 330 170"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-primary/50"
                filter="url(#glow)"
              />
              <path
                d="M 450 170 L 530 170"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-primary/50"
                filter="url(#glow)"
              />
              <path
                d="M 650 170 L 730 170"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-primary/50"
                filter="url(#glow)"
              />
            </svg>

            {/* Glass Nodes */}
            <div className={cn(
              "absolute left-6 top-24 w-36 rounded-2xl p-4 cursor-pointer transition-all hover:scale-105",
              glassPanel,
              "border-2 border-primary/50 shadow-[0_0_30px_rgba(var(--primary),0.3)]"
            )}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                <span className="text-[10px] text-foreground/50 uppercase tracking-wider">Input</span>
              </div>
              <div className="text-sm font-semibold">Case Intake</div>
            </div>

            <div className={cn(
              "absolute left-56 top-32 w-36 rounded-2xl p-4 cursor-pointer transition-all hover:scale-105",
              glassPanel
            )}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
                <span className="text-[10px] text-foreground/50 uppercase tracking-wider">AI</span>
              </div>
              <div className="text-sm font-semibold">Extract Facts</div>
            </div>

            <div className={cn(
              "absolute left-[410px] top-32 w-36 rounded-2xl p-4 cursor-pointer transition-all hover:scale-105",
              glassPanel
            )}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
                <span className="text-[10px] text-foreground/50 uppercase tracking-wider">AI</span>
              </div>
              <div className="text-sm font-semibold">Legal Analysis</div>
            </div>

            <div className={cn(
              "absolute right-6 top-32 w-36 rounded-2xl p-4 cursor-pointer transition-all hover:scale-105",
              glassPanel
            )}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.5)]" />
                <span className="text-[10px] text-foreground/50 uppercase tracking-wider">Output</span>
              </div>
              <div className="text-sm font-semibold">Generate Report</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
