Codex MVP backlog (epics → stories → acceptance tests) for the “wow” demo

Definition of Done for the “wow demo”

A consultant can: upload docs → click Assess Case → get structured artifacts with citations → approve → generate memo + client email → approve → view ledger proofs.

⸻

Epic A — Platform contracts and validation

A1. Workflow DSL v1 (graph + routes + state)

Story: Define and implement DSL schema + validator.
Acceptance tests
	•	Given a valid workflow DSL, the runtime loads it and returns “valid”.
	•	Given an invalid DSL (missing node, bad edge, unknown component), runtime returns a structured error with location.
	•	DSL supports: nodes, edges, conditions, routes/pages, component config, version.

A2. Component Manifest v1 (backend + UI + AI toggles)

Story: Implement manifest schema and registry lookup.
Acceptance tests
	•	Registry rejects components missing required fields (inputs/outputs/configSchema/events/permissions).
	•	Registry supports version pinning (component name@version).
	•	Manifest exposes AI toggles (on/off), and when disabled, AI methods are not invokable.

A3. UI Schema v1 (server-driven rendering contract)

Story: Define UI schema primitives and JSON validation.
Acceptance tests
	•	Given UI schema JSON, frontend renders without custom code per workflow.
	•	Invalid UI schema fails fast with clear validation errors.
	•	UI schema supports: layout, form, table, timeline, document viewer embed, rich-text editor embed, chat panel, action bar, guidance blocks.

⸻

Epic B — Workflow runtime and state machine

B1. Workflow instance lifecycle

Story: Create/run workflow instances per case.
Acceptance tests
	•	Start workflow for case → instance created with instance_id.
	•	UI events advance workflow deterministically to expected next node.
	•	Runtime persists node transitions and can resume after restart.

B2. Human gate component (pause/resume)

Story: Implement a “HumanApprovalGate” node.
Acceptance tests
	•	When execution reaches gate, workflow status becomes WAITING_APPROVAL.
	•	Without approval, downstream nodes cannot execute.
	•	Approve event resumes execution; reject event routes to configured fallback path.

B3. Typed connector validation (inputs/outputs)

Story: Validate wiring between components based on declared types.
Acceptance tests
	•	Studio/runtime rejects connecting incompatible types.
	•	Runtime error includes fromNode, toNode, expected type, actual type.

⸻

Epic C — Audit ledger (tamper-evident) and proofs

C1. Append-only ledger with hash chaining

Story: Implement ledger table and write API.
Acceptance tests
	•	Any state mutation produces a ledger entry (create/update actions) with prev_hash and entry_hash.
	•	Database role used by app cannot UPDATE/DELETE ledger rows.
	•	Ledger verification endpoint recomputes chain and returns “valid” for unchanged data.

C2. Ledger taxonomy for AI + approvals + workflow transitions

Story: Implement structured event types.
Acceptance tests
	•	AI invocation events include: model, prompt_hash, sources, output_hash, tokens_in/out, component_id.
	•	Approval events include: reviewer_id, artifact_id, decision, timestamp, diff summary (optional).
	•	Workflow transition events include: from_node, to_node, condition result.

C3. Ledger viewer UI (demo-critical)

Story: Provide per-artifact provenance view.
Acceptance tests
	•	For any memo/email artifact, UI shows: creation event → AI invocation(s) → approval → finalization.
	•	UI can display sources used (doc IDs/chunk IDs) and link back to documents.

⸻

Epic D — Document ingest, indexing, and citations

D1. Document upload + storage + versioning

Story: Upload PDF/DOCX, store immutable original, create version record.
Acceptance tests
	•	Upload returns document_id + version_id.
	•	Re-upload as new version links to prior version.
	•	Viewer loads the exact version referenced by an artifact.

D2. Text extraction + chunking pipeline

Story: Extract text and chunk with stable chunk IDs.
Acceptance tests
	•	For a document, system produces N chunks with deterministic IDs.
	•	Chunks include offsets/page references when available.
	•	Pipeline is idempotent (re-run does not duplicate chunks).

D3. Embeddings + vector store write (case-scoped)

Story: Embed chunks and store with metadata filters.
Acceptance tests
	•	Query vector store filtered by case_id returns only that case’s chunks.
	•	Removing/closing a case prevents retrieval in future queries (policy-based).

D4. Citation pack format (non-negotiable)

Story: Standardize citations returned by retrieval and attached to AI outputs.
Acceptance tests
	•	Every AI answer in “wow flow” includes at least one citation when grounded in docs.
	•	Citation entries include: doc_id, version_id, chunk_id, snippet, confidence score.
	•	UI can click citation → open document viewer at referenced location (page/snippet best-effort).

⸻

Epic E — AI runtime (“AI rails”) with governance and metering

E1. AI provider abstraction

Story: Implement provider interface (completion + embeddings) with model registry.
Acceptance tests
	•	Switching provider config does not change business code.
	•	Requests include tenant/workflow policy checks (allowed models, max tokens).

E2. Structured output enforcement (schema-bound)

Story: Enforce Pydantic/JSON schema outputs for key AI components.
Acceptance tests
	•	If AI output fails schema validation, component returns a recoverable error and does not mutate state.
	•	For “Assess Case,” facts/timeline/issues/checklist outputs must validate.

E3. AI metering (tokens/cost) and reporting

Story: Track AI usage per component/case/workflow.
Acceptance tests
	•	Each AI call logs tokens in/out and cost estimate in metering store + ledger.
	•	UI shows totals per case and per workflow run.

E4. “No silent writes” policy

Story: Prevent AI-driven state changes without an approval gate.
Acceptance tests
	•	Any component flagged “substantive” requires gate before persistence.
	•	Attempt to persist without approval is blocked and logged.

⸻

Epic F — Legal Pack v1: Wow pipeline components

F1. ExtractFactsTimeline (structured)

Story: Produce facts and timeline events with citations.
Acceptance tests
	•	Output schema: facts[], events[] with dates (nullable) and citations.
	•	UI renders timeline; each event has citation links.
	•	Reject/approve gate controls persistence.

F2. SpotIssues (structured)

Story: Identify legal issues/claims/defenses (POC scope) with citations and “needs confirmation”.
Acceptance tests
	•	Output schema: issues[] with confidence + citations + required_missing_info.
	•	UI shows issues with confidence and “confirm” controls.
	•	Approval required before issues become “case state”.

F3. MissingInfoChecklist (actionable)

Story: Generate checklist of missing docs/facts required for next steps.
Acceptance tests
	•	Output schema: checklist items with priority and rationale.
	•	One-click “Create tasks from checklist” generates tasks and logs ledger entries.

F4. StrengthCompletenessAssessment (rubric-based)

Story: Produce assessment sections with evidence pointers (no hallucinated certainty).
Acceptance tests
	•	Output includes “strengths”, “weaknesses”, “open questions” and each item has citations or explicitly marked “assumption”.
	•	UI clearly distinguishes grounded vs assumed statements.

F5. AssembleAssessmentMemo (template + AI assist)

Story: Generate assessment memo draft in editor with inline citations.
Acceptance tests
	•	Memo draft includes sections and embedded citation references.
	•	Editor supports edit; finalization requires approval.
	•	Final memo stores provenance: template version + AI invocation hashes.

F6. ClientEmailDraft (request missing info)

Story: Generate client email requesting missing documents/facts.
Acceptance tests
	•	Email draft includes checklist items, due date placeholders, polite tone.
	•	User can edit; sending requires approval.
	•	“Send” records comms event + ledger entry (actual send can be stubbed to outbox).

⸻

Epic G — UI/UX: Rich Case Workspace for demo

G1. Case workspace “hero layout”

Story: Implement responsive layout with panels and guided next steps.
Acceptance tests
	•	Panels: Overview, Docs, Timeline, Issues, Checklist, Drafts, Copilot, Audit.
	•	Guidance block shows “Next recommended action” based on state.

G2. Copilot chat (case-scoped, cited)

Story: Provide chat UI for questions with citations.
Acceptance tests
	•	Questions answered using case retrieval; citations shown and clickable.
	•	Chat cannot directly mutate state; it can propose actions that create draft artifacts requiring approval.

G3. “Assess Case” one-click experience

Story: Single button triggers pipeline and shows progress + results.
Acceptance tests
	•	Progress shown per step (facts → issues → checklist → assessment → memo draft).
	•	On completion, artifacts are in “Proposed” state pending approval.

⸻

Epic H — Demo workflow + deployment packaging (minimal studio path)

H1. Demo workflow definition (pinned versions)

Story: Create the canonical workflow for the wow demo.
Acceptance tests
	•	Workflow uses fixed component versions and runs deterministically from a sample dataset.
	•	Rerun produces same structure (content may vary, structure must match schema).

H2. Deployment bundle + isolated runtime (POC)

Story: Package workflow + components for deployment to single-tenant runtime.
Acceptance tests
	•	Deploy bundle creates a fresh runtime instance.
	•	Consultant can access via browser URL and run the demo flow end-to-end.

⸻

“Wow demo” end-to-end acceptance test (master)

Scenario: New case with uploaded documents.

Steps / Expected
	1.	Upload 3–10 documents → docs listed + viewable.
	2.	Click Assess Case → pipeline runs; outputs appear as Proposed:
	•	Timeline (events cited)
	•	Issues (cited + needs confirmation)
	•	Missing checklist (actionable)
	•	Assessment (rubric, grounded vs assumptions)
	•	Memo draft in editor
	3.	Click Approve on artifacts → state updates committed.
	4.	Generate Client Email → edit → approve → “send/outbox” logged.
	5.	Open Audit/Provenance → see:
	•	AI invocation entries with prompt_hash, sources, output_hash, token usage
	•	approval entries by user
	•	workflow transitions
	6.	Run ledger verification endpoint → returns “valid chain”.

⸻

Backlog ordering (recommended)
	1.	A, B, C (contracts + runtime + ledger)
	2.	D (docs + citations)
	3.	E (AI rails + governance)
	4.	F (legal wow components)
	5.	G (hero UI + assess button)
	6.	H (demo workflow + deployment)

