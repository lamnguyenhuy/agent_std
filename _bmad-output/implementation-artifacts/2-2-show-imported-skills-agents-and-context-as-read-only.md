---
baseline_commit: NO_VCS
---

# Story 2.2: Show Imported Skills, Agents, and Context as Read-Only

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a tech lead,
I want to inspect imported Skills, Agents, and Context with source paths,
so that I trust the Playbook draft without expecting full CRUD in MVP.

## Acceptance Criteria

1. Given imported Playbook content exists, when the user views Skills, Agents, or Context, then each imported item shows its name or label.
2. Given imported Playbook content exists, when the user views Skills, Agents, or Context, then each imported item shows its source path where available.
3. Given imported Playbook content exists, when the user views Skills, Agents, or Context, then each section includes an explicit MVP read-only affordance.
4. Given imported Playbook content exists, when the user views Skills, Agents, or Context, then no add, edit, delete, or lifecycle controls are shown for these sections.
5. Given imported Playbook content exists, when the user views Skills, Agents, or Context, then the UI does not imply marketplace, workflow, or governance capabilities.

## Tasks / Subtasks

- [x] Deepen the read-only imported section presentation for Skills, Agents, and Context. (AC: 1, 2, 3)
  - [x] Update `src/components/workbench/imported-section.tsx` or add a focused child component so imported sections can show a concise read-only affordance in the section header/body.
  - [x] Preserve the existing `Imported/read-only` status badge behavior from Story 2.1 and add explicit MVP read-only copy such as `MVP read-only` or `Imported from the Sample Repo; editing comes later for Rules only`.
  - [x] Keep the section UI compact and workbench-like; do not introduce modal, marketplace, lifecycle, or management surfaces.
- [x] Render imported item details consistently across Skills, Agents, and Context. (AC: 1, 2)
  - [x] Skills: show imported skill name and source path. Preserve existing source path display from `playbook.skills[*].sourcePath`.
  - [x] Agents: show agent name, role, and all source paths from `playbook.agents[*].sourcePaths`; keep multi-source paths readable without truncating the only visible traceability.
  - [x] Context: show context label and source path. Prefer `sourcePath` when present; `path` is currently the same for generated context entries but the schema exposes both.
  - [x] If an imported section is empty, show a non-interactive empty state that does not claim imported content exists and does not expose CRUD controls.
- [x] Prevent non-Rule lifecycle affordances and scope creep. (AC: 3, 4, 5)
  - [x] Do not add add/edit/delete buttons, menus, drag handles, hover-only actions, CRUD empty states, marketplace links, workflow setup copy, governance/audit copy, or role-management affordances to Skills, Agents, or Context.
  - [x] Keep Rules as the only section that may imply future editing; do not implement Story 2.3 behavior here.
  - [x] Do not touch Preview/Review inspector behavior, export actions, Tool Translator disabled-state handling, or detected file group summary wording unless directly required by the read-only imported section presentation.
- [x] Update automated coverage for imported read-only details. (AC: 1, 2, 3, 4, 5)
  - [x] Extend `tests/e2e/sample-flow.spec.ts` after `Create Agent Playbook` to assert Skills, Agents, and Context show item names/labels, source paths, and explicit MVP read-only affordance.
  - [x] Assert no add/edit/delete lifecycle controls are visible inside Skills, Agents, and Context sections.
  - [x] Assert marketplace, workflow, and governance capability language is not present in those sections.
  - [x] Add focused Vitest coverage only if new pure helper logic is extracted; do not introduce a component-test framework just for this story.
- [x] Verify implementation locally. (AC: 1-5)
  - [x] Run `pnpm typecheck`.
  - [x] Run `pnpm lint`.
  - [x] Run `pnpm test`.
  - [x] Run `pnpm test:e2e`.
  - [x] Run `pnpm build`.

### Review Findings

- [x] [Review][Patch] Empty imported sections can show read-only copy that claims content was imported [src/components/workbench/agent-studio-workbench.tsx:212]
- [x] [Review][Patch] Mobile coverage does not exercise imported section content after Playbook creation [tests/e2e/sample-flow.spec.ts:134]
- [x] [Review][Patch] Negative lifecycle-control coverage misses non-button controls and generic manage/configure affordances [tests/e2e/sample-flow.spec.ts:79]
- [x] [Review][Patch] Empty imported-section behavior is untested [tests/e2e/sample-flow.spec.ts:90]
- [x] [Review][Patch] Imported sections lack stable accessible region names, forcing DOM-shape locators [src/components/workbench/imported-section.tsx:21]
- [x] [Review][Patch] Agent source paths are joined into one comma-delimited string [src/components/workbench/agent-studio-workbench.tsx:258]
- [x] [Review][Defer] Rules is labeled editable before Rules editing controls exist [src/components/workbench/agent-studio-workbench.tsx:271] — deferred, pre-existing
- [x] [Review][Defer] Sprint status has stale header metadata comment [./_bmad-output/implementation-artifacts/sprint-status.yaml:2] — deferred, pre-existing

## Dev Notes

Story 2.2 builds directly on Story 2.1. Story 2.1 established the section-oriented Playbook viewer and `Imported/read-only` status cues. Story 2.2 must deepen the content inside Skills, Agents, and Context so the user can inspect imported items and source paths without mistaking those sections for full CRUD surfaces.

### Story Source

- Epic: Epic 2, `Playbook Workbench and Rules Editing`.
- Story requirement ID: `FR-8`.
- Source acceptance criteria: `_bmad-output/planning-artifacts/epics.md`, `Story 2.2: Show Imported Skills, Agents, and Context as Read-Only`.
- PRD requirement: Skills, Agents, and Context are read-only or minimally editable in MVP, and the UI must not imply full lifecycle management for those sections. [Source: `_bmad-output/planning-artifacts/prds/prd-agent_std-2026-06-09/prd.md`, `FR-8: Restrict Full CRUD for Non-Rule Sections`]
- UX requirement: read-only imported sections show imported Skills, Agents, and Context with source path and a disabled or `MVP read-only` affordance. [Source: `_bmad-output/planning-artifacts/ux-designs/ux-agent_std-2026-06-09/EXPERIENCE.md`, `Component Patterns`]

### Current Code State

- `src/components/workbench/agent-studio-workbench.tsx` remains the single top-level Playbook state owner. It calls `generatePlaybookDraft`, stores `playbook`, derives imported workspace state, and renders Skills, Agents, Rules, Context, and Tool Translators.
- `src/components/workbench/imported-section.tsx` is a presentational wrapper with a title, status badge, and children. It currently does not provide a dedicated body copy or affordance slot for MVP read-only messaging.
- `src/components/workbench/playbook-sections.ts` derives section statuses. Skills, Agents, and Context are `imported` when their arrays contain content and `pending` when empty.
- `src/components/workbench/playbook-status.ts` maps `imported` to `Imported/read-only`.
- Current section content already shows basic item data:
  - Skills: `skill.name` and `skill.sourcePath`.
  - Agents: `agent.name`, `agent.role`, and joined `agent.sourcePaths`.
  - Context: `contextItem.label` and currently `contextItem.path`.
- `src/lib/playbook/schema.ts` requires imported Skills and Context to have `sourcePath`; Agents have `sourcePaths`. `generatePlaybookDraft` fills these from detected fixture files.
- `tests/e2e/sample-flow.spec.ts` already covers Playbook creation, glossary labels, `Imported/read-only` badges, and absence of `Tool adapters`/`Exporter` copy. Extend this test rather than replacing it.

### Architecture Compliance

- Keep `src/components/workbench/*` responsible for UI composition and interaction only. Do not build domain generation logic inside UI components. [Source: `_bmad-output/planning-artifacts/architecture.md`, component/domain architecture]
- Keep the Agent Playbook as canonical source state and derive section presentation from `playbook`. Do not duplicate mutable imported-section state. [Source: `_bmad-output/planning-artifacts/architecture.md`, state model]
- Keep one top-level Workbench state owner in `AgentStudioWorkbench`; pass serializable props into presentational children. [Source: `_bmad-output/planning-artifacts/architecture.md`, `AR-13`]
- Do not introduce backend APIs, server actions, auth, GitHub integration, persistence, database, arbitrary filesystem access, marketplace, workflow, governance, audit, rollback, or role-management scope. [Source: `_bmad-output/planning-artifacts/epics.md`, `AR-4`, `AR-24`, `FR-8`]
- Keep Rules as the only fully editable Playbook section in MVP. [Source: `_bmad-output/planning-artifacts/epics.md`, `AR-8`]

### Technical Guardrails

- This repo uses Next.js `16.2.6`, React `19.2.4`, TypeScript, Tailwind CSS, shadcn-compatible local UI components, Vitest, and Playwright per `package.json`.
- Read and follow the local Next.js docs in `node_modules/next/dist/docs/` before code changes. Relevant guidance already checked during story creation:
  - App routes are Server Components by default.
  - Client Components are required for state/event handlers.
  - `"use client"` defines the client/server boundary, and children imported by the client entry are part of the client bundle.
  - Props crossing a server/client boundary must be serializable.
  [Source: `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`; `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-client.md`]
- Keep `src/app/page.tsx` and `src/app/layout.tsx` server-rendered; any interactive work remains below the existing `"use client"` boundary in `agent-studio-workbench.tsx`.
- Prefer extending `ImportedSection` or adding a small presentational child under `src/components/workbench/` over adding a new stateful component.
- Use existing `StatusBadge`, `playbookSectionStatusUi`, and Tailwind patterns. Avoid new dependencies.
- Keep source path text readable and copyable as plain text; do not hide the only path behind hover-only UI.

### File Structure Requirements

- `src/components/workbench/agent-studio-workbench.tsx` (UPDATE)
- `src/components/workbench/imported-section.tsx` (UPDATE likely)
- `tests/e2e/sample-flow.spec.ts` (UPDATE)
- `src/components/workbench/playbook-sections.ts` (UPDATE only if status/helper logic changes)
- `src/components/workbench/playbook-sections.test.ts` (UPDATE only if helper logic changes)
- Do not create `rules-editor.tsx`, `rule-row.tsx`, translator modules, review-panel modules, or export modules in this story.

### Testing Requirements

- Follow TDD: add failing coverage for the imported read-only affordance and item detail behavior before implementation.
- Extend the existing Playwright smoke flow:
  - Click `Create Agent Playbook`.
  - Assert Skills includes `code-review`, `test-writer`, `.claude/skills/code-review.md`, and `.claude/skills/test-writer.md`.
  - Assert Agents includes `workspace-default`, `Repository coding assistant`, `CLAUDE.md`, and `.cursorrules`.
  - Assert Context includes `architecture`, `conventions`, `glossary`, and the matching `docs/*.md` paths.
  - Assert Skills, Agents, and Context each expose explicit MVP read-only affordance copy.
  - Assert add/edit/delete controls are absent in Skills, Agents, and Context.
  - Assert marketplace, workflow, and governance capability language is absent in those sections.
- Keep the mobile readability smoke test passing.
- Run `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:e2e`, and `pnpm build` before marking the story ready for review.

### Previous Story Intelligence

From Story 2.1:

- The workbench was refactored into section-oriented components: `PlaybookSummary`, `PlaybookSectionList`, `ImportedSection`, and `playbook-sections` helpers.
- `AgentStudioWorkbench` remains the single state owner; keep deriving UI from `playbook` and `workspace.playbookSections`.
- Code review findings were resolved by using `Imported/read-only` for imported sections, sharing section status derivation between list and detail cards, and guarding against `Exporter` copy regressions.
- Deferred work from Story 2.1 must not be pulled into Story 2.2 unless directly required:
  - Preview/Review controls remain disabled after Playbook creation.
  - Detected file group summary still says files are ready after import.
  - Disabled Tool Translators would render without disabled state.
  [Source: `_bmad-output/implementation-artifacts/2-1-display-agent-playbook-sections-in-the-workbench.md`; `_bmad-output/implementation-artifacts/deferred-work.md`]

From Story 1.5:

- Keep `.agent-studio/playbook.yaml` presented as canonical and native tool files as generated outputs only.
- Preserve inline failure handling for Playbook generation.
- Imported-vs-edited visual distinction for Rules remains deferred until Rules editing exists; Story 2.2 should not implement edited Rule styling.

### Latest Tech Information

- Next.js `16.2.6` local docs confirm App Router pages/layouts are Server Components by default and interactive UI requiring state/event handlers belongs in Client Components with `"use client"`. This supports keeping the imported-section presentation beneath the existing client workbench boundary rather than changing route-level rendering.
- React `19.2.4` is used by the repo; keep derived UI data out of redundant mutable state.
- Tailwind CSS and existing shadcn-compatible local components are already available; no new UI package is needed for read-only affordances.

### Project Context Reference

- No `project-context.md` file was found in the workspace during workflow activation.
- The workspace is not currently a git repository, so `baseline_commit` is `NO_VCS` and git history analysis was skipped.

### Completion Note

Ultimate context engine analysis completed - comprehensive developer guide created.

## Dev Agent Record

### Agent Model Used

Codex GPT-5

### Debug Log References

- Story creation analysis used `_bmad-output/planning-artifacts/epics.md`, PRD, architecture, UX design, UX experience, Story 2.1 output, deferred-work notes, package scripts, local Next.js docs, and current workbench source files.
- Git history analysis was skipped because `/Users/lamnh/Downloads/agent_std` is not currently a git repository.
- Dev workflow activation resolved customization with no prepend or append steps and no project-context.md found.
- Confirmed Story 2.2 was the first `ready-for-dev` story in `sprint-status.yaml`.
- Verified TDD RED with `pnpm test:e2e -- tests/e2e/sample-flow.spec.ts`; the story test failed because Skills lacked the explicit `MVP read-only` affordance.

### Implementation Plan

- Extend `ImportedSection` with optional read-only affordance copy while keeping it presentational.
- Pass affordance copy only to Skills, Agents, and Context from `AgentStudioWorkbench`.
- Preserve existing imported item rendering, switch Context source display to `sourcePath`, and add non-interactive empty states.
- Extend Playwright coverage for item details, source paths, read-only affordances, absence of non-Rule controls, and absence of marketplace/workflow/governance language.

### Completion Notes List

- Selected the first backlog story from `sprint-status.yaml`: `2-2-show-imported-skills-agents-and-context-as-read-only`.
- Mapped Story 2.2 to existing imported section rendering and Story 2.1 status helpers.
- Added explicit guardrails to prevent non-Rule CRUD, marketplace, workflow, governance, Preview/Review, translator, or export scope expansion.
- Implemented explicit `MVP read-only` affordance copy for imported Skills, Agents, and Context.
- Preserved imported item name/label and source-path traceability; Context now displays `sourcePath`.
- Added non-interactive empty states for empty imported Skills, Agents, and Context sections.
- Extended Playwright coverage for imported section details, read-only affordances, negative lifecycle controls, and negative marketplace/workflow/governance copy.
- Full validation passed: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:e2e`, and `pnpm build`.
- Applied all Story 2.2 code-review patch findings: empty-section copy now stays truthful, imported sections have accessible region names, mobile coverage exercises imported content after Playbook creation, negative lifecycle assertions cover generic controls, empty copy has Vitest coverage, and agent source paths render as separate entries.
- Post-review validation passed again: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:e2e`, and `pnpm build`.

### File List

- `_bmad-output/implementation-artifacts/2-2-show-imported-skills-agents-and-context-as-read-only.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `src/components/workbench/agent-studio-workbench.tsx`
- `src/components/workbench/imported-section.tsx`
- `src/components/workbench/imported-section-state.ts`
- `src/components/workbench/imported-section-state.test.ts`
- `tests/e2e/sample-flow.spec.ts`

## Change Log

- 2026-06-15: Created Story 2.2 context and moved story to ready-for-dev.
- 2026-06-15: Implemented Story 2.2 and moved story to review.
- 2026-06-15: Applied Story 2.2 code-review patches and moved story to done.
