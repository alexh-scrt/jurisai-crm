High-level design for JurisAI (universal CRM on AI rails)

Design goals
	•	Universal core, domain packs on top (Legal Pack v1 first).
	•	Pluggable AI / storage / search / deploy targets (avoid vendor lock-in).
	•	Workflow-defined applications: a workflow compiles into a running CRM instance.
	•	Governed AI: explicit AI actions, human approval gates, full audit ledger.
	•	Server-driven UI: one web shell renders any deployed workflow.

⸻

1) System architecture at a glance

Control plane (build/operate)
	•	Workflow Studio (designer)
	•	Component Pack Registry (domain packs)
	•	Deployment Manager (compile → deploy)
	•	Observability / Audit Viewer

Data plane (run work)
	•	Runtime API Gateway (BFF)
	•	Workflow Runtime (DAG + state)
	•	UI Schema Service (server-driven views)
	•	AI Runtime (RAG + tools)
	•	Data services: Case, Documents, Tasks, Knowledge, Ledger, Metering

A deployed workflow instance runs as an isolated “tenant runtime” (confidential VM later).

⸻

2) Key primitives (keep these stable)

2.1 Workflow

A workflow is a typed graph:
	•	nodes (components), edges, conditions
	•	state model and events
	•	UI routes/pages derived from components

Important non-lock-in choice: store workflows in a neutral JSON/YAML DSL with versioning; do not bind them to a specific engine implementation.

2.2 Component

A component is a dual artifact:

Backend contract
	•	inputs/outputs (typed)
	•	configSchema (what builder sets)
	•	execute(ctx) -> outputs + proposedStateChanges
	•	optional: aiCapabilities[] (metered hooks)

UI contract
	•	render(ctx) -> UISchema (server-driven)
	•	events (submit, approve, reject, requestChanges, etc.)
	•	permissions

Non-lock-in choice: keep the UI contract as a framework-agnostic schema, not React-specific.

2.3 Knowledge substrate

Three planes:
	•	Global knowledge graph (domain pack)
	•	Tenant knowledge (templates/playbooks)
	•	Case knowledge (documents + extracted facts/issues + vector store)

Non-lock-in choice: define a retrieval interface that supports multiple backends:
	•	vector store (Qdrant, pgvector, Pinecone)
	•	keyword search (Postgres FTS, OpenSearch)
	•	graph store (Postgres adjacency, Neo4j)

2.4 Audit ledger

An append-only, tamper-evident ledger of:
	•	AI invocations (prompt hash, sources, output hash, tokens)
	•	human approvals/overrides
	•	workflow transitions
	•	data mutations

Non-lock-in choice: ledger API is abstract; initial impl can be Postgres hash-chained; later WORM/external notarization.

⸻

3) Runtime execution model (governed)

Deterministic-by-default
	•	Components propose state changes.
	•	Only commits on explicit rules:
	•	automatic for safe operations (e.g., “create task” if policy allows)
	•	approval required for anything substantive (drafts, assessments, outgoing comms, closure)

Event-driven state machine
	•	UI emits events → runtime evaluates node → produces:
	•	next node(s)
	•	UI schema updates
	•	proposed changes
	•	ledger + metering entries

⸻

4) Server-driven UI model (core to “workflow becomes app”)

UI shell (fixed)
	•	Navigation + routing
	•	Auth + session
	•	Standard widgets (forms, tables, cards, timelines, doc viewer, editor, chat, queues)
	•	Policy-aware rendering (permissions)

UI schema (dynamic)

Components return:
	•	layout blocks
	•	data bindings
	•	actions (events)
	•	guidance content (“what to do next / why”)

Non-lock-in choice: keep the UI schema small and composable; avoid baking in “legal” semantics.

⸻

5) AI runtime design (avoid coupling to one model/provider)

AI Provider Interface
	•	complete(), embed(), rerank(), tool_call()
	•	model registry + policies per tenant/workflow

RAG pipeline as a service
	•	ingestion: chunk → embed → store
	•	retrieval: hybrid retrieve + filters + citations pack
	•	generation: schema-constrained outputs
	•	evaluation: confidence + gap detection

Non-lock-in choice: all AI work runs behind internal services; no direct model calls from business components.

⸻

6) Data architecture (state vs history)

Operational stores
	•	Postgres: cases, parties, tasks, workflow instances, permissions, metadata
	•	Object storage: documents + versions + derived artifacts
	•	Vector store: embeddings with metadata filters

Historical truth
	•	Audit ledger (append-only)
	•	AI usage events (metering)

Non-lock-in choice: keep “operational state” reconstructable in principle from ledger, but don’t require event-sourcing for POC.

⸻

7) Deployment architecture (confidential VM-friendly)

Build artifact

A deployment bundle includes:
	•	workflow DSL + config
	•	selected component pack versions
	•	UI schema registry
	•	policies (permissions, AI allowed, connectors)
	•	secrets references (not raw secrets)

Runtime unit
	•	single-tenant container stack initially
	•	target: confidential VM / enclave-backed instance

Non-lock-in choice: define a “Deployment Target” interface (local docker, VM, Kubernetes, confidential VM).

⸻

8) Extensibility model (how “universal CRM” happens)

Domain pack = schema + components + knowledge + templates

A pack provides:
	•	domain entity schemas (Case-like objects)
	•	components (nodes) + UI schemas
	•	prompts/rubrics/checklists (versioned)
	•	optional knowledge graph seed

Legal pack is v1; future packs reuse the same core runtime.

Connector pack (optional later)

Integrations as components:
	•	email, calendar, storage, research APIs
	•	kept separate from domain packs

⸻

9) Minimal service boundaries (POC-friendly, not over-microserviced)

Start as a modular monolith with clean internal interfaces:
	•	workflow_runtime
	•	ui_schema
	•	case_service
	•	doc_service
	•	knowledge_service
	•	ai_service
	•	ledger_service
	•	metering_service

Split into services later without redesign because boundaries are explicit.

⸻

10) “Avoid lock-in” decisions to make now
	1.	Workflow DSL is engine-agnostic (store as JSON/YAML + version).
	2.	UI schema is framework-agnostic (React is just the renderer).
	3.	AI provider abstraction (OpenAI/Azure first, others later).
	4.	Search abstraction (vector + keyword + graph behind interfaces).
	5.	Deployment target abstraction (local/docker → confidential VM).
	6.	Component contracts are stable (inputs/outputs/config/events/permissions).
	7.	Audit ledger is a first-class API (not scattered logs).

⸻

11) Concrete high-level module diagram (text)
	•	Studio
	•	Workflow Editor (DAG)
	•	Pack Manager (Legal Pack v1)
	•	Deploy Manager
	•	Runtime
	•	API Gateway / BFF
	•	Workflow Engine
	•	UI Schema Engine
	•	AI Service (RAG + tools)
	•	Data Services (Case/Doc/Task/Knowledge)
	•	Ledger + Metering
	•	Stores
	•	Postgres
	•	Object Store
	•	Vector Store
	•	Deployment
	•	Single-tenant runtime (container now, confidential VM next)

⸻

12) Next design artifacts to produce (high leverage)
	1.	Component Manifest spec (backend + UI + AI metering + permissions)
	2.	UI Schema v1 spec (widgets, layouts, actions, guidance blocks)
	3.	Workflow DSL v1 (graph + routes/pages + state + events)
	4.	Ledger event taxonomy (event types + required fields)
	5.	Legal Pack v1 component list mapped to the “wow” workflow

