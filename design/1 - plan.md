
# JurisAI POC → MVP Project Plan

Goal: Deliver an AI-native legal CRM that demonstrates the platform thesis, the Legal Component Pack v1, and a compelling “wow moment,” while laying foundations for a universal CRM platform.

⸻

Phase 0 — Alignment & Lock-in (1 week)

Purpose: Prevent scope drift and architectural rework.

Objectives
	•	Lock the POC boundaries
	•	Align product, tech, and demo expectations
	•	Freeze v1 assumptions

Deliverables
	•	Finalized POC scope
	•	Selected jurisdiction + practice area (single, narrow)
	•	Final “wow moment” demo script
	•	Legal Component Pack v1 definition (approved)
	•	Architecture & data flow diagram

Acceptance criteria
	•	Everyone can describe the demo flow in <2 minutes
	•	No unresolved “we’ll decide later” items for core architecture

⸻

Phase 1 — Platform Foundations (Weeks 1–2)

Purpose: Build the rails before adding intelligence.

Objectives
	•	Establish core infrastructure
	•	Enable isolation, auditability, and extensibility

Deliverables
	•	Repo + CI/CD setup
	•	Auth (login, roles, permissions)
	•	PostgreSQL schema (core entities)
	•	Object storage for documents
	•	Vector store (Qdrant) connected
	•	Audit ledger (append-only, hash-chained)
	•	AI provider abstraction (no features yet)
	•	Dockerized single-tenant runtime (POC-grade)

Acceptance criteria
	•	A tenant can log in
	•	A case can be created
	•	A document can be uploaded and stored
	•	Ledger entries are written for all mutations

⸻

Phase 2 — Case Workspace Skeleton (Weeks 3–4)

Purpose: Make it feel like a CRM before making it smart.

Objectives
	•	Deliver a usable case workspace
	•	Establish UI patterns and server-driven rendering

Deliverables
	•	React + TypeScript UI shell
	•	Server-driven UI renderer (v1 schema)
	•	Case list + selection
	•	Case Workspace layout:
	•	Overview panel
	•	Document list + PDF viewer
	•	Timeline / notes
	•	Tasks / requirements panel
	•	Basic permissions enforced
	•	Audit viewer (read-only)

Acceptance criteria
	•	Consultant can navigate end-to-end:
login → case → documents → tasks
	•	UI is responsive and stable
	•	All actions emit ledger events

⸻

Phase 3 — AI Rails + Case Memory (Weeks 5–6)

Purpose: Turn the CRM into an AI-native system.

Objectives
	•	Enable case-scoped AI understanding
	•	Introduce AI copilot safely

Deliverables
	•	Document ingestion pipeline:
	•	chunking
	•	embeddings
	•	metadata tagging
	•	Case-scoped vector store
	•	Retrieval service with citations
	•	AI Copilot (chat UI) scoped to case
	•	“Read-only” AI interactions (no state mutation yet)
	•	AI usage tracking (tokens, cost, component)

Acceptance criteria
	•	Consultant can ask:
“What is this case about?”
“Summarize the uploaded documents.”
	•	Answers include citations
	•	AI usage is logged and visible

⸻

Phase 4 — Legal Intelligence (“Wow Pipeline”) (Weeks 7–9)

Purpose: Deliver the differentiating moment.

Objectives
	•	Demonstrate AI doing real legal work
	•	Show structured outputs + human oversight

Deliverables

Assess Case Workflow
	•	Fact extraction + timeline
	•	Issue spotting (AI-proposed, human-confirmable)
	•	Missing information checklist
	•	Strength / completeness assessment (rubric-based)
	•	Relevant case law search (basic)
	•	Authority summaries with relevance

Outputs
	•	Case assessment memo (AI-generated, cited)
	•	Structured artifacts persisted to case

Controls
	•	Human approval gate before persistence
	•	Ledger entries for AI outputs and approvals

Acceptance criteria
	•	Upload messy docs → click “Assess Case”
	•	Structured, explainable outputs appear
	•	User must approve before state changes
	•	Clear “wow” narrative for demo

⸻

Phase 5 — Drafting & Communications (Weeks 10–11)

Purpose: Show end-to-end value, not just analysis.

Objectives
	•	Close the loop from understanding → action

Deliverables
	•	Template-based document generator
	•	AI-assisted drafting (memo + letter/email)
	•	Rich text editor (redlining)
	•	Client email composer (AI-assisted)
	•	Review/approve/send flow
	•	All comms logged to case + ledger

Acceptance criteria
	•	One-click draft generation from assessment
	•	User can edit, approve, and “send”
	•	Full provenance visible (how draft was produced)

⸻

Phase 6 — Workflow Studio v1 + Deployment (Weeks 12–13)

Purpose: Prove this is a platform, not a one-off app.

Objectives
	•	Enable workflow-defined CRMs
	•	Deploy a workflow as a standalone instance

Deliverables
	•	Visual workflow editor (DAG, minimal)
	•	Component library (Legal Pack v1)
	•	AI toggles per component
	•	Save/version workflow
	•	Deploy → create isolated runtime
	•	Monitor workflow execution + AI usage

Acceptance criteria
	•	A workflow can be edited and redeployed
	•	Deployed workflow behaves as a CRM app
	•	Components render their own UI

⸻

Phase 7 — Polish, Hardening & Demo Readiness (Weeks 14–15)

Purpose: Make it investor- and customer-ready.

Objectives
	•	Remove friction
	•	Improve clarity and trust signals

Deliverables
	•	Guided UX (“next steps,” tooltips)
	•	Sample dataset for demo
	•	Performance tuning
	•	Error handling + fallbacks
	•	Final demo script and walkthrough
	•	Metrics dashboard (AI usage, outcomes)

Acceptance criteria
	•	Demo runs smoothly, repeatedly
	•	Non-expert can follow the flow
	•	System communicates confidence, not magic

⸻

MVP Definition (Post-POC)

You are at MVP when:
	•	Legal Component Pack v1 is complete
	•	One practice area works end-to-end
	•	Workflow Studio supports customization
	•	Audit ledger is non-negotiable and visible
	•	AI is governed, not experimental
	•	Platform is demonstrably extensible to other domains

⸻

Risk Control (explicit)

Risk	Mitigation
Scope creep	Hard POC boundaries + locked demo
AI unreliability	Structured outputs + approvals
UX complexity	Guided flows, not feature density
Overengineering	Single tenant, single domain
Trust concerns	Ledger + citations everywhere


⸻

Final note

This plan is aggressive but realistic if discipline is maintained.
The biggest risk is not technology—it is trying to prove too much at once.

Legal-first, wow-driven, platform-backed is the right sequence.

