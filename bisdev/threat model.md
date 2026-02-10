# AI Rails — Threat Model

This document defines the **security posture** for AI Rails Phase 1, followed by **domain expansion plans** via component packs.

---

## 1. Explicit Threat Model

### 1.1 Assets We Protect
AI Rails is designed to protect:

- **Customer Data**
  - PII (emails, names, messages, documents, voice transcripts)
  - Business-sensitive content (contracts, legal filings, internal comms)
- **Execution Integrity**
  - Correctness of AI actions
  - Prevention of unauthorized or duplicated side effects
- **Proof & Audit Records**
  - Ledger integrity (non-tampering, non-repudiation)
- **Secrets**
  - API tokens, credentials, encryption keys
- **Customer Trust**
  - Confidentiality of data-in-use
  - Isolation between workflows and tenants

---

### 1.2 Threats We Explicitly Defend Against

#### A. Infrastructure-Level Threats
- Cloud operator or malicious insider access
- Memory scraping or disk inspection
- Cross-tenant data leakage

**Mitigation**
- Confidential VMs (Intel TDX / AMD SEV)
- Encrypted memory and storage
- Per-workflow VM isolation
- Attestation-gated key release

---

#### B. Execution & Integrity Threats
- Tampering with workflow logic after deployment
- Undetected modification of execution outcomes
- Replay or duplicate execution of side effects

**Mitigation**
- Immutable, versioned workflow artifacts
- Deterministic execution model
- Idempotency keys and step invariants
- Append-only proof-of-work ledger with hash chaining

---

#### C. Data Handling & Privacy Threats
- Unauthorized access to PII
- Over-retention of sensitive data
- Leakage through logs or observability systems

**Mitigation**
- PII classification and redaction components
- Evidence hashing instead of raw data storage
- Explicit data retention policies per workflow
- Metrics-only observability by default

---

#### D. Integration & Connector Threats
- Over-scoped API permissions
- Token exfiltration
- Unauthorized outbound communication

**Mitigation**
- Scoped, per-workflow connector credentials
- Token sealing inside confidential VM
- Allowlisted outbound endpoints
- Proof capture of external request IDs (not payloads by default)

---

#### E. AI-Specific Threats
- Hallucinated actions
- Unsafe autonomous decisions
- Prompt injection via external inputs

**Mitigation**
- Policy gates before side-effecting actions
- Human-in-the-loop for high-risk decisions
- Guard components (validation, anomaly detection)
- Structured inputs/outputs (no free-form execution)

---

### 1.3 Threats Explicitly Out of Scope (v1)

AI Rails does **not** attempt to protect against:

- Malicious users with legitimate approval authority
- Incorrect business policy definitions by customers
- Errors in third-party systems after successful API calls
- Nation-state physical attacks on data centers
- Fully offline inference attacks outside our runtime

These are documented assumptions and communicated transparently.


AI Rails becomes the platform enterprises use when AI is allowed to act.
