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
  Play,
  ArrowLeft,
  Search,
  Command,
  Plus,
  Settings,
  FileText,
  Zap,
  Move,
  PenTool,
  Keyboard,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { ThemeColorBar } from '../shared/ThemeSwitcherDropdown'
import { mockWorkflows } from '@/mock-data/workflows'

interface CommandItem {
  id: string
  label: string
  shortcut?: string
  icon: React.ElementType
  category: string
}

const commands: CommandItem[] = [
  { id: 'add-node', label: 'Add Node', shortcut: 'N', icon: Plus, category: 'Actions' },
  { id: 'run', label: 'Run Workflow', shortcut: '⌘R', icon: Play, category: 'Actions' },
  { id: 'settings', label: 'Workflow Settings', shortcut: '⌘,', icon: Settings, category: 'Actions' },
  { id: 'case-intake', label: 'Case Intake Form', icon: FileText, category: 'Nodes' },
  { id: 'extract-facts', label: 'Extract Facts Timeline', icon: Zap, category: 'Nodes' },
  { id: 'legal-analysis', label: 'Legal Analysis', icon: Zap, category: 'Nodes' },
]

export function FloatingCommandPalette() {
  const [zoom, setZoom] = useState(100)
  const [activeTool, setActiveTool] = useState('select')
  const [commandOpen, setCommandOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [contextPanel, setContextPanel] = useState<string | null>(null)
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

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = []
    acc[cmd.category].push(cmd)
    return acc
  }, {} as Record<string, CommandItem[]>)

  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      {/* Ultra Minimal Top Bar */}
      <header className="h-9 flex items-center justify-between px-3 bg-zinc-900/50 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <Link to="/layouts/floating" className="text-zinc-500 hover:text-zinc-300">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <span className="text-sm font-medium text-zinc-300">Command Palette</span>
          <ChevronRight className="h-3 w-3 text-zinc-600" />
          <span className="text-xs text-zinc-500">{selectedWorkflow.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeColorBar />
          <Separator orientation="vertical" className="h-4 bg-zinc-800" />
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
            onClick={() => setCommandOpen(true)}
          >
            <Command className="h-3 w-3 mr-1" />
            <span className="text-zinc-500">⌘K</span>
          </Button>
        </div>
      </header>

      <div className="flex-1 relative overflow-hidden">
        {/* Command Palette Modal */}
        {commandOpen && (
          <div className="absolute inset-0 z-50 flex items-start justify-center pt-24">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setCommandOpen(false)}
            />

            {/* Palette */}
            <div className="relative w-[500px] bg-zinc-900 rounded-xl border border-zinc-800 shadow-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
                <Search className="h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <Badge variant="outline" className="text-[10px] text-zinc-500 border-zinc-700">
                  ESC
                </Badge>
              </div>

              <div className="max-h-[300px] overflow-auto p-2">
                {Object.entries(groupedCommands).map(([category, items]) => (
                  <div key={category} className="mb-3">
                    <div className="px-2 py-1 text-[10px] text-zinc-500 uppercase tracking-wider">
                      {category}
                    </div>
                    {items.map((cmd) => (
                      <button
                        key={cmd.id}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
                        onClick={() => {
                          setCommandOpen(false)
                          if (cmd.category === 'Nodes') {
                            setContextPanel(cmd.id)
                          }
                        }}
                      >
                        <cmd.icon className="h-4 w-4 text-zinc-500" />
                        <span className="flex-1 text-left">{cmd.label}</span>
                        {cmd.shortcut && (
                          <kbd className="px-1.5 py-0.5 text-[10px] bg-zinc-800 rounded text-zinc-500">
                            {cmd.shortcut}
                          </kbd>
                        )}
                      </button>
                    ))}
                  </div>
                ))}
              </div>

              <div className="px-4 py-2 border-t border-zinc-800 flex items-center justify-between text-[10px] text-zinc-600">
                <div className="flex items-center gap-3">
                  <span><kbd className="px-1 bg-zinc-800 rounded">↑↓</kbd> Navigate</span>
                  <span><kbd className="px-1 bg-zinc-800 rounded">↵</kbd> Select</span>
                </div>
                <div className="flex items-center gap-1">
                  <Keyboard className="h-3 w-3" />
                  <span>Keyboard first</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Context Panel (shows when node type selected) */}
        {contextPanel && (
          <div className="absolute right-4 top-4 w-64 bg-zinc-900 rounded-xl border border-zinc-800 shadow-xl z-20">
            <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800">
              <span className="text-xs font-medium text-zinc-300">Quick Add Node</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 text-zinc-500 hover:text-zinc-300"
                onClick={() => setContextPanel(null)}
              >
                ×
              </Button>
            </div>
            <div className="p-3 space-y-3">
              <div>
                <label className="text-[10px] text-zinc-500 uppercase">Node Type</label>
                <div className="text-sm text-zinc-300 mt-1">
                  {commands.find(c => c.id === contextPanel)?.label}
                </div>
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 uppercase">Label</label>
                <Input
                  className="h-8 text-xs mt-1 bg-zinc-800 border-zinc-700 text-zinc-200"
                  placeholder="Enter label..."
                />
              </div>
              <Button size="sm" className="w-full h-8 text-xs">
                <Plus className="h-3 w-3 mr-1" />
                Add to Canvas
              </Button>
            </div>
          </div>
        )}

        {/* Minimal Floating Toolbar - Bottom Left */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-zinc-900 rounded-xl border border-zinc-800 p-1 z-20">
          {tools.slice(0, 4).map((tool) => (
            <Button
              key={tool.id}
              variant="ghost"
              size="icon"
              className={cn(
                'h-8 w-8 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800',
                activeTool === tool.id && 'bg-primary text-primary-foreground'
              )}
              onClick={() => setActiveTool(tool.id)}
            >
              <tool.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>

        {/* Zoom Controls - Bottom Right */}
        <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-zinc-900 rounded-xl border border-zinc-800 p-1 z-20">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
            onClick={() => setZoom(Math.max(25, zoom - 25))}
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <span className="text-xs w-10 text-center text-zinc-400">{zoom}%</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
            onClick={() => setZoom(Math.min(200, zoom + 25))}
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Hint - Bottom Center */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-zinc-900/80 rounded-full border border-zinc-800 text-xs text-zinc-500 z-20">
          Press <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-400 mx-1">⌘K</kbd> for commands
        </div>

        {/* Canvas */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `scale(${zoom / 100})` }}>
          <div className="relative w-[800px] h-[500px]">
            {/* Subtle Grid */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />

            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.5" />
                </linearGradient>
              </defs>
              <path d="M 160 140 C 240 140, 240 170, 320 170" stroke="url(#lineGradient)" strokeWidth="2" fill="none" />
              <path d="M 440 170 L 520 170" stroke="url(#lineGradient)" strokeWidth="2" fill="none" />
              <path d="M 640 170 L 720 170" stroke="url(#lineGradient)" strokeWidth="2" fill="none" />
            </svg>

            {/* Nodes - Dark Theme Style */}
            <div className="absolute left-8 top-24 w-36 bg-zinc-900 rounded-xl border border-zinc-800 p-4 hover:border-zinc-700 transition-colors cursor-pointer">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Input</span>
              </div>
              <div className="text-sm font-medium text-zinc-200">Case Intake</div>
              <div className="text-[10px] text-zinc-600 mt-1">CaseIntakeForm</div>
            </div>

            <div className="absolute left-56 top-32 w-36 bg-zinc-900 rounded-xl border border-primary/50 p-4 ring-2 ring-primary/20 cursor-pointer">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">AI</span>
              </div>
              <div className="text-sm font-medium text-zinc-200">Extract Facts</div>
              <div className="text-[10px] text-zinc-600 mt-1">Selected</div>
            </div>

            <div className="absolute left-[400px] top-32 w-36 bg-zinc-900 rounded-xl border border-zinc-800 p-4 hover:border-zinc-700 transition-colors cursor-pointer">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">AI</span>
              </div>
              <div className="text-sm font-medium text-zinc-200">Legal Analysis</div>
              <div className="text-[10px] text-zinc-600 mt-1">LegalAnalysis</div>
            </div>

            <div className="absolute right-8 top-32 w-36 bg-zinc-900 rounded-xl border border-zinc-800 p-4 hover:border-zinc-700 transition-colors cursor-pointer">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Output</span>
              </div>
              <div className="text-sm font-medium text-zinc-200">Generate Report</div>
              <div className="text-[10px] text-zinc-600 mt-1">ReportGenerator</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
