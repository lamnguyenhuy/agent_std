---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - "_bmad-output/planning-artifacts/briefs/brief-agent_std-2026-06-09/brief.md"
  - "_bmad-output/planning-artifacts/prds/prd-agent_std-2026-06-09/prd.md"
  - "_bmad-output/planning-artifacts/ux-designs/ux-agent_std-2026-06-09/DESIGN.md"
  - "_bmad-output/planning-artifacts/ux-designs/ux-agent_std-2026-06-09/EXPERIENCE.md"
workflowType: 'architecture'
project_name: 'agent_std'
user_name: 'Lamnh'
date: '2026-06-09'
lastStep: 8
status: 'complete'
completedAt: '2026-06-09'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Initialization

**Documents loaded:**

- Product Brief: `_bmad-output/planning-artifacts/briefs/brief-agent_std-2026-06-09/brief.md`
- PRD: `_bmad-output/planning-artifacts/prds/prd-agent_std-2026-06-09/prd.md`
- UX DESIGN: `_bmad-output/planning-artifacts/ux-designs/ux-agent_std-2026-06-09/DESIGN.md`
- UX EXPERIENCE: `_bmad-output/planning-artifacts/ux-designs/ux-agent_std-2026-06-09/EXPERIENCE.md`

**Input summary:** Agent Studio MVP is a narrow, desktop-first web demo for a controlled React/Next.js sample repo. It imports scattered agent configs, generates a Git-native Agent Playbook, edits Rules only, previews Claude Code/Cursor/Windsurf translator outputs, shows Plan and Behavior Diff, and exports reviewable patch/generated files without GitHub OAuth or arbitrary repo access.

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

The MVP has 18 functional requirements grouped into 6 architecture-relevant areas:

1. **Sample Repo Demo Workspace** (`FR-1` to `FR-2`)
   - Load a bundled React/Next.js Sample Repo from app-controlled data.
   - Present a Projects-first workspace without arbitrary filesystem or GitHub access.

2. **Config Scanner and Playbook Draft** (`FR-3` to `FR-5`)
   - Detect fixed sample artifacts: `CLAUDE.md`, `.cursorrules`, `.claude/skills/*`, and `docs/*`.
   - Generate deterministic `.agent-studio/playbook.yaml`.
   - Track imported vs user-edited content.

3. **Agent Playbook Viewer and Rules Editor** (`FR-6` to `FR-8`)
   - Display Skills, Agents, Rules, Context, and Tool Translators.
   - Fully edit Rules only.
   - Keep Skills, Agents, and Context read-only or lightly editable.

4. **Cross-Tool Preview** (`FR-9` to `FR-12`)
   - Render Claude Code, Cursor, and Windsurf previews from the same Agent Playbook.
   - Surface compatibility notes where a Tool Translator adapts or flattens behavior.

5. **Plan and Behavior Diff** (`FR-13` to `FR-15`)
   - Generate file-level Plan.
   - Generate template-based Behavior Diff for Rule changes.
   - Keep previews, Plan, and Behavior Diff synchronized with Rule edits.

6. **Patch Export** (`FR-16` to `FR-18`)
   - Export generated files and/or reviewable patch without GitHub auth.
   - Include generated file provenance pointing back to `.agent-studio/playbook.yaml`.

**Non-Functional Requirements:**

- Demo flow must work without manual setup.
- Rule edits should update preview/review surfaces quickly for bundled sample data.
- UI must support keyboard navigation and accessible preview readability.
- Terminology must remain consistent with the PRD glossary.
- MVP must not require repo write permissions, GitHub OAuth, or arbitrary repo access.
- Generation must be deterministic for the same Sample Repo and Rule set.

**UX Implications:**

The UX defines a desktop-first, single-surface web app with a 3-panel Playbook Workbench:

- Left rail: Sample Repo, detected files, Playbook sections.
- Center: Rules editor and imported Playbook sections.
- Right inspector: Tool Translator previews, Plan, Behavior Diff, export controls.

Architecturally, this points toward a client-heavy deterministic demo app with clear state derivation rather than a backend-heavy SaaS system.

### Scale & Complexity

- **Primary domain:** Web developer tool / local demo prototype.
- **Complexity level:** Low-to-medium.
- **Estimated architectural components:** 8 core components.

Likely components:

1. Sample Repo fixture/data package.
2. Config scanner.
3. Agent Playbook domain model and schema validation.
4. Playbook draft generator.
5. Rules editor state management.
6. Tool Translator modules for Claude Code, Cursor, and Windsurf.
7. Plan and Behavior Diff generator.
8. Export generator for patch/generated files.

Complexity is not driven by scale, auth, multi-tenancy, or backend integration. Complexity is driven by clean domain modeling, deterministic translation, UI state synchronization, and keeping MVP scope from expanding into local repo/GitHub/workflow/governance concerns.

### Technical Constraints & Dependencies

Known constraints:

- Must be sample-repo-first.
- Must not require arbitrary filesystem access.
- Must not require GitHub OAuth or live PR creation.
- Must keep Rules as the only fully editable Playbook section.
- Must preserve `.agent-studio/playbook.yaml` as canonical source of truth.
- Must treat native tool configs as generated outputs.
- Must label unsupported/adapted translation behavior honestly.
- Must avoid AI semantic analysis for Behavior Diff; use template-based summaries.

Likely implementation assumptions from UX:

- Web app, desktop-first.
- shadcn/ui + Tailwind assumed by UX, but still needs architectural confirmation.
- React/Next.js is natural given the sample app and UX assumptions, but final technology choice belongs in architecture decisions.

### Cross-Cutting Concerns Identified

- **Determinism:** Same input fixture + same Rule set must produce same Playbook, previews, Plan, Behavior Diff, and export.
- **Source-of-truth integrity:** Generated outputs must point back to `.agent-studio/playbook.yaml`.
- **Translator modularity:** Claude Code, Cursor, and Windsurf renderers should be isolated so tool-specific changes do not leak across the app.
- **Scope guardrails:** Architecture must make local repo, GitHub PR creation, workflows, governance, and marketplace hard to accidentally include in MVP.
- **State synchronization:** Rule edits must update Playbook state, preview outputs, Plan, Behavior Diff, and export artifacts consistently.
- **Validation:** Empty Rules and malformed Playbook state must block export.
- **Accessibility:** Keyboard and screen-reader behavior must be preserved across the 3-panel workbench.
- **Future extension:** Architecture should leave seams for local repo support and GitHub PR creation later, without building them now.

## Starter Template Evaluation

### Primary Technology Domain

Agent Studio MVP is a single-surface web developer tool. The primary domain is a client-heavy React/Next.js web app with deterministic local domain logic and no backend service requirement in MVP.

### Starter Options Considered

#### Option 1: Next.js App Router via create-next-app

**Fit:** Strong.

Next.js is a natural fit because the sample repo, UX assumptions, and target implementation already align with React/Next.js. Official `create-next-app` supports TypeScript, Tailwind CSS, ESLint, App Router, and import aliases. This gives the MVP a standard web-app foundation without inventing build tooling.

**Architectural implications:**

- TypeScript-first application code.
- App Router structure under `app/` or `src/app/`.
- Tailwind CSS support from project creation.
- Can keep all MVP logic local to the app.
- Easy path to add API routes later if local repo/GitHub integration becomes v1.1.

#### Option 2: shadcn/ui Next template

**Fit:** Strongest.

shadcn/ui supports scaffolding a Next.js project directly with `shadcn@latest init -t next`, and also supports adding shadcn/ui to an existing `create-next-app` project. This matches the UX assumption and gives ready component patterns for the 3-panel workbench: buttons, tabs, cards, sheets, dialogs, badges, toasts, separators, inputs, and scroll areas.

**Architectural implications:**

- Next.js + TypeScript + Tailwind foundation.
- shadcn/ui component ownership: components are copied into the repo, not hidden behind a black-box UI dependency.
- Good match for a developer-tool interface with tabs, panels, code previews, and alerts.
- Keeps visual implementation aligned with `DESIGN.md`.

#### Option 3: Vite + React + TypeScript

**Fit:** Viable but weaker.

Vite would be sufficient for a client-only demo and may be simpler than Next.js. However, it diverges from the sample repo framing and from the UX assumption of Next.js/shadcn. It also gives less obvious future path for API routes if v1.1 adds GitHub PR creation or local repo services.

### Selected Starter: shadcn/ui Next template on Next.js

**Rationale for Selection:**

Use the shadcn/ui Next template because Agent Studio is a desktop-first developer tool with dense UI, tabs, panels, code previews, badges, toasts, and form controls. The starter aligns with UX, keeps styling decisions consistent, and avoids custom component-system work.

This is still a lightweight MVP architecture: no database, no auth, no backend service, no GitHub integration. The app can run entirely from bundled sample data and client-side deterministic modules.

**Initialization Command:**

```bash
pnpm dlx shadcn@latest init -t next
```

Alternative if preferring explicit Next.js first:

```bash
pnpm create next-app@latest agent-studio --ts --tailwind --eslint --app --src-dir --import-alias "@/*"
cd agent-studio
pnpm dlx shadcn@latest init
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**

- TypeScript application code.
- React and Next.js App Router.
- Browser-first MVP with optional future API route support.

**Styling Solution:**

- Tailwind CSS.
- shadcn/ui component conventions.
- `DESIGN.md` tokens implemented through Tailwind theme/CSS variables.

**Build Tooling:**

- Next.js development/build pipeline.
- Hot reload during development.
- Static/client-heavy rendering is sufficient for MVP.

**Testing Framework:**

The starter does not fully settle testing. Architecture should add:

- Unit tests for pure domain modules: scanner, Playbook generator, Tool Translators, Plan generator, Behavior Diff generator.
- Component/interaction tests for Rules editor and preview synchronization.
- Optional E2E smoke test for the sample flow.

**Code Organization:**

Recommended project organization:

```text
src/
  app/
    page.tsx
    globals.css
  components/
    workbench/
    ui/
  lib/
    sample-repo/
    playbook/
    translators/
    review/
    export/
  test/
```

**Development Experience:**

- shadcn/ui components are local and editable.
- Tailwind utility styling matches UX spec.
- Deterministic domain logic can be developed and tested independently from UI.
- Future v1.1 can add local repo/GitHub boundaries without changing MVP domain model.

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**

1. **Runtime/application framework:** Next.js App Router + React + TypeScript.
2. **Execution model:** Client-heavy deterministic demo app; no backend service in MVP.
3. **Domain model validation:** Zod schema for Agent Playbook and generated artifacts.
4. **State architecture:** Single in-memory Playbook state with derived previews, Plan, Behavior Diff, and export artifacts.
5. **Translator architecture:** Isolated Tool Translator modules for Claude Code, Cursor, and Windsurf.
6. **Export format:** Browser-generated zip bundle containing generated files and a reviewable patch/diff artifact.

**Important Decisions (Shape Architecture):**

1. shadcn/ui + Tailwind for UI implementation.
2. Vitest for pure domain module tests.
3. Playwright for one smoke test of the complete demo flow.
4. No database, no auth, no server API, no filesystem permissions in MVP.
5. Sample Repo represented as static fixture data inside the app.

**Deferred Decisions (Post-MVP):**

1. Local repo access strategy.
2. GitHub OAuth / GitHub App / PR creation.
3. Persistence beyond browser/session.
4. Multi-user collaboration.
5. Workflow orchestration.
6. Governance/audit/rollback.
7. Marketplace or Playbook Library.

### Data Architecture

**Decision:** Use static Sample Repo fixtures and in-memory derived state.

**Version / Libraries:**

- TypeScript `6.0.3`
- Zod `4.4.3`

**Rationale:**
The MVP does not need server persistence or arbitrary repo access. All required input files are bundled as controlled fixture data. This directly supports deterministic generation and reliable demos.

**Data model layers:**

1. `SampleRepoFixture`
   - Represents bundled files such as `CLAUDE.md`, `.cursorrules`, `.claude/skills/*`, and `docs/*`.

2. `AgentPlaybook`
   - Canonical model for `.agent-studio/playbook.yaml`.
   - Includes `name`, `version`, `repo`, `description`, `skills`, `agents`, `rules`, `context`, and `translators`.

3. `GeneratedArtifact`
   - Represents a generated output file path and content.

4. `PlanChange`
   - Represents added/modified generated files.

5. `BehaviorDiffItem`
   - Template-based summary of Rule additions, removals, edits, or translator warnings.

**Validation strategy:**
Use Zod schemas at fixture import boundaries, Playbook generation boundaries, Rules editor save boundaries, and export boundaries.

**Migration strategy:**
None for MVP. No database.

**Caching strategy:**
No persistent cache. Use memoized derived values in React where needed for preview responsiveness.

### Authentication & Security

**Decision:** No authentication, authorization, secrets, or repo permissions in MVP.

**Rationale:**
The MVP must prove the reviewability loop without asking users to trust Agent Studio with GitHub or filesystem access. This reduces implementation and trust risk.

**Security implications:**

- No GitHub OAuth.
- No backend credentials.
- No filesystem write permissions.
- No user-uploaded arbitrary repo parsing.
- Export artifacts are generated client-side from bundled fixtures and user-edited Rules.

**Future seam:**
v1.1 can introduce local repo support or GitHub PR creation behind explicit boundary modules, without changing the core Playbook/Translator domain model.

### API & Communication Patterns

**Decision:** No application API in MVP.

**Rationale:**
All MVP logic can run locally in the browser using static fixtures and deterministic TypeScript modules. API design would add unnecessary architecture before repo/GitHub integration exists.

**Internal communication pattern:**
Use function boundaries, not network boundaries:

```text
SampleRepoFixture
  -> scanSampleRepo()
  -> generatePlaybookDraft()
  -> updateRules()
  -> translatePlaybook()
  -> generatePlan()
  -> generateBehaviorDiff()
  -> generateExportBundle()
```

**Error handling standard:**
Domain functions return typed results with structured error objects where recoverable. UI maps those errors into inline validation, compatibility notes, or export failure messages.

### Frontend Architecture

**Decision:** Next.js App Router + React + shadcn/ui + Tailwind.

**Versions verified:**

- Next.js `16.2.7`
- React `19.2.7`
- Tailwind CSS `4.3.0`
- shadcn CLI `4.11.0`
- TypeScript `6.0.3`

**Rationale:**
This matches the UX assumptions and gives a strong foundation for a dense desktop developer tool. It also leaves a natural route to future API routes if v1.1 adds GitHub PR creation.

**State management decision:**
Use React local state plus derived selectors/memoization. Do not add Redux, Zustand, server state libraries, or persistence libraries in MVP.

**Rationale:**
The state graph is small and deterministic:

```text
Sample Repo Fixture
  + User Rule Edits
    -> Agent Playbook
    -> Tool Translator Outputs
    -> Plan
    -> Behavior Diff
    -> Export Bundle
```

Adding a global state library would be premature. If the state graph grows in v1.1, introduce a small store behind a `workbench-state` module.

**Component architecture:**

```text
src/components/workbench/
  repo-rail.tsx
  playbook-summary.tsx
  rules-editor.tsx
  imported-section.tsx
  translator-preview.tsx
  review-panel.tsx
  export-actions.tsx
```

**Domain architecture:**

```text
src/lib/
  sample-repo/
    fixtures.ts
    scanner.ts
  playbook/
    schema.ts
    generate.ts
    serialize.ts
  translators/
    types.ts
    claude-code.ts
    cursor.ts
    windsurf.ts
  review/
    plan.ts
    behavior-diff.ts
  export/
    bundle.ts
    patch.ts
```

**Performance approach:**
Keep all transformations pure and deterministic. Use memoization for translator outputs, Plan, Behavior Diff, and export previews. No worker is required for MVP unless preview generation becomes visibly slow.

### Infrastructure & Deployment

**Decision:** Static/client-heavy Next.js deployment; no backend runtime dependency for MVP.

**Package manager:**
Use pnpm `11.5.2`.

**Deployment target:**
Vercel or any static-compatible Next.js host. Vercel is the natural default for Next.js demos, but the architecture does not require Vercel-specific services.

**Environment configuration:**
No secrets required in MVP. Environment variables are not required unless deployment metadata is added later.

**Monitoring/logging:**
No production observability stack in MVP. Use browser console only for development diagnostics and visible UI errors for user-facing failures.

**CI/CD:**
Minimum pipeline:

- typecheck
- lint
- unit tests
- optional Playwright smoke test

### Testing Architecture

**Decision:** Test pure domain logic heavily; keep UI tests focused on the critical demo path.

**Versions verified:**

- Vitest `4.1.8`
- Playwright `1.60.0`

**Unit test coverage targets:**

- Scanner detects fixed sample files.
- Playbook generator creates deterministic schema-valid Playbook.
- Rules editor domain update rejects empty Rules.
- Each Tool Translator renders expected output for the demo Rule.
- Plan generator reports added/modified paths.
- Behavior Diff generator emits template-based summaries.
- Export generator includes Playbook and generated tool outputs.

**E2E smoke path:**

1. Load Sample Repo.
2. Create Agent Playbook.
3. Add demo Rule.
4. Verify Claude/Cursor/Windsurf previews update.
5. Verify Plan and Behavior Diff update.
6. Download/export action becomes available.

### Decision Impact Analysis

**Implementation Sequence:**

1. Initialize Next.js + shadcn/ui project.
2. Add `DESIGN.md` tokens and base layout shell.
3. Implement static Sample Repo fixture.
4. Implement Playbook schema and generator.
5. Implement Rules editor state.
6. Implement Tool Translator modules.
7. Implement Plan and Behavior Diff generators.
8. Implement export bundle/patch generation.
9. Wire Playbook Workbench UI.
10. Add unit tests and E2E smoke test.

**Cross-Component Dependencies:**

- Tool Translators depend only on validated Agent Playbook, not UI state.
- Plan and Behavior Diff depend on Playbook before/after state plus translator outputs.
- Export depends on generated artifacts and Plan, not on UI components.
- UI depends on domain modules through typed view models.
- Future GitHub/local repo integrations should depend on Playbook/export boundaries, not on translator internals.

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:** 9 areas where AI agents could make different choices:

1. File and component naming.
2. Domain module boundaries.
3. Playbook schema and validation.
4. Tool Translator contract.
5. Derived state flow.
6. Error/result handling.
7. UI state and loading patterns.
8. Export artifact structure.
9. Test placement and naming.

### Naming Patterns

**Database Naming Conventions:**

No database in MVP. AI agents must not introduce database tables, migrations, ORM models, persistence adapters, or storage abstractions.

**API Naming Conventions:**

No public or internal HTTP API in MVP. AI agents must not introduce API routes unless a later architecture update explicitly adds a backend boundary.

**Code Naming Conventions:**

- React components: `PascalCase`
  - Good: `RulesEditor`, `TranslatorPreview`, `ReviewPanel`
  - Avoid: `rules-editor` as component name

- Component files: kebab-case
  - Good: `rules-editor.tsx`, `translator-preview.tsx`
  - Avoid: `RulesEditor.tsx`

- Domain files: kebab-case
  - Good: `behavior-diff.ts`, `claude-code.ts`, `sample-repo.ts`
  - Avoid: `behaviorDiff.ts`, `ClaudeCode.ts`

- Functions: camelCase verbs
  - Good: `scanSampleRepo`, `generatePlaybookDraft`, `translatePlaybook`
  - Avoid: `playbookGenerator`, `doTranslate`

- Types and schemas: PascalCase
  - Good: `AgentPlaybook`, `GeneratedArtifact`, `ToolTranslator`
  - Zod schemas: `AgentPlaybookSchema`, `RuleSchema`

- Constants: SCREAMING_SNAKE_CASE only for true constants
  - Good: `DEMO_RULE_TEXT`
  - Avoid using constants for ordinary local labels.

### Structure Patterns

**Project Organization:**

```text
src/
  app/
    page.tsx
    globals.css
  components/
    workbench/
      repo-rail.tsx
      playbook-summary.tsx
      rules-editor.tsx
      imported-section.tsx
      translator-preview.tsx
      review-panel.tsx
      export-actions.tsx
    ui/
  lib/
    sample-repo/
      fixtures.ts
      scanner.ts
    playbook/
      schema.ts
      generate.ts
      serialize.ts
      update-rules.ts
    translators/
      types.ts
      claude-code.ts
      cursor.ts
      windsurf.ts
      index.ts
    review/
      plan.ts
      behavior-diff.ts
    export/
      bundle.ts
      patch.ts
  test/
```

**Rules:**

- `components/workbench/*` may import from `lib/*`.
- `lib/*` must not import from `components/*` or `app/*`.
- Tool Translators must not import from each other.
- Export modules depend on generated artifacts, not on UI components.
- UI components receive view models and callbacks; they should not parse fixtures directly.

**File Structure Patterns:**

- Use co-located unit tests for pure domain modules when practical:
  - `schema.test.ts`
  - `generate.test.ts`
  - `claude-code.test.ts`
- Keep one E2E smoke test under `tests/e2e/` or `e2e/`.
- Keep bundled sample repo data in `src/lib/sample-repo/fixtures.ts` or a nearby `fixtures/` folder.
- Do not scatter sample data across UI components.

### Format Patterns

**Domain Result Format:**

Recoverable domain functions should return a typed Result:

```ts
type Result<T, E = AppError> =
  | { ok: true; data: T }
  | { ok: false; error: E }
```

Use thrown errors only for unexpected programmer errors. UI-facing validation and export failures should use `Result`.

**Error Format:**

```ts
type AppError = {
  code: string
  message: string
  details?: Record<string, unknown>
}
```

Error codes use kebab-case strings:

```ts
"rule-empty"
"playbook-invalid"
"export-failed"
"translator-warning"
```

**Data Exchange Formats:**

- Internal TypeScript object fields use `camelCase`.
- Serialized Playbook YAML uses snake_case only if required by the Playbook schema. Otherwise keep camelCase for consistency.
- File paths use POSIX-style `/` separators in all generated artifacts, even in browser-only MVP.
- Dates are not needed in MVP generated artifacts unless explicitly added later.
- Rules are plain strings in MVP.

### Communication Patterns

**Event System Patterns:**

No event bus in MVP. Use direct callback props and pure derived functions.

If a later implementation introduces action naming, use verb-object names:

```ts
addRule
updateRule
removeRule
selectTranslator
exportPatch
```

**State Management Patterns:**

Use one top-level Workbench state owner:

```ts
type WorkbenchState = {
  sampleRepo: SampleRepoFixture
  playbook: AgentPlaybook | null
  selectedTranslator: ToolId
  activeInspectorTab: "preview" | "review"
  ruleDrafts: RuleDraft[]
}
```

Derived values must not be stored as independent mutable state:

```ts
const translatorOutputs = deriveTranslatorOutputs(playbook)
const plan = generatePlan(previousPlaybook, playbook, translatorOutputs)
const behaviorDiff = generateBehaviorDiff(previousRules, currentRules)
```

**Rules:**

- Store source state; derive previews.
- Do not store duplicate copies of generated outputs unless preparing an export artifact.
- Do not let Tool Translator modules mutate Playbook state.
- Do not use a global state library in MVP.

### Process Patterns

**Validation Timing:**

- Validate fixture data at app initialization.
- Validate generated Playbook after draft generation.
- Validate Rule edits before updating export-ready state.
- Validate export bundle before enabling download.

**Error Handling Patterns:**

- Inline validation for Rule input errors.
- Compatibility warnings stay near affected Tool Translator preview.
- Export failure uses a retryable visible UI error and keeps Rule edits intact.
- Programmer errors may surface through development console but should not be used for expected user validation.

**Loading State Patterns:**

MVP uses synchronous fixture-based operations. Loading states are still defined for UI consistency:

- `idle`
- `generating-playbook`
- `ready`
- `exporting`
- `error`

Do not introduce spinners for instant derived updates. Prefer subtle disabled states for export and validation.

### Enforcement Guidelines

**All AI Agents MUST:**

- Keep MVP browser/client-heavy unless architecture is explicitly updated.
- Keep Playbook as canonical and generated files as outputs.
- Keep Tool Translator modules isolated by tool.
- Keep Rules as the only fully editable Playbook section.
- Use Zod schemas for Agent Playbook validation.
- Use typed Result for recoverable domain failures.
- Keep pure domain modules independent from React components.
- Generate all derived outputs from current Playbook state.
- Add tests for new domain logic.

**Pattern Enforcement:**

- Unit tests verify domain outputs.
- E2E smoke test verifies the demo flow.
- TypeScript strictness should catch shape drift.
- PR/review checklist should reject:
  - backend/API/auth additions,
  - arbitrary filesystem access,
  - database/persistence additions,
  - cross-imports between translators,
  - UI components parsing fixture content directly.

### Pattern Examples

**Good Example: Translator Contract**

```ts
type ToolId = "claude-code" | "cursor" | "windsurf"

type ToolTranslator = {
  id: ToolId
  label: string
  translate(playbook: AgentPlaybook): TranslatorResult
}

type TranslatorResult = {
  artifacts: GeneratedArtifact[]
  compatibilityNotes: CompatibilityNote[]
}
```

**Good Example: Pure Translator**

```ts
export function translateClaudeCode(playbook: AgentPlaybook): TranslatorResult {
  return {
    artifacts: [
      {
        path: "CLAUDE.md",
        content: renderClaudeMarkdown(playbook),
        kind: "modified",
      },
    ],
    compatibilityNotes: [],
  }
}
```

**Anti-Patterns:**

- Translator reads React state directly.
- UI component builds `CLAUDE.md` strings inline.
- Cursor translator imports Claude translator and tweaks output.
- Export module queries DOM to collect preview text.
- Rule edit updates `playbook`, `plan`, and `preview` separately as independent state.
- Empty Rule is allowed and filtered only during export.
- Generated file is presented as canonical source of truth.

## Project Structure & Boundaries

### Complete Project Directory Structure

```text
agent-studio/
├── README.md
├── package.json
├── pnpm-lock.yaml
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
├── components.json
├── .gitignore
├── .github/
│   └── workflows/
│       └── ci.yml
├── public/
│   └── favicon.ico
├── tests/
│   └── e2e/
│       └── sample-flow.spec.ts
└── src/
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    ├── components/
    │   ├── ui/
    │   │   ├── button.tsx
    │   │   ├── badge.tsx
    │   │   ├── tabs.tsx
    │   │   ├── card.tsx
    │   │   ├── scroll-area.tsx
    │   │   ├── separator.tsx
    │   │   ├── input.tsx
    │   │   └── toast.tsx
    │   └── workbench/
    │       ├── agent-studio-workbench.tsx
    │       ├── repo-rail.tsx
    │       ├── detected-file-row.tsx
    │       ├── playbook-section-list.tsx
    │       ├── playbook-summary.tsx
    │       ├── rules-editor.tsx
    │       ├── rule-row.tsx
    │       ├── imported-section.tsx
    │       ├── translator-preview.tsx
    │       ├── code-panel.tsx
    │       ├── compatibility-note.tsx
    │       ├── review-panel.tsx
    │       ├── plan-list.tsx
    │       ├── behavior-diff.tsx
    │       └── export-actions.tsx
    └── lib/
        ├── errors.ts
        ├── result.ts
        ├── sample-repo/
        │   ├── fixtures.ts
        │   ├── scanner.ts
        │   └── scanner.test.ts
        ├── playbook/
        │   ├── schema.ts
        │   ├── generate.ts
        │   ├── generate.test.ts
        │   ├── serialize.ts
        │   ├── update-rules.ts
        │   └── update-rules.test.ts
        ├── translators/
        │   ├── types.ts
        │   ├── index.ts
        │   ├── claude-code.ts
        │   ├── claude-code.test.ts
        │   ├── cursor.ts
        │   ├── cursor.test.ts
        │   ├── windsurf.ts
        │   └── windsurf.test.ts
        ├── review/
        │   ├── plan.ts
        │   ├── plan.test.ts
        │   ├── behavior-diff.ts
        │   └── behavior-diff.test.ts
        └── export/
            ├── bundle.ts
            ├── bundle.test.ts
            ├── patch.ts
            └── patch.test.ts
```

### Architectural Boundaries

**API Boundaries:**

No HTTP API boundary exists in MVP.

- `src/app/page.tsx` renders the single app surface.
- No `src/app/api/*` routes.
- No server actions.
- No backend storage.
- No auth middleware.

If v1.1 adds GitHub PR creation or local repo support, introduce those as explicit new boundaries rather than mixing them into current domain modules.

**Component Boundaries:**

- `src/components/workbench/*` owns UI composition and user interaction.
- `src/components/ui/*` owns shadcn/ui primitives.
- Workbench components may call `src/lib/*` domain functions.
- Workbench components must not build generated tool output strings inline.
- Workbench components must not parse fixture files directly.

**Service Boundaries:**

No service layer in MVP. Use pure domain modules:

- `sample-repo` detects fixture files.
- `playbook` validates, generates, serializes, and updates Agent Playbook state.
- `translators` render generated artifacts.
- `review` derives Plan and Behavior Diff.
- `export` creates downloadable review artifacts.

**Data Boundaries:**

- Sample Repo fixture data enters through `src/lib/sample-repo/fixtures.ts`.
- Scanner output feeds Playbook generation.
- Agent Playbook is the canonical domain object.
- Tool outputs, Plan, Behavior Diff, and export bundle are derived objects.
- Generated native configs are never treated as source of truth.

### Requirements to Structure Mapping

**FR-1 to FR-2: Sample Repo Demo Workspace**

- `src/lib/sample-repo/fixtures.ts`
- `src/lib/sample-repo/scanner.ts`
- `src/components/workbench/agent-studio-workbench.tsx`
- `src/components/workbench/repo-rail.tsx`
- `src/components/workbench/detected-file-row.tsx`

**FR-3 to FR-5: Config Scanner and Playbook Draft**

- `src/lib/sample-repo/scanner.ts`
- `src/lib/playbook/schema.ts`
- `src/lib/playbook/generate.ts`
- `src/lib/playbook/serialize.ts`
- `src/components/workbench/playbook-summary.tsx`
- `src/components/workbench/playbook-section-list.tsx`

**FR-6 to FR-8: Agent Playbook Viewer and Rules Editor**

- `src/components/workbench/rules-editor.tsx`
- `src/components/workbench/rule-row.tsx`
- `src/components/workbench/imported-section.tsx`
- `src/lib/playbook/update-rules.ts`
- `src/lib/playbook/schema.ts`

**FR-9 to FR-12: Cross-Tool Preview**

- `src/lib/translators/types.ts`
- `src/lib/translators/claude-code.ts`
- `src/lib/translators/cursor.ts`
- `src/lib/translators/windsurf.ts`
- `src/lib/translators/index.ts`
- `src/components/workbench/translator-preview.tsx`
- `src/components/workbench/code-panel.tsx`
- `src/components/workbench/compatibility-note.tsx`

**FR-13 to FR-15: Plan and Behavior Diff**

- `src/lib/review/plan.ts`
- `src/lib/review/behavior-diff.ts`
- `src/components/workbench/review-panel.tsx`
- `src/components/workbench/plan-list.tsx`
- `src/components/workbench/behavior-diff.tsx`

**FR-16 to FR-18: Patch Export**

- `src/lib/export/bundle.ts`
- `src/lib/export/patch.ts`
- `src/components/workbench/export-actions.tsx`

### Integration Points

**Internal Communication:**

```text
fixtures.ts
  -> scanner.ts
  -> playbook/generate.ts
  -> playbook/update-rules.ts
  -> translators/*
  -> review/plan.ts
  -> review/behavior-diff.ts
  -> export/*
  -> workbench UI
```

**External Integrations:**

None in MVP.

Explicitly not integrated:

- GitHub
- local filesystem
- databases
- auth providers
- remote APIs
- analytics

**Data Flow:**

```text
SampleRepoFixture
  -> scanSampleRepo()
  -> generatePlaybookDraft()
  -> WorkbenchState.playbook
  -> updateRules()
  -> translateAll()
  -> generatePlan()
  -> generateBehaviorDiff()
  -> generateExportBundle()
```

### File Organization Patterns

**Configuration Files:**

- Root config remains standard Next.js/shadcn:
  - `next.config.ts`
  - `tsconfig.json`
  - `eslint.config.mjs`
  - `postcss.config.mjs`
  - `components.json`
- No `.env` required for MVP.
- If `.env.example` appears, it should document that no env vars are required in MVP.

**Source Organization:**

- UI composition in `src/components/workbench`.
- Reusable UI primitives in `src/components/ui`.
- Pure domain logic in `src/lib`.
- Keep domain functions framework-independent.
- Keep UI components thin around rendering, events, and accessibility.

**Test Organization:**

- Domain unit tests live next to domain modules.
- E2E test lives in `tests/e2e/sample-flow.spec.ts`.
- No snapshot tests for generated outputs unless they are deliberate translator contract tests.
- Translator tests should assert important generated substrings and artifact paths.

**Asset Organization:**

- `public/` only for static web assets such as favicon.
- Sample Repo fixture content lives in TypeScript modules under `src/lib/sample-repo`, not `public/`.

### Development Workflow Integration

**Development Server Structure:**

- `pnpm dev` runs the Next.js app.
- The app opens directly into the demo workspace or a single Sample Repo card that leads to the workbench.
- No setup scripts or seed scripts required.

**Build Process Structure:**

- `pnpm build` builds the static/client-heavy Next.js app.
- Build should not require secrets.
- Build should not access external services.

**Deployment Structure:**

- Deploy as a standard Next.js app.
- Vercel is the default deployment target, but no Vercel-specific runtime services are required.
- A static-compatible deployment remains possible because MVP has no backend data dependency.

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**

The architecture is coherent. Next.js App Router, React, TypeScript, Tailwind, and shadcn/ui align with the UX specification and MVP scope. The client-heavy execution model is compatible with static Sample Repo fixtures, deterministic domain modules, browser-generated previews, and browser-side export.

There are no contradictory backend decisions because MVP explicitly excludes database, auth, API routes, server actions, GitHub OAuth, arbitrary filesystem access, and remote services.

**Pattern Consistency:**

Implementation patterns support the core architectural decisions:

- Pure domain modules support deterministic output.
- Zod schemas support Playbook validation and export readiness.
- Tool Translator isolation prevents Claude/Cursor/Windsurf logic from leaking across modules.
- Typed Result errors support UI validation without mixing expected user errors and programmer errors.
- Derived state rules prevent preview, Plan, Behavior Diff, and export from becoming separate sources of truth.

**Structure Alignment:**

The project structure supports the architecture:

- `src/components/workbench` owns UI composition.
- `src/lib/*` owns framework-independent domain logic.
- `sample-repo`, `playbook`, `translators`, `review`, and `export` map directly to PRD feature groups.
- Tests are placed close to domain modules, with an E2E smoke path for the full demo flow.

### Requirements Coverage Validation ✅

**Feature Coverage:**

All PRD feature areas are architecturally supported:

- Sample Repo Demo Workspace → `sample-repo` fixtures/scanner + workbench UI.
- Config Scanner and Playbook Draft → scanner + Playbook schema/generator.
- Agent Playbook Viewer and Rules Editor → Rules editor + update-rules domain module.
- Cross-Tool Preview → isolated Tool Translator modules.
- Plan and Behavior Diff → review domain modules.
- Patch Export → export bundle/patch modules.

**Functional Requirements Coverage:**

All FRs `FR-1` through `FR-18` have mapped structure and supporting architectural boundaries.

**Non-Functional Requirements Coverage:**

- Demo reliability: supported by bundled fixtures and no external dependencies.
- Responsiveness: supported by synchronous deterministic transforms and memoized derived values.
- Accessibility: supported by UX spine and component-level responsibility.
- Terminology consistency: supported by glossary-aligned names and component/module naming.
- No repo write permissions: supported by no backend/API/filesystem/GitHub boundaries.
- Deterministic generation: supported by pure functions and controlled fixtures.

### Implementation Readiness Validation ✅

**Decision Completeness:**

Critical decisions are documented with verified versions where applicable:

- Next.js `16.2.7`
- React `19.2.7`
- Tailwind CSS `4.3.0`
- shadcn CLI `4.11.0`
- TypeScript `6.0.3`
- Zod `4.4.3`
- Vitest `4.1.8`
- Playwright `1.60.0`
- pnpm `11.5.2`
- JSZip `3.10.1`

**Structure Completeness:**

The project structure is specific enough for AI agents to implement consistently. Each FR group maps to files/directories, and anti-boundaries are explicit: no API routes, no auth, no database, no filesystem integration, no GitHub integration.

**Pattern Completeness:**

The main AI-agent conflict points are addressed: naming, module boundaries, Result/error shape, translator contract, state derivation, validation timing, loading states, export boundaries, and tests.

### Gap Analysis Results

**Critical Gaps:** None.

**Important Gaps:**

1. **Exact patch artifact format remains implementation-level.**
   - Current architecture says browser-generated zip bundle containing generated files and patch/diff artifact.
   - This is enough for architecture, but the implementation story should decide whether patch output is unified diff, zip-only, or both.

2. **Performance target is still an assumption.**
   - PRD says preview/review updates should complete within 500 ms for bundled Sample Repo.
   - Architecture supports this with pure functions and memoization, but implementation must verify.

3. **Cursor output target needs final product choice.**
   - Architecture supports `.cursor/rules` with `.cursorrules` compatibility context.
   - PRD/UX still ask whether to foreground modern `.cursor/rules` or recognizable `.cursorrules`.

**Nice-to-Have Gaps:**

1. A small Storybook or component sandbox could help UI consistency, but is not necessary for MVP.
2. A formal Playbook JSON/YAML schema file could help future integrations, but Zod schema is enough for MVP.
3. A package boundary lint rule could enforce `lib` not importing `components`, but review checklist may be enough initially.

### Validation Issues Addressed

No critical issues were found. Minor gaps are documented as implementation/story decisions rather than architecture blockers.

### Architecture Completeness Checklist

**Requirements Analysis**

- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**Architectural Decisions**

- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**Implementation Patterns**

- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**Project Structure**

- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY WITH MINOR GAPS

**Confidence Level:** High

**Key Strengths:**

- Strong MVP scope control.
- Deterministic client-heavy architecture.
- Clear Tool Translator contract.
- Clean separation between UI and domain logic.
- Requirements mapped directly to modules.
- Future seams for local repo and GitHub PR without building them now.

**Areas for Future Enhancement:**

- Local repo support boundary.
- GitHub PR creation boundary.
- Persistence/session handling.
- Playbook Library.
- Governance and audit.
- Workflow orchestration.

### Implementation Handoff

**AI Agent Guidelines:**

- Follow all architectural decisions exactly as documented.
- Use implementation patterns consistently across all components.
- Respect project structure and boundaries.
- Keep MVP browser/client-heavy.
- Treat `.agent-studio/playbook.yaml` as canonical.
- Treat native tool files as generated outputs.
- Do not add backend/API/auth/GitHub/filesystem/database scope without an explicit architecture update.

**First Implementation Priority:**

Initialize project with:

```bash
pnpm dlx shadcn@latest init -t next
```

Then add domain modules before UI wiring:

1. `sample-repo` fixtures and scanner.
2. `playbook` schema/generator/update functions.
3. `translators` contract and three tool implementations.
4. `review` Plan and Behavior Diff.
5. `export` bundle/patch.
6. Workbench UI.
