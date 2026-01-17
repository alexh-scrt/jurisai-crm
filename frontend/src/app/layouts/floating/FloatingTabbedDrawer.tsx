import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronRight,
  ChevronUp,
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
  Palette,
  Link2,
  Move,
  PenTool,
  Minus,
  Maximize2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ThemeColorBar } from '../shared/ThemeSwitcherDropdown'
import { mockWorkflows } from '@/mock-data/workflows'

type DrawerState = 'collapsed' | 'peek' | 'expanded'

interface Tab {
  id: string
  label: string
  icon: React.ElementType
}

const tabs: Tab[] = [
  { id: 'layers', label: 'Layers', icon: Layers },
  { id: 'properties', label: 'Properties', icon: Settings },
  { id: 'style', label: 'Style', icon: Palette },
  { id: 'connections', label: 'Links', icon: Link2 },
]

export function FloatingTabbedDrawer() {
  const [zoom, setZoom] = useState(100)
  const [activeTool, setActiveTool] = useState('select')
  const [drawerState, setDrawerState] = useState<DrawerState>('peek')
  const [activeTab, setActiveTab] = useState('layers')
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

  const cycleDrawerState = () => {
    const states: DrawerState[] = ['collapsed', 'peek', 'expanded']
    const currentIndex = states.indexOf(drawerState)
    const nextIndex = (currentIndex + 1) % states.length
    setDrawerState(states[nextIndex])
  }

  const drawerHeight = {
    collapsed: 'h-12',
    peek: 'h-48',
    expanded: 'h-[400px]',
  }

  return (
    <div className="h-screen flex flex-col bg-muted/40">
      {/* Top Bar */}
      <header className="h-10 flex items-center justify-between px-3 bg-background border-b">
        <div className="flex items-center gap-3">
          <Link to="/layouts/floating" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Separator orientation="vertical" className="h-5" />
          <span className="text-sm font-medium">Tabbed Drawer</span>
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

      <div className="flex-1 relative overflow-hidden">
        {/* Floating Toolbar - Top Center */}
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

        {/* Zoom Controls - Top Right */}
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-background rounded-xl shadow-xl border p-1 z-20">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.max(25, zoom - 25))}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs w-10 text-center">{zoom}%</span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.min(200, zoom + 25))}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        {/* Canvas */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-all duration-300"
          style={{
            transform: `scale(${zoom / 100})`,
            paddingBottom: drawerState === 'expanded' ? '400px' : drawerState === 'peek' ? '192px' : '48px'
          }}
        >
          <div className="relative w-[800px] h-[400px]">
            {/* Grid */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }} />

            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path d="M 170 110 C 250 110, 250 140, 330 140" stroke="currentColor" strokeWidth="2" fill="none" className="text-primary/30" />
              <path d="M 450 140 L 530 140" stroke="currentColor" strokeWidth="2" fill="none" className="text-primary/30" />
              <path d="M 650 140 L 730 140" stroke="currentColor" strokeWidth="2" fill="none" className="text-primary/30" />
            </svg>

            {/* Nodes */}
            <div className="absolute left-8 top-16 w-36 bg-background rounded-xl border-2 border-primary shadow-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-[10px] text-muted-foreground uppercase">Input</span>
              </div>
              <div className="text-sm font-semibold">Case Intake</div>
            </div>

            <div className="absolute left-56 top-24 w-36 bg-background rounded-xl border shadow-md p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[10px] text-muted-foreground uppercase">AI</span>
              </div>
              <div className="text-sm font-semibold">Extract Facts</div>
            </div>

            <div className="absolute left-[400px] top-24 w-36 bg-background rounded-xl border shadow-md p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[10px] text-muted-foreground uppercase">AI</span>
              </div>
              <div className="text-sm font-semibold">Legal Analysis</div>
            </div>

            <div className="absolute right-8 top-24 w-36 bg-background rounded-xl border shadow-md p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-[10px] text-muted-foreground uppercase">Output</span>
              </div>
              <div className="text-sm font-semibold">Generate Report</div>
            </div>
          </div>
        </div>

        {/* Bottom Drawer */}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 bg-background border-t shadow-2xl transition-all duration-300 z-30",
          drawerHeight[drawerState]
        )}>
          {/* Drawer Handle */}
          <div className="h-12 flex items-center justify-between px-4 border-b">
            <div className="flex items-center gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors',
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={cycleDrawerState}>
                {drawerState === 'collapsed' && <ChevronUp className="h-4 w-4" />}
                {drawerState === 'peek' && <Maximize2 className="h-4 w-4" />}
                {drawerState === 'expanded' && <Minus className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Drawer Content */}
          {drawerState !== 'collapsed' && (
            <div className="p-4 overflow-auto" style={{ height: 'calc(100% - 48px)' }}>
              {activeTab === 'layers' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Case Intake', 'Extract Facts', 'Legal Analysis', 'Generate Report'].map((name, i) => (
                    <button
                      key={name}
                      className={cn(
                        'p-3 rounded-xl border text-left transition-all hover:shadow-md',
                        i === 0 ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={cn(
                          'w-2 h-2 rounded-full',
                          i === 0 ? 'bg-green-500' : i < 3 ? 'bg-blue-500' : 'bg-purple-500'
                        )} />
                        <Badge variant="secondary" className="text-[10px]">
                          {i === 0 ? 'input' : i < 3 ? 'ai' : 'output'}
                        </Badge>
                      </div>
                      <div className="text-sm font-medium">{name}</div>
                    </button>
                  ))}
                </div>
              )}

              {activeTab === 'properties' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-muted/50">
                    <label className="text-xs text-muted-foreground uppercase">Selected</label>
                    <div className="text-lg font-semibold mt-1">Case Intake</div>
                    <div className="text-sm text-muted-foreground">CaseIntakeForm</div>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50">
                    <label className="text-xs text-muted-foreground uppercase">Position</label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <label className="text-[10px] text-muted-foreground">X</label>
                        <Input className="h-8 text-sm mt-1" value="50" readOnly />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground">Y</label>
                        <Input className="h-8 text-sm mt-1" value="100" readOnly />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50">
                    <label className="text-xs text-muted-foreground uppercase">Size</label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <label className="text-[10px] text-muted-foreground">Width</label>
                        <Input className="h-8 text-sm mt-1" value="140" readOnly />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground">Height</label>
                        <Input className="h-8 text-sm mt-1" value="64" readOnly />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'style' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl border">
                    <label className="text-xs text-muted-foreground">Border</label>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-8 h-8 rounded border-2 border-primary" />
                      <span className="text-sm">Primary</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border">
                    <label className="text-xs text-muted-foreground">Background</label>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-8 h-8 rounded bg-background border" />
                      <span className="text-sm">White</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border">
                    <label className="text-xs text-muted-foreground">Radius</label>
                    <div className="text-lg font-medium mt-2">12px</div>
                  </div>
                  <div className="p-4 rounded-xl border">
                    <label className="text-xs text-muted-foreground">Shadow</label>
                    <div className="text-lg font-medium mt-2">Large</div>
                  </div>
                </div>
              )}

              {activeTab === 'connections' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border">
                    <label className="text-xs text-muted-foreground uppercase mb-3 block">Inputs</label>
                    <div className="text-sm text-muted-foreground italic">No inputs (start node)</div>
                  </div>
                  <div className="p-4 rounded-xl border">
                    <label className="text-xs text-muted-foreground uppercase mb-3 block">Outputs</label>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-sm font-medium">Extract Facts</span>
                      <Badge variant="outline" className="text-[10px] ml-auto">connected</Badge>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
