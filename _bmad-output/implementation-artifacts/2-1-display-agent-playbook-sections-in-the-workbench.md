---
baseline_commit: NO_VCS
---

# Story 2.1: Display Agent Playbook Sections in the Workbench

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a tech lead,
I want to inspect the generated Agent Playbook by section,
so that I can understand what behavior was imported before editing it.

## Acceptance Criteria

1. Given a draft Agent Playbook has been generated, when the Playbook Workbench opens, then the UI displays Skills, Agents, Rules, Context, and Tool Translators sections.
2. Given a draft Agent Playbook has been generated, when the Playbook Workbench opens, then section labels use the exact PRD glossary terms.
3. Given a draft Agent Playbook has been generated, when the Playbook Workbench opens, then Rules is marked as editable.
4. Given a draft Agent Playbook has been generated, when the Playbook Workbench opens, then Skills, Agents, and Context are marked as imported/read-only.
5. Given a draft Agent Playbook has been generated, when the Playbook Workbench opens, then Tool Translator is used instead of Exporter in the UI.

## Tasks / Subtasks

- [x] Refactor the Playbook viewer into explicit section-oriented workbench components. (AC: 1, 2, 5)
  - [x] Extract the current inline Playbook rendering from `src/components/workbench/agent-studio-workbench.tsx` into focused workbench components that match the architecture direction, such as `playbook-summary.tsx`, `playbook-section-list.tsx`, and `imported-section.tsx`.
  - [x] Keep `AgentStudioWorkbench` as the single top-level state owner; pass the generated `playbook` down as props instead of duplicating mutable derived state.
  - [x] Preserve the existing create-Playbook flow and canonical `.agent-studio/playbook.yaml` summary while reorganizing the UI around explicit Agent Playbook sections.
- [x] Align glossary and section status language with PRD and UX requirements. (AC: 1, 2, 3, 4, 5)
  - [x] Replace all remaining `Tool adapters` language with `Tool Translators` in fixture-driven section labels and rendered UI.
  - [x] Mark `Rules` as editable in the workbench UI without adding add/edit/remove controls yet; those behaviors belong to Stories 2.3 and 2.4.
  - [x] Mark `Skills`, `Agents`, and `Context` as imported/read-only using visible affordances that do not imply full CRUD.
  - [x] Ensure no UI copy uses `Exporter` or equivalent terminology for the translation layer.
- [x] Preserve imported Playbook content rendering while preparing for later stories. (AC: 1, 3, 4)
  - [x] Continue showing the generated content for each section after Playbook creation so the user can inspect imported items before editing anything.
  - [x] Keep existing imported source-path display intact where already present, but do not expand into new CRUD or marketplace/workflow/governance affordances in this story.
  - [x] Structure the section components so Story 2.2 can deepen imported item presentation and Story 2.3 can introduce Rules editing without reworking the whole screen again.
- [x] Update automated coverage for the section viewer behavior. (AC: 1, 2, 3, 4, 5)
  - [x] Extend `tests/e2e/sample-flow.spec.ts` to assert the exact glossary labels, the `Tool Translators` wording, and the editable vs imported/read-only status cues after Playbook creation.
  - [x] Add focused Vitest coverage only if new pure helper logic is extracted; do not introduce a new component-test stack just for this story.
- [x] Verify implementation locally. (AC: 1-5)
  - [x] Run `pnpm typecheck`.
  - [x] Run `pnpm lint`.
  - [x] Run `pnpm test`.
  - [x] Run `pnpm test:e2e`.
  - [x] Run `pnpm build`.

### Review Findings

- [x] [Review][Patch] Skills/Agents/Context are marked read-only but not visibly imported [src/components/workbench/playbook-status.ts:20]
- [x] [Review][Patch] Empty imported sections can show pending in the section list but read-only in detail cards [src/components/workbench/agent-studio-workbench.tsx:26]
- [x] [Review][Patch] E2E coverage does not guard against `Exporter` terminology regressions [tests/e2e/sample-flow.spec.ts:73]
- [x] [Review][Defer] Preview and Review controls remain disabled after Playbook creation [src/components/workbench/agent-studio-workbench.tsx:380] — deferred, pre-existing
- [x] [Review][Defer] Detected file group summary still says files are ready after import [src/components/workbench/agent-studio-workbench.tsx:364] — deferred, pre-existing
- [x] [Review][Defer] Disabled tool translators would render without disabled state [src/components/workbench/agent-studio-workbench.tsx:327] — deferred, pre-existing

## Dev Notes

Story 2.1 is the first story in Epic 2. Its job is not to add editing yet; it establishes a clear, glossary-correct section viewer so the user can inspect the canonical Agent Playbook before Story 2.2 expands read-only imported detail and Story 2.3 adds Rules editing.

### Story Source

- Epic: Epic 2, `Playbook Workbench and Rules Editing`.
- Story requirement ID: `FR-6`.
- Source acceptance criteria: `_bmad-output/planning-artifacts/epics.md`, `Story 2.1: Display Agent Playbook Sections in the Workbench`.
- PRD requirement: Agent Studio displays Agent Playbook sections for Skills, Agents, Rules, Context, and Tool Translators, and uses the term `Tool Translator` for the translation layer. [Source: `_bmad-output/planning-artifacts/prds/prd-agent_std-2026-06-09/prd.md`]
- UX requirement: the Playbook section list must use exact glossary names and mark Rules as editable while Skills, Agents, and Context are imported/read-only. [Source: `_bmad-output/planning-artifacts/ux-designs/ux-agent_std-2026-06-09/EXPERIENCE.md`]

### Current Code State

- `src/components/workbench/agent-studio-workbench.tsx` is already a client component and currently owns the top-level `playbook` state plus the `Create Agent Playbook` action. Keep that ownership model.
- The same file currently renders all Playbook sections inline after creation. This satisfies a rough summary, but it is not yet organized as a dedicated section viewer and currently labels `Rules` as imported instead of editable.
- `src/lib/sample-repo/fixtures.ts` still defines the section name union with `Tool adapters`, and `src/components/workbench/repo-rail.tsx` renders that same terminology. Story 2.1 must normalize this to `Tool Translators`.
- `src/app/page.tsx` remains a thin server component wrapper around the interactive workbench. Preserve that boundary.

### Architecture Compliance

- Keep `src/components/workbench/*` responsible for UI composition and interaction only. [Source: `_bmad-output/planning-artifacts/architecture.md`]
- Keep the Agent Playbook as canonical source state and avoid storing duplicate mutable derived state for section summaries. [Source: `_bmad-output/planning-artifacts/architecture.md`]
- Keep one top-level Workbench state owner and derive section presentation from `playbook`. [Source: `_bmad-output/planning-artifacts/architecture.md`]
- Do not introduce backend APIs, server actions, auth, GitHub integration, persistence, or arbitrary filesystem access.
- Do not implement Rules CRUD in this story; only the section-view and status affordances belong here.

### Technical Guardrails

- Preserve `AgentStudioWorkbench` as the only component owning `playbook` state. New section components should receive serializable props and remain presentational.
- Keep `page.tsx` and `layout.tsx` server-rendered. Any new interactive workbench child that needs browser state or event handlers must remain below the existing `"use client"` boundary in `agent-studio-workbench.tsx`. This matches Next.js App Router guidance that interactive UI requiring state and event handling belongs in Client Components. [Source: Next.js `use client` directive docs and Server/Client Components docs, accessed June 12, 2026: https://nextjs.org/docs/app/api-reference/directives/use-client and https://nextjs.org/docs/app/getting-started/server-and-client-components]
- Avoid redundant React state for section labels, statuses, or rendered lists. Derive them from the current `playbook` object and fixture metadata, consistent with React guidance to avoid redundant or duplicate state. [Source: React docs, `Managing State`, accessed June 12, 2026: https://react.dev/learn/managing-state]
- Continue using responsive Tailwind utilities for the current 3-panel layout instead of custom breakpoint logic. [Source: Tailwind CSS responsive design docs, accessed June 12, 2026: https://tailwindcss.com/docs/responsive-design]
- If segmented navigation or tab-like section switching becomes useful during refactor, prefer existing shadcn/Radix-compatible patterns instead of inventing a custom tabs primitive. [Source: shadcn/ui Tabs docs, accessed June 12, 2026: https://ui.shadcn.com/docs/components/radix/tabs]

### File Structure Requirements

- `src/components/workbench/agent-studio-workbench.tsx` (UPDATE)
- `src/components/workbench/repo-rail.tsx` (UPDATE)
- `src/lib/sample-repo/fixtures.ts` (UPDATE)
- `tests/e2e/sample-flow.spec.ts` (UPDATE)
- `src/components/workbench/playbook-summary.tsx` (NEW, recommended if extracting the canonical summary)
- `src/components/workbench/playbook-section-list.tsx` (NEW, recommended for section labels/statuses)
- `src/components/workbench/imported-section.tsx` (NEW, recommended for repeated imported/read-only section rendering)

### Testing Requirements

- Extend the existing Playwright smoke flow rather than replacing it.
- After clicking `Create Agent Playbook`, assert the UI shows `Skills`, `Agents`, `Rules`, `Context`, and `Tool Translators`.
- Assert `Rules` is visually labeled editable, and `Skills`, `Agents`, and `Context` are visually labeled imported/read-only.
- Assert `Tool Translators` wording appears and `Tool adapters` does not.
- Keep the mobile readability smoke test passing.
- Add Vitest coverage only for any new pure helper extracted from the workbench refactor.

### Previous Story Intelligence

From Story 1.5:

- Keep `.agent-studio/playbook.yaml` presented as canonical and native tool files as outputs.
- Avoid in-render data computations when they become non-trivial; extract helpers or memoized derivations where appropriate.
- Preserve inline failure handling for Playbook generation; do not regress to an unhandled throw path.
- Imported-vs-edited visual distinction was intentionally deferred until Rules editing exists. For Story 2.1, only establish the non-editable vs editable section affordance, not edited Rule styling yet. [Source: `_bmad-output/implementation-artifacts/1-5-generate-draft-agent-playbook-from-detected-files.md` and `_bmad-output/implementation-artifacts/deferred-work.md`]

### Latest Tech Information

- This repo is on Next.js `16.2.6` and React `19.2.4` per `package.json`. The current official Next.js App Router docs state that routes are server-rendered by default and interactive stateful UI should be explicitly placed in Client Components with `"use client"`. That reinforces keeping `page.tsx` simple and pushing section-view interactivity into the existing workbench client boundary. [Source: `package.json`; Next.js docs accessed June 12, 2026]
- Current React guidance emphasizes structuring state to avoid redundancy and lifting shared state to the closest common owner. That supports keeping the Playbook state in `AgentStudioWorkbench` and passing derived section data downward. [Source: React docs accessed June 12, 2026]
- Current Tailwind guidance still favors breakpoint-prefixed utilities for responsive behavior, which matches the existing grid/layout approach and should be preserved during the refactor. [Source: Tailwind docs accessed June 12, 2026]

### Project Context Reference

- No `project-context.md` file was found in the workspace during workflow activation.

### Completion Note

Ultimate context engine analysis completed - comprehensive developer guide created.

## Dev Agent Record

### Agent Model Used

Codex GPT-5

### Debug Log References

- Story creation analysis used `_bmad-output/planning-artifacts/epics.md`, PRD, architecture, UX design, UX experience, current workbench source files, and Story 1.5 output.
- Git history analysis was skipped because `/Users/lamnh/Downloads/agent_std` is not currently a git repository.
- Dev workflow activation resolved customization with no prepend or append steps and no project-context.md found.
- Read local Next.js 16.2.6 docs for Server/Client Components and `use client` before validating the workbench component boundary.
- Verified focused E2E story coverage with `pnpm test:e2e -- tests/e2e/sample-flow.spec.ts`.

### Implementation Plan

- Keep `AgentStudioWorkbench` as the only Playbook state owner and derive section presentation from the generated Playbook.
- Use presentational workbench components for the canonical summary, section status list, and imported section cards.
- Preserve imported content display and source paths while limiting this story to status affordances, not Rules CRUD.
- Validate glossary language and section statuses through Playwright coverage.

### Completion Notes List

- Selected the first backlog story from `sprint-status.yaml`: `2-1-display-agent-playbook-sections-in-the-workbench`.
- Mapped the story to current implementation files already responsible for Playbook rendering and repo-rail terminology.
- Added guardrails to preserve the existing canonical Playbook flow while preparing for Story 2.2 and Story 2.3.
- Completed Story 2.1 section-oriented Playbook viewer validation: Skills, Agents, Rules, Context, and Tool Translators render after Playbook creation.
- Confirmed Rules is labeled Editable while Skills, Agents, and Context are labeled Read-only; no Rules CRUD was introduced.
- Confirmed `Tool Translators` replaces old `Tool adapters` terminology in fixture-driven UI and rendered workbench surfaces.
- Full validation passed: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:e2e`, and `pnpm build`.
- Resolved code review findings by showing `Imported/read-only` for imported sections, sharing section status derivation between list and detail cards, and guarding against `Exporter` copy regressions in E2E coverage.

### File List

- `_bmad-output/implementation-artifacts/2-1-display-agent-playbook-sections-in-the-workbench.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `src/components/workbench/agent-studio-workbench.tsx`
- `src/components/workbench/imported-section.tsx`
- `src/components/workbench/playbook-section-list.tsx`
- `src/components/workbench/playbook-sections.test.ts`
- `src/components/workbench/playbook-sections.ts`
- `src/components/workbench/playbook-status.ts`
- `src/components/workbench/playbook-summary.tsx`
- `src/components/workbench/repo-rail.tsx`
- `src/components/workbench/status-badge.tsx`
- `src/lib/sample-repo/fixtures.ts`
- `tests/e2e/sample-flow.spec.ts`

## Change Log

- 2026-06-12: Created Story 2.1 context and moved story to ready-for-dev.
- 2026-06-15: Completed Story 2.1 validation, marked all tasks complete, and moved story to review.
- 2026-06-15: Addressed code review patch findings and moved story to done.
