# AI Rails Ecosystem — High-Level Design

## Purpose
AI Rails is an enterprise execution ecosystem for **AI-driven automation you can trust**: workflows that are **verifiable, auditable, policy-governed**, and deployed inside **confidential computing** environments.

This document defines the high-level architecture and system boundaries for:
- **AI Rails Workflow Studio** (design/build)
- **AI Rails Dashboard** (operate/observe/govern)
- **Workflow Runtime** (execute safely)
- **Component Packs** (domain capabilities)
- **Confidential VM Infrastructure** (confidential-by-default execution)
- **Proof / Audit / Compliance** (trust guarantees)

---

## Product Definition
### What it is
A platform to **design, deploy, and operate AI workflows** where every action:
- is executed within a **confidential VM**
- produces a **proof-of-work ledger trail**
- is subject to **policy and approval gates**
- is observable through an **enterprise dashboard**

### What it is not
- Not a generic “agent framework”
- Not a simple workflow automation tool
- Not a CRM or ticketing system replacement

---

## Core Personas
- **Workflow Designer / Automation Engineer**: builds workflows using Studio and component packs
- **Business Owner / Ops Lead**: owns outcomes, configures policies and approvals
- **Reviewer / Approver**: handles human gates (refund approvals, content approvals, risky actions)
- **Security / Compliance**: audits workflows, reviews proofs, enforces governance
- **IT / Platform Admin**: manages integrations, access, tenancy, and deployment policies

---

## System Overview

```mermaid
flowchart TB
  subgraph Build[Build Plane]
    Studio[AI Rails Workflow Studio]
    Packs[Domain Component Packs]
    Registry[Workflow Registry\n(versioned artifacts)]
  end

  subgraph Operate[Operate Plane]
    Dash[AI Rails Dashboard]
    Policy[Policy & Approval Config]
    AuditUI[Audit / Proof Explorer]
    Alerts[Alerts / SLO Monitoring]
  end

  subgraph Runtime[Execution Plane]
    Orchestrator[Workflow Orchestrator]
    subgraph CC[Confidential Computing Layer]
      CVM[Per-Workflow Confidential VM\nEncrypted Disk + Memory]
      GPU[NVIDIA Confidential GPU (H100)\n(when needed)]
      Ledger[Proof-of-Work Ledger\n(append-only)]
    end
    Connectors[Connector Runtime\n(Slack/Gmail/X/etc.)]
    KeyMgmt[Key Management / Attestation]
  end

  Studio --> Packs
  Studio --> Registry
  Dash --> Policy
  Dash --> AuditUI
  Dash --> Alerts

  Registry --> Orchestrator
  Orchestrator --> CVM
  CVM --> Ledger
  CVM --> Connectors
  CVM --> GPU
  CVM --> KeyMgmt
  AuditUI --> Ledger
  Policy --> Orchestrator


⸻

Major Subsystems

1) AI Rails Workflow Studio (Build Plane)

Goal: AI-assisted creation of trusted workflows.

Key capabilities:
	•	Visual workflow designer (graph-based)
	•	AI-assisted authoring: propose steps, checks, gates, and error handling
	•	Component palette (domain packs + core packs)
	•	Workflow simulation / dry runs (with synthetic data)
	•	Versioning: immutable workflow artifacts + change history
	•	Test harness: deterministic replay + integration mocks
	•	Policy hints: propose approval gates for risky actions

Outputs:
	•	Workflow Artifact (graph + config + policies + connectors)
	•	Deployment Manifest (runtime requirements: CPU/GPU, secrets, domains, cost limits)

High-level Studio architecture:

flowchart LR
  UI[Studio UI\n(Graph Editor)] --> Compiler[Workflow Compiler]
  Compiler --> Artifact[Versioned Workflow Artifact]
  Compiler --> Lints[Safety Lints\n(policy/risk)]
  Compiler --> Test[Sim & Test Harness]
  Packs[Component Packs] --> UI
  Packs --> Compiler
  Artifact --> Registry[Workflow Registry]


⸻

2) AI Rails Dashboard (Operate Plane)

Goal: Operate workflows in production with transparency and governance.

Key capabilities:
	•	List workflows, versions, environments, and owners
	•	Live status: throughput, error rate, queue depth, cost, latency
	•	Human gates: review / approve / deny / request info
	•	Proof explorer: action timeline, evidence, receipts, and replay
	•	Compliance views: policy adherence, exceptions, and audit exports
	•	Alerts: SLO breaches, anomalous behavior, integration failures

Dashboard views (conceptual):

flowchart TB
  Dash[Dashboard] --> Ops[Operations\nmetrics & health]
  Dash --> Gates[Human Interaction Gates\nreview/approve]
  Dash --> Proof[Proof & Audit\nledger explorer]
  Dash --> PolicyUI[Policy Management\nlimits/escalations]
  Dash --> Access[RBAC & Access Logs]


⸻

3) Workflow Runtime (Execution Plane)

Goal: Execute workflows deterministically and safely, producing verifiable outcomes.

Runtime responsibilities:
	•	Load workflow artifact and validate integrity
	•	Enforce policies (limits, gates, approvals)
	•	Execute steps (AI + deterministic tools)
	•	Guarantee idempotency (no duplicate side effects)
	•	Produce proof-of-work entries for every action
	•	Support retries, compensation steps, and rollback strategies

Runtime execution model:

sequenceDiagram
  participant E as Event/Trigger
  participant O as Orchestrator
  participant V as Confidential VM
  participant P as Policy Engine
  participant H as Human Gate
  participant S as External Systems
  participant L as Proof Ledger

  E->>O: Trigger workflow(instance)
  O->>P: Evaluate policy (risk/limits)
  P-->>O: Allow / Require Gate
  alt Gate Required
    O->>H: Request approval (Dashboard)
    H-->>O: Approve / Deny / Ask for Info
  end
  O->>V: Execute next steps
  V->>S: Perform action (API call)
  S-->>V: Result/evidence
  V->>L: Append proof entry (action + evidence hash)
  V-->>O: Step outcome
  O-->>E: Completion / Next state


⸻

Trust Layer: Verify / Prove / Audit / Compliance

Proof-of-Work Ledger

Each workflow has an append-only ledger that records:
	•	Workflow version + instance ID
	•	Step execution details (what, when, who/what authorized)
	•	Tool calls and outcomes (with evidence references)
	•	Approval events (human gates)
	•	Data lineage pointers (hashes, redactions)
	•	Integrity chain (entry hashes to prevent tampering)

Ledger entry types:
	•	TRIGGER_RECEIVED
	•	POLICY_EVALUATED
	•	HUMAN_GATE_REQUESTED
	•	HUMAN_GATE_DECISIONED
	•	TOOL_ACTION_EXECUTED
	•	EVIDENCE_CAPTURED
	•	ROLLBACK_APPLIED
	•	WORKFLOW_COMPLETED
	•	WORKFLOW_FAILED

Verification

Verification combines:
	•	Deterministic checks (schema validation, invariants, thresholds)
	•	Evidence collection (API responses, receipts, message IDs)
	•	Cryptographic linking (hash chains)
	•	Optional attestation outputs from confidential computing

Compliance & Governance
	•	RBAC: least privilege per user/workflow
	•	Segregation of duties: author vs approver vs auditor
	•	Policy templates: e.g., “money movement”, “external publishing”
	•	Audit exports: trace reports per instance/time range
	•	Data handling rules: retention, redaction, PII constraints

⸻

Confidential Computing Design

Goal

Ensure workflows execute in an environment that provides:
	•	Confidentiality of data-in-use (memory)
	•	Confidentiality of storage
	•	Tenant isolation (per workflow)
	•	Attestable runtime integrity

Approach
	•	Each workflow is deployed to its own Confidential VM
	•	Confidential computing: Intel TDX or AMD SEV
	•	Optional NVIDIA H100 Confidential GPU for AI inference where required
	•	Encrypted storage per workflow VM
	•	Keys released only after successful attestation (policy-controlled)

Confidential VM lifecycle:

stateDiagram-v2
  [*] --> Provisioned
  Provisioned --> Attested: Attestation Check
  Attested --> KeysReleased: KMS Release
  KeysReleased --> Running: Start Runtime
  Running --> RotatingKeys: Periodic Rotation
  RotatingKeys --> Running
  Running --> Terminated: Scale down / Decommission
  Terminated --> [*]


⸻

Confidential VM (Per Workflow) — Reference Model

Each confidential VM includes:
	•	Workflow runtime binary + workflow artifact
	•	Component runtime sandbox
	•	Encrypted disk volumes:
	•	workflow state
	•	ledger data
	•	connector tokens (sealed)
	•	Network controls:
	•	allowlisted egress per connector
	•	optional private connectivity to customer VPC
	•	Observability sidecar (metrics only, no sensitive payloads unless permitted)

⸻

Components & Component Packs

Component Model

A component is a reusable building block with:
	•	Inputs/outputs (typed schemas)
	•	Deterministic step behavior where possible
	•	Policy annotations (risk level, data sensitivity, money movement)
	•	Evidence hooks (what to store in proofs)
	•	Retry/compensation strategy

Component categories:
	•	AI Components: classify, extract, summarize, draft, decide-with-constraints
	•	Tool Components: call external APIs, write to systems, publish content
	•	Guard Components: validate, policy-check, anomaly-detect, safety rules
	•	Human Gate Components: request approval, collect more info, escalate
	•	Proof Components: capture evidence, hash/record receipts, attestation events

Core Packs (Always Available)
	•	Policy & Gates Pack: thresholds, approvals, escalations, SoD controls
	•	Proof & Ledger Pack: receipts, evidence capture, replay anchors
	•	Data Handling Pack: PII detection/redaction, retention tags, encryption
	•	Reliability Pack: idempotency keys, retries, backoff, circuit breakers
	•	Observability Pack: metrics, traces, SLOs, anomaly flags

⸻

Popular Domain Component Packs (Initial Set)

1) Customer Operations Pack
	•	Ticket triage and routing
	•	Refund/credit/cancellation execution (with gates)
	•	Customer email drafting + verified send
	•	Evidence: ticket IDs, transaction IDs, customer confirmations

2) Email & Inbox Automation Pack (Gmail/IMAP/Exchange)
	•	Classify inbound messages
	•	Extract intent + required fields
	•	Draft response, request missing info
	•	Thread-safe reply + archive/label actions

3) Voice Pack (Phone: STT/TTS)
	•	STT transcription with confidence scoring
	•	Entity extraction and intent detection
	•	TTS response generation (scripted + AI)
	•	Escalation gates for sensitive conversations
	•	Evidence: call metadata, transcript hashes, consent flags

4) Social Media Ops Pack (X/Twitter, LinkedIn, Instagram, etc.)
	•	Post scheduling and publishing (approval gate)
	•	Mention monitoring and response drafts (gate by risk)
	•	Sentiment + brand safety checks
	•	Evidence: post IDs, timestamps, moderation decisions

5) Collaboration Pack (Slack / Teams / Telegram)
	•	Handle requests from channels
	•	Create tickets, update status, notify stakeholders
	•	Approvals in-chat (signed decisions)
	•	Evidence: message IDs, channel audit trail

6) Document Intake & Processing Pack
	•	Ingest PDFs/docs/images (structured extraction)
	•	Validate completeness; request missing docs
	•	Summaries and structured outputs to downstream systems
	•	Evidence: source doc hashes, extracted fields, validation results

7) Expense & Finance Ops Pack
	•	Receipt ingestion and categorization
	•	Policy checks (limits, allowed merchants)
	•	Approvals for exceptions
	•	Posting to accounting systems
	•	Evidence: receipt hashes, approvals, ledger trail

8) IT Ops & Access Pack
	•	Provision/deprovision access (with strict gates)
	•	Password reset routing (policy + identity checks)
	•	Asset tracking updates
	•	Evidence: system logs, access change receipts

9) Technical Issue Triage Pack
	•	Parse bug reports/log snippets
	•	Reproduce steps (where safe), categorize severity
	•	Create/route tickets, request more info
	•	Evidence: ticket creation IDs, linked artifacts

⸻

Integration Connectors (Examples)
	•	Slack, Gmail, Telegram
	•	X/Twitter (where available), social schedulers
	•	CRM/ticketing: Zendesk, Intercom, Salesforce Service Cloud
	•	Calendar/event: Google Calendar, Outlook Calendar
	•	Payments: Stripe, Adyen (for refund flows)
	•	Storage: S3-compatible, Google Drive (policy-controlled)
	•	Internal APIs via secure connectors

Connector requirements:
	•	Scoped permissions
	•	Token sealing inside confidential VM
	•	Allowlisted endpoints
	•	Evidence capture (request IDs, response IDs)

⸻

Deployment & Lifecycle

Workflow Lifecycle
	1.	Design in Studio
	2.	Compile + lint + test
	3.	Register artifact (immutable, versioned)
	4.	Deploy to per-workflow Confidential VM
	5.	Operate via Dashboard (metrics, gates, audit)
	6.	Update via new version rollout (blue/green or canary)
	7.	Decommission with retained proofs per policy

Rollout model:

flowchart LR
  V1[Workflow v1] --> Canary[Canary Deploy]
  Canary -->|Pass SLO| Prod[Production]
  Canary -->|Fail| Rollback[Rollback to v1]
  Prod --> V2[Workflow v2]


⸻

Reliability & Safety Requirements (Non-Functional)
	•	Determinism: repeatable behavior for the same inputs where applicable
	•	Idempotency: no duplicate side effects on retries
	•	Blast radius control: per-workflow VM isolation; policy rate limits
	•	Cost controls: budgets, per-workflow spend limits, GPU usage caps
	•	Latency targets: defined per workflow class (interactive vs batch)
	•	Audit readiness: 100% action coverage in proofs for high-risk domains

⸻

Business Outcomes & KPI Mapping

What customers measure, mapped to platform levers:
	•	Time-to-Resolution → automation + 24/7 execution + fewer handoffs
	•	Cost per Case / Operation → human removal from execution path
	•	Error Rate / Rework → deterministic checks + policy guards + proof
	•	Compliance & Audit Time → ledger, receipts, exportable trails
	•	Throughput / Scalability → per-workflow VM scaling and concurrency
	•	Customer Satisfaction (CSAT/NPS) → faster, consistent outcomes

⸻

First-Order Product Path (Suggested)

Phase 1 (Wedge): Customer Ops Refund/Credit Automation
	•	Studio + core pack + customer ops pack
	•	Dashboard gates + proofs
	•	Confidential VM runtime with encrypted storage + ledger

Phase 2: Email + Document Intake Expansion
	•	Gmail + document processing packs
	•	Strong proof/evidence for document lineage and decisions

Phase 3: Voice + Social Automation (High leverage, higher governance)
	•	STT/TTS + social publishing with strict policy gates

⸻

Open Design Decisions (High-Level)
	•	Ledger storage model: per-VM local + centralized replicated (read-only mirror)
	•	Attestation vendor integration approach (KMS release conditions)
	•	Evidence retention and redaction policy defaults
	•	Connector isolation model (in-VM vs sidecar) for strongest containment
	•	GPU tenancy strategy: dedicated vs pooled confidential GPU slices
