export type ComponentKind = 'trigger' | 'node' | 'gate' | 'condition' | 'connector' | 'end'

export interface ComponentPort {
  id: string
  name: string
  type: string
  required?: boolean
  description?: string
}

export interface ComponentDefinition {
  id: string
  name: string
  displayName: string
  version: string
  kind: ComponentKind
  category: string
  description: string
  inputs: ComponentPort[]
  outputs: ComponentPort[]
  hasAI: boolean
  aiToggles?: string[]
  color: string // Node border/accent color
  icon: string // Lucide icon name
}

export const componentCategories = [
  { id: 'triggers', name: 'Triggers', icon: 'Zap', description: 'Start workflow execution' },
  { id: 'legal-analysis', name: 'Legal / Analysis', icon: 'Scale', description: 'AI-powered legal analysis' },
  { id: 'legal-generation', name: 'Legal / Generation', icon: 'FileText', description: 'Document generation' },
  { id: 'workflow-control', name: 'Flow Control', icon: 'GitBranch', description: 'Control workflow execution' },
  { id: 'human-gates', name: 'Human Gates', icon: 'UserCheck', description: 'Human-in-the-loop approvals' },
  { id: 'connectors', name: 'Connectors', icon: 'Plug', description: 'External integrations' },
  { id: 'utilities', name: 'Utilities', icon: 'Wrench', description: 'Helper components' },
  { id: 'endpoints', name: 'Endpoints', icon: 'Flag', description: 'Workflow termination' },
]

export const mockComponents: ComponentDefinition[] = [
  // ============ TRIGGERS ============
  {
    id: 'trigger.CaseCreated',
    name: 'trigger.CaseCreated',
    displayName: 'Case Created',
    version: '1.0.0',
    kind: 'trigger',
    category: 'triggers',
    description: 'Triggered when a new case is created in the system',
    inputs: [],
    outputs: [
      { id: 'case_id', name: 'case_id', type: 'core.CaseId', description: 'The new case ID' },
      { id: 'created_by', name: 'created_by', type: 'core.UserId', description: 'User who created the case' },
    ],
    hasAI: false,
    color: 'green',
    icon: 'Plus',
  },
  {
    id: 'trigger.DocumentUploaded',
    name: 'trigger.DocumentUploaded',
    displayName: 'Document Uploaded',
    version: '1.0.0',
    kind: 'trigger',
    category: 'triggers',
    description: 'Triggered when documents are uploaded to a case',
    inputs: [],
    outputs: [
      { id: 'case_id', name: 'case_id', type: 'core.CaseId' },
      { id: 'document_ids', name: 'document_ids', type: 'core.DocumentId[]' },
    ],
    hasAI: false,
    color: 'green',
    icon: 'Upload',
  },
  {
    id: 'trigger.ManualStart',
    name: 'trigger.ManualStart',
    displayName: 'Manual Start',
    version: '1.0.0',
    kind: 'trigger',
    category: 'triggers',
    description: 'Manually triggered by user action (e.g., "Assess Case" button)',
    inputs: [],
    outputs: [
      { id: 'case_id', name: 'case_id', type: 'core.CaseId' },
      { id: 'triggered_by', name: 'triggered_by', type: 'core.UserId' },
    ],
    hasAI: false,
    color: 'green',
    icon: 'Play',
  },
  {
    id: 'trigger.ScheduledTask',
    name: 'trigger.ScheduledTask',
    displayName: 'Scheduled Task',
    version: '1.0.0',
    kind: 'trigger',
    category: 'triggers',
    description: 'Triggered on a schedule (cron expression)',
    inputs: [],
    outputs: [
      { id: 'timestamp', name: 'timestamp', type: 'datetime' },
    ],
    hasAI: false,
    color: 'green',
    icon: 'Clock',
  },

  // ============ LEGAL / ANALYSIS ============
  {
    id: 'legal.ExtractFactsTimeline',
    name: 'legal.ExtractFactsTimeline',
    displayName: 'Extract Facts & Timeline',
    version: '1.0.0',
    kind: 'node',
    category: 'legal-analysis',
    description: 'Extracts structured facts and timeline events from case documents with citations',
    inputs: [
      { id: 'case_id', name: 'case_id', type: 'core.CaseId', required: true },
      { id: 'document_ids', name: 'document_ids', type: 'core.DocumentId[]', description: 'Optional specific docs' },
    ],
    outputs: [
      { id: 'facts_timeline', name: 'facts_timeline', type: 'legal.FactsTimelineV1' },
      { id: 'artifact_id', name: 'artifact_id', type: 'core.ArtifactId' },
    ],
    hasAI: true,
    aiToggles: ['ai_extract', 'citation_linking'],
    color: 'blue',
    icon: 'FileSearch',
  },
  {
    id: 'legal.SpotIssues',
    name: 'legal.SpotIssues',
    displayName: 'Spot Legal Issues',
    version: '1.0.0',
    kind: 'node',
    category: 'legal-analysis',
    description: 'Identifies legal issues, claims, and defenses with confidence scores',
    inputs: [
      { id: 'case_id', name: 'case_id', type: 'core.CaseId', required: true },
      { id: 'facts_timeline', name: 'facts_timeline', type: 'legal.FactsTimelineV1' },
    ],
    outputs: [
      { id: 'issues', name: 'issues', type: 'legal.IssuesV1' },
      { id: 'artifact_id', name: 'artifact_id', type: 'core.ArtifactId' },
    ],
    hasAI: true,
    aiToggles: ['ai_spot', 'confidence_scoring'],
    color: 'blue',
    icon: 'AlertTriangle',
  },
  {
    id: 'legal.MissingInfoChecklist',
    name: 'legal.MissingInfoChecklist',
    displayName: 'Missing Info Checklist',
    version: '1.0.0',
    kind: 'node',
    category: 'legal-analysis',
    description: 'Generates actionable checklist of missing documents and facts',
    inputs: [
      { id: 'case_id', name: 'case_id', type: 'core.CaseId', required: true },
      { id: 'issues', name: 'issues', type: 'legal.IssuesV1' },
    ],
    outputs: [
      { id: 'checklist', name: 'checklist', type: 'legal.ChecklistV1' },
      { id: 'artifact_id', name: 'artifact_id', type: 'core.ArtifactId' },
    ],
    hasAI: true,
    aiToggles: ['ai_checklist'],
    color: 'blue',
    icon: 'ClipboardList',
  },
  {
    id: 'legal.StrengthAssessment',
    name: 'legal.StrengthAssessment',
    displayName: 'Strength & Completeness',
    version: '1.0.0',
    kind: 'node',
    category: 'legal-analysis',
    description: 'Rubric-based assessment of case strengths, weaknesses, and assumptions',
    inputs: [
      { id: 'case_id', name: 'case_id', type: 'core.CaseId', required: true },
      { id: 'facts_timeline', name: 'facts_timeline', type: 'legal.FactsTimelineV1' },
      { id: 'issues', name: 'issues', type: 'legal.IssuesV1' },
    ],
    outputs: [
      { id: 'assessment', name: 'assessment', type: 'legal.AssessmentV1' },
      { id: 'artifact_id', name: 'artifact_id', type: 'core.ArtifactId' },
    ],
    hasAI: true,
    aiToggles: ['ai_assess', 'rubric_scoring'],
    color: 'blue',
    icon: 'BarChart3',
  },
  {
    id: 'legal.CaseOrchestrator',
    name: 'legal.CaseOrchestrator',
    displayName: 'Case Assessment Pipeline',
    version: '1.0.0',
    kind: 'node',
    category: 'legal-analysis',
    description: 'Orchestrates complete case assessment (facts → issues → checklist → assessment)',
    inputs: [
      { id: 'case_id', name: 'case_id', type: 'core.CaseId', required: true },
    ],
    outputs: [
      { id: 'all_artifacts', name: 'all_artifacts', type: 'core.ArtifactId[]' },
      { id: 'status', name: 'status', type: 'string' },
    ],
    hasAI: true,
    aiToggles: ['ai_all'],
    color: 'blue',
    icon: 'Workflow',
  },

  // ============ LEGAL / GENERATION ============
  {
    id: 'legal.AssembleMemo',
    name: 'legal.AssembleMemo',
    displayName: 'Assemble Assessment Memo',
    version: '1.0.0',
    kind: 'node',
    category: 'legal-generation',
    description: 'Generates structured legal memo from approved assessment artifacts',
    inputs: [
      { id: 'case_id', name: 'case_id', type: 'core.CaseId', required: true },
      { id: 'artifact_ids', name: 'artifact_ids', type: 'core.ArtifactId[]', required: true },
    ],
    outputs: [
      { id: 'memo_draft', name: 'memo_draft', type: 'legal.MemoDraftV1' },
      { id: 'artifact_id', name: 'artifact_id', type: 'core.ArtifactId' },
    ],
    hasAI: true,
    aiToggles: ['ai_draft', 'citation_linking'],
    color: 'purple',
    icon: 'FileText',
  },
  {
    id: 'legal.ClientEmailDraft',
    name: 'legal.ClientEmailDraft',
    displayName: 'Client Email Draft',
    version: '1.0.0',
    kind: 'node',
    category: 'legal-generation',
    description: 'Drafts professional email to client requesting missing information',
    inputs: [
      { id: 'case_id', name: 'case_id', type: 'core.CaseId', required: true },
      { id: 'checklist', name: 'checklist', type: 'legal.ChecklistV1', required: true },
    ],
    outputs: [
      { id: 'email_draft', name: 'email_draft', type: 'legal.EmailDraftV1' },
      { id: 'artifact_id', name: 'artifact_id', type: 'core.ArtifactId' },
    ],
    hasAI: true,
    aiToggles: ['ai_email'],
    color: 'purple',
    icon: 'Mail',
  },
  {
    id: 'legal.GenerateReport',
    name: 'legal.GenerateReport',
    displayName: 'Generate Case Report',
    version: '1.0.0',
    kind: 'node',
    category: 'legal-generation',
    description: 'Generates comprehensive case report PDF',
    inputs: [
      { id: 'case_id', name: 'case_id', type: 'core.CaseId', required: true },
      { id: 'include_sections', name: 'include_sections', type: 'string[]' },
    ],
    outputs: [
      { id: 'report_url', name: 'report_url', type: 'string' },
      { id: 'artifact_id', name: 'artifact_id', type: 'core.ArtifactId' },
    ],
    hasAI: true,
    aiToggles: ['ai_report'],
    color: 'purple',
    icon: 'FileOutput',
  },

  // ============ FLOW CONTROL ============
  {
    id: 'flow.Condition',
    name: 'flow.Condition',
    displayName: 'Conditional Branch',
    version: '1.0.0',
    kind: 'condition',
    category: 'workflow-control',
    description: 'Routes workflow based on a boolean condition',
    inputs: [
      { id: 'value', name: 'value', type: 'any', required: true },
      { id: 'condition', name: 'condition', type: 'string', required: true, description: 'Expression to evaluate' },
    ],
    outputs: [
      { id: 'true', name: 'true', type: 'any', description: 'Path when condition is true' },
      { id: 'false', name: 'false', type: 'any', description: 'Path when condition is false' },
    ],
    hasAI: false,
    color: 'yellow',
    icon: 'GitBranch',
  },
  {
    id: 'flow.Switch',
    name: 'flow.Switch',
    displayName: 'Switch / Multi-Branch',
    version: '1.0.0',
    kind: 'condition',
    category: 'workflow-control',
    description: 'Routes to multiple branches based on value matching',
    inputs: [
      { id: 'value', name: 'value', type: 'any', required: true },
    ],
    outputs: [
      { id: 'case_a', name: 'case_a', type: 'any' },
      { id: 'case_b', name: 'case_b', type: 'any' },
      { id: 'default', name: 'default', type: 'any' },
    ],
    hasAI: false,
    color: 'yellow',
    icon: 'Route',
  },
  {
    id: 'flow.Parallel',
    name: 'flow.Parallel',
    displayName: 'Parallel Execution',
    version: '1.0.0',
    kind: 'node',
    category: 'workflow-control',
    description: 'Executes multiple branches simultaneously, waits for all to complete',
    inputs: [
      { id: 'trigger', name: 'trigger', type: 'any', required: true },
    ],
    outputs: [
      { id: 'branch_1', name: 'branch_1', type: 'any' },
      { id: 'branch_2', name: 'branch_2', type: 'any' },
      { id: 'branch_3', name: 'branch_3', type: 'any' },
    ],
    hasAI: false,
    color: 'yellow',
    icon: 'GitMerge',
  },
  {
    id: 'flow.Merge',
    name: 'flow.Merge',
    displayName: 'Merge Branches',
    version: '1.0.0',
    kind: 'node',
    category: 'workflow-control',
    description: 'Merges multiple branches back into single flow',
    inputs: [
      { id: 'branch_1', name: 'branch_1', type: 'any' },
      { id: 'branch_2', name: 'branch_2', type: 'any' },
      { id: 'branch_3', name: 'branch_3', type: 'any' },
    ],
    outputs: [
      { id: 'merged', name: 'merged', type: 'any' },
    ],
    hasAI: false,
    color: 'yellow',
    icon: 'Merge',
  },
  {
    id: 'flow.Loop',
    name: 'flow.Loop',
    displayName: 'Loop / Iterator',
    version: '1.0.0',
    kind: 'node',
    category: 'workflow-control',
    description: 'Iterates over array items, executing branch for each',
    inputs: [
      { id: 'items', name: 'items', type: 'any[]', required: true },
    ],
    outputs: [
      { id: 'item', name: 'item', type: 'any', description: 'Current item in iteration' },
      { id: 'done', name: 'done', type: 'any', description: 'Triggered when loop completes' },
    ],
    hasAI: false,
    color: 'yellow',
    icon: 'Repeat',
  },

  // ============ HUMAN GATES ============
  {
    id: 'gate.HumanApproval',
    name: 'gate.HumanApproval',
    displayName: 'Human Approval Gate',
    version: '1.0.0',
    kind: 'gate',
    category: 'human-gates',
    description: 'Pauses workflow until human approves or rejects. Creates task for assignee.',
    inputs: [
      { id: 'artifact_ids', name: 'artifact_ids', type: 'core.ArtifactId[]', required: true },
      { id: 'reason', name: 'reason', type: 'string', required: true },
      { id: 'assignee', name: 'assignee', type: 'core.UserId' },
    ],
    outputs: [
      { id: 'approved', name: 'approved', type: 'any', description: 'Path when approved' },
      { id: 'rejected', name: 'rejected', type: 'any', description: 'Path when rejected' },
      { id: 'decision', name: 'decision', type: 'string' },
      { id: 'approved_ids', name: 'approved_ids', type: 'core.ArtifactId[]' },
    ],
    hasAI: false,
    color: 'orange',
    icon: 'UserCheck',
  },
  {
    id: 'gate.ReviewRequired',
    name: 'gate.ReviewRequired',
    displayName: 'Review Required',
    version: '1.0.0',
    kind: 'gate',
    category: 'human-gates',
    description: 'Requires human review before proceeding. Consultant must mark as reviewed.',
    inputs: [
      { id: 'data', name: 'data', type: 'any', required: true },
      { id: 'review_type', name: 'review_type', type: 'string', required: true },
    ],
    outputs: [
      { id: 'reviewed', name: 'reviewed', type: 'any' },
      { id: 'review_notes', name: 'review_notes', type: 'string' },
    ],
    hasAI: false,
    color: 'orange',
    icon: 'Eye',
  },
  {
    id: 'gate.EditGate',
    name: 'gate.EditGate',
    displayName: 'Human Edit Gate',
    version: '1.0.0',
    kind: 'gate',
    category: 'human-gates',
    description: 'Allows human to edit content before proceeding (e.g., email draft)',
    inputs: [
      { id: 'content', name: 'content', type: 'string', required: true },
      { id: 'content_type', name: 'content_type', type: 'string', required: true },
    ],
    outputs: [
      { id: 'edited_content', name: 'edited_content', type: 'string' },
      { id: 'finalized', name: 'finalized', type: 'any' },
    ],
    hasAI: false,
    color: 'orange',
    icon: 'PenLine',
  },
  {
    id: 'gate.TaskAssignment',
    name: 'gate.TaskAssignment',
    displayName: 'Task Assignment',
    version: '1.0.0',
    kind: 'gate',
    category: 'human-gates',
    description: 'Creates a task and waits for completion by assignee',
    inputs: [
      { id: 'title', name: 'title', type: 'string', required: true },
      { id: 'description', name: 'description', type: 'string' },
      { id: 'assignee', name: 'assignee', type: 'core.UserId' },
      { id: 'due_date', name: 'due_date', type: 'datetime' },
    ],
    outputs: [
      { id: 'completed', name: 'completed', type: 'any' },
      { id: 'task_result', name: 'task_result', type: 'any' },
    ],
    hasAI: false,
    color: 'orange',
    icon: 'ListTodo',
  },

  // ============ CONNECTORS ============
  {
    id: 'connector.EmailSend',
    name: 'connector.EmailSend',
    displayName: 'Send Email',
    version: '1.0.0',
    kind: 'connector',
    category: 'connectors',
    description: 'Sends email via configured SMTP provider',
    inputs: [
      { id: 'to', name: 'to', type: 'string', required: true },
      { id: 'subject', name: 'subject', type: 'string', required: true },
      { id: 'body', name: 'body', type: 'string', required: true },
      { id: 'attachments', name: 'attachments', type: 'core.DocumentId[]' },
    ],
    outputs: [
      { id: 'sent', name: 'sent', type: 'boolean' },
      { id: 'message_id', name: 'message_id', type: 'string' },
    ],
    hasAI: false,
    color: 'cyan',
    icon: 'Send',
  },
  {
    id: 'connector.DocumentStore',
    name: 'connector.DocumentStore',
    displayName: 'Store Document',
    version: '1.0.0',
    kind: 'connector',
    category: 'connectors',
    description: 'Stores document in case file storage with versioning',
    inputs: [
      { id: 'case_id', name: 'case_id', type: 'core.CaseId', required: true },
      { id: 'file', name: 'file', type: 'File', required: true },
      { id: 'metadata', name: 'metadata', type: 'object' },
    ],
    outputs: [
      { id: 'document_id', name: 'document_id', type: 'core.DocumentId' },
    ],
    hasAI: false,
    color: 'cyan',
    icon: 'Database',
  },
  {
    id: 'connector.Notification',
    name: 'connector.Notification',
    displayName: 'Send Notification',
    version: '1.0.0',
    kind: 'connector',
    category: 'connectors',
    description: 'Sends in-app notification to user',
    inputs: [
      { id: 'user_id', name: 'user_id', type: 'core.UserId', required: true },
      { id: 'title', name: 'title', type: 'string', required: true },
      { id: 'message', name: 'message', type: 'string', required: true },
    ],
    outputs: [
      { id: 'sent', name: 'sent', type: 'boolean' },
    ],
    hasAI: false,
    color: 'cyan',
    icon: 'Bell',
  },
  {
    id: 'connector.Webhook',
    name: 'connector.Webhook',
    displayName: 'Webhook',
    version: '1.0.0',
    kind: 'connector',
    category: 'connectors',
    description: 'Calls external webhook URL with payload',
    inputs: [
      { id: 'url', name: 'url', type: 'string', required: true },
      { id: 'method', name: 'method', type: 'string', required: true },
      { id: 'payload', name: 'payload', type: 'object' },
    ],
    outputs: [
      { id: 'response', name: 'response', type: 'object' },
      { id: 'status', name: 'status', type: 'number' },
    ],
    hasAI: false,
    color: 'cyan',
    icon: 'Globe',
  },

  // ============ UTILITIES ============
  {
    id: 'util.SetVariable',
    name: 'util.SetVariable',
    displayName: 'Set Variable',
    version: '1.0.0',
    kind: 'node',
    category: 'utilities',
    description: 'Sets a workflow variable for later use',
    inputs: [
      { id: 'name', name: 'name', type: 'string', required: true },
      { id: 'value', name: 'value', type: 'any', required: true },
    ],
    outputs: [
      { id: 'pass', name: 'pass', type: 'any' },
    ],
    hasAI: false,
    color: 'gray',
    icon: 'Variable',
  },
  {
    id: 'util.Transform',
    name: 'util.Transform',
    displayName: 'Transform Data',
    version: '1.0.0',
    kind: 'node',
    category: 'utilities',
    description: 'Transforms data using JSONata expression',
    inputs: [
      { id: 'input', name: 'input', type: 'any', required: true },
      { id: 'expression', name: 'expression', type: 'string', required: true },
    ],
    outputs: [
      { id: 'output', name: 'output', type: 'any' },
    ],
    hasAI: false,
    color: 'gray',
    icon: 'Shuffle',
  },
  {
    id: 'util.Delay',
    name: 'util.Delay',
    displayName: 'Delay',
    version: '1.0.0',
    kind: 'node',
    category: 'utilities',
    description: 'Adds a delay before continuing',
    inputs: [
      { id: 'duration', name: 'duration', type: 'number', required: true, description: 'Duration in milliseconds' },
    ],
    outputs: [
      { id: 'pass', name: 'pass', type: 'any' },
    ],
    hasAI: false,
    color: 'gray',
    icon: 'Timer',
  },
  {
    id: 'util.Logger',
    name: 'util.Logger',
    displayName: 'Log to Audit',
    version: '1.0.0',
    kind: 'node',
    category: 'utilities',
    description: 'Logs message and data to audit ledger',
    inputs: [
      { id: 'message', name: 'message', type: 'string', required: true },
      { id: 'data', name: 'data', type: 'any' },
      { id: 'level', name: 'level', type: 'string' },
    ],
    outputs: [
      { id: 'pass', name: 'pass', type: 'any' },
    ],
    hasAI: false,
    color: 'gray',
    icon: 'ScrollText',
  },

  // ============ ENDPOINTS ============
  {
    id: 'end.Success',
    name: 'end.Success',
    displayName: 'End: Success',
    version: '1.0.0',
    kind: 'end',
    category: 'endpoints',
    description: 'Marks workflow as completed successfully',
    inputs: [
      { id: 'result', name: 'result', type: 'any' },
      { id: 'message', name: 'message', type: 'string' },
    ],
    outputs: [],
    hasAI: false,
    color: 'emerald',
    icon: 'CheckCircle',
  },
  {
    id: 'end.Error',
    name: 'end.Error',
    displayName: 'End: Error',
    version: '1.0.0',
    kind: 'end',
    category: 'endpoints',
    description: 'Marks workflow as failed with error',
    inputs: [
      { id: 'error', name: 'error', type: 'string', required: true },
      { id: 'details', name: 'details', type: 'any' },
    ],
    outputs: [],
    hasAI: false,
    color: 'red',
    icon: 'XCircle',
  },
  {
    id: 'end.Waiting',
    name: 'end.Waiting',
    displayName: 'End: Awaiting Input',
    version: '1.0.0',
    kind: 'end',
    category: 'endpoints',
    description: 'Pauses workflow awaiting external input (resume trigger)',
    inputs: [
      { id: 'wait_for', name: 'wait_for', type: 'string', required: true },
      { id: 'timeout', name: 'timeout', type: 'number' },
    ],
    outputs: [],
    hasAI: false,
    color: 'amber',
    icon: 'Pause',
  },
]

// Helper function to get component by ID
export function getComponentById(id: string): ComponentDefinition | undefined {
  return mockComponents.find(c => c.id === id)
}

// Helper function to get components by category
export function getComponentsByCategory(categoryId: string): ComponentDefinition[] {
  return mockComponents.filter(c => c.category === categoryId)
}

// Helper to get node color class
export function getNodeColorClasses(color: string): { border: string; bg: string; glow: string } {
  const colors: Record<string, { border: string; bg: string; glow: string }> = {
    green: {
      border: 'border-green-400/60',
      bg: 'bg-green-400',
      glow: 'shadow-[0_0_20px_rgba(74,222,128,0.3)] hover:shadow-[0_0_30px_rgba(74,222,128,0.5)]',
    },
    blue: {
      border: 'border-blue-400/60',
      bg: 'bg-blue-400',
      glow: 'shadow-[0_0_20px_rgba(96,165,250,0.3)] hover:shadow-[0_0_30px_rgba(96,165,250,0.5)]',
    },
    purple: {
      border: 'border-purple-400/60',
      bg: 'bg-purple-400',
      glow: 'shadow-[0_0_20px_rgba(192,132,252,0.3)] hover:shadow-[0_0_30px_rgba(192,132,252,0.5)]',
    },
    yellow: {
      border: 'border-yellow-400/60',
      bg: 'bg-yellow-400',
      glow: 'shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:shadow-[0_0_30px_rgba(250,204,21,0.5)]',
    },
    orange: {
      border: 'border-orange-400/60',
      bg: 'bg-orange-400',
      glow: 'shadow-[0_0_20px_rgba(251,146,60,0.3)] hover:shadow-[0_0_30px_rgba(251,146,60,0.5)]',
    },
    cyan: {
      border: 'border-cyan-400/60',
      bg: 'bg-cyan-400',
      glow: 'shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]',
    },
    gray: {
      border: 'border-gray-400/60',
      bg: 'bg-gray-400',
      glow: 'shadow-[0_0_20px_rgba(156,163,175,0.3)] hover:shadow-[0_0_30px_rgba(156,163,175,0.5)]',
    },
    emerald: {
      border: 'border-emerald-400/60',
      bg: 'bg-emerald-400',
      glow: 'shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_30px_rgba(52,211,153,0.5)]',
    },
    red: {
      border: 'border-red-400/60',
      bg: 'bg-red-400',
      glow: 'shadow-[0_0_20px_rgba(248,113,113,0.3)] hover:shadow-[0_0_30px_rgba(248,113,113,0.5)]',
    },
    amber: {
      border: 'border-amber-400/60',
      bg: 'bg-amber-400',
      glow: 'shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.5)]',
    },
  }
  return colors[color] || colors.gray
}
