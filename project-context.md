# Agent Studio — Project Context

## Overview

Agent Studio is a Next.js MVP web app (desktop-first, responsive) that turns scattered agent instruction files (CLAUDE.md, .cursorrules, .claude/skills/*, docs/*) into a Git-native Agent Playbook. Users can review generated outputs for Claude Code, Cursor, and Windsurf, edit Rules, view Plan and Behavior Diff, and export generated files or a reviewable patch.

## Tech Stack

- **Framework:** Next.js (App Router), React
- **UI:** Tailwind CSS v4, shadcn/ui (Button, Tabs)
- **Language:** TypeScript
- **Testing:** Vitest (unit + source-string), Playwright (E2E)
- **Linting:** ESLint
- **Package manager:** pnpm
- **Key dependencies:** js-yaml, jszip, zod (schema validation)

## Directory Structure

```
src/
├── app/                       # Next.js pages (layout, home)
├── components/
│   ├── export/                # Export feedback: toast, useExportFeedback
│   ├── ui/                    # shadcn/ui primitives (Button, Tabs)
│   └── workbench/             # Main UI: AgentStudioWorkbench, panels, editors
├── lib/
│   ├── export/                # Export domain: YAML serialization, ZIP bundle, diff/patch, provenance, download
│   ├── playbook/              # Playbook domain: Zod schema, draft generator, rule validation
│   ├── review/                # Review domain: Plan, Behavior Diff, Export Readiness
│   ├── sample-repo/           # Demo fixtures + config file scanner
│   └── translators/           # Tool translators: Claude Code, Cursor, Windsurf
└── ... (errors, result, utils)
```

## Architecture Patterns

### State Derivation (useMemo)
All review surfaces (Plan, Behavior Diff, Export Readiness) are derived via `useMemo` from the canonical `playbook` state. No mutable state for computed data.

### Pure Domain Modules
Business logic lives in `src/lib/` as pure functions with no React dependencies. Each domain module has a corresponding `.test.ts` file.

### Red-Green-Refactor
All domain modules implemented TDD-style: write failing test first, implement minimal code, then refactor.

### Export Pipeline
1. `serializePlaybookToYaml` — playbook → YAML string
2. `generateExportBundle` — playbook + translator artifacts → ZIP (ArrayBuffer)
3. `generatePatchArchive` — playbook + artifact pairs → ZIP with agent-studio.patch
4. `downloadBlob` — Blob → browser file download
5. `ExportToast` — accessible success/error feedback with aria-live

### Data Flow
- Sample Repo fixtures → scanner → detected files
- detected files → generatePlaybookDraft → AgentPlaybook
- AgentPlaybook → TRANSLATORS.map(t.translate) → TranslatorResult[]
- AgentPlaybook + initialRules → generateBehaviorDiff → BehaviorDiffItem[]
- AgentPlaybook + TRANSLATOR results → generatePlan → PlanChange[]

### Key Types
- `AgentPlaybook` (Zod-validated) — canonical playbook with skills, agents, rules, context, translators
- `GeneratedArtifact` — `{ path, content, kind: "added" | "modified" }`
- `TranslatorModule` — `{ id, label, translate(playbook): TranslatorResult }`
- `ArtifactPair` — `{ path, before, after }` for diff generation

## Test Strategy
- **Unit tests** for all lib/ modules (Vitest)
- **Source-string tests** for component contracts (readFileSync + toContain assertions)
- **Component tests** for export feedback (Vitest + jsdom + @testing-library/react)
- **E2E tests** for critical user flow (Playwright)

## Configuration
- `vitest.config.ts` — test config with path alias
- `vitest.setup.ts` — jest-dom matchers
- `playwright.config.ts` — E2E config
- `tsconfig.json` — path alias `@/` → `src/`
- `eslint.config.mjs` — ESLint flat config

## Known Deferred Items
See `_bmad-output/implementation-artifacts/deferred-work.md` for ~30+ items (low priority, mostly theoretical edge cases and UX polish).

## Build & Test Commands
```bash
pnpm dev          # Start dev server
pnpm test         # Run unit tests
pnpm test:e2e     # Run Playwright E2E tests
pnpm typecheck    # TypeScript check
pnpm lint         # ESLint
pnpm build        # Production build
```

## Current Status
All 4 epics, 20 stories complete. MVP is feature-complete.
