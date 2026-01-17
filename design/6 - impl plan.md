Detailed implementation plan (12-week aggressive variant) — phase by phase

This is written as an implementable blueprint: repo structure, contracts, APIs, DB schemas, runtime flows, UI schemas, testing strategy, and acceptance tests per phase. It assumes React+TS frontend, Python+FastAPI backend, Postgres, Qdrant, S3-compatible object store, and a provider-abstracted AI layer.

⸻

Global implementation principles (apply to all phases)
	1.	Contracts-first: Workflow DSL, Component Manifest, UI Schema, Ledger Event taxonomy are stable and versioned.
	2.	Modular monolith: One backend repo/process with clear internal modules; split later if needed.
	3.	Deterministic by default: AI produces proposals; persistence of substantive artifacts requires HumanApprovalGate.
	4.	Everything is auditable: Any state mutation, workflow transition, AI call, and approval produces ledger entries.
	5.	No vendor lock-in: AI provider interface, vector store interface, object store interface, deployment target interface.

⸻

Repository layout (create in Sprint 1)

jurisai-crm/
  backend/
    app/
      main.py
      api/                  # FastAPI routers
      core/                 # settings, auth, RBAC, deps
      db/                   # models, migrations, repos
      workflow/             # DSL, runtime, executor, state
      components/           # component registry + implementations
      ui_schema/            # schema types, validation, rendering helpers
      ai/                   # provider abstraction, prompts, schemas
      knowledge/            # ingestion, retrieval, citation pack
      ledger/               # ledger writer, verifier, event taxonomy
      metering/             # AI usage accounting
      tests/
  frontend/
    src/
      app/                  # routes, layout
      ui/                   # renderer + widgets
      schema/               # UI schema TS types + validators
      features/
        auth/
        cases/
        documents/
        copilot/
        ledger/
        assess/
      tests/
  infra/
    docker-compose.yml
    localstack/ or minio config
    qdrant config
  workflows/
    demo_workflow.yaml      # pinned versions
  component_packs/
    legal_v1/
      components.yaml       # manifests
      prompts/
      templates/


⸻

Contract specs (must exist before building features)

1) Workflow DSL v1 (YAML/JSON)

Minimal fields (keep extensible):

version: "1.0"
workflow_id: "legal_assess_v1"
name: "Legal Assess Case"
routes:
  - path: "/"
    page_node: "case_workspace_page"
nodes:
  - id: "case_workspace_page"
    component: "ui.CaseWorkspacePage@1.0.0"
    config: { ... }
  - id: "assess_case"
    component: "legal.AssessCaseOrchestrator@1.0.0"
    config: { ... }
edges:
  - from: "case_workspace_page"
    on: "event.assess_case_clicked"
    to: "assess_case"
  - from: "assess_case"
    on: "result.completed"
    to: "case_workspace_page"

2) Component Manifest v1 (per component)

name: "legal.ExtractFactsTimeline"
version: "1.0.0"
kind: "node"          # node | page | widget | gate | automation
inputs:
  - name: "case_id"
    type: "CaseId"
outputs:
  - name: "facts_timeline"
    type: "FactsTimelineV1"
configSchema: { ...json schema... }
permissions:
  render: ["case:read"]
  execute: ["case:write"]
events:
  emits: ["result.proposed", "result.error"]
ai:
  toggles:
    - id: "ai_extract"
      default: true
      metered: true
      policy: { requiresApproval: true }

3) UI Schema v1 (server-driven)

Keep minimal but powerful:
	•	Page, Panel, Tabs, Card, Table, Form, Timeline, DocViewer, RichTextEditor, Chat, ActionBar, GuidanceBlock, Queue.

Example (simplified):

{
  "type": "Page",
  "title": "Case Workspace",
  "layout": {
    "type": "Tabs",
    "tabs": [
      { "id": "overview", "title": "Overview", "content": { "type": "Panel", "blocks": [...] } },
      { "id": "documents", "title": "Documents", "content": { "type": "DocViewer", "docId": "..." } },
      { "id": "assess", "title": "Assess", "content": { "type": "Panel", "blocks": [...] } }
    ]
  },
  "actions": [
    { "id": "assess_case", "label": "Assess Case", "event": "event.assess_case_clicked" }
  ],
  "guidance": [
    { "type": "GuidanceBlock", "title": "Next step", "text": "Upload documents, then run Assess Case." }
  ]
}

4) Ledger Event taxonomy v1

Event types (minimum):
	•	workflow.transition
	•	workflow.waiting_approval
	•	artifact.proposed
	•	artifact.approved
	•	artifact.rejected
	•	data.mutation
	•	ai.invocation
	•	ai.result
	•	metering.usage

Each ledger entry contains canonical fields + payload hash + chain hashes.

⸻

Database schema (incremental)

Use Alembic migrations (backend/app/db/migrations).

Core tables (by end Sprint 3)
	•	tenants(id, name, created_at)
	•	users(id, tenant_id, email, pw_hash, created_at)
	•	roles(id, tenant_id, name)
	•	user_roles(user_id, role_id)
	•	permissions(role_id, perm) (string perms)
	•	cases(id, tenant_id, title, status, created_at, updated_at)
	•	case_assignments(case_id, user_id, role) (consultant, reviewer)
	•	case_fields(case_id, key, value_jsonb) (flex fields)
	•	documents(id, tenant_id, case_id, created_at)
	•	document_versions(id, document_id, version, object_key, sha256, mime, created_at)
	•	document_text_chunks(id, document_version_id, chunk_index, text, meta_jsonb) (or separate blob store for text if large)
	•	workflow_definitions(id, tenant_id, workflow_id, version, dsl_jsonb, created_at)
	•	workflow_instances(id, tenant_id, workflow_definition_id, case_id, status, current_nodes_jsonb, created_at, updated_at)
	•	node_executions(id, instance_id, node_id, status, started_at, ended_at, output_jsonb, error_jsonb)
	•	artifacts(id, tenant_id, case_id, type, status, content_ref_jsonb, created_at, updated_at)
	•	types: facts_timeline, issues, checklist, assessment, memo_draft, email_draft
	•	status: PROPOSED, APPROVED, REJECTED, FINAL
	•	ledger_entries(id, tenant_id, ts, actor_type, actor_id, event_type, payload_jsonb, payload_hash, prev_hash, entry_hash)
	•	enforce append-only via DB permissions and/or triggers
	•	ai_usage(id, tenant_id, case_id, component, model, tokens_in, tokens_out, cost_est, ts, ledger_entry_id)

⸻

Backend API surface (incremental)

Auth
	•	POST /api/auth/login -> JWT/session
	•	GET /api/auth/me

Cases
	•	GET /api/cases (assigned)
	•	GET /api/cases/{case_id}
	•	POST /api/cases (seed/demo)

Documents
	•	POST /api/cases/{case_id}/documents (multipart upload)
	•	GET /api/documents/{doc_id}/versions/{version_id}/download
	•	GET /api/cases/{case_id}/documents

Workflow runtime
	•	POST /api/workflows/{workflow_id}/instances (create for case)
	•	GET /api/workflow_instances/{instance_id}/ui (returns UISchema + data bindings)
	•	POST /api/workflow_instances/{instance_id}/event (emit UI event)

Artifacts & approvals
	•	GET /api/cases/{case_id}/artifacts
	•	POST /api/artifacts/{artifact_id}/approve
	•	POST /api/artifacts/{artifact_id}/reject

Ledger
	•	GET /api/cases/{case_id}/ledger (filtered)
	•	GET /api/ledger/{entry_id}
	•	POST /api/ledger/verify (verify chain for tenant/case range)

Copilot
	•	POST /api/cases/{case_id}/copilot/query

⸻

Frontend implementation approach
	•	Single React app with routes:
	•	/login
	•	/cases
	•	/cases/:caseId (workspace shell)
	•	Server-driven UI renderer renders UISchema returned by backend for active workflow page.
	•	“Hero UI” can be partially hardcoded initially (Sprint 3), but by Sprint 4+ the workspace should be driven by UISchema to prove the thesis.

⸻

Testing strategy (must be implemented throughout)

Backend tests
	•	Unit tests: DSL validation, manifest validation, ledger hashing, schema validators.
	•	Integration tests: FastAPI TestClient, Postgres (testcontainers if available), Qdrant (docker in CI optional).
	•	Golden tests: structured outputs must validate against Pydantic.

Frontend tests
	•	Schema renderer snapshot tests (given UISchema renders expected widgets).
	•	E2E tests (Playwright recommended):
	•	login → upload docs → assess → approve → view ledger.

⸻

Phase-by-phase plan (Sprints 1–6)

Sprint 1 (Weeks 1–2): Contracts + skeleton runtime

Backend tasks
	1.	Implement DSL parser + validator
	•	workflow/dsl.py: Pydantic models for DSL v1
	•	workflow/validate.py: checks:
	•	node ids unique
	•	edges refer to existing nodes
	•	referenced component exists in registry
	•	routes point to page nodes
	2.	Implement Component Registry
	•	components/registry.py: load manifests from component_packs/**/components.yaml
	•	support version pinning name@version
	•	registry lookup returns backend handler + UI renderer function
	3.	Implement UI Schema types
	•	ui_schema/types.py: Pydantic models
	•	ui_schema/validate.py: validate JSON structure
	4.	Minimal Workflow runtime
	•	workflow/runtime.py:
	•	create instance (DB record)
	•	get_ui(instance_id) returns UISchema for current page node
	•	emit_event(instance_id, event_name, payload):
	•	finds outgoing edge matching on
	•	moves current node
	•	records workflow.transition (ledger stub in Sprint 2, can log to stdout now)
	5.	Minimal DB models + migrations
	•	workflow_definitions, workflow_instances, users/tenants minimal

Frontend tasks
	1.	Minimal pages: Login, Cases list, Case workspace shell
	2.	UISchema renderer skeleton:
	•	render Page title + ActionBar buttons + GuidanceBlock
	3.	Integrate runtime endpoints:
	•	fetch /ui
	•	post /event

Acceptance tests
	•	Given a workflow DSL, create instance for case, fetch UI, click action triggers event and transitions, new UI returned.

⸻

Sprint 2 (Weeks 3–4): Ledger + governance core

Backend tasks
	1.	Ledger service
	•	ledger/hash.py:
	•	canonical JSON serialization (stable key ordering)
	•	payload_hash = sha256(canonical_payload)
	•	entry_hash = sha256(prev_hash + payload_hash + metadata_fields)
	•	ledger/service.py:
	•	append_event(tenant_id, actor, event_type, payload) -> entry
	•	store prev_hash per tenant (or per case—choose per tenant for simplicity)
	2.	DB constraints
	•	ledger_entries table with insert-only permissions (enforce with DB role and app role)
	3.	Ledger verifier
	•	POST /api/ledger/verify recompute chain across range; return first mismatch if any
	4.	HumanApprovalGate component
	•	Component that sets workflow instance status WAITING_APPROVAL and creates a PROPOSED artifact placeholder
	•	Resume on approve/reject events
	5.	Typed connector validation
	•	Add type checking in DSL validation:
	•	each component manifest has inputs/outputs
	•	edge from A to B must pass output type compatible with B input

Frontend tasks
	1.	Basic ledger viewer
	•	show list of entries filtered by case_id (backend should include case_id in payload for filtering)
	2.	Approval gate UI primitive:
	•	show “Approve / Reject” actions when workflow status waiting

Acceptance tests
	•	Any workflow transition appends ledger entry
	•	Approval gate pauses execution
	•	Approve triggers transition and ledger entries
	•	Verify endpoint returns valid chain

⸻

Sprint 3 (Weeks 5–6): CRM workspace + docs

Backend tasks
	1.	Cases service
	•	create/list/get, assignments
	2.	Document service
	•	upload endpoint stores:
	•	original object to object store (MinIO for local)
	•	document + version rows
	•	sha256 computed
	•	version listing endpoint
	3.	Serve document download
	4.	Ledger integration with mutations
	•	document upload writes data.mutation + document.version_created

Frontend tasks
	1.	Rich Case Workspace layout (tabs/panels)
	•	Overview (status, assigned users)
	•	Documents (list + viewer)
	•	Tasks/Requirements (stub list; real later)
	•	Audit (ledger viewer)
	•	Copilot tab placeholder
	2.	PDF.js viewer integration
	3.	Upload UI (drag/drop)

Acceptance tests
	•	Upload doc → appears in list → viewable
	•	Ledger shows document upload + version creation
	•	Case list shows assigned cases

⸻

Sprint 4 (Weeks 7–8): AI rails + case memory (citations)

Backend tasks
	1.	Text extraction
	•	PDF: use pypdf or pdfplumber (POC)
	•	DOCX: python-docx
	•	store extracted text per version
	2.	Chunking
	•	deterministic chunking strategy:
	•	split by paragraphs/sentences with max tokens/characters
	•	chunk_id deterministic: sha256(document_version_id + chunk_index + text_hash)
	•	store chunks in document_text_chunks
	3.	Vector store interface
	•	knowledge/vector_store.py with methods:
	•	upsert(chunks[])
	•	query(case_id, text, top_k, filters)
	4.	Embeddings
	•	ai/embeddings.py via provider abstraction
	5.	Retrieval service
	•	knowledge/retrieve.py returns CitationPack:
	•	doc_id, version_id, chunk_id, snippet, score, meta(page if known)
	6.	Copilot query endpoint
	•	POST /copilot/query:
	•	retrieve citations
	•	call AI completion with tool-less RAG prompt
	•	return answer + citations
	•	ledger ai.invocation, ai.result + metering entries

Frontend tasks
	1.	Copilot UI (read-only, cited)
	•	show answer + citation chips; click opens document viewer (best-effort open and highlight snippet)
	2.	Citation rendering component

Acceptance tests
	•	Ask “Summarize the case” returns answer with citations
	•	Clicking citation opens doc viewer
	•	AI usage appears in metering + ledger

⸻

Sprint 5 (Weeks 9–10): Legal “wow pipeline” (structured outputs + approvals)

Backend tasks

Implement Legal Pack components (all schema-validated) and orchestration.

Shared: structured output schemas
	•	ai/schemas/:
	•	FactsTimelineV1: facts[], events[]
	•	IssuesV1: issues[] (confidence, citations, needs_confirmation, missing_info[])
	•	ChecklistV1: items[] (priority, rationale, requested_from_client?)
	•	AssessmentV1: strengths[], weaknesses[], open_questions[], assumptions[]

Each item carries citations OR explicit is_assumption: true.

Components
	1.	legal.ExtractFactsTimeline@1.0.0
	•	input: case_id
	•	retrieval: top chunks
	•	AI prompt returns FactsTimelineV1
	2.	legal.SpotIssues@1.0.0
	3.	legal.MissingInfoChecklist@1.0.0
	4.	legal.StrengthCompletenessAssessment@1.0.0

Orchestrator
	5.	legal.AssessCaseOrchestrator@1.0.0
	•	runs components sequentially
	•	creates artifacts in PROPOSED status for each output
	•	routes to HumanApprovalGate for committing proposals
	•	writes workflow transitions and AI events to ledger

Approval + persistence rules
	•	On approval:
	•	artifact status -> APPROVED
	•	case_fields updated (facts/issues/checklist/assessment summaries)
	•	ledger entries: artifact.approved + data.mutation
	•	On rejection:
	•	artifact status -> REJECTED
	•	ledger entry: artifact.rejected

Frontend tasks
	1.	“Assess Case” one-click UX
	•	button triggers runtime event
	•	progress view (facts → issues → checklist → assessment)
	2.	Proposed artifacts panel
	•	each artifact card shows: status, summary, citations, Approve/Reject
	3.	Timeline, Issues, Checklist UI widgets
	4.	Guidance blocks update based on state:
	•	if missing checklist exists, prompt “Generate client email”

Acceptance tests
	•	Upload docs → click Assess Case → artifacts created as PROPOSED
	•	Each artifact shows citations (or explicit assumptions)
	•	Approving commits to case state and logs ledger entries
	•	Ledger shows AI invocations + approval chain

⸻

Sprint 6 (Weeks 11–12): Drafting, deployment packaging, demo polish

Backend tasks
	1.	Template engine
	•	simple Jinja2 templates stored in component_packs/legal_v1/templates/
	•	templates versioned via filename + manifest
	2.	Memo drafting component
	•	legal.AssembleAssessmentMemo@1.0.0
	•	uses approved artifacts as inputs
	•	generates memo draft with inline citation references
	•	stores artifact type memo_draft (PROPOSED) with content in object store (or DB text for POC)
	3.	Email draft component
	•	legal.ClientEmailDraft@1.0.0
	•	uses checklist; produces email body + subject; PROPOSED
	4.	Rich text editing persistence
	•	endpoints:
	•	GET /artifacts/{id}
	•	PUT /artifacts/{id} (updates draft content; logs ledger data.mutation)
	•	finalization on approval -> FINAL
	5.	Outbox “send” (POC)
	•	POST /artifacts/{email_id}/send
	•	writes comms.sent ledger entry
	•	does not integrate real SMTP for POC unless trivial
	6.	Deployment bundle
	•	deployment/bundle.py:
	•	package workflow DSL + component manifests + templates + prompts
	•	produce bundle.tar.gz
	•	deployment/local_target.py:
	•	unpack and run with docker-compose or “instance directory” config
	•	create instance URL (local)
	7.	Provenance endpoint
	•	GET /artifacts/{id}/provenance returns linked ledger entries and sources

Frontend tasks
	1.	Memo editor (TipTap)
	•	load draft, edit, save
	•	show citations panel
	2.	Email editor
	3.	Artifact provenance UI
	•	show chain: AI invocations → proposed → edits → approval → final
	4.	Demo polish
	•	stable navigation, consistent styling, empty states, tooltips

Acceptance tests (wow demo master)
	•	Fresh deploy → login → case → upload docs
	•	Assess Case → approve artifacts
	•	Generate memo → edit → approve → final memo view
	•	Generate email → edit → approve → send/outbox
	•	Open provenance → see complete ledger chain
	•	Ledger verify returns valid

⸻

Cross-phase “non-lock-in” safeguards (do these explicitly)
	1.	AI provider interface
	•	Do not call provider directly in components. All calls go via ai/service.py.
	2.	Vector store interface
	•	VectorStore class with Qdrant implementation; swap later.
	3.	UI schema
	•	Frontend renderer consumes schema; business logic stays backend-side.
	4.	Workflow DSL
	•	Keep it generic; avoid legal-only semantics in DSL and UI schema.
	5.	Deployment
	•	Create DeploymentTarget interface; local target now, confidential VM later.

⸻

Implementation checklists per sprint (what Codex should verify)

Sprint 1 checklist
	•	DSL loads + validates
	•	Component registry loads manifests from disk
	•	UISchema Pydantic validates
	•	Runtime can create instance and return UI for a route
	•	Frontend renders schema and can emit event

Sprint 2 checklist
	•	Ledger append + hash chain verified
	•	DB prevents updates/deletes on ledger (permissions or trigger)
	•	Approval gate pauses execution
	•	Typed connector validation blocks mismatches

Sprint 3 checklist
	•	Document upload stores original + version metadata + hash
	•	PDF viewer loads exact version
	•	Ledger shows document events
	•	Workspace is usable and responsive

Sprint 4 checklist
	•	Text extraction works for PDF/DOCX sample set
	•	Chunk IDs are stable across reruns
	•	Qdrant stores embeddings with case filter
	•	Copilot returns cited answers
	•	AI usage metering visible

Sprint 5 checklist
	•	All legal outputs validate against schema
	•	Artifacts created as PROPOSED with citations
	•	Approval commits to case state and logs ledger
	•	“Assess Case” UX shows progress and results

Sprint 6 checklist
	•	Memo/email drafts generated, editable, approvable
	•	Provenance view links ledger entries and sources
	•	Deployment bundle produces a runnable instance
	•	End-to-end demo runs reliably

⸻

Minimal “done” artifact set for MVP demo
	•	Case workspace with: Documents, Timeline, Issues, Checklist, Drafts, Copilot, Audit
	•	“Assess Case” pipeline producing: FactsTimeline, Issues, Checklist, Assessment
	•	Memo + email drafting with approval and provenance
	•	Ledger verification and per-artifact provenance viewer
	•	Local deployment packaging (single-tenant runtime)

