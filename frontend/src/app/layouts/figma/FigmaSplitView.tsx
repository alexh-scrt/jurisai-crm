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
  Settings,
  Code,
  Eye,
  SplitSquareHorizontal,
  Move,
  PenTool,
  FileJson,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { ThemeColorBar } from '../shared/ThemeSwitcherDropdown'
import { mockWorkflows } from '@/mock-data/workflows'

export function FigmaSplitView() {
  const [zoom, setZoom] = useState(100)
  const [activeTool, setActiveTool] = useState('select')
  const [splitView, setSplitView] = useState<'canvas' | 'split' | 'code'>('split')
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

  const workflowJson = `{
  "name": "${selectedWorkflow.name}",
  "version": "${selectedWorkflow.version}",
  "nodes": [
    {
      "id": "intake",
      "type": "CaseIntakeForm",
      "position": { "x": 50, "y": 100 }
    },
    {
      "id": "extract",
      "type": "ExtractFactsTimeline",
      "position": { "x": 250, "y": 150 }
    },
    {
      "id": "analysis",
      "type": "LegalAnalysis",
      "position": { "x": 450, "y": 150 }
    },
    {
      "id": "report",
      "type": "GenerateReport",
      "position": { "x": 650, "y": 150 }
    }
  ],
  "edges": [
    { "source": "intake", "target": "extract" },
    { "source": "extract", "target": "analysis" },
    { "source": "analysis", "target": "report" }
  ]
}`

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <header className="h-11 flex items-center justify-between px-3 border-b bg-muted/30">
        <div className="flex items-center gap-3">
          <Link to="/layouts/figma" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Separator orientation="vertical" className="h-5" />
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-[10px]">J</span>
            </div>
            <span className="text-sm font-medium">Split View</span>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{selectedWorkflow.name}</span>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
          <Button
            variant="ghost"
            size="sm"
            className={cn('h-7 px-3 text-xs', splitView === 'canvas' && 'bg-background shadow-sm')}
            onClick={() => setSplitView('canvas')}
          >
            <Eye className="h-3.5 w-3.5 mr-1" />
            Canvas
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn('h-7 px-3 text-xs', splitView === 'split' && 'bg-background shadow-sm')}
            onClick={() => setSplitView('split')}
          >
            <SplitSquareHorizontal className="h-3.5 w-3.5 mr-1" />
            Split
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn('h-7 px-3 text-xs', splitView === 'code' && 'bg-background shadow-sm')}
            onClick={() => setSplitView('code')}
          >
            <Code className="h-3.5 w-3.5 mr-1" />
            Code
          </Button>
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

      {/* Secondary Toolbar */}
      <div className="h-10 flex items-center justify-between px-3 border-b bg-background">
        <div className="flex items-center gap-1">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant="ghost"
              size="icon"
              className={cn('h-8 w-8', activeTool === tool.id && 'bg-muted')}
              onClick={() => setActiveTool(tool.id)}
            >
              <tool.icon className="h-4 w-4" />
            </Button>
          ))}
          <Separator orientation="vertical" className="h-5 mx-2" />
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.max(25, zoom - 25))}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs w-12 text-center">{zoom}%</span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.min(200, zoom + 25))}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Canvas Side */}
        {(splitView === 'canvas' || splitView === 'split') && (
          <div className={cn('flex-1 bg-muted/40 relative overflow-hidden', splitView === 'split' && 'border-r')}>
            <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `scale(${zoom / 100})` }}>
              <div className="relative w-[700px] h-[400px]">
                {/* Grid */}
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: 'radial-gradient(circle, #64748b 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }} />

                {/* Nodes */}
                <div className="absolute left-4 top-20 w-32 bg-background rounded-lg border-2 border-primary shadow-lg p-3">
                  <div className="text-xs font-medium">Case Intake</div>
                  <div className="text-[10px] text-muted-foreground mt-1">CaseIntakeForm</div>
                </div>

                <div className="absolute left-48 top-28 w-32 bg-background rounded-lg border shadow-md p-3">
                  <div className="text-xs font-medium">Extract Facts</div>
                  <div className="text-[10px] text-muted-foreground mt-1">ExtractFactsTimeline</div>
                </div>

                <div className="absolute left-[350px] top-28 w-32 bg-background rounded-lg border shadow-md p-3">
                  <div className="text-xs font-medium">Legal Analysis</div>
                  <div className="text-[10px] text-muted-foreground mt-1">LegalAnalysis</div>
                </div>

                <div className="absolute right-4 top-28 w-32 bg-background rounded-lg border shadow-md p-3">
                  <div className="text-xs font-medium">Generate Report</div>
                  <div className="text-[10px] text-muted-foreground mt-1">GenerateReport</div>
                </div>
              </div>
            </div>

            {splitView === 'canvas' && (
              <div className="absolute bottom-4 right-4 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                Press <kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">Cmd+E</kbd> to toggle code view
              </div>
            )}
          </div>
        )}

        {/* Code Side */}
        {(splitView === 'code' || splitView === 'split') && (
          <div className={cn('flex-1 bg-sidebar flex flex-col', splitView === 'split' ? 'max-w-[50%]' : '')}>
            <Tabs defaultValue="json" className="flex-1 flex flex-col">
              <div className="border-b border-sidebar-border px-2">
                <TabsList className="h-9 bg-transparent">
                  <TabsTrigger value="json" className="text-xs data-[state=active]:bg-sidebar-hover text-sidebar-foreground">
                    <FileJson className="h-3.5 w-3.5 mr-1" />
                    workflow.json
                  </TabsTrigger>
                  <TabsTrigger value="config" className="text-xs data-[state=active]:bg-sidebar-hover text-sidebar-foreground">
                    <Settings className="h-3.5 w-3.5 mr-1" />
                    config
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="json" className="flex-1 m-0 overflow-auto">
                <div className="p-4 font-mono text-xs text-sidebar-foreground">
                  <div className="flex">
                    <div className="w-8 text-right pr-4 select-none opacity-40">
                      {workflowJson.split('\n').map((_, i) => (
                        <div key={i}>{i + 1}</div>
                      ))}
                    </div>
                    <pre className="flex-1">
                      <code>
                        {workflowJson.split('\n').map((line, i) => (
                          <div key={i} className="hover:bg-sidebar-hover/50">
                            {line.includes('"') ? (
                              <>
                                {line.split(/("[^"]*")/).map((part, j) =>
                                  part.startsWith('"') && part.endsWith('"') ? (
                                    <span key={j} className={part.includes(':') ? 'text-cyan-400' : 'text-green-400'}>
                                      {part}
                                    </span>
                                  ) : (
                                    <span key={j}>{part}</span>
                                  )
                                )}
                              </>
                            ) : (
                              line
                            )}
                          </div>
                        ))}
                      </code>
                    </pre>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="config" className="flex-1 m-0 p-4">
                <div className="text-sm text-sidebar-foreground space-y-3">
                  <div className="flex items-center justify-between p-2 bg-sidebar-hover rounded">
                    <span>Auto-save</span>
                    <Badge variant="outline" className="text-xs">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-sidebar-hover rounded">
                    <span>Validation</span>
                    <Badge variant="outline" className="text-xs">Strict</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-sidebar-hover rounded">
                    <span>Format</span>
                    <Badge variant="outline" className="text-xs">JSON</Badge>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}
