import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Files,
  Search,
  GitBranch,
  Bug,
  Blocks,
  Settings,
  X,
  ChevronRight,
  ChevronDown,
  FileText,
  Folder,
  Circle,
  ArrowLeft,
  Bell,
  AlertCircle,
  CheckCircle,
  Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ThemeSwitcherDropdown } from './shared/ThemeSwitcherDropdown'
import { mockWorkflows } from '@/mock-data/workflows'

interface FileItem {
  id: string
  name: string
  type: 'file' | 'folder'
  children?: FileItem[]
  modified?: boolean
}

const explorerData: FileItem[] = [
  {
    id: 'workflows',
    name: 'workflows',
    type: 'folder',
    children: [
      { id: 'wf-1', name: 'legal-case-assessment.json', type: 'file' },
      { id: 'wf-2', name: 'document-intake.json', type: 'file', modified: true },
      { id: 'wf-3', name: 'client-communication.json', type: 'file' },
    ],
  },
  {
    id: 'components',
    name: 'components',
    type: 'folder',
    children: [
      {
        id: 'legal',
        name: 'legal',
        type: 'folder',
        children: [
          { id: 'extract-facts', name: 'ExtractFactsTimeline.tsx', type: 'file' },
          { id: 'spot-issues', name: 'SpotIssuesIRAC.tsx', type: 'file' },
        ],
      },
      {
        id: 'ui',
        name: 'ui',
        type: 'folder',
        children: [
          { id: 'form', name: 'CaseIntakeForm.tsx', type: 'file' },
          { id: 'report', name: 'ReportViewer.tsx', type: 'file' },
        ],
      },
    ],
  },
  { id: 'config', name: 'studio.config.json', type: 'file' },
]

const activityBarItems = [
  { id: 'explorer', icon: Files, label: 'Explorer' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'git', icon: GitBranch, label: 'Source Control' },
  { id: 'debug', icon: Bug, label: 'Debug' },
  { id: 'extensions', icon: Blocks, label: 'Extensions' },
]

interface Tab {
  id: string
  name: string
  modified?: boolean
}

const openTabs: Tab[] = [
  { id: 'wf-1', name: 'legal-case-assessment.json' },
  { id: 'wf-2', name: 'document-intake.json', modified: true },
]

function FileTreeItem({ item, level = 0 }: { item: FileItem; level?: number }) {
  const [expanded, setExpanded] = useState(level === 0)
  const hasChildren = item.children && item.children.length > 0

  return (
    <div>
      <button
        onClick={() => hasChildren && setExpanded(!expanded)}
        className={cn(
          'w-full flex items-center gap-1 py-1 px-2 text-sm hover:bg-muted/80 transition-colors',
          'text-foreground/80 hover:text-foreground'
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {hasChildren ? (
          expanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          )
        ) : (
          <span className="w-4" />
        )}
        {item.type === 'folder' ? (
          <Folder className="h-4 w-4 text-amber-500 flex-shrink-0" />
        ) : (
          <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        )}
        <span className="flex-1 text-left truncate text-xs">{item.name}</span>
        {item.modified && <Circle className="h-2 w-2 fill-current text-primary" />}
      </button>
      {hasChildren && expanded && (
        <div>
          {item.children!.map((child) => (
            <FileTreeItem key={child.id} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export function VSCodeLayout() {
  const [activeActivity, setActiveActivity] = useState('explorer')
  const [activeTab, setActiveTab] = useState('wf-1')
  const selectedWorkflow = mockWorkflows[0]

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Menu Bar */}
      <header className="h-8 flex items-center justify-between px-3 bg-muted/50 border-b text-xs">
        <div className="flex items-center gap-4">
          <Link to="/layouts" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
          <span className="text-muted-foreground">VS Code Style</span>
          <nav className="flex items-center gap-4 text-muted-foreground">
            <button className="hover:text-foreground">File</button>
            <button className="hover:text-foreground">Edit</button>
            <button className="hover:text-foreground">View</button>
            <button className="hover:text-foreground">Run</button>
            <button className="hover:text-foreground">Help</button>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcherDropdown />
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Activity Bar */}
        <aside className="w-12 bg-sidebar flex flex-col items-center py-2 border-r">
          {activityBarItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="icon"
              className={cn(
                'h-12 w-12 rounded-none text-sidebar-foreground/60 hover:text-sidebar-foreground',
                activeActivity === item.id &&
                  'text-sidebar-foreground border-l-2 border-primary bg-muted/20'
              )}
              onClick={() => setActiveActivity(item.id)}
            >
              <item.icon className="h-5 w-5" />
            </Button>
          ))}
          <div className="flex-1" />
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-none text-sidebar-foreground/60 hover:text-sidebar-foreground"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </aside>

        {/* Sidebar */}
        <aside className="w-56 bg-muted/30 border-r flex flex-col">
          <div className="p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Explorer
          </div>
          <div className="flex-1 overflow-auto">
            <div className="mb-2">
              <div className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-muted-foreground uppercase">
                <ChevronDown className="h-3 w-3" />
                SecretAI Rails
              </div>
              {explorerData.map((item) => (
                <FileTreeItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </aside>

        {/* Main Editor Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="h-9 flex items-center bg-muted/20 border-b">
            {openTabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'h-full flex items-center gap-2 px-3 border-r cursor-pointer group',
                  activeTab === tab.id
                    ? 'bg-background border-t-2 border-t-primary'
                    : 'bg-muted/30 hover:bg-muted/50'
                )}
              >
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs">{tab.name}</span>
                {tab.modified && <Circle className="h-2 w-2 fill-current text-primary" />}
                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
            ))}
          </div>

          {/* Breadcrumb */}
          <div className="h-6 flex items-center gap-1 px-3 bg-background border-b text-xs text-muted-foreground">
            <span>workflows</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">legal-case-assessment.json</span>
          </div>

          {/* Editor Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Code/Content Area */}
            <div className="flex-1 overflow-auto bg-background p-4 font-mono text-sm">
              {/* Line Numbers + Content */}
              <div className="flex">
                <div className="w-12 text-right pr-4 text-muted-foreground/50 select-none">
                  {Array.from({ length: 25 }, (_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                <div className="flex-1">
                  <div className="text-muted-foreground">{'{'}</div>
                  <div>
                    <span className="text-blue-500">"name"</span>
                    <span className="text-foreground">: </span>
                    <span className="text-green-600">"{selectedWorkflow.name}"</span>
                    <span className="text-foreground">,</span>
                  </div>
                  <div>
                    <span className="text-blue-500">"version"</span>
                    <span className="text-foreground">: </span>
                    <span className="text-green-600">"{selectedWorkflow.version}"</span>
                    <span className="text-foreground">,</span>
                  </div>
                  <div>
                    <span className="text-blue-500">"status"</span>
                    <span className="text-foreground">: </span>
                    <span className="text-green-600">"{selectedWorkflow.status}"</span>
                    <span className="text-foreground">,</span>
                  </div>
                  <div>
                    <span className="text-blue-500">"description"</span>
                    <span className="text-foreground">: </span>
                    <span className="text-green-600">"{selectedWorkflow.description}"</span>
                    <span className="text-foreground">,</span>
                  </div>
                  <div>
                    <span className="text-blue-500">"nodes"</span>
                    <span className="text-foreground">: [</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-muted-foreground">{'{'}</span>
                  </div>
                  <div className="pl-8">
                    <span className="text-blue-500">"id"</span>
                    <span className="text-foreground">: </span>
                    <span className="text-green-600">"intake"</span>
                    <span className="text-foreground">,</span>
                  </div>
                  <div className="pl-8">
                    <span className="text-blue-500">"type"</span>
                    <span className="text-foreground">: </span>
                    <span className="text-green-600">"CaseIntakeForm"</span>
                    <span className="text-foreground">,</span>
                  </div>
                  <div className="pl-8">
                    <span className="text-blue-500">"position"</span>
                    <span className="text-foreground">: </span>
                    <span className="text-muted-foreground">{'{ "x": 100, "y": 100 }'}</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-muted-foreground">{'}'}</span>
                    <span className="text-foreground">,</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-muted-foreground">{'{'}</span>
                  </div>
                  <div className="pl-8">
                    <span className="text-blue-500">"id"</span>
                    <span className="text-foreground">: </span>
                    <span className="text-green-600">"extract"</span>
                    <span className="text-foreground">,</span>
                  </div>
                  <div className="pl-8">
                    <span className="text-blue-500">"type"</span>
                    <span className="text-foreground">: </span>
                    <span className="text-green-600">"ExtractFactsTimeline"</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-muted-foreground">{'}'}</span>
                  </div>
                  <div>
                    <span className="text-foreground">],</span>
                  </div>
                  <div>
                    <span className="text-blue-500">"edges"</span>
                    <span className="text-foreground">: []</span>
                  </div>
                  <div className="text-muted-foreground">{'}'}</div>
                </div>
              </div>
            </div>

            {/* Minimap */}
            <div className="w-24 bg-muted/30 border-l">
              <div className="p-2 text-[6px] text-muted-foreground/50 font-mono leading-tight">
                {'{'}
                <br />
                &nbsp;&nbsp;"name": "Legal..."
                <br />
                &nbsp;&nbsp;"version": "1.2.0"
                <br />
                &nbsp;&nbsp;"status": "deployed"
                <br />
                &nbsp;&nbsp;"nodes": [...]
                <br />
                {'}'}
              </div>
            </div>
          </div>

          {/* Bottom Panel - Problems/Terminal */}
          <div className="h-32 border-t bg-muted/20">
            <div className="h-8 flex items-center gap-4 px-3 border-b bg-muted/30">
              <button className="text-xs text-foreground flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Problems
                <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">
                  0
                </Badge>
              </button>
              <button className="text-xs text-muted-foreground flex items-center gap-1">
                Output
              </button>
              <button className="text-xs text-muted-foreground flex items-center gap-1">
                Terminal
              </button>
            </div>
            <div className="p-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>No problems have been detected in the workspace.</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Status Bar */}
      <footer className="h-6 flex items-center justify-between px-3 bg-primary text-primary-foreground text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <GitBranch className="h-3 w-3" />
            <span>main</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>0 Problems</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span>JSON</span>
          <span>UTF-8</span>
          <span>LF</span>
          <div className="flex items-center gap-1">
            <Info className="h-3 w-3" />
            <span>Ln 1, Col 1</span>
          </div>
          <Bell className="h-3 w-3" />
        </div>
      </footer>
    </div>
  )
}
