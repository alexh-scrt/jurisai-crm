Codex high-level implementation plan (phase-by-phase to MVP)

Guiding constraints (keeps design flexible)
	•	Modular monolith with explicit internal interfaces (split later).
	•	Workflow DSL + Component Manifest + UI Schema are stable contracts.
	•	Provider abstractions for AI, vector store, deployment target.
	•	Deterministic-by-default; AI is explicit, metered, and audited.

⸻

Phase 0 — Codex Foundations and Contracts (Week 1)

Objective: Lock platform contracts early to avoid rewrites.

Deliverables
	•	Repo + CI/CD + dev environment (Docker, lint, typecheck, tests)
	•	Workflow DSL v1 (JSON/YAML): graph, nodes, edges, conditions, routes
	•	Component Manifest v1: inputs/outputs, config schema, permissions, AI toggles, events
	•	UI Schema v1: layouts, widgets, actions, guidance blocks
	•	Ledger Event Taxonomy v1: required event fields + hash-chaining approach
	•	Reference “Hello Workflow” (2–3 components) running end-to-end

Exit criteria
	•	A workflow definition can be loaded, validated, and rendered as a minimal UI page.

⸻

Phase 1 — Core Platform Rails (Weeks 2–3)

Objective: Get the runtime backbone operational.

Deliverables
	•	Auth/RBAC (roles, permissions, session)
	•	Core services (internal modules):
	•	workflow_runtime
	•	ui_schema_runtime
	•	ledger_service
	•	metering_service
	•	Postgres schema: tenant/user, workflow definitions, workflow instances, audit ledger
	•	Event dispatcher: UI events → workflow runtime → state updates
	•	Append-only ledger table + hash chaining
	•	Deployment “local target” (docker-compose single-tenant stack)

Exit criteria
	•	Any state mutation produces a ledger entry.
	•	Workflow instance can progress node-to-node via UI events.

⸻

Phase 2 — CRM Workspace Skeleton (Weeks 4–5)

Objective: Make it feel like a CRM app with rich widgets.

Deliverables
	•	React + TypeScript UI shell
	•	Server-driven UI renderer:
	•	forms, tables, cards, timelines, action bars, queues
	•	Case list + case selection (assigned cases)
	•	Case workspace layout:
	•	Overview, Tasks/Requirements, Activity Timeline
	•	Documents list + viewer (PDF.js)
	•	Basic “guided UX” blocks (tips/next steps) via UI Schema

Exit criteria
	•	Consultant can login → select case → view workspace → interact with tasks/docs.

⸻

Phase 3 — Document Pipeline + Case Memory (Weeks 6–7)

Objective: Enable case-scoped knowledge and retrieval.

Deliverables
	•	Document storage (object store) + versioning metadata
	•	Ingestion pipeline:
	•	text extraction (PDF/DOCX basic)
	•	chunking + embeddings
	•	write to vector store (Qdrant) with metadata filters
	•	Retrieval service:
	•	hybrid retrieve (vector + keyword later if needed)
	•	citation pack format (docId, chunkId, offsets)
	•	“Ask about this case” Copilot chat (read-only)

Exit criteria
	•	Upload docs → ask questions → get grounded answers with citations.

⸻

Phase 4 — Legal Pack v1: “Wow Pipeline” (Weeks 8–10)

Objective: Deliver the flagship demo flow.

Deliverables
	•	Legal Component Pack v1 (initial set):
	•	DocumentClassify (AI toggle)
	•	SummarizeDocument (AI toggle)
	•	ExtractFactsTimeline (AI toggle; structured output)
	•	SpotIssues (AI toggle; structured output)
	•	MissingInfoChecklist (AI toggle + rules)
	•	StrengthCompletenessAssessment (rubric output)
	•	ResearchQueryBuilder (AI toggle)
	•	AuthoritySearch (stub or minimal integration)
	•	AuthoritySummarizer (AI toggle)
	•	AssembleAssessmentMemo (template + AI assist)
	•	HumanApprovalGate
	•	Case artifacts UI:
	•	Timeline view (facts/events)
	•	Issues panel
	•	Missing items checklist
	•	Assessment panel with citations

Exit criteria
	•	Upload bundle → click “Assess Case” → produces structured artifacts + memo draft + citations, requiring approval to persist.

⸻

Phase 5 — Drafting + Client Communications (Weeks 11–12)

Objective: Close the loop: understanding → action.

Deliverables
	•	Template engine (merge fields from case model)
	•	Rich text editor (TipTap) for:
	•	memo drafting
	•	redlines / tracked changes (POC-grade)
	•	Email composer component:
	•	AI-assisted draft
	•	review/approve/send (send can be stubbed to “outbox”)
	•	Communications log → case timeline + ledger
	•	AI metering visible per action/component

Exit criteria
	•	One-click generate client email requesting missing documents; review/approve; logged and auditable.

⸻

Phase 6 — Workflow Studio v1 + Deploy to Isolated Runtime (Weeks 13–14)

Objective: Prove “workflow becomes the CRM app.”

Deliverables
	•	Workflow Studio v1:
	•	DAG editor (drag/drop nodes, connectors)
	•	config editor (component configSchema)
	•	validation (type compatibility)
	•	versioning (basic)
	•	Deploy manager:
	•	compile workflow → deployment bundle
	•	deploy to local single-tenant runtime
	•	Runtime monitoring:
	•	workflow execution trace
	•	AI usage dashboard
	•	failure view

Exit criteria
	•	Build/modify workflow in studio → deploy → open in browser as a running CRM instance.

⸻

Phase 7 — Demo Hardening and MVP Readiness (Weeks 15–16)

Objective: Make it reliable, fast, and presentable.

Deliverables
	•	Demo dataset + scripted flows
	•	Performance pass (doc viewing, retrieval latency, caching)
	•	Error handling + safe fallbacks
	•	Security pass (permission checks everywhere, secrets hygiene)
	•	UX polish:
	•	guided next steps
	•	contextual explanations
	•	consistent design system
	•	“Audit & Provenance” viewer (per artifact: sources, approvals, AI calls)

Exit criteria
	•	Demo runs repeatedly with consistent outputs and a clean narrative.

⸻

MVP gate criteria (what “done” means)
	•	Legal Pack v1 supports a complete case workflow (intake not required if demo starts at assigned case).
	•	AI outputs are citation-grounded and approval-gated.
	•	Ledger is tamper-evident and visible.
	•	Workflow Studio can deploy a workflow into an isolated runtime.
	•	UI is rich, guided, and responsive.

⸻

Workstreams (run in parallel)
	•	Contracts & Runtime: DSL/manifest/schema, workflow engine, ledger
	•	UI/UX: renderer, workspace, widgets, doc viewer/editor
	•	Knowledge & AI: ingestion, retrieval, citations, structured outputs
	•	Legal Pack: components, rubrics, templates, demo workflow
	•	Deployment: bundling, isolated runtime, monitoring

⸻

If you want the next artifact, the most useful is a Codex MVP backlog: epics → stories with acceptance tests for the “wow” demo (especially the structured outputs + citations + approval gates + ledger proofs).