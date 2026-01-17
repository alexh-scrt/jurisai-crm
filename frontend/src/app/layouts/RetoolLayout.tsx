import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Search,
  Settings,
  Play,
  Eye,
  Save,
  MoreHorizontal,
  Layers,
  Box,
  Type,
  ToggleLeft,
  Table,
  FileInput,
  ArrowLeft,
  Grip,
  Copy,
  Trash2,
  Lock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { ThemeSwitcherDropdown } from './shared/ThemeSwitcherDropdown'
import { mockWorkflows } from '@/mock-data/workflows'

interface ComponentItem {
  id: string
  name: string
  type: string
  icon: typeof Box
}

const componentTree: ComponentItem[] = [
  { id: 'form1', name: 'caseIntakeForm', type: 'Form', icon: FileInput },
  { id: 'table1', name: 'casesTable', type: 'Table', icon: Table },
  { id: 'text1', name: 'headerText', type: 'Text', icon: Type },
  { id: 'button1', name: 'submitButton', type: 'Button', icon: Box },
  { id: 'toggle1', name: 'advancedToggle', type: 'Switch', icon: ToggleLeft },
]

const componentPalette = [
  { category: 'Inputs', items: ['Text Input', 'Number Input', 'Select', 'Date Picker', 'File Upload'] },
  { category: 'Display', items: ['Text', 'Table', 'Chart', 'Statistic', 'Image'] },
  { category: 'Actions', items: ['Button', 'Link', 'Modal', 'Drawer'] },
  { category: 'Layout', items: ['Container', 'Tabs', 'Form', 'List View'] },
]

export function RetoolLayout() {
  const [selectedComponent, setSelectedComponent] = useState('form1')
  const [expandedCategories, setExpandedCategories] = useState(['Inputs', 'Display'])
  const selectedWorkflow = mockWorkflows[0]

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Navigation */}
      <header className="h-11 flex items-center justify-between px-3 border-b bg-sidebar">
        <div className="flex items-center gap-3">
          <Link to="/layouts" className="text-sidebar-foreground/70 hover:text-sidebar-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">J</span>
            </div>
            <span className="text-sidebar-foreground font-medium text-sm">Retool Style</span>
          </div>
          <Separator orientation="vertical" className="h-5 bg-sidebar-foreground/20" />
          <nav className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-foreground/10"
            >
              Apps
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-sidebar-foreground hover:bg-sidebar-foreground/10 bg-sidebar-foreground/10"
            >
              Workflows
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-foreground/10"
            >
              Resources
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeSwitcherDropdown />
          <Button variant="ghost" size="sm" className="h-7 text-sidebar-foreground/70">
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-sidebar-foreground/70">
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button size="sm" className="h-7">
            <Play className="h-4 w-4 mr-1" />
            Deploy
          </Button>
        </div>
      </header>

      {/* Secondary Toolbar */}
      <div className="h-10 flex items-center justify-between px-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{selectedWorkflow.name}</span>
          <Badge variant="outline" className="text-xs">
            v{selectedWorkflow.version}
          </Badge>
          <Badge
            variant="outline"
            className={cn(
              'text-xs',
              selectedWorkflow.status === 'deployed'
                ? 'border-green-400 text-green-700'
                : 'border-yellow-400 text-yellow-700'
            )}
          >
            {selectedWorkflow.status}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Component Palette */}
        <aside className="w-52 border-r bg-muted/20 flex flex-col">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search components..." className="pl-7 h-7 text-xs" />
            </div>
          </div>

          <div className="flex-1 overflow-auto p-2">
            {componentPalette.map((section) => (
              <div key={section.category} className="mb-2">
                <button
                  onClick={() => toggleCategory(section.category)}
                  className="w-full flex items-center gap-1 py-1.5 px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  {expandedCategories.includes(section.category) ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                  {section.category}
                </button>
                {expandedCategories.includes(section.category) && (
                  <div className="grid grid-cols-2 gap-1 mt-1 pl-4">
                    {section.items.map((item) => (
                      <button
                        key={item}
                        className="flex items-center gap-1 p-2 text-[10px] bg-background rounded border hover:border-primary hover:bg-primary/5 transition-colors"
                      >
                        <Box className="h-3 w-3 text-muted-foreground" />
                        <span className="truncate">{item}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-2 border-t">
            <Button variant="outline" size="sm" className="w-full text-xs">
              <Plus className="h-3 w-3 mr-1" />
              Custom Component
            </Button>
          </div>
        </aside>

        {/* Center - Canvas */}
        <main className="flex-1 bg-muted/50 flex flex-col overflow-hidden">
          {/* Canvas Toolbar */}
          <div className="h-8 flex items-center justify-between px-3 bg-background border-b">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Layers className="h-3.5 w-3.5" />
              <span>Canvas</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground">Main View</span>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Grip className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 overflow-auto p-6">
            <div className="bg-background rounded-lg border shadow-sm min-h-[500px] p-6">
              {/* Mock App Preview */}
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b">
                  <h2 className="text-lg font-semibold">Case Intake Form</h2>
                  <Badge variant="outline">Draft</Badge>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={cn(
                      'p-3 rounded border-2 border-dashed cursor-pointer transition-colors',
                      selectedComponent === 'form1' ? 'border-primary bg-primary/5' : 'border-transparent hover:border-muted-foreground/30'
                    )}
                    onClick={() => setSelectedComponent('form1')}
                  >
                    <label className="text-sm text-muted-foreground">Client Name</label>
                    <Input placeholder="Enter client name" className="mt-1" />
                  </div>
                  <div className="p-3 rounded border-2 border-dashed border-transparent hover:border-muted-foreground/30 cursor-pointer">
                    <label className="text-sm text-muted-foreground">Case Type</label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="civil">Civil</SelectItem>
                        <SelectItem value="criminal">Criminal</SelectItem>
                        <SelectItem value="corporate">Corporate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-3 rounded border-2 border-dashed border-transparent hover:border-muted-foreground/30 cursor-pointer">
                  <label className="text-sm text-muted-foreground">Description</label>
                  <textarea
                    className="w-full mt-1 p-2 rounded-md border text-sm resize-none h-24"
                    placeholder="Enter case description..."
                  />
                </div>

                {/* Table Preview */}
                <div
                  className={cn(
                    'p-3 rounded border-2 border-dashed cursor-pointer transition-colors',
                    selectedComponent === 'table1' ? 'border-primary bg-primary/5' : 'border-transparent hover:border-muted-foreground/30'
                  )}
                  onClick={() => setSelectedComponent('table1')}
                >
                  <div className="text-sm font-medium mb-2">Recent Cases</div>
                  <div className="border rounded">
                    <div className="grid grid-cols-4 gap-4 p-2 bg-muted/50 text-xs font-medium">
                      <span>Case ID</span>
                      <span>Client</span>
                      <span>Type</span>
                      <span>Status</span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 p-2 text-xs border-t">
                      <span>CASE-001</span>
                      <span>Acme Corp</span>
                      <span>Corporate</span>
                      <span className="text-green-600">Active</span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 p-2 text-xs border-t">
                      <span>CASE-002</span>
                      <span>John Doe</span>
                      <span>Civil</span>
                      <span className="text-yellow-600">Pending</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4">
                  <Button
                    className={cn(
                      'border-2 border-dashed',
                      selectedComponent === 'button1' ? 'border-primary' : 'border-transparent'
                    )}
                    onClick={() => setSelectedComponent('button1')}
                  >
                    Submit Case
                  </Button>
                  <Button variant="outline">Cancel</Button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Right Panel - Component Tree + Properties */}
        <aside className="w-64 border-l bg-muted/20 flex flex-col">
          {/* Component Tree */}
          <div className="border-b">
            <div className="p-2 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Component Tree</span>
              <Button variant="ghost" size="icon" className="h-5 w-5">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <div className="max-h-40 overflow-auto px-2 pb-2">
              {componentTree.map((comp) => (
                <button
                  key={comp.id}
                  onClick={() => setSelectedComponent(comp.id)}
                  className={cn(
                    'w-full flex items-center gap-2 py-1.5 px-2 rounded text-xs transition-colors',
                    selectedComponent === comp.id
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted text-foreground/80'
                  )}
                >
                  <comp.icon className="h-3.5 w-3.5" />
                  <span className="flex-1 text-left truncate">{comp.name}</span>
                  <span className="text-muted-foreground text-[10px]">{comp.type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Properties Panel */}
          <div className="flex-1 overflow-auto">
            <div className="p-2 border-b flex items-center justify-between">
              <span className="text-xs font-medium">Properties</span>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-5 w-5">
                  <Copy className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-5 w-5">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="p-3 space-y-4">
              {/* Basic */}
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Name
                </label>
                <Input className="h-7 text-xs mt-1" value="caseIntakeForm" />
              </div>

              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Label
                </label>
                <Input className="h-7 text-xs mt-1" value="Case Intake Form" />
              </div>

              <Separator />

              {/* Interaction */}
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 block">
                  On Submit
                </label>
                <Select>
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="query">Run Query</SelectItem>
                    <SelectItem value="api">Call API</SelectItem>
                    <SelectItem value="navigate">Navigate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Display */}
              <div className="flex items-center justify-between">
                <label className="text-xs">Visible</label>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-xs">Disabled</label>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-xs flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Read Only
                </label>
                <Switch />
              </div>

              <Separator />

              {/* Styling */}
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 block">
                  Styling
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-muted-foreground">Width</label>
                    <Input className="h-7 text-xs mt-1" value="100%" />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground">Padding</label>
                    <Input className="h-7 text-xs mt-1" value="16px" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
