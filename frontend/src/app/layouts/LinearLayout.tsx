import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Home,
  GitBranch,
  Puzzle,
  Rocket,
  Settings,
  Search,
  Plus,
  Bell,
  ChevronRight,
  MoreHorizontal,
  Sparkles,
  Clock,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { ThemeSwitcherDropdown } from './shared/ThemeSwitcherDropdown'
import { mockWorkflows } from '@/mock-data/workflows'

const navItems = [
  { icon: Home, label: 'Home', href: '#' },
  { icon: GitBranch, label: 'Workflows', href: '#', active: true },
  { icon: Puzzle, label: 'Components', href: '#' },
  { icon: Rocket, label: 'Deploy', href: '#' },
  { icon: Settings, label: 'Settings', href: '#' },
]

export function LinearLayout() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)

  return (
    <div className="h-screen flex bg-background">
      {/* Narrow Sidebar - expands on hover */}
      <aside
        className={cn(
          'bg-sidebar flex flex-col transition-all duration-200 ease-out',
          sidebarExpanded ? 'w-56' : 'w-14'
        )}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
      >
        {/* Logo */}
        <div className="h-14 flex items-center px-3 border-b border-sidebar">
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center flex-shrink-0">
            <span className="text-sidebar-primary-foreground font-bold text-sm">J</span>
          </div>
          {sidebarExpanded && (
            <span className="ml-3 text-sidebar font-semibold whitespace-nowrap">JurisAI</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-2">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                'flex items-center h-10 px-3 mx-2 rounded-lg transition-colors',
                item.active
                  ? 'bg-sidebar-active text-sidebar'
                  : 'text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar'
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {sidebarExpanded && (
                <span className="ml-3 text-sm font-medium whitespace-nowrap">{item.label}</span>
              )}
            </a>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-2 border-t border-sidebar">
          <div className="flex items-center h-10 px-3 mx-1 rounded-lg hover:bg-sidebar-hover transition-colors cursor-pointer">
            <Avatar className="h-6 w-6 flex-shrink-0">
              <AvatarFallback className="text-xs bg-sidebar-primary text-sidebar-primary-foreground">
                JD
              </AvatarFallback>
            </Avatar>
            {sidebarExpanded && (
              <span className="ml-3 text-sm text-sidebar-muted whitespace-nowrap">John Doe</span>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Minimal Top Bar */}
        <header className="h-14 flex items-center justify-between px-6 border-b bg-card">
          <div className="flex items-center gap-4">
            <Link to="/layouts" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <span className="text-sm text-muted-foreground">Linear Style</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Workflows</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-9 h-9 bg-muted/50" />
            </div>
            <ThemeSwitcherDropdown />
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-5xl mx-auto py-8 px-6">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-semibold">Workflows</h1>
                <p className="text-muted-foreground mt-1">
                  Manage and deploy your workflow applications
                </p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Workflow
              </Button>
            </div>

            {/* Workflow List - Linear-style minimal cards */}
            <div className="space-y-2">
              {mockWorkflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className="group flex items-center gap-4 p-4 rounded-lg border bg-card hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer"
                >
                  {/* Icon */}
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    workflow.status === 'deployed' ? 'bg-green-100' : 'bg-muted'
                  )}>
                    {workflow.status === 'deployed' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{workflow.name}</span>
                      {workflow.nodeCount > 8 && (
                        <Sparkles className="h-3 w-3 text-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {workflow.description}
                    </p>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <Badge variant="outline" className={cn(
                      workflow.status === 'deployed' && 'border-green-500 text-green-700',
                      workflow.status === 'draft' && 'border-yellow-500 text-yellow-700',
                      workflow.status === 'archived' && 'border-gray-400 text-gray-600'
                    )}>
                      {workflow.status}
                    </Badge>
                    <span>v{workflow.version}</span>
                    <span>{workflow.nodeCount} nodes</span>
                  </div>

                  {/* Actions */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
