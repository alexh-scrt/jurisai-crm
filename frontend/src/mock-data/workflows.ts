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
    name: 'Legal Case Assessment',
    description: 'Complete workflow for assessing legal cases with AI-powered analysis',
    status: 'deployed',
    version: '1.2.0',
    lastModified: '2024-01-15T10:30:00Z',
    createdAt: '2024-01-01T09:00:00Z',
    nodeCount: 12,
    deployedInstances: 3,
  },
  {
    id: 'ca-criminal-defense-intake',
    name: 'California Criminal Defense Intake',
    description: 'Criminal defense case intake and assessment for California jurisdiction. Includes charge extraction, Three Strikes analysis, and defense strategy.',
    status: 'deployed',
    version: '1.0.0',
    lastModified: '2024-01-16T14:00:00Z',
    createdAt: '2024-01-16T10:00:00Z',
    nodeCount: 24,
    deployedInstances: 2,
  },
  {
    id: 'wf-2',
    name: 'Document Intake Pipeline',
    description: 'Automated document classification and extraction workflow',
    status: 'deployed',
    version: '2.0.1',
    lastModified: '2024-01-14T15:45:00Z',
    createdAt: '2023-12-15T11:00:00Z',
    nodeCount: 8,
    deployedInstances: 5,
  },
  {
    id: 'wf-3',
    name: 'Client Communication Flow',
    description: 'Draft and approval workflow for client emails and letters',
    status: 'draft',
    version: '0.3.0',
    lastModified: '2024-01-16T09:15:00Z',
    createdAt: '2024-01-10T14:00:00Z',
    nodeCount: 6,
  },
  {
    id: 'wf-4',
    name: 'Research & Citation Builder',
    description: 'AI-assisted legal research with citation management',
    status: 'draft',
    version: '0.1.0',
    lastModified: '2024-01-12T16:20:00Z',
    createdAt: '2024-01-12T10:00:00Z',
    nodeCount: 4,
  },
  {
    id: 'wf-5',
    name: 'Legacy Intake Form',
    description: 'Old intake form workflow (replaced by v2)',
    status: 'archived',
    version: '1.0.0',
    lastModified: '2023-11-20T12:00:00Z',
    createdAt: '2023-06-01T09:00:00Z',
    nodeCount: 5,
  },
]
