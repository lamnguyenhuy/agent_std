---
baseline_commit: NO_VCS
---

# Story 1.5: Generate Draft Agent Playbook from Detected Files

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a tech lead,
I want to generate a draft `.agent-studio/playbook.yaml` from detected files,
So that scattered instructions become one Git-native source of truth.

## Acceptance Criteria

1. Given detected Sample Repo artifacts are available, when the user clicks `Create Agent Playbook`, then Agent Studio generates a deterministic draft Agent Playbook.
2. Given detected Sample Repo artifacts are available, when the user clicks `Create Agent Playbook`, then the Playbook includes name, version, repo, description, skills, agents, rules, context, and enabled Tool Translators.
3. Given detected Sample Repo artifacts are available, when the user clicks `Create Agent Playbook`, then imported items preserve source-file traceability where possible.
4. Given detected Sample Repo artifacts are available, when the user clicks `Create Agent Playbook`, then imported content is visually distinguishable from user-edited content.
5. Given detected Sample Repo artifacts are available, when the user clicks `Create Agent Playbook`, then `.agent-studio/playbook.yaml` is presented as canonical.
6. Given detected Sample Repo artifacts are available, when the user clicks `Create Agent Playbook`, then generated native config files are not presented as the source of truth.

## Tasks / Subtasks

- [x] Implement Playbook schema and generation logic. (AC: 1, 2)
  - [x] Define Zod schema for `AgentPlaybook` in `src/lib/playbook/schema.ts` matching the architecture constraints.
  - [x] Implement pure `generatePlaybookDraft` function in `src/lib/playbook/generate.ts` taking detected files and returning a valid `AgentPlaybook`.
  - [x] Ensure generation maps detected skills, rules, and context appropriately, ensuring source traceability (e.g. keeping track of the source file path).
  - [x] Ensure determinism for the bundled Sample Repo.
- [x] Connect "Create Agent Playbook" action in the UI. (AC: 3, 4, 5, 6)
  - [x] Update `src/components/workbench/agent-studio-workbench.tsx` to enable the "Create Agent Playbook" button.
  - [x] Introduce Workbench state (e.g., using `useState` or derived state) to track if the playbook has been created.
  - [x] Update UI to display the Playbook structure (name, version, description) when loaded.
  - [x] Present `.agent-studio/playbook.yaml` as canonical (adjust UI wording as necessary to emphasize this).
- [x] Add domain unit tests. (AC: 1, 2, 3)
  - [x] Create `src/lib/playbook/generate.test.ts` and `src/lib/playbook/schema.test.ts`.
  - [x] Assert playbook schema validation works for valid and invalid payloads.
  - [x] Assert `generatePlaybookDraft` produces a deterministic and schema-valid Playbook from the known sample repo fixtures.
- [x] Update E2E smoke tests. (AC: 1)
  - [x] Assert clicking "Create Agent Playbook" successfully transitions the UI and updates the workspace state.
- [x] Verify implementation locally. (AC: 1-6)
  - [x] Run `pnpm install --frozen-lockfile`.
  - [x] Run `pnpm typecheck`.
  - [x] Run `pnpm lint`.
  - [x] Run `pnpm test`.
  - [x] Run `pnpm test:e2e`.
  - [x] Run `pnpm build`.
  - [x] Run touched-file Prettier check.
  - [x] Run a boundary scan confirming no backend/auth/GitHub/filesystem/arbitrary repo scope was introduced.

### Review Findings

- [x] [Review][Defer] Imported vs edited visual distinction scope — deferred to Story 2.3: Edited-state visual distinction only becomes meaningful once the Rules editor is active and user-edited Rule styling exists.
- [x] [Review][Patch] Imported rule traceability is not enforced by schema [src/lib/playbook/schema.ts:27]
- [x] [Review][Patch] Generator determinism still depends on input path normalization and can collapse case-variant files into conflicting entries [src/lib/playbook/generate.ts:13]
- [x] [Review][Patch] Workbench marks sections as imported even when generated playbook sections are empty [src/components/workbench/agent-studio-workbench.tsx:14]
- [x] [Review][Patch] Playbook creation has no failure boundary for schema parse errors [src/components/workbench/agent-studio-workbench.tsx:59]

## Dev Notes

Story 1.5 is the core of Epic 1, establishing the Git-native `.agent-studio/playbook.yaml` as the canonical representation. It introduces the `AgentPlaybook` domain model and connects the generation action in the UI.

### Story Source

- Epic: Epic 1, `Demo Workspace and Git-Native Playbook Foundation`.
- Story requirement ID: `FR-4`, `FR-5`.
- Source acceptance criteria: `_bmad-output/planning-artifacts/epics.md`, `Story 1.5: Generate Draft Agent Playbook from Detected Files`.
- PRD requirement: Agent Studio generates a deterministic draft Agent Playbook from detected Sample Repo artifacts. [Source: `_bmad-output/planning-artifacts/prds/prd-agent_std-2026-06-09/prd.md#FR-4-Generate-Draft-Agent-Playbook`]

### Architecture Compliance

- AgentPlaybook must include `name`, `version`, `repo`, `description`, `skills`, `agents`, `rules`, `context`, and `translators`. [Source: `_bmad-output/planning-artifacts/architecture.md#Data-Architecture`]
- Use Zod schemas at Playbook generation boundaries (`AgentPlaybookSchema`). [Source: `_bmad-output/planning-artifacts/architecture.md#Data-Architecture`]
- Place pure domain generation logic in `src/lib/playbook/generate.ts`. [Source: `_bmad-output/planning-artifacts/architecture.md#Frontend-Architecture`]
- Do not store duplicate copies of generated outputs in global state. Derive state or store canonical only.
- No database tables, migrations, ORM models, persistence adapters, or server APIs.

### Library/Framework Requirements

- Use `zod` for playbook validation.
- Use `useMemo` where derived state from Playbook is needed in React.

### File Structure Requirements

- `src/lib/playbook/schema.ts` (NEW)
- `src/lib/playbook/generate.ts` (NEW)
- `src/lib/playbook/schema.test.ts` (NEW)
- `src/lib/playbook/generate.test.ts` (NEW)
- `src/components/workbench/agent-studio-workbench.tsx` (UPDATE)

### Testing Requirements

- Unit tests for `generate.ts` and `schema.ts`.
- E2E smoke tests for clicking "Create Agent Playbook".

### Previous Story Intelligence

**Code Review Learnings from Story 1.4:**

- Avoid in-render data computations (use `useMemo`).
- Avoid side-effects on module import (use lazy getters or explicit functions).
- Use robust path parsing (handle Windows backslashes with `.replace(/\\/g, '/')`).
- Always include null/undefined guards for array parameters and iterations.
- Path matching should be case-insensitive where appropriate.

### Latest Tech Information

- Next.js App Router and React 19 best practices should be followed.
- Zod schema validation should be strict to ensure playbook integrity.

### Git Intelligence Summary

- Git history is unavailable because `/Users/lamnh/Downloads/agent_std` is not currently a git repository.

### Project Context Reference

- No `project-context.md` file was found in the workspace during workflow activation.

### Completion Note

Ultimate context engine analysis completed - comprehensive developer guide created.

## Dev Agent Record

### Agent Model Used

Codex GPT-5

### Debug Log References

- Red phase: `pnpm test -- src/lib/playbook/schema.test.ts src/lib/playbook/generate.test.ts` failed because `src/lib/playbook/schema.ts` and `src/lib/playbook/generate.ts` did not exist yet.
- Red phase: `pnpm test:e2e --grep "renders the Sample Repo as the primary workspace"` failed because `Create Agent Playbook` was still disabled and the canonical Playbook UI did not exist yet.
- Green phase: targeted E2E surfaced a Next.js server/client boundary error after adding `useState`; adding `"use client"` to `agent-studio-workbench.tsx` resolved it.
- Boundary scan over `src` found no backend/API/server action/filesystem/GitHub/marketplace scope.
- Review patch cycle: added imported-rule schema enforcement, rejected case-variant path conflicts in generator, derived section statuses from actual playbook content, and added inline playbook generation error handling.

### Completion Notes List

- Added strict Zod domain schemas for the canonical Agent Playbook, imported items, and Tool Translators.
- Added pure `generatePlaybookDraft()` logic that converts detected Sample Repo files plus fixture content into a deterministic `.agent-studio/playbook.yaml` model with source traceability.
- Promoted the workbench to a client component, enabled `Create Agent Playbook`, and rendered canonical Playbook summary state with imported/read-only sections and clear source-of-truth messaging.
- Updated repo rail status rendering so detected files and Playbook sections shift from pending/detected to imported/enabled after draft generation.
- Added focused unit coverage for Playbook schema validation and deterministic draft generation, plus E2E smoke coverage for the create-playbook transition.
- Verified with frozen install, typecheck, lint, unit tests, E2E smoke, production build, touched-file Prettier check, and boundary scan.
- Resolved all actionable code review patches for Story 1.5; deferred edited-state visual distinction to Story 2.3 by explicit product decision.

### File List

- `_bmad-output/implementation-artifacts/1-5-generate-draft-agent-playbook-from-detected-files.md`
- `_bmad-output/implementation-artifacts/deferred-work.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `package.json`
- `pnpm-lock.yaml`
- `src/components/workbench/agent-studio-workbench.tsx`
- `src/components/workbench/detected-file-row.tsx`
- `src/components/workbench/repo-rail.tsx`
- `src/lib/playbook/generate.test.ts`
- `src/lib/playbook/generate.ts`
- `src/lib/playbook/schema.test.ts`
- `src/lib/playbook/schema.ts`
- `src/lib/sample-repo/fixtures.ts`
- `tests/e2e/sample-flow.spec.ts`

## Change Log

- 2026-06-10: Created Story 1.5 context and moved story to ready-for-dev.
- 2026-06-10: Implemented canonical Playbook draft generation, UI transition, and verification; moved story to review.
- 2026-06-10: Applied code review patches, recorded one deferred item, and moved story to done.
