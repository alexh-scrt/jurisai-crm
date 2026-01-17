import {
  Rocket,
  CheckCircle,
  Clock,
  AlertCircle,
  Activity,
  Zap,
  Database,
  FileText,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { mockWorkflows } from '@/mock-data/workflows'

const deployedWorkflows = mockWorkflows.filter((w) => w.status === 'deployed')

const mockInstances = [
  {
    id: 'inst-1',
    workflowId: 'wf-1',
    workflowName: 'Legal Case Assessment',
    caseId: 'case-2024-001',
    status: 'running',
    startedAt: '2024-01-16T09:30:00Z',
    currentNode: 'assessment',
  },
  {
    id: 'inst-2',
    workflowId: 'wf-1',
    workflowName: 'Legal Case Assessment',
    caseId: 'case-2024-002',
    status: 'waiting',
    startedAt: '2024-01-16T08:15:00Z',
    currentNode: 'approval-gate',
  },
  {
    id: 'inst-3',
    workflowId: 'wf-2',
    workflowName: 'Document Intake Pipeline',
    caseId: 'case-2024-003',
    status: 'completed',
    startedAt: '2024-01-15T14:00:00Z',
    currentNode: 'end',
  },
]

const mockAuditLogs = [
  {
    id: 'log-1',
    timestamp: '2024-01-16T10:45:32Z',
    eventType: 'ai.invocation',
    actor: 'system',
    details: 'ExtractFactsTimeline - GPT-4 - 1,234 tokens',
  },
  {
    id: 'log-2',
    timestamp: '2024-01-16T10:44:15Z',
    eventType: 'workflow.transition',
    actor: 'system',
    details: 'extract-facts → spot-issues',
  },
  {
    id: 'log-3',
    timestamp: '2024-01-16T10:42:00Z',
    eventType: 'artifact.proposed',
    actor: 'system',
    details: 'FactsTimeline artifact created',
  },
  {
    id: 'log-4',
    timestamp: '2024-01-16T09:30:00Z',
    eventType: 'workflow.started',
    actor: 'john.doe@example.com',
    details: 'Legal Case Assessment v1.2.0',
  },
]

const statusIcons = {
  running: <Activity className="h-4 w-4 text-blue-500 animate-pulse" />,
  waiting: <Clock className="h-4 w-4 text-yellow-500" />,
  completed: <CheckCircle className="h-4 w-4 text-green-500" />,
  error: <AlertCircle className="h-4 w-4 text-red-500" />,
}

const statusColors = {
  running: 'bg-blue-100 text-blue-800 border-blue-200',
  waiting: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  error: 'bg-red-100 text-red-800 border-red-200',
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function DeployMonitor() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Deploy & Monitor</h1>
          <p className="text-muted-foreground">
            Monitor deployed workflows and active instances
          </p>
        </div>
        <Button variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Deployed Workflows</CardDescription>
            <CardTitle className="text-3xl">{deployedWorkflows.length}</CardTitle>
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
            <CardDescription>Active Instances</CardDescription>
            <CardTitle className="text-3xl">
              {mockInstances.filter((i) => i.status !== 'completed').length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="h-4 w-4" />
              <span>Running or waiting</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>AI Tokens (24h)</CardDescription>
            <CardTitle className="text-3xl">45.2k</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4" />
              <span>$3.42 estimated cost</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Ledger Entries (24h)</CardDescription>
            <CardTitle className="text-3xl">127</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Database className="h-4 w-4" />
              <span>Audit events</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deployed Workflows */}
      <Card>
        <CardHeader>
          <CardTitle>Deployed Workflows</CardTitle>
          <CardDescription>Currently active workflow deployments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Workflow</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Active Instances</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Deploy</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deployedWorkflows.map((workflow) => (
                <TableRow key={workflow.id}>
                  <TableCell className="font-medium">{workflow.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">v{workflow.version}</Badge>
                  </TableCell>
                  <TableCell>{workflow.deployedInstances || 0}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-green-700">Healthy</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDateTime(workflow.lastModified)}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Active Instances */}
      <Card>
        <CardHeader>
          <CardTitle>Active Instances</CardTitle>
          <CardDescription>Currently running workflow instances</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Instance</TableHead>
                <TableHead>Workflow</TableHead>
                <TableHead>Case</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Current Node</TableHead>
                <TableHead>Started</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockInstances.map((instance) => (
                <TableRow key={instance.id}>
                  <TableCell className="font-mono text-sm">{instance.id}</TableCell>
                  <TableCell>{instance.workflowName}</TableCell>
                  <TableCell className="font-mono text-sm">{instance.caseId}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {statusIcons[instance.status as keyof typeof statusIcons]}
                      <Badge
                        variant="outline"
                        className={statusColors[instance.status as keyof typeof statusColors]}
                      >
                        {instance.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{instance.currentNode}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatTime(instance.startedAt)}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Audit Log */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Audit Log</CardTitle>
              <CardDescription>Latest entries from the audit ledger</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              View Full Log
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Event Type</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAuditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-muted-foreground">
                    {formatTime(log.timestamp)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.eventType}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{log.actor}</TableCell>
                  <TableCell>{log.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
