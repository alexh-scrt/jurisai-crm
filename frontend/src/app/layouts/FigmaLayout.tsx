import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronRight,
  ChevronDown,
  Layers,
  Square,
  Circle,
  Type,
  Image,
  MousePointer2,
  Hand,
  ZoomIn,
  ZoomOut,
  Undo,
  Redo,
  Play,
  Share2,
  MoreHorizontal,
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { ThemeSwitcherDropdown } from './shared/ThemeSwitcherDropdown'
import { mockWorkflows } from '@/mock-data/workflows'

interface LayerItem {
  id: string
  name: string
  type: 'frame' | 'group' | 'rectangle' | 'text' | 'image'
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
          { id: 'node-1', name: 'Case Intake', type: 'rectangle', visible: true, locked: false },
          { id: 'node-2', name: 'Document Upload', type: 'rectangle', visible: true, locked: false },
        ],
      },
      {
        id: 'group-2',
        name: 'Processing Nodes',
        type: 'group',
        visible: true,
        locked: false,
        children: [
          { id: 'node-3', name: 'Extract Facts', type: 'rectangle', visible: true, locked: false },
          { id: 'node-4', name: 'Spot Issues', type: 'rectangle', visible: true, locked: false },
          { id: 'node-5', name: 'Legal Analysis', type: 'rectangle', visible: true, locked: false },
        ],
      },
      {
        id: 'group-3',
        name: 'Output Nodes',
        type: 'group',
        visible: true,
        locked: false,
        children: [
          { id: 'node-6', name: 'Generate Report', type: 'rectangle', visible: true, locked: false },
        ],
      },
    ],
  },
]

const typeIcons = {
  frame: Layers,
  group: Layers,
  rectangle: Square,
  text: Type,
  image: Image,
}

function LayerTreeItem({ item, level = 0 }: { item: LayerItem; level?: number }) {
  const [expanded, setExpanded] = useState(true)
  const [visible, setVisible] = useState(item.visible)
  const hasChildren = item.children && item.children.length > 0
  const Icon = typeIcons[item.type]

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-1 py-1 px-2 text-sm hover:bg-muted/80 transition-colors group cursor-pointer',
          'text-foreground/80 hover:text-foreground'
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        <button
          onClick={() => hasChildren && setExpanded(!expanded)}
          className="w-4 h-4 flex items-center justify-center"
        >
          {hasChildren ? (
            expanded ? (
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
            )
          ) : null}
        </button>
        <Icon className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
        <span className="flex-1 truncate text-xs">{item.name}</span>
        <button
          onClick={(e) => {
            e.stopPropagation()
            setVisible(!visible)
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {visible ? (
            <Eye className="h-3 w-3 text-muted-foreground" />
          ) : (
            <EyeOff className="h-3 w-3 text-muted-foreground/50" />
          )}
        </button>
        {item.locked && <Lock className="h-3 w-3 text-muted-foreground/50" />}
      </div>
      {hasChildren && expanded && (
        <div>
          {item.children!.map((child) => (
            <LayerTreeItem key={child.id} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export function FigmaLayout() {
  const [zoom, setZoom] = useState(100)
  const selectedWorkflow = mockWorkflows[0]

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Toolbar */}
      <header className="h-12 flex items-center justify-between px-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <Link to="/layouts" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">J</span>
            </div>
            <span className="text-sm font-medium">Figma Style</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{selectedWorkflow.name}</span>
          </div>
        </div>

        {/* Center Tools */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MousePointer2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Hand className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-6 mx-1" />
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Square className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Circle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Type className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-6 mx-1" />
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <ThemeSwitcherDropdown />
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
          <div className="p-2 border-b">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Layers className="h-4 w-4" />
              <span>Layers</span>
            </div>
          </div>
          <div className="flex-1 overflow-auto py-1">
            {layersData.map((item) => (
              <LayerTreeItem key={item.id} item={item} />
            ))}
          </div>
        </aside>

        {/* Center Canvas */}
        <main className="flex-1 bg-muted/50 relative overflow-hidden">
          {/* Zoom Controls */}
          <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-background rounded-lg shadow-md border p-1 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setZoom(Math.max(25, zoom - 25))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm w-12 text-center">{zoom}%</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setZoom(Math.min(200, zoom + 25))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          {/* Canvas Content - Workflow Nodes */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ transform: `scale(${zoom / 100})` }}
          >
            <div className="relative w-[800px] h-[500px]">
              {/* Connection Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <path
                  d="M 120 100 C 200 100, 200 150, 280 150"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-muted-foreground/40"
                />
                <path
                  d="M 120 200 C 200 200, 200 150, 280 150"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-muted-foreground/40"
                />
                <path
                  d="M 400 150 C 480 150, 480 150, 560 150"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-muted-foreground/40"
                />
                <path
                  d="M 400 250 C 480 250, 480 150, 560 150"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-muted-foreground/40"
                />
                <path
                  d="M 680 150 C 720 150, 720 150, 760 150"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-muted-foreground/40"
                />
              </svg>

              {/* Nodes */}
              <div className="absolute left-4 top-16 w-28 bg-background rounded-lg border-2 border-primary shadow-lg p-3">
                <div className="text-xs font-medium">Case Intake</div>
                <div className="text-[10px] text-muted-foreground mt-1">Input Node</div>
              </div>

              <div className="absolute left-4 top-40 w-28 bg-background rounded-lg border shadow-md p-3">
                <div className="text-xs font-medium">Doc Upload</div>
                <div className="text-[10px] text-muted-foreground mt-1">Input Node</div>
              </div>

              <div className="absolute left-60 top-28 w-28 bg-background rounded-lg border shadow-md p-3">
                <div className="text-xs font-medium">Extract Facts</div>
                <div className="text-[10px] text-muted-foreground mt-1">AI Processing</div>
              </div>

              <div className="absolute left-60 top-52 w-28 bg-background rounded-lg border shadow-md p-3">
                <div className="text-xs font-medium">Spot Issues</div>
                <div className="text-[10px] text-muted-foreground mt-1">AI Processing</div>
              </div>

              <div className="absolute left-[520px] top-28 w-28 bg-background rounded-lg border shadow-md p-3">
                <div className="text-xs font-medium">Legal Analysis</div>
                <div className="text-[10px] text-muted-foreground mt-1">AI Processing</div>
              </div>

              <div className="absolute right-4 top-28 w-28 bg-background rounded-lg border shadow-md p-3">
                <div className="text-xs font-medium">Generate Report</div>
                <div className="text-[10px] text-muted-foreground mt-1">Output Node</div>
              </div>
            </div>
          </div>
        </main>

        {/* Right Panel - Properties */}
        <aside className="w-64 border-l bg-muted/20 flex flex-col">
          <div className="p-3 border-b">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Properties</span>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-3 space-y-4">
            {/* Selected Node Info */}
            <div>
              <label className="text-xs text-muted-foreground">Selected</label>
              <div className="text-sm font-medium mt-1">Case Intake</div>
            </div>

            {/* Position */}
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Position</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-muted-foreground">X</label>
                  <Input className="h-7 text-xs" value="16" readOnly />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground">Y</label>
                  <Input className="h-7 text-xs" value="64" readOnly />
                </div>
              </div>
            </div>

            {/* Size */}
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Size</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-muted-foreground">W</label>
                  <Input className="h-7 text-xs" value="112" readOnly />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground">H</label>
                  <Input className="h-7 text-xs" value="56" readOnly />
                </div>
              </div>
            </div>

            <Separator />

            {/* Node Configuration */}
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Configuration</label>
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] text-muted-foreground">Node Type</label>
                  <Input className="h-7 text-xs" value="CaseIntakeForm" readOnly />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground">Label</label>
                  <Input className="h-7 text-xs" defaultValue="Case Intake" />
                </div>
              </div>
            </div>

            <Separator />

            {/* Appearance */}
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Appearance</label>
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] text-muted-foreground">Border Color</label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-6 h-6 rounded border bg-primary" />
                    <Input className="h-7 text-xs flex-1" value="#2563eb" readOnly />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground">Border Width</label>
                  <Input className="h-7 text-xs" value="2px" readOnly />
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
