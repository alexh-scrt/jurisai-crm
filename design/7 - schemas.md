Below is a careful design + reference implementation outline + documentation for:
	•	Component Manifest v1
	•	UI Schema v1 (server-driven UI)

This is designed to be:
	•	stable enough to build on immediately,
	•	extensible without breaking changes,
	•	not locked to React (React is only the renderer),
	•	safe for multi-tenant/governed execution.

⸻

1) Component Manifest v1

1.1 Purpose

A Component Manifest is the contract that lets Codex:
	•	validate workflow wiring (typed inputs/outputs),
	•	render configuration UIs in the Studio,
	•	render runtime UI in the deployed CRM (via UI Schema),
	•	enforce permissions,
	•	govern and meter AI usage,
	•	version/pin behavior for reproducibility.

1.2 Design principles
	•	Strict versioning: name@version must uniquely identify behavior.
	•	Typed ports: connectors are validated against declared inputs/outputs.
	•	Execution/UI split: a component can have execute logic, UI rendering, or both.
	•	Policy hooks, not policy decisions: manifest declares what’s possible; runtime enforces.
	•	Forward-compatible: support new fields via x-* extension namespace.

⸻

1.3 Manifest JSON structure (v1.0)

Top-level fields

{
  "manifest_version": "1.0",
  "name": "legal.ExtractFactsTimeline",
  "version": "1.0.0",
  "kind": "node",
  "display": { "title": "Extract Facts & Timeline", "icon": "timeline", "category": "Legal/Analysis" },
  "description": "Extracts structured facts and timeline events from case documents.",
  "runtime": { "executor": "python", "entrypoint": "app.components.legal.extract_facts:Component" },
  "ports": { "inputs": [], "outputs": [] },
  "config_schema": { },
  "ui": { },
  "events": { "emits": [], "accepts": [] },
  "permissions": { "execute": [], "render": [] },
  "ai": { "toggles": [] },
  "resources": { "timeouts_ms": 60000, "retries": 1 },
  "compat": { "min_runtime": "0.1.0" },
  "x-meta": { }
}

Field definitions

manifest_version
	•	Literal "1.0" for v1.

name
	•	Global identifier. Recommended format: domain.ComponentName (e.g., legal.ClientEmailDraft).

version
	•	SemVer string. Runtime must support pinning to exact version.

kind
Enum:
	•	page – defines a routeable page (returns UI Schema)
	•	widget – renderable block within a page
	•	node – executable step in workflow (may also render)
	•	gate – node that blocks waiting for approval/human action
	•	automation – headless node (no UI)
	•	connector – integration connector (email/calendar/etc.)

runtime
Describes how to run the component.
	•	executor: python | wasm | container | remote
	•	entrypoint: language-specific address
	•	Optional: image (for container), cmd, env_schema

This prevents lock-in to Python while letting POC be Python.

ports
Typed inputs/outputs.

"ports": {
  "inputs": [
    { "name": "case_id", "type": "core.CaseId", "required": true, "description": "Target case." }
  ],
  "outputs": [
    { "name": "facts_timeline", "type": "legal.FactsTimelineV1" }
  ]
}

Type strings are opaque identifiers resolved via a type registry (simple mapping in v1).

config_schema
JSON Schema for configuration in Studio and at runtime.
	•	Must be JSON Schema Draft 2020-12 compatible subset.
	•	Keep config stable across patch versions.
	•	Include defaults and UI hints via x-ui.

Example:

"config_schema": {
  "type": "object",
  "properties": {
    "top_k_chunks": { "type": "integer", "minimum": 5, "maximum": 50, "default": 20 },
    "jurisdiction": { "type": "string", "default": "CA-ON", "x-ui": { "widget": "select" } }
  },
  "required": ["jurisdiction"]
}

ui
Declares whether and how this component renders.

"ui": {
  "renders": true,
  "renderer": "ui_schema_v1",
  "view": {
    "mode": "page|widget|modal",
    "schema_template": null
  }
}

	•	For v1: components return UI Schema dynamically from backend (render(ctx)).
	•	schema_template can be added later for static UIs.

events
Defines contract for events:
	•	accepts: events component can handle (e.g., event.submit)
	•	emits: events component may produce (result.proposed, result.error)

"events": {
  "accepts": [
    { "name": "event.assess_case_clicked", "payload_schema": { "type": "object", "properties": {} } }
  ],
  "emits": [
    { "name": "result.proposed", "payload_schema": { "type": "object" } }
  ]
}

permissions
RBAC strings (runtime enforces).

"permissions": {
  "render": ["case:read"],
  "execute": ["case:write"]
}

ai
AI governance + metering toggles (explicit).

"ai": {
  "toggles": [
    {
      "id": "extract",
      "label": "AI extraction",
      "default": true,
      "metered": true,
      "policy": { "requires_approval": true },
      "limits": { "max_output_tokens": 1200 }
    }
  ]
}

resources
Runtime hints (non-binding but useful).
	•	timeouts_ms, retries, concurrency_key, memory_mb

compat
	•	min_runtime version for the Codex runtime.

x-*
Extension namespace.
	•	Codex must ignore unknown x-* fields.

⸻

1.4 Reference JSON Schema (Component Manifest v1)

{
  "$id": "codex.component_manifest.v1",
  "type": "object",
  "required": ["manifest_version", "name", "version", "kind", "ports", "config_schema", "events", "permissions", "ui", "runtime"],
  "properties": {
    "manifest_version": { "const": "1.0" },
    "name": { "type": "string", "minLength": 3 },
    "version": { "type": "string", "pattern": "^[0-9]+\\.[0-9]+\\.[0-9]+(-[0-9A-Za-z.-]+)?$" },
    "kind": { "enum": ["page", "widget", "node", "gate", "automation", "connector"] },
    "display": {
      "type": "object",
      "properties": {
        "title": { "type": "string" },
        "icon": { "type": "string" },
        "category": { "type": "string" }
      },
      "additionalProperties": true
    },
    "description": { "type": "string" },
    "runtime": {
      "type": "object",
      "required": ["executor", "entrypoint"],
      "properties": {
        "executor": { "enum": ["python", "wasm", "container", "remote"] },
        "entrypoint": { "type": "string" },
        "image": { "type": "string" }
      },
      "additionalProperties": true
    },
    "ports": {
      "type": "object",
      "required": ["inputs", "outputs"],
      "properties": {
        "inputs": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["name", "type"],
            "properties": {
              "name": { "type": "string" },
              "type": { "type": "string" },
              "required": { "type": "boolean", "default": true },
              "description": { "type": "string" }
            },
            "additionalProperties": false
          }
        },
        "outputs": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["name", "type"],
            "properties": {
              "name": { "type": "string" },
              "type": { "type": "string" },
              "description": { "type": "string" }
            },
            "additionalProperties": false
          }
        }
      },
      "additionalProperties": false
    },
    "config_schema": { "type": "object" },
    "ui": {
      "type": "object",
      "required": ["renders", "renderer"],
      "properties": {
        "renders": { "type": "boolean" },
        "renderer": { "const": "ui_schema_v1" },
        "view": { "type": "object", "additionalProperties": true }
      },
      "additionalProperties": true
    },
    "events": {
      "type": "object",
      "required": ["accepts", "emits"],
      "properties": {
        "accepts": { "type": "array", "items": { "type": "object" } },
        "emits": { "type": "array", "items": { "type": "object" } }
      },
      "additionalProperties": false
    },
    "permissions": {
      "type": "object",
      "required": ["render", "execute"],
      "properties": {
        "render": { "type": "array", "items": { "type": "string" } },
        "execute": { "type": "array", "items": { "type": "string" } }
      },
      "additionalProperties": false
    },
    "ai": {
      "type": "object",
      "properties": {
        "toggles": { "type": "array", "items": { "type": "object" } }
      },
      "additionalProperties": true
    },
    "resources": { "type": "object", "additionalProperties": true },
    "compat": { "type": "object", "additionalProperties": true }
  },
  "additionalProperties": true
}


⸻

1.5 Reference TypeScript type (frontend/studio)

export type ComponentKind = "page" | "widget" | "node" | "gate" | "automation" | "connector";

export interface PortDef {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
}

export interface ComponentManifestV1 {
  manifest_version: "1.0";
  name: string;
  version: string;
  kind: ComponentKind;
  display?: { title?: string; icon?: string; category?: string; [k: string]: any };
  description?: string;

  runtime: { executor: "python" | "wasm" | "container" | "remote"; entrypoint: string; image?: string; [k: string]: any };

  ports: { inputs: PortDef[]; outputs: PortDef[] };

  config_schema: Record<string, any>;

  ui: { renders: boolean; renderer: "ui_schema_v1"; view?: Record<string, any>; [k: string]: any };

  events: { accepts: any[]; emits: any[] };

  permissions: { render: string[]; execute: string[] };

  ai?: { toggles?: any[]; [k: string]: any };

  resources?: Record<string, any>;
  compat?: Record<string, any>;

  [k: `x-${string}`]: any;
}


⸻

2) UI Schema v1 (Server-driven UI)

2.1 Purpose

UI Schema is a backend-produced JSON tree rendered by a stable frontend shell. It enables:
	•	workflow-defined applications,
	•	rich widgets without per-tenant builds,
	•	safe multi-tenant UI (no arbitrary JS),
	•	guided UX (“what to do next”).

2.2 Design principles
	•	Discriminated unions via type.
	•	Data binding via safe expressions ($ref pointers).
	•	Event-driven actions: UI emits workflow events (no hidden side-effects).
	•	Composable layout: small set of layout containers + rich widgets.
	•	Versioned schema: ui_schema_version: "1.0".

⸻

2.3 Core schema envelope

{
  "ui_schema_version": "1.0",
  "page_id": "case_workspace",
  "title": "Case Workspace",
  "data": { },
  "root": { "type": "Page", "children": [] }
}

	•	data is optional “view model” payload (or you can fetch data separately). For speed, return data inline in POC.

⸻

2.4 Data binding model

Binding references

Use a restricted JSON Pointer-like referencing:
	•	{"$ref": "#/data/case/title"}
	•	{"$ref": "#/data/documents"}

No code execution, no arbitrary expressions in v1.

Action payload templating

Allow payload fields to embed $ref:

{
  "id": "approve",
  "label": "Approve",
  "event": "event.approve_artifact",
  "payload": { "artifact_id": { "$ref": "#/data/selectedArtifactId" } }
}

Frontend resolves $ref into concrete values.

⸻

2.5 Widget set (v1)

Layout containers
	•	Page
	•	Row
	•	Column
	•	Grid
	•	Tabs
	•	Split (left/right or top/bottom)
	•	Card
	•	Section

Content widgets
	•	Text
	•	Markdown
	•	Badge
	•	Divider
	•	Spacer

Data widgets
	•	Table
	•	Form
	•	Timeline
	•	Queue (task/approval list)

Domain-necessary rich widgets (POC “wow”)
	•	DocViewer (PDF.js embed target)
	•	RichTextEditor (TipTap target)
	•	Chat (copilot)
	•	CitationList (clickable source links)
	•	Progress (pipeline progress for Assess Case)

Actions
	•	ActionBar
	•	Button (usually nested in ActionBar)

⸻

2.6 UI Schema reference TypeScript types (renderer)

export type Ref = { $ref: string };

export type UISchemaV1 = {
  ui_schema_version: "1.0";
  page_id: string;
  title?: string;
  data?: any;
  root: UINode;
};

export type UINode =
  | PageNode | RowNode | ColumnNode | GridNode | TabsNode | SplitNode | CardNode | SectionNode
  | TextNode | MarkdownNode | BadgeNode | DividerNode | SpacerNode
  | TableNode | FormNode | TimelineNode | QueueNode
  | DocViewerNode | RichTextEditorNode | ChatNode | CitationListNode | ProgressNode
  | ActionBarNode;

interface BaseNode {
  id?: string;
  type: string;
  visible_if?: { $ref: string } | { not?: any; and?: any[]; or?: any[] }; // minimal boolean ops allowed
}

export interface PageNode extends BaseNode {
  type: "Page";
  children: UINode[];
}

export interface TabsNode extends BaseNode {
  type: "Tabs";
  tabs: { id: string; title: string; content: UINode }[];
}

export interface TableNode extends BaseNode {
  type: "Table";
  rows: Ref | any[];
  columns: { key: string; title: string; cell?: { type: "Text" | "Badge" | "Markdown"; value: Ref | any } }[];
  on_row_click?: { event: string; payload?: Record<string, any> };
}

export interface DocViewerNode extends BaseNode {
  type: "DocViewer";
  document_url: Ref | string;
  highlights?: Ref | any[];
}

export interface ActionBarNode extends BaseNode {
  type: "ActionBar";
  actions: { id: string; label: string; event: string; payload?: Record<string, any>; style?: "primary"|"secondary"|"danger" }[];
}


⸻

2.7 Reference JSON Schema (UI Schema v1)

This is a minimal validator approach: validate envelope + node shapes by type. In implementation, use a discriminated union (Pydantic/TS) rather than an enormous JSON Schema. Still, Codex can keep a JSON Schema for quick validation.

{
  "$id": "codex.ui_schema.v1",
  "type": "object",
  "required": ["ui_schema_version", "page_id", "root"],
  "properties": {
    "ui_schema_version": { "const": "1.0" },
    "page_id": { "type": "string" },
    "title": { "type": "string" },
    "data": { "type": "object" },
    "root": { "$ref": "#/$defs/node" }
  },
  "$defs": {
    "node": {
      "type": "object",
      "required": ["type"],
      "properties": {
        "id": { "type": "string" },
        "type": { "type": "string" }
      },
      "additionalProperties": true
    }
  },
  "additionalProperties": false
}

(Use Pydantic/TS discriminated union checks for strictness.)

⸻

2.8 Backend reference Pydantic models (core pattern)

from pydantic import BaseModel, Field
from typing import Any, List, Literal, Optional, Union, Dict

class Ref(BaseModel):
    ref: str = Field(alias="$ref")

class BaseNode(BaseModel):
    id: Optional[str] = None
    type: str

class PageNode(BaseNode):
    type: Literal["Page"]
    children: List["UINode"]

class Action(BaseModel):
    id: str
    label: str
    event: str
    payload: Optional[Dict[str, Any]] = None
    style: Optional[Literal["primary","secondary","danger"]] = None

class ActionBarNode(BaseNode):
    type: Literal["ActionBar"]
    actions: List[Action]

UINode = Union[PageNode, ActionBarNode]  # extend with other nodes

class UISchemaV1(BaseModel):
    ui_schema_version: Literal["1.0"]
    page_id: str
    title: Optional[str] = None
    data: Optional[Dict[str, Any]] = None
    root: UINode


⸻

2.9 Example: Case Workspace UI Schema (demo-ready)

{
  "ui_schema_version": "1.0",
  "page_id": "case_workspace",
  "title": "Case Workspace",
  "data": {
    "case": { "id": "c_123", "title": "Smith v. Doe", "status": "Active" },
    "documents": [
      { "id": "d1", "name": "Demand Letter.pdf", "version_id": "v1" },
      { "id": "d2", "name": "Contract.docx", "version_id": "v1" }
    ],
    "assess": {
      "status": "idle",
      "proposed_artifacts": []
    }
  },
  "root": {
    "type": "Page",
    "children": [
      {
        "type": "ActionBar",
        "actions": [
          { "id": "assess", "label": "Assess Case", "event": "event.assess_case_clicked", "style": "primary" }
        ]
      },
      {
        "type": "Tabs",
        "tabs": [
          {
            "id": "overview",
            "title": "Overview",
            "content": {
              "type": "Card",
              "children": [
                { "type": "Text", "value": { "$ref": "#/data/case/title" } },
                { "type": "Badge", "value": { "$ref": "#/data/case/status" } }
              ]
            }
          },
          {
            "id": "documents",
            "title": "Documents",
            "content": {
              "type": "Table",
              "rows": { "$ref": "#/data/documents" },
              "columns": [
                { "key": "name", "title": "Name", "cell": { "type": "Text", "value": { "$ref": "#/row/name" } } }
              ],
              "on_row_click": { "event": "event.select_document", "payload": { "doc_id": { "$ref": "#/row/id" } } }
            }
          },
          {
            "id": "copilot",
            "title": "Copilot",
            "content": { "type": "Chat", "context": { "case_id": { "$ref": "#/data/case/id" } } }
          }
        ]
      }
    ]
  }
}

Notes:
	•	#/row/... is a renderer-provided ephemeral context for table rows (safe, not arbitrary).
	•	Chat is a widget that calls /copilot/query.

⸻

3) Implementation tasks (Codex-ready)

3.1 Backend
	1.	Add schemas/component_manifest_v1.json and schemas/ui_schema_v1.json.
	2.	Implement components/manifest_loader.py:
	•	load JSON/YAML manifests from component pack directories,
	•	validate against schema,
	•	store in registry keyed by name@version.
	3.	Implement ui_schema/models.py (Pydantic discriminated union).
	4.	Implement UI Schema validation in GET /workflow_instances/{id}/ui:
	•	component returns schema + data,
	•	validate before returning to client (fail fast).
	5.	Add a simple “type registry”:
	•	map core.CaseId, legal.FactsTimelineV1, etc. to validators (Pydantic models).

3.2 Frontend
	1.	Add TS types for UI Schema nodes.
	2.	Implement resolveRef(ref: string, ctx: object):
	•	supports #/data/... and #/row/....
	3.	Implement renderer mapping type -> React component.
	4.	Implement action dispatcher:
	•	sends {event, payload} to runtime,
	•	re-fetch UI schema.
	5.	Add renderer tests:
	•	snapshot: given schema renders expected elements,
	•	ref resolution tests.

⸻

4) Non-lock-in guardrails (must enforce now)
	•	UI schema supports only declarative constructs; no custom JS.
	•	Binding is $ref only; no arbitrary expressions in v1.
	•	Component runtime is declared, not assumed (executor interface).
	•	Unknown x-* fields are ignored, not rejected.
	•	Type names are opaque strings resolved by registry to avoid binding to any single language.

⸻

5) What Codex should produce as “documentation artifacts”
	1.	docs/component-manifest-v1.md
	•	field definitions, examples, versioning rules, compatibility policy.
	2.	docs/ui-schema-v1.md
	•	node catalog, binding rules, event rules, renderer requirements.
	3.	schemas/component_manifest_v1.json
	4.	schemas/ui_schema_v1.json
	5.	Example pack in component_packs/legal_v1/components/ with 2–3 manifests:
	•	ui.CaseWorkspacePage@1.0.0
	•	workflow.HumanApprovalGate@1.0.0
	•	legal.AssessCaseOrchestrator@1.0.0
