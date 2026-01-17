import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Search,
  Settings,
  MoreHorizontal,
  FileText,
  Folder,
  Star,
  Clock,
  Sparkles,
  Menu,
  ArrowLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ThemeSwitcherDropdown } from './shared/ThemeSwitcherDropdown'
import { mockWorkflows } from '@/mock-data/workflows'

interface TreeItem {
  id: string
  label: string
  icon: typeof FileText
  children?: TreeItem[]
  badge?: string
}

const treeData: TreeItem[] = [
  {
    id: 'workflows',
    label: 'Workflows',
    icon: Folder,
    children: [
      { id: 'wf-1', label: 'Legal Case Assessment', icon: FileText, badge: 'deployed' },
      { id: 'wf-2', label: 'Document Intake Pipeline', icon: FileText, badge: 'deployed' },
      { id: 'wf-3', label: 'Client Communication Flow', icon: FileText, badge: 'draft' },
      { id: 'wf-4', label: 'Research & Citation Builder', icon: FileText, badge: 'draft' },
    ],
  },
  {
    id: 'components',
    label: 'Component Library',
    icon: Folder,
    children: [
      { id: 'legal', label: 'Legal / Analysis', icon: Folder },
      { id: 'workflow', label: 'Workflow / Gates', icon: Folder },
      { id: 'ui', label: 'UI / Pages', icon: Folder },
    ],
  },
  {
    id: 'templates',
    label: 'Templates',
    icon: Folder,
  },
]

function TreeNode({ item, level = 0 }: { item: TreeItem; level?: number }) {
  const [expanded, setExpanded] = useState(level === 0)
  const hasChildren = item.children && item.children.length > 0

  return (
    <div>
      <button
        onClick={() => hasChildren && setExpanded(!expanded)}
        className={cn(
          'w-full flex items-center gap-1 py-1.5 px-2 rounded-md text-sm hover:bg-muted/80 transition-colors group',
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
        <item.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <span className="flex-1 text-left truncate">{item.label}</span>
        {item.badge && (
          <Badge variant="outline" className={cn(
            'text-xs px-1.5 py-0',
            item.badge === 'deployed' && 'border-green-400 text-green-700 bg-green-50',
            item.badge === 'draft' && 'border-yellow-400 text-yellow-700 bg-yellow-50'
          )}>
            {item.badge}
          </Badge>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="h-3 w-3" />
        </Button>
      </button>
      {hasChildren && expanded && (
        <div>
          {item.children!.map((child) => (
            <TreeNode key={child.id} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export function NotionLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const selectedWorkflow = mockWorkflows[0]

  return (
    <div className="h-screen flex bg-background">
      {/* Wide Sidebar */}
      <aside
        className={cn(
          'flex flex-col border-r bg-muted/30 transition-all duration-200',
          sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
        )}
      >
        {/* Workspace Header */}
        <div className="h-12 flex items-center justify-between px-3 border-b">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">J</span>
            </div>
            <span className="font-medium text-sm">JurisAI Workspace</span>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="p-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-8 h-8 text-sm bg-background" />
          </div>
        </div>

        {/* Quick Links */}
        <div className="px-2 py-1">
          <button className="w-full flex items-center gap-2 py-1.5 px-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/80">
            <Star className="h-4 w-4" />
            <span>Favorites</span>
          </button>
          <button className="w-full flex items-center gap-2 py-1.5 px-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/80">
            <Clock className="h-4 w-4" />
            <span>Recent</span>
          </button>
        </div>

        {/* Tree Navigation */}
        <div className="flex-1 overflow-auto px-2 py-2">
          {treeData.map((item) => (
            <TreeNode key={item.id} item={item} />
          ))}
        </div>

        {/* New Page Button */}
        <div className="p-2 border-t">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground">
            <Plus className="h-4 w-4 mr-2" />
            New Workflow
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Minimal Header / Breadcrumb */}
        <header className="h-12 flex items-center justify-between px-4 border-b">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            <Link to="/layouts" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <span className="text-sm text-muted-foreground">Notion Style</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Workflows</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{selectedWorkflow.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeSwitcherDropdown />
            <Button variant="ghost" size="sm">Share</Button>
            <Button size="sm">Deploy</Button>
          </div>
        </header>

        {/* Document-style Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-3xl mx-auto py-12 px-8">
            {/* Page Title */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{selectedWorkflow.name}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="border-green-400 text-green-700">
                      {selectedWorkflow.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      v{selectedWorkflow.version}
                    </span>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">
                      {selectedWorkflow.nodeCount} nodes
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Block */}
            <div className="mb-8 pb-8 border-b">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {selectedWorkflow.description}
              </p>
            </div>

            {/* Properties Table */}
            <div className="mb-8">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                Properties
              </h2>
              <div className="space-y-3">
                <div className="flex items-center py-2 border-b">
                  <span className="w-40 text-sm text-muted-foreground">Status</span>
                  <Badge variant="outline" className="border-green-400 text-green-700">
                    Deployed
                  </Badge>
                </div>
                <div className="flex items-center py-2 border-b">
                  <span className="w-40 text-sm text-muted-foreground">Version</span>
                  <span className="text-sm">{selectedWorkflow.version}</span>
                </div>
                <div className="flex items-center py-2 border-b">
                  <span className="w-40 text-sm text-muted-foreground">Created</span>
                  <span className="text-sm">
                    {new Date(selectedWorkflow.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center py-2 border-b">
                  <span className="w-40 text-sm text-muted-foreground">Last Modified</span>
                  <span className="text-sm">
                    {new Date(selectedWorkflow.lastModified).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center py-2 border-b">
                  <span className="w-40 text-sm text-muted-foreground">Active Instances</span>
                  <span className="text-sm">{selectedWorkflow.deployedInstances || 0}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                Quick Actions
              </h2>
              <div className="flex gap-3">
                <Button variant="outline">Open Editor</Button>
                <Button variant="outline">View Instances</Button>
                <Button variant="outline">Export</Button>
              </div>
            </div>

            {/* Placeholder for more content */}
            <div className="text-muted-foreground text-sm">
              <p>Click here to add notes, documentation, or embed workflow preview...</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
