# AI Rails — Data Flow

This document defines the **data handling model** for AI Rails Phase 1.

## 1. Data Flow Diagram (PII, Evidence, Proof)

### 1.1 High-Level Data Flow

```mermaid
flowchart LR
  Input[External Input\nEmail / Slack / Voice / Web]
  Classify[PII & Sensitivity Classifier]
  Redact[Redaction / Minimization]
  AI[AI Reasoning Components]
  Policy[Policy & Gate Checks]
  Action[Side-Effect Action\n(API / Message / Update)]
  Evidence[Evidence Capture]
  Hash[Hash & Reference]
  Ledger[Proof-of-Work Ledger]
  Dashboard[Audit / Review UI]

  Input --> Classify
  Classify --> Redact
  Redact --> AI
  AI --> Policy
  Policy --> Action
  Action --> Evidence
  Evidence --> Hash
  Hash --> Ledger
  Ledger --> Dashboard


⸻

1.2 PII Handling Rules
	•	PII is classified immediately on ingress
	•	Only the minimum required fields are passed to AI reasoning
	•	Raw PII is:
	•	processed in-memory inside confidential VM
	•	optionally redacted before storage
	•	Proof ledger stores:
	•	hashes, references, and metadata
	•	not raw sensitive payloads (unless explicitly configured)

⸻

1.3 Evidence & Proof Model

Evidence types:
	•	External system IDs (message ID, ticket ID, transaction ID)
	•	Timestamps and decision metadata
	•	Approval events and identities
	•	Cryptographic hashes of payloads (optional payload escrow)

Ledger guarantees:
	•	Append-only
	•	Tamper-evident (hash chain)
	•	Replayable for audit
	•	Exportable for compliance



AI Rails becomes the platform enterprises use when AI is allowed to act.
