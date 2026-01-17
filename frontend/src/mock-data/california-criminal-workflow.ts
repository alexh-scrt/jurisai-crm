import type { Node, Edge } from '@xyflow/react'
import type { WorkflowNodeData } from './sample-workflow'

// California Criminal Defense Case Workflow
// This workflow represents a realistic criminal defense case intake and assessment
// process under California Penal Code, following standard public defender procedures.
//
// Key California-specific considerations:
// - Prop 47 (PC 1170.18) - felony reduction eligibility
// - PC 17(b) - wobbler reduction motions
// - PC 1203.4 - expungement eligibility
// - Realignment (AB 109) considerations
// - Three Strikes law analysis (PC 667/1170.12)

export const californiaWorkflowNodes: Node<WorkflowNodeData>[] = [
  // ============ INTAKE PHASE ============

  // Trigger: New criminal case assigned
  {
    id: 'ca-trigger-intake',
    type: 'workflowNode',
    position: { x: 50, y: 300 },
    data: {
      label: 'Case Intake',
      componentId: 'trigger.CaseCreated',
      description: 'New criminal case assigned from court arraignment',
      kind: 'trigger',
      color: 'green',
      icon: 'Plus',
      config: {
        case_type: 'criminal_defense',
        jurisdiction: 'CA',
      },
      status: 'completed',
    },
  },

  // Upload charging documents
  {
    id: 'ca-upload-docs',
    type: 'workflowNode',
    position: { x: 250, y: 300 },
    data: {
      label: 'Upload Documents',
      componentId: 'trigger.DocumentUploaded',
      description: 'Complaint, police reports, RAP sheet uploaded',
      kind: 'trigger',
      color: 'green',
      icon: 'Upload',
      config: {
        required_docs: ['complaint', 'police_report', 'rap_sheet'],
      },
      status: 'completed',
    },
  },

  // ============ AI ANALYSIS PHASE ============

  // Extract charges from complaint
  {
    id: 'ca-extract-charges',
    type: 'workflowNode',
    position: { x: 450, y: 300 },
    data: {
      label: 'Extract Charges',
      componentId: 'legal.ExtractFactsTimeline',
      description: 'AI extracts PC sections, enhancements, special allegations from complaint',
      kind: 'node',
      color: 'blue',
      icon: 'FileSearch',
      config: {
        extract_type: 'criminal_charges',
        jurisdiction: 'CA',
        include_enhancements: true,
      },
      status: 'completed',
    },
  },

  // Analyze prior record (RAP sheet)
  {
    id: 'ca-analyze-priors',
    type: 'workflowNode',
    position: { x: 650, y: 200 },
    data: {
      label: 'Analyze Priors',
      componentId: 'legal.ExtractFactsTimeline',
      description: 'AI analyzes criminal history, identifies strikes, priors per PC 667.5/668',
      kind: 'node',
      color: 'blue',
      icon: 'History',
      config: {
        analyze_strikes: true,
        analyze_priors: true,
        check_667_5: true,
      },
      status: 'completed',
    },
  },

  // Three Strikes Analysis
  {
    id: 'ca-strikes-analysis',
    type: 'workflowNode',
    position: { x: 850, y: 200 },
    data: {
      label: 'Strikes Analysis',
      componentId: 'legal.SpotIssues',
      description: 'Analyzes Three Strikes exposure under PC 667/1170.12, Romero motion viability',
      kind: 'node',
      color: 'blue',
      icon: 'AlertTriangle',
      config: {
        check_strikes_law: true,
        romero_analysis: true,
        people_v_superior_court: true,
      },
      status: 'running',
    },
  },

  // Sentencing exposure calculation
  {
    id: 'ca-sentencing-calc',
    type: 'workflowNode',
    position: { x: 650, y: 400 },
    data: {
      label: 'Sentence Exposure',
      componentId: 'legal.StrengthAssessment',
      description: 'Calculates max/mid/min exposure, identifies aggravating/mitigating per PC 1170',
      kind: 'node',
      color: 'blue',
      icon: 'Calculator',
      config: {
        calculate_triad: true,
        consecutive_analysis: true,
        enhancement_stacking: true,
      },
      status: 'idle',
    },
  },

  // Identify constitutional issues
  {
    id: 'ca-constitutional-issues',
    type: 'workflowNode',
    position: { x: 850, y: 400 },
    data: {
      label: 'Constitutional Issues',
      componentId: 'legal.SpotIssues',
      description: 'Identifies 4th/5th/6th Amendment issues, Miranda, search & seizure',
      kind: 'node',
      color: 'blue',
      icon: 'Shield',
      config: {
        check_4th_amendment: true,
        check_miranda: true,
        check_speedy_trial: true,
        check_confrontation: true,
      },
      status: 'idle',
    },
  },

  // Prop 47 / Wobbler Analysis
  {
    id: 'ca-prop47-analysis',
    type: 'workflowNode',
    position: { x: 1050, y: 300 },
    data: {
      label: 'Prop 47 / Wobbler',
      componentId: 'legal.SpotIssues',
      description: 'Analyzes PC 1170.18 eligibility, PC 17(b) reduction potential',
      kind: 'node',
      color: 'blue',
      icon: 'Scale',
      config: {
        prop_47_check: true,
        wobbler_analysis: true,
        pc_17b_motion: true,
      },
      status: 'idle',
    },
  },

  // ============ HUMAN REVIEW GATES ============

  // Attorney review of AI analysis
  {
    id: 'ca-attorney-review',
    type: 'workflowNode',
    position: { x: 1250, y: 300 },
    data: {
      label: 'Attorney Review',
      componentId: 'gate.HumanApproval',
      description: 'Defense attorney reviews AI analysis, confirms accuracy',
      kind: 'gate',
      color: 'orange',
      icon: 'UserCheck',
      config: {
        assignee_role: 'attorney',
        reason: 'Review charge extraction, priors analysis, and sentencing exposure',
        sla_hours: 24,
      },
      status: 'idle',
    },
  },

  // Check if analysis approved
  {
    id: 'ca-analysis-approved',
    type: 'workflowNode',
    position: { x: 1450, y: 300 },
    data: {
      label: 'Analysis OK?',
      componentId: 'flow.Condition',
      description: 'Route based on attorney approval of AI analysis',
      kind: 'condition',
      color: 'yellow',
      icon: 'GitBranch',
      config: {
        condition: 'decision === "approved"',
      },
      status: 'idle',
    },
  },

  // ============ DEFENSE STRATEGY PHASE ============

  // Generate defense strategy memo
  {
    id: 'ca-defense-strategy',
    type: 'workflowNode',
    position: { x: 1650, y: 200 },
    data: {
      label: 'Defense Strategy',
      componentId: 'legal.AssembleMemo',
      description: 'AI generates defense strategy memo with recommended motions',
      kind: 'node',
      color: 'purple',
      icon: 'FileText',
      config: {
        memo_type: 'defense_strategy',
        include_motions: true,
        include_plea_options: true,
      },
      status: 'idle',
    },
  },

  // Generate motion recommendations
  {
    id: 'ca-motion-recs',
    type: 'workflowNode',
    position: { x: 1650, y: 400 },
    data: {
      label: 'Motion Checklist',
      componentId: 'legal.MissingInfoChecklist',
      description: 'Generates checklist of recommended motions (Pitchess, 995, 1538.5, etc.)',
      kind: 'node',
      color: 'blue',
      icon: 'ClipboardList',
      config: {
        motion_types: ['pitchess', 'pc_995', 'pc_1538_5', 'romero', 'marsden'],
      },
      status: 'idle',
    },
  },

  // Supervisor review for serious cases
  {
    id: 'ca-supervisor-review',
    type: 'workflowNode',
    position: { x: 1850, y: 200 },
    data: {
      label: 'Supervisor Review',
      componentId: 'gate.HumanApproval',
      description: 'Senior attorney reviews strategy for strike/serious felony cases',
      kind: 'gate',
      color: 'orange',
      icon: 'Eye',
      config: {
        assignee_role: 'supervisor',
        reason: 'Review defense strategy for serious felony case',
        required_for: ['strike_priors', 'life_sentence', 'capital'],
      },
      status: 'idle',
    },
  },

  // ============ CLIENT COMMUNICATION ============

  // Generate client letter
  {
    id: 'ca-client-letter',
    type: 'workflowNode',
    position: { x: 2050, y: 300 },
    data: {
      label: 'Client Letter',
      componentId: 'legal.ClientEmailDraft',
      description: 'AI drafts client communication explaining charges and options',
      kind: 'node',
      color: 'purple',
      icon: 'Mail',
      config: {
        letter_type: 'case_assessment',
        reading_level: 'plain_english',
        include_next_steps: true,
      },
      status: 'idle',
    },
  },

  // Attorney edits client letter
  {
    id: 'ca-edit-letter',
    type: 'workflowNode',
    position: { x: 2250, y: 300 },
    data: {
      label: 'Edit Letter',
      componentId: 'gate.EditGate',
      description: 'Attorney reviews and personalizes client communication',
      kind: 'gate',
      color: 'orange',
      icon: 'PenLine',
      config: {
        content_type: 'client_letter',
      },
      status: 'idle',
    },
  },

  // Send client notification
  {
    id: 'ca-notify-client',
    type: 'workflowNode',
    position: { x: 2450, y: 300 },
    data: {
      label: 'Notify Client',
      componentId: 'connector.Notification',
      description: 'Send case assessment to client via secure portal',
      kind: 'connector',
      color: 'cyan',
      icon: 'Bell',
      config: {
        notification_type: 'case_update',
        secure_portal: true,
      },
      status: 'idle',
    },
  },

  // ============ CALENDAR & DEADLINES ============

  // Create calendar tasks
  {
    id: 'ca-create-tasks',
    type: 'workflowNode',
    position: { x: 2050, y: 500 },
    data: {
      label: 'Create Tasks',
      componentId: 'gate.TaskAssignment',
      description: 'Creates tasks for motion deadlines, court dates',
      kind: 'gate',
      color: 'orange',
      icon: 'ListTodo',
      config: {
        task_types: ['motion_deadline', 'court_appearance', 'discovery_review'],
      },
      status: 'idle',
    },
  },

  // Log to audit trail
  {
    id: 'ca-audit-log',
    type: 'workflowNode',
    position: { x: 2250, y: 500 },
    data: {
      label: 'Audit Log',
      componentId: 'util.Logger',
      description: 'Records case assessment to compliance audit trail',
      kind: 'node',
      color: 'gray',
      icon: 'ScrollText',
      config: {
        log_level: 'info',
        compliance_log: true,
      },
      status: 'idle',
    },
  },

  // ============ ERROR HANDLING ============

  // AI Error handler
  {
    id: 'ca-ai-error',
    type: 'workflowNode',
    position: { x: 850, y: 550 },
    data: {
      label: 'AI Error Log',
      componentId: 'util.Logger',
      description: 'Logs AI processing failures for review',
      kind: 'node',
      color: 'gray',
      icon: 'ScrollText',
      config: {
        log_level: 'error',
        alert_supervisor: true,
      },
      status: 'idle',
    },
  },

  // Manual review required
  {
    id: 'ca-manual-review',
    type: 'workflowNode',
    position: { x: 1050, y: 550 },
    data: {
      label: 'Manual Review',
      componentId: 'gate.TaskAssignment',
      description: 'Creates task for manual case review when AI fails',
      kind: 'gate',
      color: 'orange',
      icon: 'UserCheck',
      config: {
        priority: 'high',
        reason: 'AI analysis failed - manual review required',
      },
      status: 'idle',
    },
  },

  // Needs more info
  {
    id: 'ca-needs-info',
    type: 'workflowNode',
    position: { x: 1450, y: 500 },
    data: {
      label: 'Request Info',
      componentId: 'gate.TaskAssignment',
      description: 'Attorney requests additional documents or clarification',
      kind: 'gate',
      color: 'orange',
      icon: 'HelpCircle',
      config: {
        task_type: 'document_request',
      },
      status: 'idle',
    },
  },

  // ============ ENDPOINTS ============

  // Success - ready for next phase
  {
    id: 'ca-end-ready',
    type: 'workflowNode',
    position: { x: 2650, y: 300 },
    data: {
      label: 'Assessment Complete',
      componentId: 'end.Success',
      description: 'Case assessment complete, ready for pre-trial phase',
      kind: 'end',
      color: 'emerald',
      icon: 'CheckCircle',
      status: 'idle',
    },
  },

  // Waiting for documents
  {
    id: 'ca-end-waiting',
    type: 'workflowNode',
    position: { x: 1650, y: 550 },
    data: {
      label: 'Awaiting Docs',
      componentId: 'end.Waiting',
      description: 'Workflow paused pending additional documents',
      kind: 'end',
      color: 'amber',
      icon: 'Pause',
      config: {
        wait_for: 'additional_documents',
        timeout_days: 14,
      },
      status: 'idle',
    },
  },

  // AI failure endpoint
  {
    id: 'ca-end-error',
    type: 'workflowNode',
    position: { x: 1250, y: 550 },
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
]

// Edges for California Criminal Workflow
export const californiaWorkflowEdges: Edge[] = [
  // ============ INTAKE FLOW ============
  {
    id: 'ca-e-intake-upload',
    source: 'ca-trigger-intake',
    target: 'ca-upload-docs',
    sourceHandle: 'output',
    animated: true,
    style: { stroke: '#000000', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#000000' },
  },
  {
    id: 'ca-e-upload-extract',
    source: 'ca-upload-docs',
    target: 'ca-extract-charges',
    sourceHandle: 'output',
    animated: true,
    style: { stroke: '#000000', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#000000' },
  },

  // ============ PARALLEL ANALYSIS PATHS ============
  // Extract charges success → Analyze priors
  {
    id: 'ca-e-extract-priors',
    source: 'ca-extract-charges',
    target: 'ca-analyze-priors',
    sourceHandle: 'success',
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
  // Extract charges success → Sentencing calc
  {
    id: 'ca-e-extract-sentencing',
    source: 'ca-extract-charges',
    target: 'ca-sentencing-calc',
    sourceHandle: 'success',
    style: { stroke: '#22c55e', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#22c55e' },
  },
  // Extract charges failure → AI error
  {
    id: 'ca-e-extract-failure',
    source: 'ca-extract-charges',
    target: 'ca-ai-error',
    sourceHandle: 'failure',
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

  // Analyze priors → Strikes analysis
  {
    id: 'ca-e-priors-strikes',
    source: 'ca-analyze-priors',
    target: 'ca-strikes-analysis',
    sourceHandle: 'success',
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
  // Analyze priors failure → AI error
  {
    id: 'ca-e-priors-failure',
    source: 'ca-analyze-priors',
    target: 'ca-ai-error',
    sourceHandle: 'failure',
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

  // Sentencing calc → Constitutional issues
  {
    id: 'ca-e-sentencing-constitutional',
    source: 'ca-sentencing-calc',
    target: 'ca-constitutional-issues',
    sourceHandle: 'success',
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

  // Strikes analysis → Prop 47
  {
    id: 'ca-e-strikes-prop47',
    source: 'ca-strikes-analysis',
    target: 'ca-prop47-analysis',
    sourceHandle: 'success',
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

  // Constitutional issues → Prop 47 (merge point)
  {
    id: 'ca-e-constitutional-prop47',
    source: 'ca-constitutional-issues',
    target: 'ca-prop47-analysis',
    sourceHandle: 'success',
    style: { stroke: '#22c55e', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#22c55e' },
  },

  // Prop 47 → Attorney review
  {
    id: 'ca-e-prop47-review',
    source: 'ca-prop47-analysis',
    target: 'ca-attorney-review',
    sourceHandle: 'success',
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

  // ============ ATTORNEY REVIEW FLOW ============
  // Attorney review → Condition check
  {
    id: 'ca-e-review-condition',
    source: 'ca-attorney-review',
    target: 'ca-analysis-approved',
    sourceHandle: 'approved',
    style: { stroke: '#000000', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#000000' },
  },

  // Approved → Defense strategy
  {
    id: 'ca-e-approved-strategy',
    source: 'ca-analysis-approved',
    target: 'ca-defense-strategy',
    sourceHandle: 'true',
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

  // Approved → Motion recommendations (parallel)
  {
    id: 'ca-e-approved-motions',
    source: 'ca-analysis-approved',
    target: 'ca-motion-recs',
    sourceHandle: 'true',
    style: { stroke: '#22c55e', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#22c55e' },
  },

  // Rejected → Needs more info
  {
    id: 'ca-e-rejected-info',
    source: 'ca-analysis-approved',
    target: 'ca-needs-info',
    sourceHandle: 'false',
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

  // Needs info → Waiting
  {
    id: 'ca-e-info-waiting',
    source: 'ca-needs-info',
    target: 'ca-end-waiting',
    sourceHandle: 'completed',
    style: { stroke: '#000000', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#000000' },
  },

  // ============ DEFENSE STRATEGY FLOW ============
  // Defense strategy → Supervisor review
  {
    id: 'ca-e-strategy-supervisor',
    source: 'ca-defense-strategy',
    target: 'ca-supervisor-review',
    sourceHandle: 'success',
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

  // Supervisor review → Client letter
  {
    id: 'ca-e-supervisor-letter',
    source: 'ca-supervisor-review',
    target: 'ca-client-letter',
    sourceHandle: 'approved',
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

  // Motion recs → Create tasks
  {
    id: 'ca-e-motions-tasks',
    source: 'ca-motion-recs',
    target: 'ca-create-tasks',
    sourceHandle: 'success',
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

  // ============ CLIENT COMMUNICATION FLOW ============
  // Client letter → Edit letter
  {
    id: 'ca-e-letter-edit',
    source: 'ca-client-letter',
    target: 'ca-edit-letter',
    sourceHandle: 'success',
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

  // Edit letter → Notify client
  {
    id: 'ca-e-edit-notify',
    source: 'ca-edit-letter',
    target: 'ca-notify-client',
    sourceHandle: 'finalized',
    style: { stroke: '#000000', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#000000' },
  },

  // Notify client → End success
  {
    id: 'ca-e-notify-end',
    source: 'ca-notify-client',
    target: 'ca-end-ready',
    sourceHandle: 'output',
    style: { stroke: '#000000', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#000000' },
  },

  // ============ TASK & AUDIT FLOW ============
  // Create tasks → Audit log
  {
    id: 'ca-e-tasks-audit',
    source: 'ca-create-tasks',
    target: 'ca-audit-log',
    sourceHandle: 'completed',
    style: { stroke: '#000000', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#000000' },
  },

  // Audit log → End success (merge)
  {
    id: 'ca-e-audit-end',
    source: 'ca-audit-log',
    target: 'ca-end-ready',
    sourceHandle: 'output',
    style: { stroke: '#000000', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#000000' },
  },

  // ============ ERROR HANDLING FLOW ============
  // AI error → Manual review
  {
    id: 'ca-e-error-manual',
    source: 'ca-ai-error',
    target: 'ca-manual-review',
    sourceHandle: 'output',
    style: { stroke: '#ef4444', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#ef4444' },
  },

  // Manual review → End error (if unrecoverable)
  {
    id: 'ca-e-manual-error',
    source: 'ca-manual-review',
    target: 'ca-end-error',
    sourceHandle: 'completed',
    style: { stroke: '#ef4444', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#ef4444' },
  },
]

// Workflow metadata
export const californiaWorkflowMetadata = {
  id: 'ca-criminal-defense-intake',
  name: 'California Criminal Defense Intake',
  description: 'Criminal defense case intake and assessment workflow for California jurisdiction. Includes charge extraction, prior record analysis, Three Strikes evaluation, and defense strategy generation.',
  version: '1.0.0',
  jurisdiction: 'CA',
  caseType: 'criminal_defense',
  author: 'JurisAI',
  tags: ['criminal', 'defense', 'california', 'intake', 'assessment'],
  legalReferences: [
    'PC 667 - Three Strikes',
    'PC 1170.12 - Three Strikes',
    'PC 1170.18 - Prop 47',
    'PC 17(b) - Wobbler reduction',
    'PC 1203.4 - Expungement',
    'PC 995 - Motion to dismiss',
    'PC 1538.5 - Suppression motion',
  ],
}
