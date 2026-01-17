UI Schema v1 node catalog (complete enumerated spec)

This defines every node type Codex must implement for the 3-month MVP, including: required/optional fields, data binding rules, renderer behavior, and event behavior. It is intentionally domain-agnostic; the Legal Pack uses these nodes to render its experiences.

⸻

0) Common concepts

0.1 Envelope

Every UI response is:

{
  "ui_schema_version": "1.0",
  "page_id": "string",
  "title": "string?",
  "data": { },
  "root": { "type": "Page", "children": [] }
}

Required
	•	ui_schema_version = "1.0"
	•	page_id (stable identifier for routing/analytics)
	•	root

Optional
	•	title
	•	data (view model; recommended for POC)

⸻

0.2 BaseNode (applies to all nodes)

All nodes share these fields:

Required
	•	type: string (discriminator)

Optional
	•	id: string (stable DOM key, automation hooks)
	•	test_id: string (E2E selectors)
	•	visible_if: Condition (default visible)
	•	disabled_if: Condition
	•	help: HelpBlock (inline tooltip/help)
	•	meta: object (ignored by renderer; for analytics/extensions)

Condition (v1)

Keep minimal and safe:

{ "$ref": "#/data/path/to/bool" }

and boolean ops:

{ "and": [Condition, ...] }
{ "or": [Condition, ...] }
{ "not": Condition }


⸻

0.3 Data binding: Ref

A Ref is:

{ "$ref": "#/data/..." }

Supported pointer roots
	•	#/data/... (envelope data)
	•	#/row/... (table row context)
	•	#/item/... (list context, e.g., Queue items)
	•	#/selection/... (renderer-managed selection context; optional in v1)

If a ref can’t be resolved:
	•	renderer shows placeholder (“—”) and logs console warning.

⸻

0.4 Events and actions

All user actions emit an event to the workflow runtime:

{ "event": "event.name", "payload": { ... } }

Payload values may include Ref. Renderer resolves refs at click time.

Renderer behavior:
	•	POST event to /api/workflow_instances/{id}/event
	•	After success, refetch /ui
	•	Show loading state while pending
	•	If API error: show toast and do not mutate local state

⸻

1) Layout nodes

1.1 Page

Top-level container.

Required
	•	type: "Page"
	•	children: UINode[]

Optional
	•	header: Header?
	•	footer: Footer?

Renderer behavior
	•	Establishes page scope
	•	Renders header, then children, then footer

⸻

1.2 Row

Horizontal layout.

Required
	•	type: "Row"
	•	children: UINode[]

Optional
	•	gap: number (px or semantic scale like 1–6)
	•	align: "start"|"center"|"end"|"stretch"
	•	wrap: boolean (default true)

Renderer behavior
	•	Flex row container

⸻

1.3 Column

Vertical layout.

Required
	•	type: "Column"
	•	children: UINode[]

Optional
	•	gap
	•	align
	•	grow: boolean (default true)

Renderer behavior
	•	Flex column container

⸻

1.4 Grid

Multi-column grid.

Required
	•	type: "Grid"
	•	columns: number (1–12)
	•	children: UINode[]

Optional
	•	gap
	•	responsive: { sm?: number; md?: number; lg?: number }

Renderer behavior
	•	CSS grid with responsive column count

⸻

1.5 Split

Resizable or fixed split panel.

Required
	•	type: "Split"
	•	direction: "horizontal"|"vertical"
	•	first: UINode
	•	second: UINode

Optional
	•	ratio: number (0.1–0.9, default 0.5)
	•	resizable: boolean (default false in v1)
	•	gap

Renderer behavior
	•	Two-pane layout, optionally resizable later

⸻

1.6 Tabs

Tabbed container.

Required
	•	type: "Tabs"
	•	tabs: { id: string; title: string; content: UINode }[]

Optional
	•	default_tab_id: string
	•	persist_key: string (store selected tab in local storage)
	•	actions: Action[] (tab-level actions)

Renderer behavior
	•	Render tab headers and active tab content
	•	If persist_key, remember last selected tab

⸻

1.7 Card

Card-style container.

Required
	•	type: "Card"
	•	children: UINode[]

Optional
	•	title: string|Ref
	•	subtitle: string|Ref
	•	actions: Action[]
	•	variant: "default"|"outlined"|"warning"|"success"

Renderer behavior
	•	Visual card with optional header and actions

⸻

1.8 Section

Semantic grouping.

Required
	•	type: "Section"
	•	title: string|Ref
	•	children: UINode[]

Optional
	•	collapsed: boolean (default false)
	•	collapsible: boolean (default true)

Renderer behavior
	•	Renders heading and content; supports collapse

⸻

2) Content nodes

2.1 Text

Plain text.

Required
	•	type: "Text"
	•	value: string|Ref

Optional
	•	style: "muted"|"normal"|"strong"
	•	size: "sm"|"md"|"lg"|"xl"
	•	mono: boolean

Renderer behavior
	•	Resolve ref and render text

⸻

2.2 Markdown

Markdown content (sanitized).

Required
	•	type: "Markdown"
	•	value: string|Ref

Optional
	•	truncate: number (max chars before “Read more”)

Renderer behavior
	•	Render markdown with XSS-safe sanitizer
	•	No raw HTML allowed

⸻

2.3 Badge

Status indicator.

Required
	•	type: "Badge"
	•	value: string|Ref

Optional
	•	variant: "default"|"info"|"warning"|"success"|"danger"

Renderer behavior
	•	Render pill badge

⸻

2.4 Divider

Horizontal divider.

Required
	•	type: "Divider"

Optional
	•	label: string|Ref

⸻

2.5 Spacer

Adds space.

Required
	•	type: "Spacer"

Optional
	•	size: number (semantic scale 1–8)

⸻

2.6 GuidanceBlock

User guidance (“what to do next”).

Required
	•	type: "GuidanceBlock"
	•	title: string|Ref
	•	text: string|Ref

Optional
	•	variant: "info"|"tip"|"warning"
	•	actions: Action[]
	•	dismiss_key: string (persist dismiss)

Renderer behavior
	•	Render callout with actions
	•	If dismiss_key provided, allow dismiss and remember

⸻

3) Action nodes

3.1 ActionBar

Buttons cluster.

Required
	•	type: "ActionBar"
	•	actions: Action[]

Optional
	•	align: "left"|"right"|"between"
	•	sticky: boolean (default false)

Renderer behavior
	•	Render buttons; disabled/loading states
	•	For each action: resolve payload refs on click, emit event

Action object

Required
	•	id: string
	•	label: string
	•	event: string

Optional
	•	payload: object
	•	style: "primary"|"secondary"|"danger"|"ghost"
	•	confirm: { title: string; text: string } (confirmation dialog)
	•	disabled_if: Condition
	•	visible_if: Condition
	•	icon: string

⸻

4) Data display and interaction nodes

4.1 Table

Tabular list.

Required
	•	type: "Table"
	•	rows: Ref | object[]
	•	columns: ColumnDef[]

Optional
	•	row_key: string (default "id")
	•	on_row_click: { event: string; payload?: object }
	•	empty: { title: string; text?: string; actions?: Action[] }
	•	pagination: { enabled: boolean; page_size: number } (client-side for POC)
	•	filters: FilterDef[] (client-side for POC)

ColumnDef

Required
	•	key: string
	•	title: string

Optional
	•	cell: CellSpec (default renders row[key] as text)
	•	width: string
	•	align: "left"|"right"|"center"

CellSpec
	•	{ "type": "Text"|"Badge"|"Markdown", "value": Ref|string }

Renderer behavior
	•	For each row, create #/row/* context
	•	If on_row_click, clicking emits event with payload resolved with #/row/...

⸻

4.2 Form

Structured input (minimal v1).

Required
	•	type: "Form"
	•	fields: FieldDef[]
	•	submit: { label: string; event: string; payload?: object }

Optional
	•	title: string|Ref
	•	initial: Ref|object (initial values)
	•	validate: "none"|"required_only" (v1)
	•	cancel?: { label: string; event: string }

FieldDef

Required
	•	id: string
	•	label: string
	•	field_type: "text"|"textarea"|"select"|"date"|"checkbox"|"number"
	•	name: string (key in form values)

Optional
	•	required: boolean
	•	options: { label: string; value: any }[] (for select)
	•	placeholder: string
	•	help: string
	•	default: any

Renderer behavior
	•	Maintain local form state
	•	On submit:
	•	Build payload:
	•	merge submit.payload + { form: values }
	•	resolve any refs
	•	Emit submit event

⸻

4.3 Timeline

Chronological events.

Required
	•	type: "Timeline"
	•	items: Ref | TimelineItem[]

Optional
	•	empty: { title: string; text?: string }
	•	on_item_click?: { event: string; payload?: object }

TimelineItem

Required
	•	id: string
	•	title: string|Ref

Optional
	•	date: string|Ref (ISO date/time)
	•	subtitle: string|Ref
	•	body: string|Ref (markdown allowed via separate Markdown node if desired)
	•	badges: (string|Ref)[]
	•	citations: Citation[]

Renderer behavior
	•	Renders vertical timeline
	•	If citations present, render via CitationList semantics (see below)

⸻

4.4 Queue

Task/approval queue list.

Required
	•	type: "Queue"
	•	items: Ref | QueueItem[]

Optional
	•	title: string|Ref
	•	empty: { title: string; text?: string; actions?: Action[] }
	•	on_select?: { event: string; payload?: object }

QueueItem

Required
	•	id: string
	•	title: string|Ref

Optional
	•	status: string|Ref
	•	priority: "low"|"medium"|"high"|string
	•	meta: object
	•	actions: Action[] (inline item actions)
	•	citations: Citation[]

Renderer behavior
	•	Set #/item/... context when rendering each item action payload

⸻

5) Rich “wow” widgets

5.1 DocViewer

Document viewing/preview.

Required
	•	type: "DocViewer"
	•	document_url: string|Ref

Optional
	•	title: string|Ref
	•	highlights: Highlight[]|Ref
	•	selected_page: number|Ref
	•	on_selection?: { event: string; payload?: object } (future; can omit in POC)

Highlight
	•	page?: number
	•	text?: string
	•	bbox?: [number, number, number, number] (future)
	•	color?: string (renderer may ignore)

Renderer behavior
	•	Render PDF via PDF.js
	•	If highlights, show list and optionally jump to page (POC: jump only)
	•	Clicking a highlight sets page and scrolls (best-effort)

⸻

5.2 RichTextEditor

Draft editing (memo/email).

Required
	•	type: "RichTextEditor"
	•	doc: Ref | string (content string; for POC use Markdown or HTML string)
	•	on_change: { event: string; payload?: object }

Optional
	•	title: string|Ref
	•	read_only: boolean (default false)
	•	citations: Citation[]|Ref (side panel)
	•	toolbar: { bold?: boolean; italic?: boolean; headings?: boolean; lists?: boolean } (v1 minimal)

Renderer behavior
	•	Render TipTap (or equivalent)
	•	Debounced change emits on_change event with payload merged with { content: <current> }
	•	Do not emit on every keystroke (debounce 500–1000ms)

⸻

5.3 Chat

Copilot chat panel.

Required
	•	type: "Chat"
	•	query_event: string (event emitted on send)
	•	messages: Ref | ChatMessage[]

Optional
	•	placeholder: string
	•	suggestions: string[]
	•	context: object (case_id, doc_id, etc.)
	•	citations: Citation[]|Ref (for latest assistant message; optional)

ChatMessage
	•	id: string
	•	role: "user"|"assistant"|"system"
	•	content: string
	•	citations?: Citation[]

Renderer behavior
	•	Maintain input box
	•	On send:
	•	emit query_event with payload { text: input, ...context }
	•	Render messages; citations clickable (open doc viewer if possible)

⸻

5.4 CitationList

Clickable citations.

Required
	•	type: "CitationList"
	•	citations: Ref | Citation[]

Citation

Required
	•	id: string
	•	doc_id: string
	•	version_id: string
	•	chunk_id: string
	•	snippet: string

Optional
	•	score: number
	•	page: number
	•	label: string

Renderer behavior
	•	Render list with snippet preview
	•	Clicking emits optional global event if provided or uses a default behavior:
	•	if schema includes on_click, emit it with citation info
	•	else call a renderer hook to open document viewer to that doc/version (best-effort)

⸻

5.5 Progress

Pipeline progress (Assess Case).

Required
	•	type: "Progress"
	•	steps: ProgressStep[] | Ref

ProgressStep

Required
	•	id: string
	•	label: string
	•	status: "pending"|"running"|"done"|"error"

Optional
	•	detail: string|Ref

Renderer behavior
	•	Display progress indicator; update as /ui updates during run

⸻

6) Node types “necessary + legal pack” mapping

The UI nodes above are the only UI building blocks. The Legal Pack is implemented as components that output:
	•	artifacts (facts/issues/checklist/assessment/memo/email),
	•	citations,
	•	and UI schemas using these nodes.

Below is the Legal Component Pack v1 spec (complete, POC-ready).

⸻

Legal Component Pack v1 (complete spec)

Legal Pack goals (v1)
	•	Produce structured case understanding with citations.
	•	Require approval before persistence of substantive outputs.
	•	Generate memo + client email drafts with provenance.

Shared Legal Types (type registry entries)
	•	legal.FactsTimelineV1
	•	legal.IssuesV1
	•	legal.ChecklistV1
	•	legal.AssessmentV1
	•	legal.MemoDraftV1
	•	legal.EmailDraftV1
	•	core.CaseId
	•	core.DocumentId
	•	core.ArtifactId
	•	core.CitationV1

Shared component behavior rules
	•	Every AI component must:
	•	write ai.invocation and ai.result ledger entries
	•	attach citations or mark statements as assumptions
	•	produce PROPOSED artifacts
	•	be schema-validated
	•	Persistence of PROPOSED → APPROVED requires workflow.HumanApprovalGate

⸻

1) ui.CaseWorkspacePage@1.0.0 (page)

Purpose

Primary “app” page: shows case overview, docs, proposed/approved artifacts, copilot, audit.

Inputs
	•	case_id: core.CaseId

Outputs
	•	none (page)

UI Schema behavior

Renders Tabs with:
	•	Overview (Text/Badge, GuidanceBlock)
	•	Documents (Table + DocViewer)
	•	Assess (Progress + Cards for artifacts + Approve/Reject ActionBars)
	•	Drafts (Queue + RichTextEditor)
	•	Copilot (Chat)
	•	Audit (Table/Queue of ledger entries)

Events accepted
	•	event.assess_case_clicked
	•	event.select_document (updates selected doc in runtime state)
	•	event.approve_artifact
	•	event.reject_artifact
	•	event.open_artifact
	•	event.save_draft (from editor on_change)
	•	event.send_email (outbox send)
	•	event.copilot_query

⸻

2) workflow.HumanApprovalGate@1.0.0 (gate)

Purpose

Pause workflow until human decision.

Inputs
	•	artifact_ids: core.ArtifactId[]
	•	reason: string (e.g., “Approve assessment artifacts”)

Outputs
	•	decision: "approved"|"rejected"
	•	approved_artifact_ids: core.ArtifactId[]

Runtime behavior
	•	Set instance WAITING_APPROVAL
	•	Emit ledger:
	•	workflow.waiting_approval
	•	On approve:
	•	mark artifacts APPROVED, persist to case state
	•	ledger artifact.approved + data.mutation
	•	On reject:
	•	mark REJECTED
	•	ledger artifact.rejected

⸻

3) legal.AssessCaseOrchestrator@1.0.0 (node)

Purpose

Run the wow pipeline sequentially and update progress.

Steps executed
	1.	ExtractFactsTimeline
	2.	SpotIssues
	3.	MissingInfoChecklist
	4.	StrengthCompletenessAssessment
	5.	Create memo draft (optional in Sprint 5; otherwise Sprint 6)

Inputs
	•	case_id: core.CaseId

Outputs
	•	artifact_ids: core.ArtifactId[] (all proposed outputs)

UI behavior
	•	Updates Progress node steps in /ui via instance state.

Dependencies
	•	Retrieval service + citation pack
	•	AI service + schema validators
	•	Artifact store

⸻

4) legal.ExtractFactsTimeline@1.0.0 (node)

Inputs
	•	case_id: core.CaseId

Outputs
	•	facts_timeline: legal.FactsTimelineV1
	•	also creates artifact facts_timeline in PROPOSED

Required output structure (minimum)
	•	facts[]: { id, statement, citations[]|assumption }
	•	events[]: { id, date?, title, details?, citations[]|assumption }

UI expectation

Rendered via Timeline + CitationList.

⸻

5) legal.SpotIssues@1.0.0 (node)

Inputs
	•	case_id

Outputs
	•	artifact issues PROPOSED

Required output structure
	•	issues[]: { id, title, description?, confidence, needs_confirmation, citations[], missing_info[] }

UI expectation

Rendered as Queue (issues) + per-item ActionBar (“Confirm”, “Flag”, etc. optional).

⸻

6) legal.MissingInfoChecklist@1.0.0 (node)

Inputs
	•	case_id

Outputs
	•	artifact checklist PROPOSED

Required output structure
	•	items[]: { id, title, rationale, priority, requested_from_client: boolean, citations? }

UI expectation

Rendered as Queue with action:
	•	“Create tasks from checklist” (event)

⸻

7) legal.StrengthCompletenessAssessment@1.0.0 (node)

Inputs
	•	case_id

Outputs
	•	artifact assessment PROPOSED

Required output structure
	•	strengths[], weaknesses[], open_questions[]
	•	each item: { id, text, citations[] | is_assumption }
	•	plus optional risk_rating: "low"|"medium"|"high"

UI expectation

Rendered as Sections with lists + citations.

⸻

8) legal.AssembleAssessmentMemo@1.0.0 (node) — Sprint 6

Inputs
	•	case_id
	•	approved_artifact_ids[] (facts/issues/checklist/assessment)

Outputs
	•	artifact memo_draft PROPOSED with content

Required output structure
	•	content: string (markdown ok for POC)
	•	citations[] (global list; inline references optional)

UI expectation

Rendered in RichTextEditor + CitationList side panel.

⸻

9) legal.ClientEmailDraft@1.0.0 (node) — Sprint 6

Inputs
	•	case_id
	•	checklist_artifact_id (approved recommended)

Outputs
	•	artifact email_draft PROPOSED:
	•	subject
	•	body
	•	requested_items[] (from checklist)
	•	citations optional

UI expectation

Rendered with RichTextEditor (body) + simple Form field for subject, and ActionBar: Save/Approve/Send.

⸻

10) Optional connectors (stub for POC)
	•	connector.OutboxEmail@1.0.0
	•	writes comms.sent ledger event and stores a sent record
	•	real SMTP deferred

⸻

Renderer behavior summary (must-haves)
	1.	Strict type dispatch: unknown node type must render a clear “Unsupported node” placeholder (not crash).
	2.	Ref resolution: support #/data, #/row, #/item contexts.
	3.	Event dispatch: all actions POST event, then refetch UI.
	4.	Loading states: ActionBar buttons show spinner/disabled while pending.
	5.	Security: renderer never executes code from schema.
	6.	Consistency: citations are always clickable and lead to document context if possible.

⸻

Minimum node implementation order (for Sprint 1–3)

Implement in this order to unblock work:
	1.	Page, Column, Row, Card, Tabs
	2.	Text, Badge, Markdown, Divider, GuidanceBlock, ActionBar
	3.	Table (with #/row), DocViewer
	4.	Queue, Timeline, Progress
	5.	Chat, CitationList
	6.	Form, RichTextEditor

