# AI Rails — Minimal v1 Scope

This document defines the **minimum shippable product** for AI Rails Phase 1, followed by **domain expansion plans** via component packs.


1. Minimal v1 Scope (Phase 1 Ship Criteria)

1.1 Target Use Case (v1)

Trusted business communications automation
(starting with email and messaging-based workflows)

⸻

1.2 Required Core Platform Components (v1)

Platform Core
	•	Workflow Studio (basic graph editor)
	•	Workflow compiler + versioning
	•	Confidential VM runtime (CPU-only initially)
	•	Proof-of-work ledger (local + mirrored read-only)
	•	Policy engine (thresholds + manual gates)
	•	Dashboard (status, approvals, audit)

Trust & Security
	•	Attestation-gated key management
	•	Encrypted disk and memory
	•	Idempotency + retry framework
	•	Evidence hashing and storage

⸻

1.3 Business Component Pack — v1

Required (Must-Have)
	•	Email automation (Gmail / IMAP)
	•	classify intent
	•	extract fields
	•	draft response
	•	send with verification
	•	Slack integration
	•	handle requests
	•	approvals in-channel
	•	Web search
	•	factual lookup
	•	citation capture
	•	Social media sentiment analysis
	•	Product Q&A chatbot (knowledge-base grounded)
	•	Scheduler / calendar coordination
	•	Voice STT-TTS (basic)
	•	transcription
	•	intent detection
	•	escalation gate

Strongly Recommended Additions
	•	Document intake (PDF/email attachment parsing)
	•	Ticket creation/update (generic webhook-based)
	•	Contact enrichment (low-risk metadata)
	•	Rate-limiting & cost guard components

⸻

1.4 What We Explicitly Do NOT Build in v1
	•	GPU-dependent large-scale inference
	•	Fully autonomous financial transactions
	•	Open-ended agent tool use
	•	Marketplace for third-party components

⸻

2. Legal Component Pack (Phase 2 Focus)

Core Legal Components
	•	Document ingestion & structure extraction
	•	Legal document summarization
	•	Contract review (clauses, risks, obligations)
	•	Fact checker (claims vs cited sources)
	•	Case law search & citation
	•	Legal research assistant (query → structured answer)
	•	Legal reasoning with constraints (issue spotting, arguments)
	•	Request-for-more-information workflows

Strong Additions
	•	Jurisdiction-aware analysis
	•	Redline / comparison between document versions
	•	Deadline & obligation tracking
	•	Evidence chain mapping (facts → sources)
	•	Human approval gates for conclusions

All legal outputs are advisory, policy-gated, and auditable.

⸻

3. Other High-Value Domains for AI Rails

3.1 Finance & Operations

Component packs:
	•	Expense processing
	•	Invoice intake and validation
	•	Budget threshold enforcement
	•	Approval workflows
	•	Ledger reconciliation

3.2 IT & Internal Ops

Component packs:
	•	Access provisioning/deprovisioning
	•	Incident intake and triage
	•	Asset tracking updates
	•	Compliance check automation

3.3 HR & People Ops

Component packs:
	•	Candidate screening (policy-gated)
	•	Interview scheduling
	•	Offer document handling
	•	Employee request automation

3.4 Sales & RevOps

Component packs:
	•	Lead intake and qualification
	•	CRM updates
	•	Proposal drafting (approval-gated)
	•	Contract handoff workflows

3.5 Marketing & Communications

Component packs:
	•	Content drafting and scheduling
	•	Brand safety checks
	•	Campaign analytics summaries
	•	Social publishing with approvals

⸻

4. Strategic Summary
	•	Phase 1 proves trust, execution, and auditability in business communications
	•	Phase 2 expands into legal and document-heavy domains where trust is mandatory
	•	Future phases unlock finance, ops, and internal automation

AI Rails becomes the platform enterprises use when AI is allowed to act.
