import { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ReactFlow,
  Background,
  MiniMap,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type Connection,
  type NodeTypes,
  BackgroundVariant,
  Position,
  Handle,
  MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import * as LucideIcons from 'lucide-react'
import {
  ChevronRight,
  Play,
  Share2,
  ChevronLeft,
  Grid3X3,
  Save,
  Sparkles,
  Search,
  FolderOpen,
  Settings,
  Trash2,
  Copy,
  MoreVertical,
  Info,
  Zap,
  Scale,
  FileText,
  GitBranch,
  UserCheck,
  Plug,
  Wrench,
  Flag,
  Circle,
  ArrowRight,
  Minus,
  TriangleRight,
  CircleDot,
  Palette,
  Type,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { ThemeSwitcherDropdown } from '@/app/layouts/shared/ThemeSwitcherDropdown'
import { mockWorkflows } from '@/mock-data/workflows'
import {
  mockComponents,
  componentCategories,
  getNodeColorClasses,
  getComponentById,
  type ComponentDefinition,
} from '@/mock-data/components'
import { sampleNodes, sampleEdges, type WorkflowNodeData } from '@/mock-data/sample-workflow'
import {
  californiaWorkflowNodes,
  californiaWorkflowEdges,
} from '@/mock-data/california-criminal-workflow'

// Map workflow IDs to their node/edge data
const workflowDataMap: Record<string, { nodes: typeof sampleNodes; edges: typeof sampleEdges }> = {
  'wf-1': { nodes: sampleNodes, edges: sampleEdges },
  'ca-criminal-defense-intake': { nodes: californiaWorkflowNodes, edges: californiaWorkflowEdges },
}

// Get workflow data by ID, fallback to sample workflow
function getWorkflowData(id: string | undefined) {
  if (id && workflowDataMap[id]) {
    return workflowDataMap[id]
  }
  return { nodes: sampleNodes, edges: sampleEdges }
}

// Icon mapping for dynamic icon rendering
const categoryIcons: Record<string, React.ElementType> = {
  triggers: Zap,
  'legal-analysis': Scale,
  'legal-generation': FileText,
  'workflow-control': GitBranch,
  'human-gates': UserCheck,
  connectors: Plug,
  utilities: Wrench,
  endpoints: Flag,
}

// Get Lucide icon by name
function getIcon(iconName: string): React.ElementType {
  const icons = LucideIcons as unknown as Record<string, React.ElementType>
  return icons[iconName] || Circle
}

// Status indicator colors and animations
const statusStyles: Record<string, { bg: string; ring: string; animate?: string }> = {
  idle: { bg: 'bg-gray-400', ring: 'ring-gray-400/30' },
  running: { bg: 'bg-blue-400', ring: 'ring-blue-400/50', animate: 'animate-pulse' },
  waiting: { bg: 'bg-orange-400', ring: 'ring-orange-400/50', animate: 'animate-pulse' },
  completed: { bg: 'bg-green-400', ring: 'ring-green-400/30' },
  error: { bg: 'bg-red-400', ring: 'ring-red-400/30' },
}

// Edge/Arrow configuration options
const edgeColors = [
  { value: '#000000', label: 'Black', class: 'bg-black' },
  { value: '#6b7280', label: 'Gray', class: 'bg-gray-500' },
  { value: '#3b82f6', label: 'Blue', class: 'bg-blue-500' },
  { value: '#22c55e', label: 'Green', class: 'bg-green-500' },
  { value: '#ef4444', label: 'Red', class: 'bg-red-500' },
  { value: '#f59e0b', label: 'Orange', class: 'bg-orange-500' },
  { value: '#8b5cf6', label: 'Purple', class: 'bg-purple-500' },
  { value: '#06b6d4', label: 'Cyan', class: 'bg-cyan-500' },
]

const edgeLineStyles = [
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dotted', label: 'Dotted' },
]

const edgeTipStyles = [
  { value: 'arrow', label: 'Arrow', marker: MarkerType.Arrow },
  { value: 'arrowclosed', label: 'Triangle', marker: MarkerType.ArrowClosed },
  { value: 'none', label: 'None', marker: undefined },
]

// Label background color options
const labelBgColors = [
  { value: 'transparent', label: 'Transparent' },
  { value: 'hsl(var(--background))', label: 'Canvas' },
  { value: '#ffffff', label: 'White' },
  { value: '#f8fafc', label: 'Slate 50' },
  { value: '#f1f5f9', label: 'Slate 100' },
]

// Helper to create edge label styles with dashed border
function createEdgeLabelStyles(color: string, bgColor: string = 'hsl(var(--background))') {
  return {
    labelStyle: {
      fill: color,
      fontSize: 11,
      fontWeight: 500,
    },
    labelBgStyle: {
      fill: bgColor,
      fillOpacity: bgColor === 'transparent' ? 0 : 1,
      stroke: color,
      strokeWidth: 1,
      strokeDasharray: '4 2',
      rx: 4,
      ry: 4,
    },
    labelBgPadding: [6, 10] as [number, number],
    labelBgBorderRadius: 4,
  }
}

// Custom Workflow Node Component
function WorkflowNode({ data, selected }: { data: WorkflowNodeData; selected: boolean }) {
  const component = getComponentById(data.componentId)
  const colorClasses = getNodeColorClasses(data.color)
  const Icon = getIcon(data.icon)
  const status = statusStyles[data.status || 'idle']

  // Determine handle positions based on node kind
  const hasInputHandle = data.kind !== 'trigger'
  const hasOutputHandle = data.kind !== 'end'
  const isConditional = data.kind === 'condition' || data.kind === 'gate'
  const isAINode = component?.hasAI === true && !isConditional

  return (
    <div
      className={cn(
        'bg-background/95 backdrop-blur-md border-2 rounded-xl p-3 min-w-[140px] max-w-[180px]',
        'transition-all cursor-pointer',
        colorClasses.border,
        colorClasses.glow,
        selected && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
      )}
    >
      {/* Input Handle */}
      {hasInputHandle && (
        <Handle
          type="target"
          position={Position.Left}
          className={cn(
            'w-3 h-3 rounded-full border-2 border-background',
            colorClasses.bg
          )}
          style={{ left: -6 }}
        />
      )}

      {/* Node Header */}
      <div className="flex items-center gap-2 mb-1.5">
        <div
          className={cn(
            'w-6 h-6 rounded-lg flex items-center justify-center',
            `bg-${data.color}-400/20`
          )}
        >
          <Icon className={cn('w-3.5 h-3.5', `text-${data.color}-400`)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold truncate">{data.label}</div>
        </div>
        {/* Status indicator */}
        <div
          className={cn(
            'w-2 h-2 rounded-full ring-2',
            status.bg,
            status.ring,
            status.animate
          )}
        />
      </div>

      {/* Node Type Badge */}
      <div className="flex items-center gap-1.5">
        <Badge
          variant="secondary"
          className={cn(
            'text-[9px] px-1.5 py-0 h-4',
            `bg-${data.color}-400/10 text-${data.color}-400 border-${data.color}-400/30`
          )}
        >
          {data.kind}
        </Badge>
        {component?.hasAI && (
          <Badge
            variant="secondary"
            className="text-[9px] px-1.5 py-0 h-4 bg-blue-400/10 text-blue-400 border-blue-400/30"
          >
            <Sparkles className="w-2 h-2 mr-0.5" />
            AI
          </Badge>
        )}
      </div>

      {/* Output Handles */}
      {hasOutputHandle && !isConditional && !isAINode && (
        <Handle
          type="source"
          position={Position.Right}
          id="output"
          className={cn(
            'w-3 h-3 rounded-full border-2 border-background',
            colorClasses.bg
          )}
          style={{ right: -6 }}
        />
      )}

      {/* AI Node outputs: Success (green) and Failure (red) */}
      {isAINode && (
        <>
          <Handle
            type="source"
            position={Position.Right}
            id="success"
            className="w-3 h-3 rounded-full border-2 border-background bg-green-400"
            style={{ right: -6, top: '30%' }}
            title="Success - passes artifact to next component"
          />
          <Handle
            type="source"
            position={Position.Right}
            id="failure"
            className="w-3 h-3 rounded-full border-2 border-background bg-red-400"
            style={{ right: -6, top: '70%' }}
            title="Failure - passes failure report for error handling"
          />
        </>
      )}

      {/* Conditional outputs (true/false or approved/rejected) */}
      {isConditional && (
        <>
          <Handle
            type="source"
            position={Position.Right}
            id="true"
            className="w-3 h-3 rounded-full border-2 border-background bg-green-400"
            style={{ right: -6, top: '30%' }}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="false"
            className="w-3 h-3 rounded-full border-2 border-background bg-red-400"
            style={{ right: -6, top: '70%' }}
          />
        </>
      )}
    </div>
  )
}

const nodeTypes: NodeTypes = {
  workflowNode: WorkflowNode,
}

// Default edge options - black solid line with triangle tip
const defaultEdgeOptions = {
  style: { stroke: '#000000', strokeWidth: 2 },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#000000',
  },
}

export function Studio() {
  const { id } = useParams()
  const workflow = mockWorkflows.find((w) => w.id === id) || mockWorkflows[0]
  const workflowData = useMemo(() => getWorkflowData(id), [id])
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  // React Flow state - initialized from workflow data
  const [nodes, setNodes, onNodesChange] = useNodesState(workflowData.nodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(workflowData.edges)

  // Update nodes/edges when workflow changes
  useEffect(() => {
    setNodes(workflowData.nodes)
    setEdges(workflowData.edges)
    setSelectedNode(null)
    setSelectedEdge(null)
  }, [id, workflowData, setNodes, setEdges])

  // UI state
  const [showGrid, setShowGrid] = useState(true)
  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const [rightCollapsed, setRightCollapsed] = useState(false)
  const [selectedNode, setSelectedNode] = useState<Node<WorkflowNodeData> | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // Handle connections
  const onConnect = useCallback(
    (connection: Connection) => {
      // Determine edge style based on handle - default to black
      let edgeColor = '#000000'
      let label = ''

      // Conditional node handles (true/false)
      if (connection.sourceHandle === 'true') {
        edgeColor = '#22c55e'
        label = 'Yes'
      } else if (connection.sourceHandle === 'false') {
        edgeColor = '#ef4444'
        label = 'No'
      }
      // AI node handles (success/failure)
      else if (connection.sourceHandle === 'success') {
        edgeColor = '#22c55e'
        label = 'Success'
      } else if (connection.sourceHandle === 'failure') {
        edgeColor = '#ef4444'
        label = 'Failure'
      }

      // Create label styles with dashed border matching edge color
      const labelStyles = createEdgeLabelStyles(edgeColor)

      const edge: Edge = {
        ...connection,
        id: `e-${connection.source}-${connection.target}-${Date.now()}`,
        style: { stroke: edgeColor, strokeWidth: 2 },
        label,
        ...labelStyles,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edgeColor,
        },
      }

      setEdges((eds) => addEdge(edge, eds))
    },
    [setEdges]
  )

  // Handle node click
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node as Node<WorkflowNodeData>)
    setSelectedEdge(null) // Deselect edge when node is selected
    setRightCollapsed(false)
  }, [])

  // Handle edge click
  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge)
    setSelectedNode(null) // Deselect node when edge is selected
    setRightCollapsed(false)
  }, [])

  // Handle pane click (deselect all)
  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
    setSelectedEdge(null)
  }, [])

  // Handle node drag from palette
  const onDragStart = useCallback(
    (event: React.DragEvent, component: ComponentDefinition) => {
      event.dataTransfer.setData('application/json', JSON.stringify(component))
      event.dataTransfer.effectAllowed = 'move'
    },
    []
  )

  // Handle drop on canvas
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const data = event.dataTransfer.getData('application/json')
      if (!data) return

      const component: ComponentDefinition = JSON.parse(data)

      // Calculate position relative to the canvas
      const bounds = reactFlowWrapper.current?.getBoundingClientRect()
      if (!bounds) return

      const position = {
        x: event.clientX - bounds.left - 80,
        y: event.clientY - bounds.top - 30,
      }

      const newNode: Node<WorkflowNodeData> = {
        id: `${component.id}-${Date.now()}`,
        type: 'workflowNode',
        position,
        data: {
          label: component.displayName,
          componentId: component.id,
          description: component.description,
          kind: component.kind,
          color: component.color,
          icon: component.icon,
          status: 'idle',
        },
      }

      setNodes((nds) => [...nds, newNode])
    },
    [setNodes]
  )

  // Delete selected node
  const deleteSelectedNode = useCallback(() => {
    if (!selectedNode) return
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id))
    setEdges((eds) =>
      eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id)
    )
    setSelectedNode(null)
  }, [selectedNode, setNodes, setEdges])

  // Delete selected edge
  const deleteSelectedEdge = useCallback(() => {
    if (!selectedEdge) return
    setEdges((eds) => eds.filter((e) => e.id !== selectedEdge.id))
    setSelectedEdge(null)
  }, [selectedEdge, setEdges])

  // Update edge properties
  const updateEdge = useCallback(
    (updates: Partial<Edge>) => {
      if (!selectedEdge) return
      setEdges((eds) =>
        eds.map((e) => {
          if (e.id === selectedEdge.id) {
            const updatedEdge = { ...e, ...updates }
            setSelectedEdge(updatedEdge)
            return updatedEdge
          }
          return e
        })
      )
    },
    [selectedEdge, setEdges]
  )

  // Update edge color (also updates label border and text color)
  const updateEdgeColor = useCallback(
    (color: string) => {
      if (!selectedEdge) return
      const currentStyle = (selectedEdge.style as React.CSSProperties) || {}
      const newStyle = { ...currentStyle, stroke: color }
      const newMarkerEnd = selectedEdge.markerEnd
        ? { ...(selectedEdge.markerEnd as { type: MarkerType; color: string }), color }
        : { type: MarkerType.ArrowClosed, color }
      // Also update label styles to match new color
      const currentBgColor =
        ((selectedEdge.labelBgStyle as React.CSSProperties)?.fill as string) ||
        'hsl(var(--background))'
      const labelStyles = createEdgeLabelStyles(color, currentBgColor)
      updateEdge({ style: newStyle, markerEnd: newMarkerEnd, ...labelStyles })
    },
    [selectedEdge, updateEdge]
  )

  // Update edge line style
  const updateEdgeLineStyle = useCallback(
    (lineStyle: string) => {
      if (!selectedEdge) return
      const currentStyle = (selectedEdge.style as React.CSSProperties) || {}
      let strokeDasharray: string | undefined
      if (lineStyle === 'dashed') {
        strokeDasharray = '8 4'
      } else if (lineStyle === 'dotted') {
        strokeDasharray = '2 2'
      }
      const newStyle = { ...currentStyle, strokeDasharray }
      updateEdge({ style: newStyle })
    },
    [selectedEdge, updateEdge]
  )

  // Update edge tip style
  const updateEdgeTipStyle = useCallback(
    (tipStyle: string) => {
      if (!selectedEdge) return
      const tip = edgeTipStyles.find((t) => t.value === tipStyle)
      const currentColor =
        ((selectedEdge.style as React.CSSProperties)?.stroke as string) || '#000000'
      const newMarkerEnd = tip?.marker
        ? { type: tip.marker, color: currentColor }
        : undefined
      updateEdge({ markerEnd: newMarkerEnd })
    },
    [selectedEdge, updateEdge]
  )

  // Update edge label
  const updateEdgeLabel = useCallback(
    (label: string) => {
      if (!selectedEdge) return
      const edgeColor =
        ((selectedEdge.style as React.CSSProperties)?.stroke as string) || '#000000'
      const currentBgColor =
        ((selectedEdge.labelBgStyle as React.CSSProperties)?.fill as string) ||
        'hsl(var(--background))'
      const labelStyles = createEdgeLabelStyles(edgeColor, currentBgColor)
      updateEdge({
        label,
        ...labelStyles,
      })
    },
    [selectedEdge, updateEdge]
  )

  // Update edge label background color
  const updateEdgeLabelBgColor = useCallback(
    (bgColor: string) => {
      if (!selectedEdge) return
      const edgeColor =
        ((selectedEdge.style as React.CSSProperties)?.stroke as string) || '#000000'
      const labelStyles = createEdgeLabelStyles(edgeColor, bgColor)
      updateEdge(labelStyles)
    },
    [selectedEdge, updateEdge]
  )

  // Duplicate selected node
  const duplicateSelectedNode = useCallback(() => {
    if (!selectedNode) return
    const newNode: Node<WorkflowNodeData> = {
      ...selectedNode,
      id: `${selectedNode.data.componentId}-${Date.now()}`,
      position: {
        x: selectedNode.position.x + 50,
        y: selectedNode.position.y + 50,
      },
    }
    setNodes((nds) => [...nds, newNode])
  }, [selectedNode, setNodes])

  // Filter components by search and category
  const filteredComponents = useMemo(() => {
    return mockComponents.filter((c) => {
      const matchesSearch =
        !searchQuery ||
        c.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = !activeCategory || c.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, activeCategory])

  // Group components by category
  const groupedComponents = useMemo(() => {
    return componentCategories.map((cat) => ({
      ...cat,
      components: filteredComponents.filter((c) => c.category === cat.id),
    }))
  }, [filteredComponents])

  // Neon style classes
  const neonPanel =
    'bg-background/95 backdrop-blur-md border-2 shadow-lg'
  const neonGlow = 'shadow-[0_0_15px_rgba(var(--primary),0.3)]'

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col bg-background">
        {/* Top Bar */}
        <header
          className={cn(
            'h-12 flex items-center justify-between px-4 border-b-2 border-primary/40',
            neonGlow
          )}
        >
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
              <span className="text-sm font-semibold">JurisAI Studio</span>
            </Link>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm font-medium">{workflow.name}</span>
            <Badge variant="outline" className="text-xs border-primary/30">
              v{workflow.version}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                'text-xs',
                workflow.status === 'deployed'
                  ? 'border-green-400/50 text-green-400'
                  : 'border-yellow-400/50 text-yellow-400'
              )}
            >
              {workflow.status}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <ThemeSwitcherDropdown />
            <Separator orientation="vertical" className="h-5" />
            <Button
              variant={showGrid ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7"
              onClick={() => setShowGrid(!showGrid)}
            >
              <Grid3X3 className="h-3.5 w-3.5 mr-1" />
              Grid
            </Button>
            <Separator orientation="vertical" className="h-5" />
            <Button
              variant="outline"
              size="sm"
              className="h-7 border-primary/30 hover:border-primary/50"
            >
              <Save className="h-3.5 w-3.5 mr-1" />
              Save
            </Button>
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
          {/* Left Panel - Component Palette */}
          <div
            className={cn(
              'absolute left-4 top-4 bottom-4 z-20 transition-all duration-300',
              leftCollapsed ? 'w-12' : 'w-72'
            )}
          >
            <div
              className={cn(
                neonPanel,
                'h-full border-primary/50 rounded-xl overflow-hidden flex flex-col',
                'shadow-[0_0_20px_rgba(var(--primary),0.2),inset_0_0_20px_rgba(var(--primary),0.05)]'
              )}
            >
              {/* Panel Header */}
              <div className="h-11 flex items-center justify-between px-3 border-b border-primary/30 bg-primary/5 shrink-0">
                {!leftCollapsed && (
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Components</span>
                  </div>
                )}
                {leftCollapsed && (
                  <FolderOpen className="h-4 w-4 text-primary mx-auto" />
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={() => setLeftCollapsed(!leftCollapsed)}
                >
                  {leftCollapsed ? (
                    <ChevronRight className="h-3 w-3" />
                  ) : (
                    <ChevronLeft className="h-3 w-3" />
                  )}
                </Button>
              </div>

              {!leftCollapsed && (
                <>
                  {/* Search */}
                  <div className="p-3 border-b border-primary/20">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        placeholder="Search components..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-8 pl-8 text-xs border-primary/30 focus:shadow-[0_0_8px_rgba(var(--primary),0.4)]"
                      />
                    </div>
                  </div>

                  {/* Category Tabs */}
                  <div className="p-2 border-b border-primary/20">
                    <div className="flex flex-wrap gap-1">
                      <Badge
                        variant={activeCategory === null ? 'default' : 'outline'}
                        className="cursor-pointer text-[10px]"
                        onClick={() => setActiveCategory(null)}
                      >
                        All
                      </Badge>
                      {componentCategories.map((cat) => {
                        const CatIcon = categoryIcons[cat.id] || Wrench
                        return (
                          <Tooltip key={cat.id}>
                            <TooltipTrigger asChild>
                              <Badge
                                variant={
                                  activeCategory === cat.id ? 'default' : 'outline'
                                }
                                className="cursor-pointer text-[10px]"
                                onClick={() =>
                                  setActiveCategory(
                                    activeCategory === cat.id ? null : cat.id
                                  )
                                }
                              >
                                <CatIcon className="h-3 w-3 mr-1" />
                                {cat.name.split(' / ')[0]}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              <p className="text-xs">{cat.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        )
                      })}
                    </div>
                  </div>

                  {/* Component List */}
                  <ScrollArea className="flex-1">
                    <div className="p-2">
                      {groupedComponents.map((category) =>
                        category.components.length > 0 ? (
                          <div key={category.id} className="mb-4">
                            <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2 flex items-center gap-1">
                              {(() => {
                                const CatIcon = categoryIcons[category.id] || Wrench
                                return <CatIcon className="h-3 w-3" />
                              })()}
                              {category.name}
                            </h4>
                            <div className="space-y-1">
                              {category.components.map((component) => {
                                const Icon = getIcon(component.icon)
                                return (
                                  <div
                                    key={component.id}
                                    draggable
                                    onDragStart={(e) => onDragStart(e, component)}
                                    className={cn(
                                      'p-2 rounded-lg cursor-grab active:cursor-grabbing transition-all',
                                      'hover:bg-primary/10 hover:shadow-[0_0_10px_rgba(var(--primary),0.2)]',
                                      'border border-transparent hover:border-primary/30'
                                    )}
                                  >
                                    <div className="flex items-center gap-2">
                                      <div
                                        className={cn(
                                          'w-6 h-6 rounded-md flex items-center justify-center',
                                          `bg-${component.color}-400/20`
                                        )}
                                      >
                                        <Icon
                                          className={cn(
                                            'h-3.5 w-3.5',
                                            `text-${component.color}-400`
                                          )}
                                        />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1">
                                          <span className="text-xs font-medium truncate">
                                            {component.displayName}
                                          </span>
                                          {component.hasAI && (
                                            <Sparkles className="h-3 w-3 text-blue-400 shrink-0" />
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2 pl-8">
                                      {component.description}
                                    </p>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        ) : null
                      )}
                    </div>
                  </ScrollArea>
                </>
              )}
            </div>
          </div>

          {/* Right Panel - Properties */}
          <div
            className={cn(
              'absolute right-4 top-4 bottom-4 z-20 transition-all duration-300',
              rightCollapsed ? 'w-12' : 'w-80'
            )}
          >
            <div
              className={cn(
                neonPanel,
                'h-full border-primary/50 rounded-xl overflow-hidden flex flex-col',
                'shadow-[0_0_20px_rgba(var(--primary),0.2),inset_0_0_20px_rgba(var(--primary),0.05)]'
              )}
            >
              <div className="h-11 flex items-center justify-between px-3 border-b border-primary/30 bg-primary/5 shrink-0">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-primary" />
                  {!rightCollapsed && (
                    <span className="text-sm font-medium">Properties</span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setRightCollapsed(!rightCollapsed)}
                >
                  {rightCollapsed ? (
                    <ChevronLeft className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </Button>
              </div>

              {!rightCollapsed && (
                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-4">
                    {selectedNode ? (
                      <>
                        {/* Node Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {(() => {
                              const Icon = getIcon(selectedNode.data.icon)
                              return (
                                <div
                                  className={cn(
                                    'w-8 h-8 rounded-lg flex items-center justify-center',
                                    `bg-${selectedNode.data.color}-400/20`
                                  )}
                                >
                                  <Icon
                                    className={cn(
                                      'h-4 w-4',
                                      `text-${selectedNode.data.color}-400`
                                    )}
                                  />
                                </div>
                              )
                            })()}
                            <div>
                              <div className="text-sm font-semibold">
                                {selectedNode.data.label}
                              </div>
                              <div className="text-[10px] text-muted-foreground">
                                {selectedNode.data.componentId}
                              </div>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={duplicateSelectedNode}>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={deleteSelectedNode}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Description */}
                        {selectedNode.data.description && (
                          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                            <div className="flex items-start gap-2">
                              <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                              <p className="text-xs text-muted-foreground">
                                {selectedNode.data.description}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Status */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-4 bg-primary/50 rounded-full" />
                            <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                              Status
                            </label>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
                            <div
                              className={cn(
                                'w-2 h-2 rounded-full',
                                statusStyles[selectedNode.data.status || 'idle'].bg,
                                statusStyles[selectedNode.data.status || 'idle'].animate
                              )}
                            />
                            <span className="text-xs capitalize">
                              {selectedNode.data.status || 'idle'}
                            </span>
                          </div>
                        </div>

                        {/* Node Configuration */}
                        <Tabs defaultValue="config" className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="config" className="text-xs">
                              Config
                            </TabsTrigger>
                            <TabsTrigger value="ports" className="text-xs">
                              Ports
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="config" className="space-y-3 pt-3">
                            <div>
                              <label className="text-[10px] text-muted-foreground">
                                Label
                              </label>
                              <Input
                                className="h-8 text-xs mt-1 border-primary/30"
                                value={selectedNode.data.label}
                                onChange={(e) => {
                                  setNodes((nds) =>
                                    nds.map((n) =>
                                      n.id === selectedNode.id
                                        ? {
                                            ...n,
                                            data: { ...n.data, label: e.target.value },
                                          }
                                        : n
                                    )
                                  )
                                }}
                              />
                            </div>
                            {selectedNode.data.config &&
                              Object.entries(selectedNode.data.config).map(
                                ([key, value]) => (
                                  <div key={key}>
                                    <label className="text-[10px] text-muted-foreground capitalize">
                                      {key.replace(/_/g, ' ')}
                                    </label>
                                    <Input
                                      className="h-8 text-xs mt-1 border-primary/30"
                                      value={String(value)}
                                      readOnly
                                    />
                                  </div>
                                )
                              )}
                          </TabsContent>

                          <TabsContent value="ports" className="space-y-4 pt-3">
                            {(() => {
                              const component = getComponentById(
                                selectedNode.data.componentId
                              )
                              if (!component) return null

                              return (
                                <>
                                  {/* Inputs */}
                                  {component.inputs.length > 0 && (
                                    <div>
                                      <label className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-primary/50" />
                                        Inputs
                                      </label>
                                      <div className="mt-2 space-y-1">
                                        {component.inputs.map((port) => (
                                          <div
                                            key={port.id}
                                            className="flex items-center justify-between p-2 rounded bg-muted/50 text-xs"
                                          >
                                            <div className="flex items-center gap-2">
                                              <span className="font-medium">
                                                {port.name}
                                              </span>
                                              {port.required && (
                                                <span className="text-red-400">*</span>
                                              )}
                                            </div>
                                            <Badge variant="outline" className="text-[9px]">
                                              {port.type}
                                            </Badge>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Outputs */}
                                  {component.outputs.length > 0 && (
                                    <div>
                                      <label className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-green-400/50" />
                                        Outputs
                                      </label>
                                      <div className="mt-2 space-y-1">
                                        {component.outputs.map((port) => (
                                          <div
                                            key={port.id}
                                            className="flex items-center justify-between p-2 rounded bg-muted/50 text-xs"
                                          >
                                            <span className="font-medium">
                                              {port.name}
                                            </span>
                                            <Badge variant="outline" className="text-[9px]">
                                              {port.type}
                                            </Badge>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </>
                              )
                            })()}
                          </TabsContent>
                        </Tabs>

                        {/* AI Toggle */}
                        {(() => {
                          const component = getComponentById(
                            selectedNode.data.componentId
                          )
                          if (!component?.hasAI) return null

                          return (
                            <div className="pt-2 border-t border-primary/20">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Sparkles className="h-4 w-4 text-blue-400" />
                                  <span className="text-xs font-medium">AI Enabled</span>
                                </div>
                                <Badge
                                  variant="outline"
                                  className="text-[9px] bg-blue-400/10 text-blue-400 border-blue-400/30"
                                >
                                  Active
                                </Badge>
                              </div>
                              {component.aiToggles && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {component.aiToggles.map((toggle) => (
                                    <Badge
                                      key={toggle}
                                      variant="secondary"
                                      className="text-[9px]"
                                    >
                                      {toggle}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          )
                        })()}
                      </>
                    ) : selectedEdge ? (
                      <>
                        {/* Edge Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-muted">
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold">Connection</div>
                              <div className="text-[10px] text-muted-foreground">
                                {selectedEdge.source} → {selectedEdge.target}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={deleteSelectedEdge}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Edge Label */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Type className="h-3.5 w-3.5 text-primary" />
                            <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                              Label
                            </label>
                          </div>
                          <Input
                            className="h-8 text-xs border-primary/30"
                            placeholder="Enter label text..."
                            value={(selectedEdge.label as string) || ''}
                            onChange={(e) => updateEdgeLabel(e.target.value)}
                          />
                          <p className="text-[10px] text-muted-foreground">
                            Label box has dashed border matching edge color
                          </p>
                        </div>

                        {/* Label Background */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="h-3.5 w-3.5 rounded border-2 border-dashed border-primary" />
                            <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                              Label Background
                            </label>
                          </div>
                          <Select
                            value={(() => {
                              const bgFill =
                                (selectedEdge.labelBgStyle as React.CSSProperties)?.fill
                              if (!bgFill || bgFill === 'hsl(var(--background))') return 'hsl(var(--background))'
                              if (bgFill === 'transparent') return 'transparent'
                              return bgFill as string
                            })()}
                            onValueChange={updateEdgeLabelBgColor}
                          >
                            <SelectTrigger className="h-8 text-xs border-primary/30">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {labelBgColors.map((bg) => (
                                <SelectItem key={bg.value} value={bg.value}>
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={cn(
                                        'w-4 h-4 rounded border',
                                        bg.value === 'transparent'
                                          ? 'bg-[repeating-linear-gradient(45deg,#ccc,#ccc_2px,transparent_2px,transparent_4px)]'
                                          : ''
                                      )}
                                      style={{
                                        backgroundColor:
                                          bg.value === 'transparent' ? undefined : bg.value,
                                      }}
                                    />
                                    <span>{bg.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Edge Color */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Palette className="h-3.5 w-3.5 text-primary" />
                            <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                              Color
                            </label>
                          </div>
                          <div className="grid grid-cols-4 gap-2">
                            {edgeColors.map((color) => {
                              const currentColor =
                                ((selectedEdge.style as React.CSSProperties)?.stroke as string) ||
                                '#000000'
                              const isSelected = currentColor === color.value
                              return (
                                <button
                                  key={color.value}
                                  onClick={() => updateEdgeColor(color.value)}
                                  className={cn(
                                    'h-8 rounded-md border-2 transition-all flex items-center justify-center',
                                    color.class,
                                    isSelected
                                      ? 'border-primary ring-2 ring-primary/30'
                                      : 'border-transparent hover:border-muted-foreground/50'
                                  )}
                                  title={color.label}
                                >
                                  {isSelected && (
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                  )}
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        {/* Edge Line Style */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Minus className="h-3.5 w-3.5 text-primary" />
                            <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                              Line Style
                            </label>
                          </div>
                          <Select
                            value={(() => {
                              const dasharray =
                                (selectedEdge.style as React.CSSProperties)?.strokeDasharray
                              if (dasharray === '8 4') return 'dashed'
                              if (dasharray === '2 2') return 'dotted'
                              return 'solid'
                            })()}
                            onValueChange={updateEdgeLineStyle}
                          >
                            <SelectTrigger className="h-8 text-xs border-primary/30">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {edgeLineStyles.map((style) => (
                                <SelectItem key={style.value} value={style.value}>
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-8 h-0.5 bg-foreground"
                                      style={{
                                        borderStyle: style.value,
                                        borderTopWidth: style.value === 'solid' ? 0 : 2,
                                        borderColor: 'currentColor',
                                        background:
                                          style.value === 'solid' ? 'currentColor' : 'transparent',
                                      }}
                                    />
                                    <span>{style.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Edge Tip Style */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <TriangleRight className="h-3.5 w-3.5 text-primary" />
                            <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                              Arrow Tip
                            </label>
                          </div>
                          <Select
                            value={(() => {
                              const marker = selectedEdge.markerEnd as
                                | { type: MarkerType }
                                | undefined
                              if (!marker) return 'none'
                              if (marker.type === MarkerType.Arrow) return 'arrow'
                              return 'arrowclosed'
                            })()}
                            onValueChange={updateEdgeTipStyle}
                          >
                            <SelectTrigger className="h-8 text-xs border-primary/30">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {edgeTipStyles.map((tip) => (
                                <SelectItem key={tip.value} value={tip.value}>
                                  <div className="flex items-center gap-2">
                                    {tip.value === 'arrow' && (
                                      <ArrowRight className="h-4 w-4" />
                                    )}
                                    {tip.value === 'arrowclosed' && (
                                      <TriangleRight className="h-4 w-4" />
                                    )}
                                    {tip.value === 'none' && (
                                      <CircleDot className="h-4 w-4" />
                                    )}
                                    <span>{tip.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Connection Info */}
                        <div className="pt-2 border-t border-primary/20">
                          <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">From</span>
                              <span className="font-medium">{selectedEdge.source}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">To</span>
                              <span className="font-medium">{selectedEdge.target}</span>
                            </div>
                            {selectedEdge.sourceHandle && (
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Output</span>
                                <Badge variant="outline" className="text-[9px]">
                                  {selectedEdge.sourceHandle}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-muted-foreground py-8">
                        <Settings className="h-8 w-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">Select a node or connection</p>
                        <p className="text-xs mt-1">
                          Click on nodes or arrows to configure them
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>

          {/* React Flow Canvas */}
          <div
            ref={reactFlowWrapper}
            className="absolute inset-0"
            onDragOver={onDragOver}
            onDrop={onDrop}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onEdgeClick={onEdgeClick}
              onPaneClick={onPaneClick}
              nodeTypes={nodeTypes}
              defaultEdgeOptions={defaultEdgeOptions}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              proOptions={{ hideAttribution: true }}
              snapToGrid={showGrid}
              snapGrid={[20, 20]}
              connectionLineStyle={{ stroke: '#000000', strokeWidth: 2 }}
            >
              {showGrid && (
                <Background
                  variant={BackgroundVariant.Dots}
                  gap={20}
                  size={1}
                  color="hsl(var(--primary) / 0.15)"
                />
              )}
              <Controls
                className="!bg-background/80 !backdrop-blur-md !border-2 !border-primary/30 !rounded-xl !shadow-[0_0_15px_rgba(var(--primary),0.2)]"
                showZoom={true}
                showFitView={true}
                showInteractive={false}
              />
              <MiniMap
                nodeStrokeWidth={3}
                pannable
                zoomable
                className="!bg-background/80 !backdrop-blur-md !border-2 !border-primary/30 !rounded-xl !shadow-[0_0_15px_rgba(var(--primary),0.2)]"
                maskColor="hsl(var(--background) / 0.8)"
              />
            </ReactFlow>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
