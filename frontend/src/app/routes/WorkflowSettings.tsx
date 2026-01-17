import { useState } from 'react'
import { Save, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function WorkflowSettings() {
  const [workflowName, setWorkflowName] = useState('Legal Case Assessment')
  const [version, setVersion] = useState('1.2.0')
  const [description, setDescription] = useState(
    'Complete workflow for assessing legal cases with AI-powered analysis'
  )

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-muted-foreground">Configure application and workflow settings</p>
        </div>
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="ai">AI Configuration</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="deployment">Deployment</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Information</CardTitle>
              <CardDescription>Basic information about this workflow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Workflow Name</label>
                  <Input
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Version</label>
                  <Input
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full min-h-[100px] rounded-md border bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Tags</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary">legal</Badge>
                  <Badge variant="secondary">assessment</Badge>
                  <Badge variant="secondary">ai-powered</Badge>
                  <Button variant="outline" size="sm">
                    + Add Tag
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Component Pack</CardTitle>
              <CardDescription>Domain pack used by this workflow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <h4 className="font-medium">Legal Pack v1</h4>
                  <p className="text-sm text-muted-foreground">
                    16 components for legal case management
                  </p>
                </div>
                <Badge>Active</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Configuration */}
        <TabsContent value="ai" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Provider Settings</CardTitle>
              <CardDescription>Configure AI models and policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Default Model</label>
                  <Select defaultValue="gpt-4">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">GPT-4 Turbo</SelectItem>
                      <SelectItem value="gpt-3.5">GPT-3.5 Turbo</SelectItem>
                      <SelectItem value="claude-3">Claude 3 Sonnet</SelectItem>
                      <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Embedding Model</label>
                  <Select defaultValue="text-embedding-3">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text-embedding-3">text-embedding-3-small</SelectItem>
                      <SelectItem value="text-embedding-3-large">text-embedding-3-large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium">Token Limits</label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <label className="text-xs text-muted-foreground">Max Input Tokens</label>
                    <Input type="number" defaultValue="8000" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Max Output Tokens</label>
                    <Input type="number" defaultValue="2000" className="mt-1" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Governance</CardTitle>
              <CardDescription>Controls for AI behavior and approvals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Require Human Approval</h4>
                  <p className="text-sm text-muted-foreground">
                    All AI-generated artifacts require approval before persistence
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Citation Requirements</h4>
                  <p className="text-sm text-muted-foreground">
                    AI outputs must include source citations
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Audit Logging</h4>
                  <p className="text-sm text-muted-foreground">
                    Log all AI invocations to audit ledger
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800">Enabled</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions */}
        <TabsContent value="permissions" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Access Control</CardTitle>
              <CardDescription>Who can view and modify this workflow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Edit Access</label>
                <Select defaultValue="admins">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">Owner Only</SelectItem>
                    <SelectItem value="admins">Administrators</SelectItem>
                    <SelectItem value="team">Team Members</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Deploy Access</label>
                <Select defaultValue="admins">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">Owner Only</SelectItem>
                    <SelectItem value="admins">Administrators</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Runtime Permissions</CardTitle>
              <CardDescription>Permissions required to execute this workflow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">case:read</Badge>
                  <span className="text-sm text-muted-foreground">Read case data</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">case:write</Badge>
                  <span className="text-sm text-muted-foreground">Write case artifacts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">ai:invoke</Badge>
                  <span className="text-sm text-muted-foreground">Invoke AI services</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">ledger:write</Badge>
                  <span className="text-sm text-muted-foreground">Write audit entries</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deployment */}
        <TabsContent value="deployment" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Deployment Target</CardTitle>
              <CardDescription>Where this workflow will be deployed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Target Environment</label>
                <Select defaultValue="local">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local Docker Runtime</SelectItem>
                    <SelectItem value="staging">Staging Environment</SelectItem>
                    <SelectItem value="production" disabled>
                      Production (requires approval)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-yellow-800">POC Mode</h4>
                  <p className="text-sm text-yellow-700">
                    Deployment is currently limited to local Docker runtime for the proof of
                    concept phase.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resource Limits</CardTitle>
              <CardDescription>Compute and storage limits for deployed instances</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Max Concurrent Instances</label>
                  <Input type="number" defaultValue="5" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Memory Limit (MB)</label>
                  <Input type="number" defaultValue="512" className="mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
