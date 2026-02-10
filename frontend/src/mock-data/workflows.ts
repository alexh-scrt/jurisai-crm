export type WorkflowStatus = 'draft' | 'deployed' | 'archived'

export interface Workflow {
  id: string
  name: string
  description: string
  status: WorkflowStatus
  version: string
  lastModified: string
  createdAt: string
  nodeCount: number
  deployedInstances?: number
}

export const mockWorkflows: Workflow[] = [
  {
    id: 'wf-1',
    name: 'Customer Support Chatbot',
    description: 'AI-powered customer support agent with RAG knowledge base, intent classification, and human escalation',
    status: 'deployed',
    version: '1.2.0',
    lastModified: '2026-02-01T10:30:00Z',
    createdAt: '2026-01-15T09:00:00Z',
    nodeCount: 10,
    deployedInstances: 3,
  },
  {
    id: 'wf-2',
    name: 'Lead Qualification Agent',
    description: 'Automated lead scoring and qualification with CRM integration and Slack notifications',
    status: 'deployed',
    version: '2.0.1',
    lastModified: '2026-01-28T15:45:00Z',
    createdAt: '2025-12-15T11:00:00Z',
    nodeCount: 14,
    deployedInstances: 5,
  },
  {
    id: 'wf-3',
    name: 'Document Processing Pipeline',
    description: 'Upload, parse, embed, and index documents into a knowledge base with PII redaction',
    status: 'draft',
    version: '0.3.0',
    lastModified: '2026-02-05T09:15:00Z',
    createdAt: '2026-01-20T14:00:00Z',
    nodeCount: 8,
  },
  {
    id: 'wf-4',
    name: 'Email Auto-Responder',
    description: 'Monitor inbox, classify emails, generate AI responses with human approval gate',
    status: 'draft',
    version: '0.1.0',
    lastModified: '2026-02-03T16:20:00Z',
    createdAt: '2026-02-01T10:00:00Z',
    nodeCount: 12,
  },
  {
    id: 'wf-5',
    name: 'Internal Knowledge Q&A',
    description: 'Slack bot that answers employee questions from internal docs with attestation verification',
    status: 'deployed',
    version: '1.0.0',
    lastModified: '2026-01-25T12:00:00Z',
    createdAt: '2026-01-10T09:00:00Z',
    nodeCount: 9,
    deployedInstances: 2,
  },
]
