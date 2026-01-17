import { useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  type Node,
  type NodeTypes,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import {
  Save,
  Play,
  Settings,
  History,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Circle,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { mockComponents, componentCategories } from '@/mock-data/components'
import { sampleNodes, sampleEdges } from '@/mock-data/sample-workflow'
import { mockWorkflows } from '@/mock-data/workflows'

// Custom Node Components
function TriggerNode({ data }: { data: { label: string; description?: string } }) {
  return (
    <div className="bg-card border-2 border-green-500 rounded-lg p-3 min-w-[150px] shadow-md">
      <div className="flex items-center gap-2 mb-1">
        <Circle className="h-4 w-4 text-green-500 fill-green-500" />
        <span className="font-medium text-sm">{data.label}</span>
      </div>
      {data.description && (
        <p className="text-xs text-muted-foreground">{data.description}</p>
      )}
    </div>
  )
}

function AINode({ data }: { data: { label: string; componentId: string; hasAI: boolean } }) {
  return (
    <div className="bg-card border-2 border-primary rounded-lg p-3 min-w-[150px] shadow-md">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="font-medium text-sm">{data.label}</span>
      </div>
      <Badge variant="secondary" className="text-xs">
        AI-powered
      </Badge>
    </div>
  )
}

function GateNode({ data }: { data: { label: string; componentId: string } }) {
  return (
    <div className="bg-card border-2 border-yellow-500 rounded-lg p-3 min-w-[150px] shadow-md">
      <div className="flex items-center gap-2 mb-1">
        <CheckCircle className="h-4 w-4 text-yellow-500" />
        <span className="font-medium text-sm">{data.label}</span>
      </div>
      <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-700">
        Approval Gate
      </Badge>
    </div>
  )
}

function EndNode({ data }: { data: { label: string; description?: string } }) {
  return (
    <div className="bg-card border-2 border-red-500 rounded-lg p-3 min-w-[150px] shadow-md">
      <div className="flex items-center gap-2 mb-1">
        <XCircle className="h-4 w-4 text-red-500" />
        <span className="font-medium text-sm">{data.label}</span>
      </div>
      {data.description && (
        <p className="text-xs text-muted-foreground">{data.description}</p>
      )}
    </div>
  )
}

const nodeTypes: NodeTypes = {
  triggerNode: TriggerNode,
  aiNode: AINode,
  gateNode: GateNode,
  endNode: EndNode,
}

export function WorkflowEditor() {
  const { id } = useParams()
  const workflow = mockWorkflows.find((w) => w.id === id) || mockWorkflows[0]

  const [nodes, , onNodesChange] = useNodesState(sampleNodes as Node[])
  const [edges, , onEdgesChange] = useEdgesState(sampleEdges)

  const [leftPanelOpen, setLeftPanelOpen] = useState(true)
  const [rightPanelOpen, setRightPanelOpen] = useState(true)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
    setRightPanelOpen(true)
  }, [])

  const filteredComponents = mockComponents.filter(
    (c) =>
      c.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const groupedComponents = componentCategories.map((cat) => ({
    ...cat,
    components: filteredComponents.filter((c) => c.category === cat.id),
  }))

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col -m-6">
      {/* Toolbar */}
      <div className="h-14 border-b bg-card flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Input
            value={workflow.name}
            className="w-64 font-medium"
            readOnly
          />
          <Badge variant="outline">v{workflow.version}</Badge>
          <Badge
            variant="outline"
            className={
              workflow.status === 'deployed'
                ? 'border-green-500 text-green-700'
                : 'border-yellow-500 text-yellow-700'
            }
          >
            {workflow.status}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <History className="h-4 w-4 mr-2" />
            History
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button size="sm">
            <Play className="h-4 w-4 mr-2" />
            Deploy
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Component Library */}
        <div
          className={cn(
            'border-r bg-card transition-all duration-300 flex flex-col',
            leftPanelOpen ? 'w-72' : 'w-0'
          )}
        >
          {leftPanelOpen && (
            <>
              <div className="p-4 border-b">
                <h3 className="font-semibold mb-3">Components</h3>
                <Input
                  placeholder="Search components..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2">
                  {groupedComponents.map((category) => (
                    <div key={category.id} className="mb-4">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
                        {category.name}
                      </h4>
                      <div className="space-y-1">
                        {category.components.map((component) => (
                          <div
                            key={component.id}
                            className="p-2 rounded-lg hover:bg-muted cursor-grab active:cursor-grabbing transition-colors"
                            draggable
                          >
                            <div className="flex items-center gap-2">
                              {component.hasAI && (
                                <Sparkles className="h-3 w-3 text-primary flex-shrink-0" />
                              )}
                              <span className="text-sm font-medium truncate">
                                {component.displayName}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {component.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </>
          )}
        </div>

        {/* Toggle Left Panel */}
        <button
          onClick={() => setLeftPanelOpen(!leftPanelOpen)}
          className="w-6 bg-muted hover:bg-muted/80 flex items-center justify-center border-r transition-colors"
        >
          {leftPanelOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>

        {/* Canvas */}
        <div className="flex-1 bg-muted/50">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            proOptions={{ hideAttribution: true }}
          >
            <Background gap={20} size={1} />
            <Controls />
            <MiniMap
              nodeStrokeWidth={3}
              pannable
              zoomable
              className="!bg-card !border"
            />
            <Panel position="top-center">
              <div className="bg-card/80 backdrop-blur px-4 py-2 rounded-lg border shadow-sm">
                <span className="text-sm text-muted-foreground">
                  {nodes.length} nodes • {edges.length} connections
                </span>
              </div>
            </Panel>
          </ReactFlow>
        </div>

        {/* Toggle Right Panel */}
        <button
          onClick={() => setRightPanelOpen(!rightPanelOpen)}
          className="w-6 bg-muted hover:bg-muted/80 flex items-center justify-center border-l transition-colors"
        >
          {rightPanelOpen ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>

        {/* Right Panel - Node Config */}
        <div
          className={cn(
            'border-l bg-card transition-all duration-300',
            rightPanelOpen ? 'w-80' : 'w-0'
          )}
        >
          {rightPanelOpen && (
            <div className="p-4">
              {selectedNode ? (
                <>
                  <h3 className="font-semibold mb-4">Node Configuration</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Node ID</label>
                      <Input value={selectedNode.id} readOnly className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Label</label>
                      <Input
                        value={(selectedNode.data as { label: string }).label || ''}
                        readOnly
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Type</label>
                      <Input value={selectedNode.type || 'default'} readOnly className="mt-1" />
                    </div>
                    {(selectedNode.data as { componentId?: string }).componentId && (
                      <div>
                        <label className="text-sm font-medium">Component</label>
                        <Input
                          value={(selectedNode.data as { componentId: string }).componentId}
                          readOnly
                          className="mt-1"
                        />
                      </div>
                    )}
                    <Separator />
                    <div className="text-sm text-muted-foreground">
                      <p>
                        Click and drag to reposition. Connect nodes by dragging
                        from handles.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <p>Select a node to configure</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
