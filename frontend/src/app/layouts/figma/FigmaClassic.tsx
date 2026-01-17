import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronRight,
  ChevronDown,
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
  Eye,
  EyeOff,
  Lock,
  MoreHorizontal,
  PenTool,
  Move,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { ThemeColorBar } from '../shared/ThemeSwitcherDropdown'
import { mockWorkflows } from '@/mock-data/workflows'

interface LayerItem {
  id: string
  name: string
  type: 'frame' | 'group' | 'node'
  visible: boolean
  locked: boolean
  children?: LayerItem[]
}

const layersData: LayerItem[] = [
  {
    id: 'frame-1',
    name: 'Workflow Canvas',
    type: 'frame',
    visible: true,
    locked: false,
    children: [
      {
        id: 'group-1',
        name: 'Input Nodes',
        type: 'group',
        visible: true,
        locked: false,
        children: [
          { id: 'node-1', name: 'Case Intake', type: 'node', visible: true, locked: false },
          { id: 'node-2', name: 'Document Upload', type: 'node', visible: true, locked: false },
        ],
      },
      {
        id: 'group-2',
        name: 'Processing',
        type: 'group',
        visible: true,
        locked: false,
        children: [
          { id: 'node-3', name: 'Extract Facts', type: 'node', visible: true, locked: false },
          { id: 'node-4', name: 'Spot Issues', type: 'node', visible: true, locked: false },
          { id: 'node-5', name: 'Legal Analysis', type: 'node', visible: true, locked: false },
        ],
      },
      {
        id: 'group-3',
        name: 'Output',
        type: 'group',
        visible: true,
        locked: false,
        children: [
          { id: 'node-6', name: 'Generate Report', type: 'node', visible: true, locked: false },
        ],
      },
    ],
  },
]

function LayerTreeItem({ item, level = 0, selected, onSelect }: {
  item: LayerItem
  level?: number
  selected: string | null
  onSelect: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(true)
  const [visible, setVisible] = useState(item.visible)
  const hasChildren = item.children && item.children.length > 0

  return (
    <div>
      <div
        onClick={() => onSelect(item.id)}
        className={cn(
          'flex items-center gap-1 py-1 px-2 text-xs hover:bg-muted/80 transition-colors group cursor-pointer',
          selected === item.id && 'bg-primary/10 text-primary'
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation()
            hasChildren && setExpanded(!expanded)
          }}
          className="w-4 h-4 flex items-center justify-center"
        >
          {hasChildren ? (
            expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />
          ) : null}
        </button>
        <Layers className="h-3 w-3 text-muted-foreground flex-shrink-0" />
        <span className="flex-1 truncate">{item.name}</span>
        <button
          onClick={(e) => {
            e.stopPropagation()
            setVisible(!visible)
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3 opacity-50" />}
        </button>
        {item.locked && <Lock className="h-3 w-3 opacity-50" />}
      </div>
      {hasChildren && expanded && (
        <div>
          {item.children!.map((child) => (
            <LayerTreeItem key={child.id} item={child} level={level + 1} selected={selected} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  )
}

export function FigmaClassic() {
  const [zoom, setZoom] = useState(100)
  const [selectedLayer, setSelectedLayer] = useState<string | null>('node-1')
  const [activeTool, setActiveTool] = useState('select')
  const selectedWorkflow = mockWorkflows[0]

  const tools = [
    { id: 'select', icon: MousePointer2, label: 'Select' },
    { id: 'hand', icon: Hand, label: 'Hand' },
    { id: 'move', icon: Move, label: 'Move' },
    { id: 'pen', icon: PenTool, label: 'Pen' },
    { id: 'rect', icon: Square, label: 'Rectangle' },
    { id: 'ellipse', icon: Circle, label: 'Ellipse' },
    { id: 'text', icon: Type, label: 'Text' },
  ]

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Toolbar */}
      <header className="h-12 flex items-center justify-between px-3 border-b bg-muted/30">
        <div className="flex items-center gap-3">
          <Link to="/layouts/figma" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">J</span>
            </div>
            <span className="text-sm font-medium">Classic Layout</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{selectedWorkflow.name}</span>
          </div>
        </div>

        {/* Center Tools */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant="ghost"
              size="icon"
              className={cn('h-8 w-8', activeTool === tool.id && 'bg-background shadow-sm')}
              onClick={() => setActiveTool(tool.id)}
              title={tool.label}
            >
              <tool.icon className="h-4 w-4" />
            </Button>
          ))}
          <Separator orientation="vertical" className="h-6 mx-1" />
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <ThemeColorBar />
          <Separator orientation="vertical" className="h-6" />
          <Button variant="ghost" size="sm">
            <Play className="h-4 w-4 mr-1" />
            Preview
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
          <Badge variant="outline" className="border-green-400 text-green-700">
            Saved
          </Badge>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Layers */}
        <aside className="w-56 border-r bg-muted/20 flex flex-col">
          <div className="p-2 border-b flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Layers</span>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-auto py-1">
            {layersData.map((item) => (
              <LayerTreeItem
                key={item.id}
                item={item}
                selected={selectedLayer}
                onSelect={setSelectedLayer}
              />
            ))}
          </div>
        </aside>

        {/* Center Canvas */}
        <main className="flex-1 bg-muted/50 relative overflow-hidden">
          {/* Zoom Controls */}
          <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-background rounded-lg shadow-md border p-1 z-10">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.max(25, zoom - 25))}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm w-12 text-center">{zoom}%</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.min(200, zoom + 25))}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          {/* Canvas Content */}
          <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `scale(${zoom / 100})` }}>
            <div className="relative w-[800px] h-[500px] bg-background rounded-lg shadow-lg border-2 border-dashed border-muted-foreground/20">
              {/* Grid Pattern */}
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }} />

              {/* Sample Nodes */}
              <div className={cn(
                'absolute left-8 top-20 w-32 bg-background rounded-lg border-2 shadow-lg p-3',
                selectedLayer === 'node-1' ? 'border-primary ring-2 ring-primary/20' : 'border-border'
              )}>
                <div className="text-xs font-medium">Case Intake</div>
                <div className="text-[10px] text-muted-foreground mt-1">Input Node</div>
              </div>

              <div className="absolute left-8 top-44 w-32 bg-background rounded-lg border shadow-md p-3">
                <div className="text-xs font-medium">Doc Upload</div>
                <div className="text-[10px] text-muted-foreground mt-1">Input Node</div>
              </div>

              <div className="absolute left-56 top-32 w-32 bg-background rounded-lg border shadow-md p-3">
                <div className="text-xs font-medium">Extract Facts</div>
                <div className="text-[10px] text-muted-foreground mt-1">AI Processing</div>
              </div>

              <div className="absolute left-[400px] top-32 w-32 bg-background rounded-lg border shadow-md p-3">
                <div className="text-xs font-medium">Legal Analysis</div>
                <div className="text-[10px] text-muted-foreground mt-1">AI Processing</div>
              </div>

              <div className="absolute right-8 top-32 w-32 bg-background rounded-lg border shadow-md p-3">
                <div className="text-xs font-medium">Generate Report</div>
                <div className="text-[10px] text-muted-foreground mt-1">Output Node</div>
              </div>
            </div>
          </div>
        </main>

        {/* Right Panel - Properties */}
        <aside className="w-64 border-l bg-muted/20 flex flex-col">
          <div className="p-2 border-b flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Properties</span>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-auto p-3 space-y-4">
            <div>
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Selected</label>
              <div className="text-sm font-medium mt-1">Case Intake</div>
            </div>

            <Separator />

            <div>
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 block">Position</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-muted-foreground">X</label>
                  <Input className="h-7 text-xs mt-1" value="32" readOnly />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground">Y</label>
                  <Input className="h-7 text-xs mt-1" value="80" readOnly />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 block">Size</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-muted-foreground">W</label>
                  <Input className="h-7 text-xs mt-1" value="128" readOnly />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground">H</label>
                  <Input className="h-7 text-xs mt-1" value="56" readOnly />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 block">Node Config</label>
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] text-muted-foreground">Type</label>
                  <Input className="h-7 text-xs mt-1" value="CaseIntakeForm" readOnly />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground">Label</label>
                  <Input className="h-7 text-xs mt-1" defaultValue="Case Intake" />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 block">Appearance</label>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded border-2 border-primary bg-primary/10" />
                <span className="text-xs">Primary border</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
