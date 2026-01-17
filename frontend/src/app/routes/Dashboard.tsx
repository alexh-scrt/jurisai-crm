import { Link } from 'react-router-dom'
import { Upload, GitBranch, Rocket, Clock, MoreHorizontal, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { mockWorkflows, type WorkflowStatus } from '@/mock-data/workflows'

const statusColors: Record<WorkflowStatus, string> = {
  draft: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  deployed: 'bg-green-100 text-green-800 border-green-200',
  archived: 'bg-gray-100 text-gray-600 border-gray-200',
}

const statusLabels: Record<WorkflowStatus, string> = {
  draft: 'Draft',
  deployed: 'Deployed',
  archived: 'Archived',
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function Dashboard() {
  const recentWorkflows = mockWorkflows.slice(0, 4)
  const deployedCount = mockWorkflows.filter((w) => w.status === 'deployed').length
  const draftCount = mockWorkflows.filter((w) => w.status === 'draft').length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="text-muted-foreground">
            Manage your workflows and deploy CRM applications
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button asChild>
            <Link to="/studio">
              <Sparkles className="h-4 w-4 mr-2" />
              Open Studio
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Workflows</CardDescription>
            <CardTitle className="text-3xl">{mockWorkflows.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GitBranch className="h-4 w-4" />
              <span>Across all statuses</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Deployed</CardDescription>
            <CardTitle className="text-3xl text-green-600">{deployedCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Rocket className="h-4 w-4" />
              <span>Active in production</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>In Progress</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">{draftCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Drafts being edited</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Workflows */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Workflows</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/workflows">View all</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentWorkflows.map((workflow) => (
            <Card key={workflow.id} className="hover:border-primary/50 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <Link
                      to={`/studio/${workflow.id}`}
                      className="font-semibold hover:text-primary transition-colors"
                    >
                      {workflow.name}
                    </Link>
                    <CardDescription className="line-clamp-2">
                      {workflow.description}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem>Export</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={statusColors[workflow.status]}
                    >
                      {statusLabels[workflow.status]}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      v{workflow.version}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(workflow.lastModified)}
                  </div>
                </div>
                {workflow.deployedInstances && (
                  <div className="mt-3 text-sm text-muted-foreground">
                    <Rocket className="h-3 w-3 inline mr-1" />
                    {workflow.deployedInstances} active instance{workflow.deployedInstances > 1 ? 's' : ''}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-4 flex-col" asChild>
              <Link to="/studio">
                <Sparkles className="h-6 w-6 mb-2" />
                <span>Open Studio</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col" asChild>
              <Link to="/components">
                <GitBranch className="h-6 w-6 mb-2" />
                <span>Browse Components</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col" asChild>
              <Link to="/deploy">
                <Rocket className="h-6 w-6 mb-2" />
                <span>Deploy Status</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col">
              <Upload className="h-6 w-6 mb-2" />
              <span>Import Workflow</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
