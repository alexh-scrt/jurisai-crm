
Codex 3-Month Aggressive MVP Plan (12 Weeks)

Team & Velocity Assumptions
	•	Team: 3 contributors
	•	You: architecture, product, workflow, AI reasoning, integration
	•	Engineer A: backend / workflow / data / ledger
	•	Engineer B: frontend / UI / UX / document experience
	•	Sprint length: 2 weeks
	•	Velocity: ~30–32 points per sprint (aggressive but feasible with focus)
	•	Hard rule: Anything not visible in the wow demo is secondary.

⸻

Sprint 1 (Weeks 1–2): Contracts + Skeleton Runtime

Theme: “Lock the shape of the platform.”

Goals
	•	Freeze core contracts
	•	Enable workflow → UI → runtime loop

Scope
	•	Workflow DSL v1
	•	Component Manifest v1
	•	UI Schema v1
	•	Minimal workflow runtime
	•	Repo, CI, Docker baseline

Stories (≈30 pts)
	•	Workflow DSL + validator (6)
	•	Component Manifest + registry (6)
	•	UI Schema primitives + renderer skeleton (6)
	•	Workflow instance lifecycle (6)
	•	Dev infra & bootstrap workflow (6)

Exit
	•	Load workflow → render page → click → advance node

⸻

Sprint 2 (Weeks 3–4): Ledger + Governance Core

Theme: “Everything leaves a trace.”

Goals
	•	Tamper-evident audit
	•	Human-in-the-loop gates

Scope
	•	Append-only audit ledger (hash-chained)
	•	Ledger taxonomy
	•	HumanApprovalGate
	•	Typed connector validation

Stories (≈30 pts)
	•	Ledger storage + hash chaining (10)
	•	Ledger taxonomy + write API (6)
	•	HumanApprovalGate component (6)
	•	Connector type validation (4)
	•	Ledger verification endpoint (4)

Exit
	•	Any workflow transition or approval shows up in ledger
	•	Ledger chain verifies cleanly

⸻

Sprint 3 (Weeks 5–6): CRM Workspace + Docs

Theme: “Now it feels real.”

Goals
	•	Consultant-usable case workspace
	•	Rich document experience

Scope
	•	Case list + selection
	•	Case workspace hero layout
	•	Document upload + versioning
	•	PDF viewer
	•	Basic ledger viewer UI

Stories (≈32 pts)
	•	Case workspace layout + navigation (10)
	•	Document upload + storage + versions (8)
	•	PDF viewer integration (6)
	•	Ledger viewer UI (basic) (4)
	•	Permissions wiring (4)

Exit
	•	Login → select case → view docs → inspect ledger

⸻

Sprint 4 (Weeks 7–8): AI Rails + Case Memory

Theme: “The system understands the case.”

Goals
	•	Case-scoped AI
	•	Citations everywhere

Scope
	•	Text extraction + chunking
	•	Embeddings + vector store
	•	Retrieval with citation packs
	•	Copilot chat (read-only)
	•	AI provider abstraction + metering

Stories (≈32 pts)
	•	Text extraction + chunking pipeline (6)
	•	Vector store integration (6)
	•	Citation pack format + UI linking (6)
	•	Case-scoped Copilot chat (8)
	•	AI provider abstraction + metering (6)

Exit
	•	Ask questions → cited answers → cost visible

⸻

Sprint 5 (Weeks 9–10): Legal “Wow” Pipeline

Theme: “This is the moment.”

Goals
	•	Structured legal intelligence
	•	Approval-gated persistence

Scope

Legal Pack v1 core:
	•	ExtractFactsTimeline
	•	SpotIssues
	•	MissingInfoChecklist
	•	Strength/Completeness Assessment
	•	Assess Case one-click UX

Stories (≈32 pts)
	•	ExtractFactsTimeline (structured + cited) (8)
	•	SpotIssues (structured + confidence) (6)
	•	MissingInfoChecklist (actionable) (6)
	•	Strength/Completeness Assessment (6)
	•	Assess Case orchestration + progress UI (6)

Exit
	•	Upload docs → click Assess Case → structured outputs appear as Proposed

⸻

Sprint 6 (Weeks 11–12): Drafting, Deploy & Demo Polish

Theme: “From understanding to action.”

Goals
	•	Close the loop
	•	Make it demo-proof

Scope
	•	Assessment memo drafting
	•	Client email drafting
	•	Approval → finalize → log
	•	Demo workflow packaging
	•	Minimal deployment isolation
	•	UX polish + demo script

Stories (≈32 pts)
	•	Assessment memo generator + editor (8)
	•	Client email draft + approve/send (6)
	•	Provenance view per artifact (6)
	•	Demo workflow definition + pin versions (4)
	•	Deployment bundle (local isolated runtime) (4)
	•	Guided UX + demo polish (4)

Exit
	•	Fresh deploy → browser → full wow demo runs end-to-end

⸻

What Gets Cut or Deferred (Explicitly)

To hit 3 months, these do NOT ship:
	•	Full Workflow Studio UI (only demo workflow editing or config files)
	•	Multi-jurisdiction support
	•	External research API integrations (stub acceptable)
	•	Advanced redlining/version diffs
	•	Multi-tenant cross-learning

⸻

Ownership Model (recommended)

You
	•	Architecture + contracts
	•	Legal Pack logic + prompts
	•	Assess Case orchestration
	•	Demo narrative & guardrails

Engineer A
	•	Workflow runtime
	•	Ledger + governance
	•	AI rails + retrieval
	•	Data models

Engineer B
	•	UI shell + workspace
	•	Document viewer/editor
	•	Copilot UI
	•	Demo polish

⸻

Success Criteria at 12 Weeks

You can confidently show:
	1.	Workflow-defined CRM
	2.	AI-maintained case understanding
	3.	Structured outputs with citations
	4.	Human approvals + ledger proofs
	5.	Draft memo + client email
	6.	Clean, guided UI
	7.	Clear path to other domains

That is enough to:
	•	impress investors,
	•	onboard design partners,
	•	and justify continued build.

⸻
