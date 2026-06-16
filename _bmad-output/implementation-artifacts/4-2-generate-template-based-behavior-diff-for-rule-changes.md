---
baseline_commit: NO_VCS
---

# Story 4.2: Generate Template-Based Behavior Diff for Rule Changes

Status: in-progress

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a tech lead,
I want a plain-language summary of Rule behavior changes,
so that I can review the impact without reading every generated file.

## Acceptance Criteria

1. Given the user adds a Rule after the initial imported Playbook is created, when the Behavior Diff is displayed, then the diff includes a row like `+ Agents must follow: "{rule}"`.
2. Given the user removes an imported or edited Rule, when the Behavior Diff is displayed, then the diff includes a row like `- Agents no longer must follow: "{rule}"`.
3. Given the user edits an existing Rule, when the Behavior Diff is displayed, then the diff shows the old Rule text and the new Rule text where available.
4. Given Behavior Diff rows are rendered, then additions/removals/edits use explicit symbols and labels in addition to color.
5. Given the Behavior Diff is displayed, then the UI does not claim AI semantic analysis.
6. Given no Rules have changed from the initial imported state, when the Review tab is displayed, then the Behavior Diff shows a clear deterministic empty state instead of blank space.

## Tasks / Subtasks

- [x] Task 1: Add Behavior Diff domain tests first. (AC: 1-6)
  - [x] Create `src/lib/review/behavior-diff.test.ts`.
  - [x] Test added Rules produce `+ Agents must follow: "{rule}"`.
  - [x] Test removed Rules produce `- Agents no longer must follow: "{rule}"`.
  - [x] Test edited Rules include both previous and current Rule text.
  - [x] Test unchanged Rules produce no diff items.
  - [x] Test output is deterministic for the same previous/current Rules.
  - [x] Test Rule text is normalized for template output so newlines/extra whitespace cannot break row structure.
  - [x] Confirm tests are RED before implementing `behavior-diff.ts`.
- [x] Task 2: Implement `src/lib/review/behavior-diff.ts`. (AC: 1-6)
  - [x] Create `src/lib/review/behavior-diff.ts`.
  - [x] Import only `PlaybookRule` type from `@/lib/playbook/schema`; do not import React or UI modules.
  - [x] Define and export `BehaviorDiffItem` type with enough data for UI rows, for example `{ id: string; kind: "added" | "removed" | "edited"; marker: "+" | "-" | "~"; label: string; summary: string; before?: string; after?: string }`.
  - [x] Implement and export `generateBehaviorDiff(previousRules: PlaybookRule[], currentRules: PlaybookRule[]): BehaviorDiffItem[]`.
  - [x] Match Rules by stable `rule.id`.
  - [x] Preserve previous/current array order deterministically: removals in previous order, additions/edits in current order.
  - [x] Do not perform semantic analysis. Use only template strings from Rule text.
  - [x] Normalize display text locally with whitespace collapse, matching translator normalization patterns.
  - [x] Confirm `pnpm test -- src/lib/review/behavior-diff.test.ts` is GREEN.
- [x] Task 3: Add Behavior Diff UI component with source-string contract tests. (AC: 4-6)
  - [x] Create `src/components/workbench/behavior-diff.test.ts` using the existing `readFileSync` source-string pattern.
  - [x] Assert source imports `BehaviorDiffItem` from `@/lib/review/behavior-diff`.
  - [x] Assert source renders `aria-label="Behavior Diff"` on the list.
  - [x] Assert source renders `item.marker`, `item.label`, and `item.summary`.
  - [x] Assert source uses explicit text labels such as `Added`, `Removed`, and `Edited`.
  - [x] Assert source includes color classes/tokens for success/addition, destructive/removal, and warning/edit styling.
  - [x] Assert source contains the empty-state text.
  - [x] Confirm tests are RED before implementation.
  - [x] Create `src/components/workbench/behavior-diff.tsx` with `"use client"`.
  - [x] Props: `{ items: BehaviorDiffItem[] }`.
  - [x] Empty state: `No Rule behavior changes yet.`.
  - [x] Render one row per item with symbol, label, and summary; for edited items, render both old and new text from `before` and `after`.
  - [x] Use non-color indicators (`+`, `-`, `~`, labels) as the primary distinction; color is supporting only.
- [x] Task 4: Wire Behavior Diff into `ReviewPanel`. (AC: 4-6)
  - [x] Extend `src/components/workbench/review-panel.test.ts`.
  - [x] Assert `ReviewPanel` imports `BehaviorDiff` from `@/components/workbench/behavior-diff`.
  - [x] Assert `ReviewPanel` imports `BehaviorDiffItem` from `@/lib/review/behavior-diff`.
  - [x] Assert `ReviewPanel` accepts a `behaviorDiff` prop.
  - [x] Assert `ReviewPanel` renders a `Behavior Diff` heading.
  - [x] Confirm tests are RED before implementation.
  - [x] Update `src/components/workbench/review-panel.tsx` props to `{ plan: PlanChange[] | null; behaviorDiff: BehaviorDiffItem[] | null }`.
  - [x] Keep the current no-Playbook null state.
  - [x] In the plan state, render Plan first and Behavior Diff below it. Do not add export controls in this story.
  - [x] Do not include copy that claims AI semantic analysis; if explanatory copy is needed, use wording like `Template-based summary from Rule text.`.
- [ ] Task 5: Wire Behavior Diff derivation into `AgentStudioWorkbench`. (AC: 1-6)
  - [ ] Extend `src/components/workbench/agent-studio-workbench.test.ts`.
  - [ ] Assert workbench source imports `generateBehaviorDiff` from `@/lib/review/behavior-diff`.
  - [ ] Assert workbench source contains `initialRules` state or an equivalent immutable baseline for initial imported Rules.
  - [ ] Assert workbench source contains `generateBehaviorDiff(` usage.
  - [ ] Assert `<ReviewPanel` receives a `behaviorDiff` prop.
  - [ ] Confirm tests are RED before implementation.
  - [ ] In `agent-studio-workbench.tsx`, import `generateBehaviorDiff` and `PlaybookRule` type if needed.
  - [ ] Add top-level baseline state such as `const [initialRules, setInitialRules] = useState<AgentPlaybook["rules"] | null>(null)`.
  - [ ] In `handleCreatePlaybook`, set `initialRules` to `nextPlaybook.rules` at the same time as `setPlaybook(nextPlaybook)`.
  - [ ] If playbook generation fails, clear `initialRules` with `setInitialRules(null)`.
  - [ ] Derive `behaviorDiff` with `useMemo`: return `null` unless both `playbook` and `initialRules` exist; otherwise `generateBehaviorDiff(initialRules, playbook.rules)`.
  - [ ] Pass `<ReviewPanel plan={plan} behaviorDiff={behaviorDiff} />`.
  - [ ] Do not store Behavior Diff rows as mutable state; derive them from source Playbook state.
- [ ] Task 6: Extend E2E coverage for Review tab Behavior Diff. (AC: 1-6)
  - [ ] In `tests/e2e/sample-flow.spec.ts`, extend the existing primary workspace flow.
  - [ ] After creating the Playbook and before Rule changes, open the Review tab and assert `Behavior Diff` heading plus `No Rule behavior changes yet.`.
  - [ ] Add a new Rule through the existing Rules editor and assert the Review tab shows `+`, `Added`, and `Agents must follow: "{rule}"`.
  - [ ] Edit an existing imported Rule and assert the Review tab shows `~`, `Edited`, the previous Rule text, and the new Rule text.
  - [ ] Remove an existing Rule and assert the Review tab shows `-`, `Removed`, and `Agents no longer must follow: "{rule}"`.
  - [ ] Assert the Review tab does not show `AI semantic analysis`, `semantic analysis`, or similar claims.
  - [ ] Keep existing Plan assertions intact.
  - [ ] Run `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3100 pnpm test:e2e tests/e2e/sample-flow.spec.ts` if the dev server is already running; otherwise run `pnpm test:e2e tests/e2e/sample-flow.spec.ts`.
- [ ] Task 7: Final full verification. (All ACs)
  - [ ] `pnpm test` passes.
  - [ ] `pnpm typecheck` passes.
  - [ ] `pnpm lint` passes.
  - [ ] `pnpm test:e2e tests/e2e/sample-flow.spec.ts` passes, using `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3100` when port 3100 is already occupied by the dev server.

## Dev Notes

### Story Source

- Epic: Epic 4, `Review Plan, Behavior Diff, and Patch Export`.
- Story requirement ID: `FR-14`.
- Source ACs: `_bmad-output/planning-artifacts/epics.md`, `Story 4.2: Generate Template-Based Behavior Diff for Rule Changes`.
- PRD requirement: Agent Studio generates a template-based Behavior Diff for Rule changes; added Rules use `+ Agents must follow: "{rule}"`, removed Rules use `- Agents no longer must follow: "{rule}"`, edited Rules show old and new text where available, and the UI must not claim full AI semantic analysis. [Source: `_bmad-output/planning-artifacts/prds/prd-agent_std-2026-06-09/prd.md`, FR-14]
- UX requirement: Review Inspector includes Behavior Diff; additions/removals must not rely on color alone and must use `+`, `-`, and labels. [Source: `_bmad-output/planning-artifacts/ux-designs/ux-agent_std-2026-06-09/EXPERIENCE.md`, Accessibility Floor]
- Visual guidance: Behavior Diff rows use neutral framing, success styling for added behavior, destructive styling for removed behavior, and warning styling for adapter/edit warnings. [Source: `_bmad-output/planning-artifacts/ux-designs/ux-agent_std-2026-06-09/DESIGN.md`, Behavior Diff Row]

### Current Code State

- `src/lib/review/plan.ts` exists and is a pure domain module with `PlanChange` and `generatePlan`.
- `src/components/workbench/review-panel.tsx` currently renders only a Plan heading and `PlanList`.
- `src/components/workbench/plan-list.tsx` uses `StatusBadge` and shows Plan rows with path and label.
- `src/components/workbench/agent-studio-workbench.tsx` owns Playbook state and currently derives `plan` with `useMemo` from `playbook` and `TRANSLATORS`.
- `src/components/workbench/agent-studio-workbench.tsx` does not currently keep an immutable baseline of initial imported Rules. Story 4.2 needs this baseline so added/removed/edited Rules can be compared against the initial imported Playbook state.
- The Rules editor updates canonical `playbook.rules` only when rule text is valid; invalid empty drafts are kept in `ruleTextDrafts` and should not be included in Behavior Diff for this story. Story 4.3 owns broader invalid-state/export-readiness synchronization.
- `tests/e2e/sample-flow.spec.ts` already opens the Review tab and verifies Plan rows after Preview tab assertions. Extend that flow rather than adding a disconnected E2E path.

### Previous Story Intelligence

Story 4.1 established these patterns:

- Add domain modules under `src/lib/review/` before UI wiring.
- Use real Vitest logic tests for pure domain functions.
- Use source-string tests for lightweight workbench component contracts because React Testing Library is not installed.
- Keep Review tab content in `ReviewPanel`; do not build review row markup inline inside `agent-studio-workbench.tsx`.
- Derive review state with `useMemo` in the top-level workbench; do not create duplicate mutable state for generated review surfaces.
- E2E may need `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3100` when the dev server is already running on port 3100.

Story 3.x established these protections:

- Normalize Playbook-provided text before rendering generated output so newlines or extra whitespace do not break deterministic display.
- Keep pure transformation modules isolated from React and workbench components.
- Use exact glossary terms: Agent Playbook, Tool Translator, Plan, Behavior Diff, Patch Export.
- Do not regress the Preview aside wrapper: keep `aria-label="Preview and Review inspector"`, `id="preview"`, and `className="min-h-[420px] rounded-lg border border-border bg-card"`.

### Architecture Compliance

- `src/lib/review/behavior-diff.ts` must be pure and deterministic: no React imports, no UI imports, no random IDs, no dates, no browser APIs.
- Workbench remains the single state owner. Store only source state (`playbook`, initial Rule baseline, drafts); derive Behavior Diff.
- Do not add Redux, Zustand, context providers, backend routes, server actions, persistence, GitHub auth, filesystem access, or export logic.
- Do not create `export/` modules, `export-actions.tsx`, `behavior-diff` export artifacts, patch files, or Behavior Diff synchronization/export readiness beyond this story.
- Do not implement Story 4.3: the baseline-derived Behavior Diff will update when valid Rule edits update `playbook.rules`, but invalid draft/export readiness behavior is out of scope.

### Next.js / UI Guardrails

- AGENTS.md says this is not the familiar Next.js version; local docs under `node_modules/next/dist/docs/` were checked before story creation.
- Relevant installed docs: App Router is active; Next.js App Router uses framework-bundled React behavior; accessibility guidance relies on correct titles/controls and linting to catch ARIA issues. [Source: `node_modules/next/dist/docs/index.md`, `node_modules/next/dist/docs/01-app/index.md`, `node_modules/next/dist/docs/03-architecture/accessibility.md`]
- Actual installed versions: Next.js `16.2.6`, React `19.2.4`, Vitest `4.1.8`, Playwright `1.60.0`, shadcn style `radix-nova`.
- Keep workbench UI dense and utilitarian. Do not add marketing copy, hero sections, decorative gradients, or nested cards.
- Behavior Diff rows must not rely on color only; visible labels and symbols are required.

### Suggested Behavior Diff Domain Contract

Use a compact contract similar to:

```ts
import type { PlaybookRule } from "@/lib/playbook/schema"

export type BehaviorDiffItem = {
  id: string
  kind: "added" | "removed" | "edited"
  marker: "+" | "-" | "~"
  label: "Added" | "Removed" | "Edited"
  summary: string
  before?: string
  after?: string
}

export function generateBehaviorDiff(
  previousRules: PlaybookRule[],
  currentRules: PlaybookRule[]
): BehaviorDiffItem[]
```

Recommended template strings:

- Added: `Agents must follow: "{rule}"`
- Removed: `Agents no longer must follow: "{rule}"`
- Edited summary: `Agents must follow updated Rule text.`
- Edited detail fields: `before` and `after` should hold normalized old/new Rule text.

Implementation notes:

- Build maps by `rule.id`.
- Removed: previous rule exists and current rule is missing.
- Added: current rule exists and previous rule is missing.
- Edited: same `id`, normalized `text` differs.
- Order: removed rows in previous order, then added/edited rows in current order. This is deterministic and easy to test.
- Empty output is valid; UI owns empty-state rendering.

### Testing Requirements

- Follow TDD: write failing tests, verify RED, implement minimal GREEN, refactor while green.
- Unit test target for domain: `pnpm test -- src/lib/review/behavior-diff.test.ts`.
- Source-string component test targets:
  - `pnpm test -- src/components/workbench/behavior-diff.test.ts`
  - `pnpm test -- src/components/workbench/review-panel.test.ts`
  - `pnpm test -- src/components/workbench/agent-studio-workbench.test.ts`
- Full verification before moving to review:
  - `pnpm test`
  - `pnpm typecheck`
  - `pnpm lint`
  - `pnpm test:e2e tests/e2e/sample-flow.spec.ts` or `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3100 pnpm test:e2e tests/e2e/sample-flow.spec.ts` if port 3100 is already in use.

### Project Structure Notes

- New domain file: `src/lib/review/behavior-diff.ts`.
- New domain test: `src/lib/review/behavior-diff.test.ts`.
- New UI component: `src/components/workbench/behavior-diff.tsx`.
- New UI source-string test: `src/components/workbench/behavior-diff.test.ts`.
- Modified UI files: `src/components/workbench/review-panel.tsx`, `src/components/workbench/review-panel.test.ts`, `src/components/workbench/agent-studio-workbench.tsx`, `src/components/workbench/agent-studio-workbench.test.ts`, `tests/e2e/sample-flow.spec.ts`.
- No conflict with current project structure. `src/lib/review/` already exists from Story 4.1 and is the correct home for review-domain transformations.

### References

- `_bmad-output/planning-artifacts/epics.md` — Epic 4, Story 4.2.
- `_bmad-output/planning-artifacts/prds/prd-agent_std-2026-06-09/prd.md` — FR-14 and FR-15 consequences.
- `_bmad-output/planning-artifacts/architecture.md` — review domain modules, single state owner, pure derived state, Behavior Diff generator.
- `_bmad-output/planning-artifacts/ux-designs/ux-agent_std-2026-06-09/EXPERIENCE.md` — Review Inspector, Behavior Diff, non-color-only diff semantics.
- `_bmad-output/planning-artifacts/ux-designs/ux-agent_std-2026-06-09/DESIGN.md` — Behavior Diff row styling guidance.
- `_bmad-output/implementation-artifacts/4-1-generate-file-level-plan-for-current-playbook.md` — previous story patterns and verification commands.
- `src/lib/review/plan.ts` — existing pure review-domain module pattern.
- `src/components/workbench/review-panel.tsx` — existing Review tab composition point.
- `src/components/workbench/agent-studio-workbench.tsx` — top-level Workbench state owner.
- `src/lib/playbook/schema.ts` — `PlaybookRule` type.
- `src/lib/playbook/update-rules.ts` — valid Rule text trimming behavior.
- `node_modules/next/dist/docs/index.md`, `node_modules/next/dist/docs/01-app/index.md`, `node_modules/next/dist/docs/03-architecture/accessibility.md` — local Next.js docs checked for this repo version.

## Dev Agent Record

### Agent Model Used

_TBD_

### Debug Log References

- 2026-06-16T09:07:17+0700: Started Story 4.2 implementation with BMAD dev-story workflow. No VCS baseline is available in this workspace.
- 2026-06-16T09:07:46+0700: Confirmed domain tests RED before implementation: `pnpm test -- src/lib/review/behavior-diff.test.ts` failed because `@/lib/review/behavior-diff` did not exist.
- 2026-06-16T09:07:59+0700: Confirmed domain tests GREEN after implementation: `pnpm test -- src/lib/review/behavior-diff.test.ts`.
- 2026-06-16T09:08:30+0700: Confirmed BehaviorDiff component tests RED before implementation: `pnpm test -- src/components/workbench/behavior-diff.test.ts` failed because `behavior-diff.tsx` did not exist.
- 2026-06-16T09:08:56+0700: Confirmed BehaviorDiff component tests GREEN after implementation: `pnpm test -- src/components/workbench/behavior-diff.test.ts`.
- 2026-06-16T09:09:24+0700: Confirmed ReviewPanel tests RED before implementation: `pnpm test -- src/components/workbench/review-panel.test.ts` failed on missing Behavior Diff imports, prop, and heading.
- 2026-06-16T09:09:35+0700: Confirmed ReviewPanel tests GREEN after implementation: `pnpm test -- src/components/workbench/review-panel.test.ts`.

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.

### File List

### Change Log

- 2026-06-16: Story 4.2 created — ready-for-dev.
