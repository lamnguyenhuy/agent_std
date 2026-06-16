# Story 2.1 Workbench Sections Design

Date: 2026-06-12
Story: `2-1-display-agent-playbook-sections-in-the-workbench`
Status: Drafted for review

## Goal

Implement Story 2.1 by turning the current inline Playbook rendering into an explicit section viewer that:

- shows `Skills`, `Agents`, `Rules`, `Context`, and `Tool Translators`
- uses exact glossary wording from the PRD
- marks `Rules` as editable
- marks `Skills`, `Agents`, and `Context` as imported/read-only
- preserves the existing canonical `.agent-studio/playbook.yaml` flow

This story does not add rule editing controls. It only establishes the viewer structure and status affordances needed for Stories 2.2 and 2.3.

## Constraints

- Keep `AgentStudioWorkbench` as the single state owner.
- Do not add backend APIs, server actions, auth, persistence, or repo access.
- Keep `page.tsx` and `layout.tsx` as server-rendered wrappers.
- Keep interactive UI under the existing `"use client"` boundary.
- Avoid redundant React state; derive section display from `playbook` plus fixture metadata.
- Keep scope tight to Story 2.1. No rule CRUD yet.

## Recommended Approach

Refactor the current Playbook display into focused presentation components now, instead of waiting for later stories.

Why:

- It aligns with the architecture document's `src/components/workbench/*` boundaries.
- It removes the current wording mismatch (`Tool adapters` vs `Tool Translators`).
- It creates clean insertion points for Story 2.2 read-only detail work and Story 2.3 Rules editing.
- It avoids repeating a broad render refactor in two consecutive stories.

## Component Design

### `AgentStudioWorkbench`

Keeps ownership of:

- `playbook`
- `playbookError`
- `workspace`
- `detectedFileCount`
- `handleCreatePlaybook`

Responsibilities after refactor:

- render page layout
- create the Playbook
- pass derived data to section-view components
- preserve existing canonical Playbook summary and detected-file areas

### `playbook-summary.tsx`

Purpose:

- render the canonical `.agent-studio/playbook.yaml` header
- render name/version/repo/description summary
- keep source-of-truth messaging explicit

Non-goals:

- no section-specific rendering
- no editing behavior

### `playbook-section-list.tsx`

Purpose:

- render the five section names with status affordances
- enforce exact wording:
  - `Skills`
  - `Agents`
  - `Rules`
  - `Context`
  - `Tool Translators`

Expected statuses for Story 2.1:

- `Skills`: imported/read-only
- `Agents`: imported/read-only
- `Rules`: editable
- `Context`: imported/read-only
- `Tool Translators`: enabled

This component should be presentational and receive a small typed list from the workbench.

### `imported-section.tsx`

Purpose:

- render repeated read-only imported sections consistently
- support `Skills`, `Agents`, and `Context`
- show an imported/read-only affordance without implying CRUD

Expected content:

- section title
- small status badge or label
- existing item display content
- existing source-path display where available

This component should not know about global workbench state.

## Data Model Changes

Update `src/lib/sample-repo/fixtures.ts`:

- rename section union value `Tool adapters` to `Tool Translators`
- keep the rest of the fixture structure stable unless a small derived-type cleanup is needed

Update any code that consumes the section name so the wording is consistent across:

- repo rail
- playbook viewer
- tests

## Rendering Rules

- `Rules` must be visually labeled editable, but must not render add/edit/remove controls yet.
- `Skills`, `Agents`, and `Context` must be visibly read-only/imported.
- `Tool Translators` must not be labeled as exporters or adapters.
- Existing imported content rendering should remain visible after Playbook creation.
- Existing Playbook generation error handling must remain intact.

## Testing Plan

Primary test surface:

- update `tests/e2e/sample-flow.spec.ts`

Assertions after `Create Agent Playbook`:

- the UI shows `Skills`, `Agents`, `Rules`, `Context`, and `Tool Translators`
- `Rules` has an editable affordance
- `Skills`, `Agents`, and `Context` have imported/read-only affordances
- `Tool adapters` no longer appears
- existing create-Playbook flow still works
- mobile smoke still passes

Optional unit tests:

- only add Vitest coverage if a new pure helper is extracted for section derivation or status mapping

## Files Expected To Change

Update:

- `src/components/workbench/agent-studio-workbench.tsx`
- `src/components/workbench/repo-rail.tsx`
- `src/lib/sample-repo/fixtures.ts`
- `tests/e2e/sample-flow.spec.ts`

Add:

- `src/components/workbench/playbook-summary.tsx`
- `src/components/workbench/playbook-section-list.tsx`
- `src/components/workbench/imported-section.tsx`

## Risks

### Over-scoping into Story 2.2 or 2.3

Mitigation:

- no new editing controls
- no item expansion beyond what current imported rendering already supports
- no state model changes beyond section wording and derived view structure

### Regressing the create-Playbook flow

Mitigation:

- keep `handleCreatePlaybook` and state ownership in `AgentStudioWorkbench`
- preserve existing E2E assertions and extend them incrementally

### Inconsistent wording across rail and viewer

Mitigation:

- centralize section labels in fixture/derived data where possible
- assert absence of `Tool adapters` in E2E

## Implementation Sequence

1. Update section naming and typed section metadata.
2. Extract presentation components.
3. Rewire `AgentStudioWorkbench` to use extracted components.
4. Update repo rail status wording to match.
5. Extend Playwright coverage.
6. Run typecheck, lint, unit tests, E2E, and build.

## Review Notes

This design is intentionally narrow. It creates clean component boundaries now so Stories 2.2 and 2.3 can add behavior without reworking the full workbench again.
