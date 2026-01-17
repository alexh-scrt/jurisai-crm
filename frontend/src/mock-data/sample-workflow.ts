import type { Node, Edge } from '@xyflow/react'

// Legal Case Assessment Workflow - demonstrates full lifecycle
// This workflow shows: triggers → AI analysis → human gates → generation → approval → output

export interface WorkflowNodeData extends Record<string, unknown> {
  label: string
  componentId: string
  description?: string
  kind: string
  color: string
  icon: string
  config?: Record<string, unknown>
  status?: 'idle' | 'running' | 'waiting' | 'completed' | 'error'
}

// Sample nodes representing the Legal Case Assessment workflow
export const sampleNodes: Node<WorkflowNodeData>[] = [
  // Trigger: Manual Start (Assess Case button clicked)
  {
    id: 'trigger-1',
    type: 'workflowNode',
    position: { x: 50, y: 200 },
    data: {
      label: 'Assess Case',
      componentId: 'trigger.ManualStart',
      description: 'Triggered when consultant clicks "Assess Case"',
      kind: 'trigger',
      color: 'green',
      icon: 'Play',
      status: 'completed',
    },
  },

  // Step 1: Extract Facts & Timeline
  {
    id: 'extract-facts',
    type: 'workflowNode',
    position: { x: 250, y: 200 },
    data: {
      label: 'Extract Facts',
      componentId: 'legal.ExtractFactsTimeline',
      description: 'AI extracts structured facts and timeline with citations',
      kind: 'node',
      color: 'blue',
      icon: 'FileSearch',
      status: 'completed',
    },
  },

  // Step 2: Spot Legal Issues
  {
    id: 'spot-issues',
    type: 'workflowNode',
    position: { x: 450, y: 200 },
    data: {
      label: 'Spot Issues',
      componentId: 'legal.SpotIssues',
      description: 'AI identifies legal issues with confidence scores',
      kind: 'node',
      color: 'blue',
      icon: 'AlertTriangle',
      status: 'completed',
    },
  },

  // Step 3: Missing Info Checklist
  {
    id: 'missing-info',
    type: 'workflowNode',
    position: { x: 650, y: 200 },
    data: {
      label: 'Missing Info',
      componentId: 'legal.MissingInfoChecklist',
      description: 'Generates checklist of missing documents/facts',
      kind: 'node',
      color: 'blue',
      icon: 'ClipboardList',
      status: 'running',
    },
  },

  // Step 4: Strength Assessment
  {
    id: 'strength-assess',
    type: 'workflowNode',
    position: { x: 850, y: 200 },
    data: {
      label: 'Assessment',
      componentId: 'legal.StrengthAssessment',
      description: 'Assesses case strengths, weaknesses, assumptions',
      kind: 'node',
      color: 'blue',
      icon: 'BarChart3',
      status: 'idle',
    },
  },

  // Human Gate 1: Review Assessment Artifacts
  {
    id: 'approval-gate-1',
    type: 'workflowNode',
    position: { x: 1050, y: 200 },
    data: {
      label: 'Review Artifacts',
      componentId: 'gate.HumanApproval',
      description: 'Consultant reviews and approves AI-generated artifacts',
      kind: 'gate',
      color: 'orange',
      icon: 'UserCheck',
      config: {
        reason: 'Review extracted facts, issues, and assessment before proceeding',
      },
      status: 'idle',
    },
  },

  // Conditional: Check if assessment is approved
  {
    id: 'condition-approved',
    type: 'workflowNode',
    position: { x: 1250, y: 200 },
    data: {
      label: 'Approved?',
      componentId: 'flow.Condition',
      description: 'Check if artifacts were approved or rejected',
      kind: 'condition',
      color: 'yellow',
      icon: 'GitBranch',
      config: {
        condition: 'decision === "approved"',
      },
      status: 'idle',
    },
  },

  // Branch: Generate Memo (if approved)
  {
    id: 'generate-memo',
    type: 'workflowNode',
    position: { x: 1450, y: 100 },
    data: {
      label: 'Generate Memo',
      componentId: 'legal.AssembleMemo',
      description: 'AI generates assessment memo from approved artifacts',
      kind: 'node',
      color: 'purple',
      icon: 'FileText',
      status: 'idle',
    },
  },

  // Branch: Check if missing info exists (parallel path)
  {
    id: 'has-missing-info',
    type: 'workflowNode',
    position: { x: 1450, y: 300 },
    data: {
      label: 'Missing Info?',
      componentId: 'flow.Condition',
      description: 'Check if there are missing documents to request',
      kind: 'condition',
      color: 'yellow',
      icon: 'GitBranch',
      config: {
        condition: 'checklist.items.length > 0',
      },
      status: 'idle',
    },
  },

  // Generate Client Email (if missing info)
  {
    id: 'generate-email',
    type: 'workflowNode',
    position: { x: 1650, y: 350 },
    data: {
      label: 'Draft Email',
      componentId: 'legal.ClientEmailDraft',
      description: 'AI drafts email requesting missing information',
      kind: 'node',
      color: 'purple',
      icon: 'Mail',
      status: 'idle',
    },
  },

  // Human Gate 2: Edit Email
  {
    id: 'edit-email-gate',
    type: 'workflowNode',
    position: { x: 1850, y: 350 },
    data: {
      label: 'Edit Email',
      componentId: 'gate.EditGate',
      description: 'Consultant reviews and edits email before sending',
      kind: 'gate',
      color: 'orange',
      icon: 'PenLine',
      status: 'idle',
    },
  },

  // Send Email
  {
    id: 'send-email',
    type: 'workflowNode',
    position: { x: 2050, y: 350 },
    data: {
      label: 'Send Email',
      componentId: 'connector.EmailSend',
      description: 'Sends approved email to client',
      kind: 'connector',
      color: 'cyan',
      icon: 'Send',
      status: 'idle',
    },
  },

  // Human Gate 3: Review Memo
  {
    id: 'review-memo-gate',
    type: 'workflowNode',
    position: { x: 1650, y: 100 },
    data: {
      label: 'Review Memo',
      componentId: 'gate.HumanApproval',
      description: 'Senior reviewer approves final memo',
      kind: 'gate',
      color: 'orange',
      icon: 'UserCheck',
      config: {
        reason: 'Final review of assessment memo before completion',
      },
      status: 'idle',
    },
  },

  // Rejected path: Request more info
  {
    id: 'request-info-task',
    type: 'workflowNode',
    position: { x: 1450, y: 450 },
    data: {
      label: 'Request Info',
      componentId: 'gate.TaskAssignment',
      description: 'Create task for consultant to gather more information',
      kind: 'gate',
      color: 'orange',
      icon: 'ListTodo',
      config: {
        title: 'Gather additional information for case assessment',
      },
      status: 'idle',
    },
  },

  // Error Handler: AI Failure
  {
    id: 'ai-error-handler',
    type: 'workflowNode',
    position: { x: 450, y: 400 },
    data: {
      label: 'AI Error Log',
      componentId: 'util.Logger',
      description: 'Logs AI failure details to audit ledger',
      kind: 'node',
      color: 'gray',
      icon: 'ScrollText',
      config: {
        level: 'error',
        message: 'AI processing failed',
      },
      status: 'idle',
    },
  },

  // End: AI Error
  {
    id: 'end-ai-error',
    type: 'workflowNode',
    position: { x: 650, y: 400 },
    data: {
      label: 'AI Failed',
      componentId: 'end.Error',
      description: 'Workflow ended due to AI processing failure',
      kind: 'end',
      color: 'red',
      icon: 'XCircle',
      status: 'idle',
    },
  },

  // End: Success
  {
    id: 'end-success',
    type: 'workflowNode',
    position: { x: 1850, y: 100 },
    data: {
      label: 'Complete',
      componentId: 'end.Success',
      description: 'Case assessment workflow completed',
      kind: 'end',
      color: 'emerald',
      icon: 'CheckCircle',
      status: 'idle',
    },
  },

  // End: Awaiting client response
  {
    id: 'end-waiting',
    type: 'workflowNode',
    position: { x: 2250, y: 350 },
    data: {
      label: 'Awaiting Response',
      componentId: 'end.Waiting',
      description: 'Waiting for client to provide missing information',
      kind: 'end',
      color: 'amber',
      icon: 'Pause',
      status: 'idle',
    },
  },
]

// Edges connecting the workflow nodes
export const sampleEdges: Edge[] = [
  // Main flow: Trigger → Extract Facts → Spot Issues → Missing Info → Assessment
  // AI nodes use 'success' handle for main flow and 'failure' handle for error handling
  {
    id: 'e-trigger-extract',
    source: 'trigger-1',
    target: 'extract-facts',
    sourceHandle: 'output',
    targetHandle: 'input',
    animated: true,
    style: { stroke: '#000000', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#000000' },
  },
  {
    id: 'e-extract-spot',
    source: 'extract-facts',
    target: 'spot-issues',
    sourceHandle: 'success',  // AI node success output
    targetHandle: 'input',
    animated: true,
    label: 'Success',
    labelStyle: { fill: '#22c55e', fontSize: 11, fontWeight: 500 },
    labelBgStyle: {
      fill: 'hsl(var(--background))',
      fillOpacity: 1,
      stroke: '#22c55e',
      strokeWidth: 1,
      strokeDasharray: '4 2',
    },
    labelBgPadding: [6, 10] as [number, number],
    style: { stroke: '#22c55e', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#22c55e' },
  },
  // Failure path from Extract Facts to error handler
  {
    id: 'e-extract-failure',
    source: 'extract-facts',
    target: 'ai-error-handler',
    sourceHandle: 'failure',  // AI node failure output
    targetHandle: 'input',
    animated: false,
    label: 'Failure',
    labelStyle: { fill: '#ef4444', fontSize: 11, fontWeight: 500 },
    labelBgStyle: {
      fill: 'hsl(var(--background))',
      fillOpacity: 1,
      stroke: '#ef4444',
      strokeWidth: 1,
      strokeDasharray: '4 2',
    },
    labelBgPadding: [6, 10] as [number, number],
    style: { stroke: '#ef4444', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#ef4444' },
  },
  {
    id: 'e-spot-missing',
    source: 'spot-issues',
    target: 'missing-info',
    sourceHandle: 'success',  // AI node success output
    targetHandle: 'input',
    animated: true,
    label: 'Success',
    labelStyle: { fill: '#22c55e', fontSize: 11, fontWeight: 500 },
    labelBgStyle: {
      fill: 'hsl(var(--background))',
      fillOpacity: 1,
      stroke: '#22c55e',
      strokeWidth: 1,
      strokeDasharray: '4 2',
    },
    labelBgPadding: [6, 10] as [number, number],
    style: { stroke: '#22c55e', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#22c55e' },
  },
  // Failure path from Spot Issues to error handler
  {
    id: 'e-spot-failure',
    source: 'spot-issues',
    target: 'ai-error-handler',
    sourceHandle: 'failure',  // AI node failure output
    targetHandle: 'input',
    animated: false,
    label: 'Failure',
    labelStyle: { fill: '#ef4444', fontSize: 11, fontWeight: 500 },
    labelBgStyle: {
      fill: 'hsl(var(--background))',
      fillOpacity: 1,
      stroke: '#ef4444',
      strokeWidth: 1,
      strokeDasharray: '4 2',
    },
    labelBgPadding: [6, 10] as [number, number],
    style: { stroke: '#ef4444', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#ef4444' },
  },
  {
    id: 'e-missing-strength',
    source: 'missing-info',
    target: 'strength-assess',
    sourceHandle: 'success',  // AI node success output
    targetHandle: 'input',
    animated: false,
    label: 'Success',
    labelStyle: { fill: '#22c55e', fontSize: 11, fontWeight: 500 },
    labelBgStyle: {
      fill: 'hsl(var(--background))',
      fillOpacity: 1,
      stroke: '#22c55e',
      strokeWidth: 1,
      strokeDasharray: '4 2',
    },
    labelBgPadding: [6, 10] as [number, number],
    style: { stroke: '#22c55e', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#22c55e' },
  },
  {
    id: 'e-strength-gate1',
    source: 'strength-assess',
    target: 'approval-gate-1',
    sourceHandle: 'success',  // AI node success output
    targetHandle: 'input',
    animated: false,
    label: 'Success',
    labelStyle: { fill: '#22c55e', fontSize: 11, fontWeight: 500 },
    labelBgStyle: {
      fill: 'hsl(var(--background))',
      fillOpacity: 1,
      stroke: '#22c55e',
      strokeWidth: 1,
      strokeDasharray: '4 2',
    },
    labelBgPadding: [6, 10] as [number, number],
    style: { stroke: '#22c55e', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#22c55e' },
  },
  // Error handler to end error
  {
    id: 'e-error-end',
    source: 'ai-error-handler',
    target: 'end-ai-error',
    sourceHandle: 'output',
    targetHandle: 'input',
    animated: false,
    style: { stroke: '#ef4444', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#ef4444' },
  },
  {
    id: 'e-gate1-condition',
    source: 'approval-gate-1',
    target: 'condition-approved',
    sourceHandle: 'output',
    targetHandle: 'input',
    animated: false,
    style: { stroke: '#000000', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#000000' },
  },

  // Approved branch: Generate Memo
  {
    id: 'e-condition-memo',
    source: 'condition-approved',
    target: 'generate-memo',
    sourceHandle: 'true',
    targetHandle: 'input',
    animated: false,
    label: 'Yes',
    labelStyle: { fill: '#22c55e', fontSize: 11, fontWeight: 500 },
    labelBgStyle: {
      fill: 'hsl(var(--background))',
      fillOpacity: 1,
      stroke: '#22c55e',
      strokeWidth: 1,
      strokeDasharray: '4 2',
    },
    labelBgPadding: [6, 10] as [number, number],
    style: { stroke: '#22c55e', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#22c55e' },
  },

  // Approved branch: Check missing info
  {
    id: 'e-condition-hasmissing',
    source: 'condition-approved',
    target: 'has-missing-info',
    sourceHandle: 'true',
    targetHandle: 'input',
    animated: false,
    style: { stroke: '#22c55e', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#22c55e' },
  },

  // Rejected branch: Request more info
  {
    id: 'e-condition-rejected',
    source: 'condition-approved',
    target: 'request-info-task',
    sourceHandle: 'false',
    targetHandle: 'input',
    animated: false,
    label: 'No',
    labelStyle: { fill: '#ef4444', fontSize: 11, fontWeight: 500 },
    labelBgStyle: {
      fill: 'hsl(var(--background))',
      fillOpacity: 1,
      stroke: '#ef4444',
      strokeWidth: 1,
      strokeDasharray: '4 2',
    },
    labelBgPadding: [6, 10] as [number, number],
    style: { stroke: '#ef4444', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#ef4444' },
  },

  // Memo review flow - Generate Memo is an AI node with success/failure outputs
  {
    id: 'e-memo-review',
    source: 'generate-memo',
    target: 'review-memo-gate',
    sourceHandle: 'success',  // AI node success output
    targetHandle: 'input',
    animated: false,
    label: 'Success',
    labelStyle: { fill: '#22c55e', fontSize: 11, fontWeight: 500 },
    labelBgStyle: {
      fill: 'hsl(var(--background))',
      fillOpacity: 1,
      stroke: '#22c55e',
      strokeWidth: 1,
      strokeDasharray: '4 2',
    },
    labelBgPadding: [6, 10] as [number, number],
    style: { stroke: '#22c55e', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#22c55e' },
  },
  {
    id: 'e-review-success',
    source: 'review-memo-gate',
    target: 'end-success',
    sourceHandle: 'approved',
    targetHandle: 'input',
    animated: false,
    label: 'Approved',
    labelStyle: { fill: '#22c55e', fontSize: 11, fontWeight: 500 },
    labelBgStyle: {
      fill: 'hsl(var(--background))',
      fillOpacity: 1,
      stroke: '#22c55e',
      strokeWidth: 1,
      strokeDasharray: '4 2',
    },
    labelBgPadding: [6, 10] as [number, number],
    style: { stroke: '#22c55e', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#22c55e' },
  },

  // Email generation flow (if missing info)
  {
    id: 'e-hasmissing-email',
    source: 'has-missing-info',
    target: 'generate-email',
    sourceHandle: 'true',
    targetHandle: 'input',
    animated: false,
    label: 'Yes',
    labelStyle: { fill: '#22c55e', fontSize: 11, fontWeight: 500 },
    labelBgStyle: {
      fill: 'hsl(var(--background))',
      fillOpacity: 1,
      stroke: '#22c55e',
      strokeWidth: 1,
      strokeDasharray: '4 2',
    },
    labelBgPadding: [6, 10] as [number, number],
    style: { stroke: '#22c55e', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#22c55e' },
  },
  // Generate Email is an AI node with success/failure outputs
  {
    id: 'e-email-edit',
    source: 'generate-email',
    target: 'edit-email-gate',
    sourceHandle: 'success',  // AI node success output
    targetHandle: 'input',
    animated: false,
    label: 'Success',
    labelStyle: { fill: '#22c55e', fontSize: 11, fontWeight: 500 },
    labelBgStyle: {
      fill: 'hsl(var(--background))',
      fillOpacity: 1,
      stroke: '#22c55e',
      strokeWidth: 1,
      strokeDasharray: '4 2',
    },
    labelBgPadding: [6, 10] as [number, number],
    style: { stroke: '#22c55e', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#22c55e' },
  },
  {
    id: 'e-edit-send',
    source: 'edit-email-gate',
    target: 'send-email',
    sourceHandle: 'finalized',
    targetHandle: 'input',
    animated: false,
    style: { stroke: '#000000', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#000000' },
  },
  {
    id: 'e-send-waiting',
    source: 'send-email',
    target: 'end-waiting',
    sourceHandle: 'output',
    targetHandle: 'input',
    animated: false,
    style: { stroke: '#000000', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#000000' },
  },

  // Loop back from request info (simplified - in reality would trigger new assessment)
  {
    id: 'e-request-waiting',
    source: 'request-info-task',
    target: 'end-waiting',
    sourceHandle: 'completed',
    targetHandle: 'input',
    animated: false,
    style: { stroke: '#000000', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#000000' },
  },
]

// Alternative: Simple Assessment Workflow (for quick demo)
export const simpleWorkflowNodes: Node<WorkflowNodeData>[] = [
  {
    id: 'start',
    type: 'workflowNode',
    position: { x: 50, y: 150 },
    data: {
      label: 'Case Created',
      componentId: 'trigger.CaseCreated',
      kind: 'trigger',
      color: 'green',
      icon: 'Plus',
      status: 'completed',
    },
  },
  {
    id: 'analyze',
    type: 'workflowNode',
    position: { x: 250, y: 150 },
    data: {
      label: 'AI Analysis',
      componentId: 'legal.CaseOrchestrator',
      description: 'Full case assessment pipeline',
      kind: 'node',
      color: 'blue',
      icon: 'Workflow',
      status: 'running',
    },
  },
  {
    id: 'approve',
    type: 'workflowNode',
    position: { x: 450, y: 150 },
    data: {
      label: 'Approve Results',
      componentId: 'gate.HumanApproval',
      kind: 'gate',
      color: 'orange',
      icon: 'UserCheck',
      status: 'idle',
    },
  },
  {
    id: 'complete',
    type: 'workflowNode',
    position: { x: 650, y: 150 },
    data: {
      label: 'Complete',
      componentId: 'end.Success',
      kind: 'end',
      color: 'emerald',
      icon: 'CheckCircle',
      status: 'idle',
    },
  },
]

export const simpleWorkflowEdges: Edge[] = [
  {
    id: 'e1',
    source: 'start',
    target: 'analyze',
    sourceHandle: 'output',
    animated: true,
    style: { stroke: '#000000', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#000000' },
  },
  // AI Analysis node uses success handle
  {
    id: 'e2',
    source: 'analyze',
    target: 'approve',
    sourceHandle: 'success',
    animated: true,
    label: 'Success',
    labelStyle: { fill: '#22c55e', fontSize: 11, fontWeight: 500 },
    labelBgStyle: {
      fill: 'hsl(var(--background))',
      fillOpacity: 1,
      stroke: '#22c55e',
      strokeWidth: 1,
      strokeDasharray: '4 2',
    },
    labelBgPadding: [6, 10] as [number, number],
    style: { stroke: '#22c55e', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#22c55e' },
  },
  {
    id: 'e3',
    source: 'approve',
    target: 'complete',
    sourceHandle: 'approved',
    animated: false,
    style: { stroke: '#000000', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#000000' },
  },
]
