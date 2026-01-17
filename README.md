# JurisAI CRM

A modern AI-powered legal workflow automation platform built for legal professionals. JurisAI CRM enables law firms and legal departments to design, execute, and monitor intelligent workflows that combine AI analysis with human oversight.

## Overview

JurisAI CRM provides a visual workflow studio where legal professionals can create automated case assessment pipelines, document processing workflows, and client communication flows. The platform emphasizes **human-in-the-loop** design, ensuring AI-generated outputs are always reviewed and approved by qualified attorneys before use.

### Key Features

- **Visual Workflow Editor** - Drag-and-drop workflow designer with React Flow
- **AI-Powered Components** - Legal analysis, document extraction, issue spotting
- **Human Gates** - Approval workflows ensuring attorney oversight of AI outputs
- **Dual Output AI Nodes** - Success/Failure paths for robust error handling
- **California Criminal Defense Workflow** - Pre-built workflow for CA criminal intake
- **Theme System** - Multiple visual themes including Neon Border glassmorphism style

## Technology Stack

### Frontend

- **React 18** with TypeScript
- **Vite** - Build tool and dev server
- **React Flow (@xyflow/react)** - DAG workflow editor
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Accessible component library
- **Lucide React** - Icon library

### Architecture

- Component-based workflow design
- Mock data layer (ready for backend integration)
- CSS variables for theming
- Responsive glassmorphism UI

## Project Structure

```text
jurisai-crm/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── routes/           # Page components (Studio, Dashboard, etc.)
│   │   │   ├── layout/           # App shell, sidebar, header
│   │   │   └── layouts/          # Layout exploration variants
│   │   ├── components/
│   │   │   └── ui/               # shadcn/ui components
│   │   ├── hooks/                # Custom React hooks
│   │   ├── lib/                  # Utilities
│   │   └── mock-data/            # Workflow and component definitions
│   ├── package.json
│   └── vite.config.ts
├── design/                       # Design documents
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/jurisai-crm.git
cd jurisai-crm

# Install frontend dependencies
cd frontend
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Workflows

### Legal Case Assessment (Default)

A general-purpose legal case assessment workflow demonstrating:

- AI fact extraction with citations
- Legal issue spotting with confidence scores
- Human approval gates
- Document generation and review

### California Criminal Defense Intake

A jurisdiction-specific workflow for California criminal defense cases:

- Charge extraction from complaints (PC sections, enhancements)
- Prior record analysis (RAP sheet processing)
- Three Strikes analysis (PC 667/1170.12)
- Prop 47 / Wobbler analysis (PC 1170.18, PC 17(b))
- Constitutional issues (4th/5th/6th Amendment, Miranda)
- Defense strategy memo generation
- Client communication drafting

Access workflows via:

- `/studio` - Default workflow
- `/studio/wf-1` - Legal Case Assessment
- `/studio/ca-criminal-defense-intake` - California Criminal Defense

## Component Library

The platform includes a comprehensive component library organized by category:

| Category            | Components                                                     |
| ------------------- | -------------------------------------------------------------- |
| **Triggers**        | Case Created, Document Uploaded, Manual Start, Scheduled Task  |
| **Legal/Analysis**  | Extract Facts, Spot Issues, Missing Info, Strength Assessment  |
| **Legal/Generation**| Assemble Memo, Client Email Draft, Generate Report             |
| **Flow Control**    | Condition, Switch, Parallel, Merge, Loop                       |
| **Human Gates**     | Human Approval, Review Required, Edit Gate, Task Assignment    |
| **Connectors**      | Email Send, Document Store, Notification, Webhook              |
| **Utilities**       | Set Variable, Transform Data, Delay, Logger                    |
| **Endpoints**       | Success, Error, Awaiting Input                                 |

## AI Node Behavior

AI-powered nodes have dual outputs for robust workflow design:

- **Success** (green) - Passes artifact to next component for further processing
- **Failure** (red) - Passes failure report for error handling

This enables workflows to gracefully handle AI processing failures with proper logging, alerts, and fallback to manual review.

## Edge/Connection Properties

Workflow connections support full customization:

- **Color** - 8 color options (Black, Gray, Blue, Green, Red, Orange, Purple, Cyan)
- **Line Style** - Solid, Dashed, Dotted
- **Arrow Tip** - Arrow, Triangle, None
- **Labels** - Text labels with configurable background color and dashed border

## Themes

The application supports multiple visual themes:

- Slate Professional
- Warm Neutral
- Cool Indigo
- Forest Green
- Minimal Gray

Toggle themes via the theme switcher in the header.

## Development Status

This project is currently in the **wireframe/prototype phase**:

- [x] Visual workflow editor with React Flow
- [x] Component library with drag-and-drop
- [x] Node and edge property panels
- [x] AI node dual outputs (Success/Failure)
- [x] California Criminal Defense workflow
- [x] Theme system with 5 variations
- [ ] Backend API integration
- [ ] Authentication and authorization
- [ ] Real AI model integration
- [ ] Workflow execution engine
- [ ] Deployment and monitoring

## License

[License TBD]

## Contributing

This is currently a private project. Contribution guidelines will be added when the project is open for collaboration.
