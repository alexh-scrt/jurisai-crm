import type { Node, Edge } from '@xyflow/react'

// Customer Support Chatbot Workflow
// Demonstrates: triggers, AI classification, knowledge retrieval, logic routing,
// content guardrails, chat responses, and human escalation.

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

// ============================================================
// Customer Support Chatbot – Nodes
// ============================================================
export const sampleNodes: Node<WorkflowNodeData>[] = [
  // Trigger: user sends a chat message
  {
    id: 'chat-trigger',
    type: 'workflowNode',
    position: { x: 50, y: 250 },
    data: {
      label: 'Chat Message',
      componentId: 'trigger.ChatMessage',
      description: 'Triggered when a customer sends a chat message',
      kind: 'trigger',
      color: 'emerald',
      icon: 'MessageSquare',
      status: 'completed',
    },
  },

  // AI: Classify the intent
  {
    id: 'classify-intent',
    type: 'workflowNode',
    position: { x: 280, y: 250 },
    data: {
      label: 'Classify Intent',
      componentId: 'ai.Classifier',
      description: 'AI classifies the user message into intent categories',
      kind: 'ai',
      color: 'purple',
      icon: 'Tags',
      config: {
        categories: ['simple_question', 'complex_issue', 'billing', 'escalation'],
      },
      status: 'completed',
    },
  },

  // Logic: Is this a simple question?
  {
    id: 'is-simple',
    type: 'workflowNode',
    position: { x: 510, y: 250 },
    data: {
      label: 'Simple?',
      componentId: 'logic.Condition',
      description: 'Check if the query can be answered from the knowledge base',
      kind: 'logic',
      color: 'amber',
      icon: 'GitBranch',
      config: {
        condition: 'category === "simple_question"',
      },
      status: 'running',
    },
  },

  // Knowledge: search the knowledge base (simple path)
  {
    id: 'knowledge-search',
    type: 'workflowNode',
    position: { x: 740, y: 150 },
    data: {
      label: 'Knowledge Base',
      componentId: 'knowledge.KnowledgeBase',
      description: 'Retrieve relevant articles using semantic search (RAG)',
      kind: 'knowledge',
      color: 'blue',
      icon: 'BookOpen',
      status: 'idle',
    },
  },

  // AI: Generate answer from context
  {
    id: 'llm-answer',
    type: 'workflowNode',
    position: { x: 970, y: 150 },
    data: {
      label: 'LLM',
      componentId: 'ai.LLM',
      description: 'Generate a helpful answer using retrieved context',
      kind: 'ai',
      color: 'purple',
      icon: 'Brain',
      config: {
        model: 'claude-sonnet-4-5-20250929',
        temperature: 0.3,
      },
      status: 'idle',
    },
  },

  // Trust: Content guardrail before responding
  {
    id: 'guardrail',
    type: 'workflowNode',
    position: { x: 1200, y: 150 },
    data: {
      label: 'Guardrail',
      componentId: 'trust.ContentGuardrail',
      description: 'Ensure AI response is safe, on-topic, and policy-compliant',
      kind: 'trust',
      color: 'rose',
      icon: 'Shield',
      status: 'idle',
    },
  },

  // Output: Send chat response
  {
    id: 'chat-response',
    type: 'workflowNode',
    position: { x: 1430, y: 150 },
    data: {
      label: 'Chat Response',
      componentId: 'output.ChatResponse',
      description: 'Send the answer back to the customer',
      kind: 'output',
      color: 'slate',
      icon: 'MessageCircle',
      status: 'idle',
    },
  },

  // Output: End Success (simple path)
  {
    id: 'end-success',
    type: 'workflowNode',
    position: { x: 1660, y: 150 },
    data: {
      label: 'Complete',
      componentId: 'output.EndSuccess',
      description: 'Conversation handled successfully',
      kind: 'output',
      color: 'emerald',
      icon: 'CheckCircle',
      status: 'idle',
    },
  },

  // Output: Escalate to human (complex path)
  {
    id: 'escalate',
    type: 'workflowNode',
    position: { x: 740, y: 380 },
    data: {
      label: 'Escalation',
      componentId: 'output.Escalation',
      description: 'Hand off to a human agent for complex issues',
      kind: 'output',
      color: 'slate',
      icon: 'PhoneForwarded',
      config: {
        priority: 'normal',
      },
      status: 'idle',
    },
  },

  // Output: End Success (escalation path)
  {
    id: 'end-escalated',
    type: 'workflowNode',
    position: { x: 970, y: 380 },
    data: {
      label: 'Escalated',
      componentId: 'output.EndSuccess',
      description: 'Conversation escalated to human agent',
      kind: 'output',
      color: 'emerald',
      icon: 'CheckCircle',
      status: 'idle',
    },
  },
]

// ============================================================
// Customer Support Chatbot – Edges
// ============================================================
export const sampleEdges: Edge[] = [
  // Trigger → Classifier
  {
    id: 'e-trigger-classify',
    source: 'chat-trigger',
    target: 'classify-intent',
    sourceHandle: 'output',
    animated: true,
    style: { stroke: '#000000', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#000000' },
  },

  // Classifier → Condition (output handle)
  {
    id: 'e-classify-condition',
    source: 'classify-intent',
    target: 'is-simple',
    sourceHandle: 'output',
    animated: true,
    style: { stroke: '#000000', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#000000' },
  },

  // Condition → Yes → Knowledge Base
  {
    id: 'e-simple-yes',
    source: 'is-simple',
    target: 'knowledge-search',
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

  // Condition → No → Escalation
  {
    id: 'e-simple-no',
    source: 'is-simple',
    target: 'escalate',
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

  // Knowledge Base → LLM
  {
    id: 'e-kb-llm',
    source: 'knowledge-search',
    target: 'llm-answer',
    sourceHandle: 'output',
    style: { stroke: '#000000', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#000000' },
  },

  // LLM → Guardrail
  {
    id: 'e-llm-guardrail',
    source: 'llm-answer',
    target: 'guardrail',
    sourceHandle: 'output',
    style: { stroke: '#000000', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#000000' },
  },

  // Guardrail → Chat Response
  {
    id: 'e-guardrail-response',
    source: 'guardrail',
    target: 'chat-response',
    sourceHandle: 'output',
    style: { stroke: '#000000', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#000000' },
  },

  // Chat Response → End Success
  {
    id: 'e-response-end',
    source: 'chat-response',
    target: 'end-success',
    sourceHandle: 'output',
    style: { stroke: '#000000', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#000000' },
  },

  // Escalation → End Escalated
  {
    id: 'e-escalate-end',
    source: 'escalate',
    target: 'end-escalated',
    sourceHandle: 'output',
    style: { stroke: '#000000', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed' as const, color: '#000000' },
  },
]
