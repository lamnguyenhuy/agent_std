---
baseline_commit: NO_VCS
---

# Story 1.4: Detect Agent Instruction Files in the Sample Repo

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a tech lead,
I want Agent Studio to detect scattered agent instruction files,
so that I can see what will be consolidated into a Playbook.

## Acceptance Criteria

1. Given the bundled Sample Repo fixture exists, when Agent Studio scans the fixture, then it detects `CLAUDE.md`.
2. Given the bundled Sample Repo fixture exists, when Agent Studio scans the fixture, then it detects `.cursorrules`.
3. Given the bundled Sample Repo fixture exists, when Agent Studio scans the fixture, then it detects files under `.claude/skills/`.
4. Given the bundled Sample Repo fixture exists, when Agent Studio scans the fixture, then it detects configured docs under `docs/`.
5. Given the bundled Sample Repo fixture exists, when Agent Studio scans the fixture, then unknown fixture files are ignored for MVP.
6. Given detected files are available, when the Demo Workspace is shown, then detected files are displayed with path, type, and detected/imported status.

## Tasks / Subtasks

- [x] Model the bundled Sample Repo fixture as controlled file data. (AC: 1, 2, 3, 4, 5)
  - [x] Refactor `src/lib/sample-repo/fixtures.ts` so it contains the workspace metadata plus a typed collection of sample repo files.
  - [x] Include representative fixture entries for `CLAUDE.md`, `.cursorrules`, `.claude/skills/code-review.md`, `.claude/skills/test-writer.md`, `docs/architecture.md`, `docs/conventions.md`, and `docs/glossary.md`.
  - [x] Include at least one unknown fixture file, such as `README.md` or `src/app/page.tsx`, so scanner tests prove unknown files are ignored.
  - [x] Keep fixture data in TypeScript modules under `src/lib/sample-repo`; do not move fixture content to `public/`, filesystem reads, uploads, or API routes.
- [x] Implement a deterministic sample repo scanner domain module. (AC: 1, 2, 3, 4, 5, 6)
  - [x] Add `src/lib/sample-repo/scanner.ts`.
  - [x] Export a pure scanner function that accepts fixture files and returns detected artifacts in deterministic order.
  - [x] Detect only these MVP patterns:
    - root `CLAUDE.md` as `Claude instructions`
    - root `.cursorrules` as `Cursor rules`
    - `.claude/skills/*.md` as `Claude skill`
    - configured docs only: `docs/architecture.md`, `docs/conventions.md`, and `docs/glossary.md` as `Project docs`
  - [x] Ignore unknown paths, unknown docs, non-Markdown skill paths, nested unsupported config files, and arbitrary repo structures.
  - [x] Preserve enough metadata for UI rows: `path`, `type`, and `status`.
  - [x] For Story 1.4, use `detected` status for scanner output; reserve imported state transitions for later Playbook-generation stories.
- [x] Feed scanner output into the existing workspace UI without changing later workflow behavior. (AC: 6)
  - [x] Update `sampleRepoWorkspace` composition so detected file groups are derived from scanner output instead of manually duplicated static rows.
  - [x] Preserve Story 1.3 UI copy and landmarks: `Sample Repo rail`, `Playbook editor`, and `Preview and Review inspector`.
  - [x] Preserve disabled future workflow actions: `Create Agent Playbook`, `Download Patch`, `Preview`, and `Review`.
  - [x] Do not implement draft `.agent-studio/playbook.yaml`, imported content parsing, source-to-Playbook traceability, Rules editing, translators, Plan, Behavior Diff, export, GitHub, local filesystem, or arbitrary repo scanning in this story.
- [x] Add focused scanner tests. (AC: 1, 2, 3, 4, 5, 6)
  - [x] Add `src/lib/sample-repo/scanner.test.ts` or equivalent co-located Vitest coverage.
  - [x] Assert the scanner detects `CLAUDE.md`.
  - [x] Assert the scanner detects `.cursorrules`.
  - [x] Assert the scanner detects both `.claude/skills/code-review.md` and `.claude/skills/test-writer.md`.
  - [x] Assert the scanner detects only configured docs under `docs/`.
  - [x] Assert unknown fixture files are not returned.
  - [x] Assert output order and statuses are deterministic.
- [x] Update E2E smoke coverage only where useful. (AC: 6)
  - [x] Keep `tests/e2e/sample-flow.spec.ts` asserting all detected file paths still render in the repo rail.
  - [x] Add an assertion that the unknown fixture file is not displayed.
  - [x] Keep responsive overflow and forbidden interactive CTA assertions from Story 1.3.
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

- [x] [Review][Patch] In-Render Data Computations [src/components/workbench/agent-studio-workbench.tsx:9-12]
- [x] [Review][Patch] Side-Effects on Module Import [src/lib/sample-repo/fixtures.ts]
- [x] [Review][Patch] Amateur Path Parsing & Windows Backslash [src/lib/sample-repo/scanner.ts:24-46]
- [x] [Review][Patch] Missing null/undefined guards in files parameter [src/lib/sample-repo/scanner.ts:50-67]
- [x] [Review][Patch] Path exact matching for config files [src/lib/sample-repo/scanner.ts]
- [x] [Review][Patch] Missing null guard for group.files [src/components/workbench/agent-studio-workbench.tsx]
- [x] [Review][Defer] Hardcoded Fixture Dependencies in UI [src/components/workbench/agent-studio-workbench.tsx] — deferred, pre-existing
- [x] [Review][Defer] Brittle Grid Layout [src/components/workbench/agent-studio-workbench.tsx] — deferred, pre-existing
- [x] [Review][Defer] Unscalable Tooltips [src/components/workbench/agent-studio-workbench.tsx] — deferred, pre-existing
- [x] [Review][Defer] Design System Violations [src/components/workbench/agent-studio-workbench.tsx] — deferred, pre-existing
- [x] [Review][Defer] Bloated E2E Test Anti-Pattern [tests/e2e/sample-flow.spec.ts] — deferred, pre-existing
- [x] [Review][Defer] Meaningless Mobile Layout Test [tests/e2e/sample-flow.spec.ts] — deferred, pre-existing

## Dev Notes

Story 1.4 is the first real domain behavior story for Sample Repo scanning. It should convert the Story 1.3 display-only detected-file model into scanner-derived data, while keeping the scanner narrow and deterministic. Do not use this story to generate a Playbook or parse native tool files into rules/skills content.

### Story Source

- Epic: Epic 1, `Demo Workspace and Git-Native Playbook Foundation`.
- Story requirement ID: `FR-3`.
- Source acceptance criteria: `_bmad-output/planning-artifacts/epics.md`, `Story 1.4: Detect Agent Instruction Files in the Sample Repo`.
- PRD requirement: the scanner identifies `CLAUDE.md`, `.cursorrules`, files under `.claude/skills/`, and configured docs under `docs/`; unknown files are ignored in MVP. [Source: `_bmad-output/planning-artifacts/prds/prd-agent_std-2026-06-09/prd.md#FR-3-Detect-Existing-Agent-Configs`]

### Architecture Compliance

- Use the existing Next.js App Router + React + TypeScript + Tailwind + shadcn/ui foundation. Do not replace the scaffold. [Source: `_bmad-output/planning-artifacts/architecture.md#Technology-Stack`]
- Keep the scanner in `src/lib/sample-repo/scanner.ts`; keep fixture data entering through `src/lib/sample-repo/fixtures.ts`. [Source: `_bmad-output/planning-artifacts/architecture.md#Requirements-to-Structure-Mapping`]
- Keep scanner logic pure and deterministic. No filesystem reads, no browser storage, no network, no API routes, no server actions, no GitHub integration, and no arbitrary repo access. [Source: `_bmad-output/planning-artifacts/architecture.md#Data-Boundaries`]
- Sample Repo fixture content lives in TypeScript modules under `src/lib/sample-repo`, not `public/`. [Source: `_bmad-output/planning-artifacts/architecture.md#Asset-Organization`]
- Domain unit tests should live next to domain modules. Add scanner tests beside `scanner.ts`. [Source: `_bmad-output/planning-artifacts/architecture.md#Test-Organization`]

### UX Requirements

- The repo rail remains the display surface for detected files. Detected file rows show path, type, and detected/imported status and are read-only in MVP. [Source: `_bmad-output/planning-artifacts/ux-designs/ux-agent_std-2026-06-09/EXPERIENCE.md#Component-and-Interaction-Specifications`]
- The Demo Workspace should continue showing `sample-nextjs-repo` with detected files: `CLAUDE.md`, `.cursorrules`, `.claude/skills/*`, and docs. [Source: `_bmad-output/planning-artifacts/ux-designs/ux-agent_std-2026-06-09/EXPERIENCE.md#Flow-1-Taylor-creates-a-Playbook-from-the-Sample-Repo`]
- Preserve Story 1.3's review fixes: disabled unavailable future workflow actions, anchor-based repo rail navigation, explicit repo/import status, mobile overflow coverage, and forbidden interactive CTA assertions.

### Current Codebase State

- `src/lib/sample-repo/fixtures.ts` currently holds both workspace metadata and manually listed detected file groups. Story 1.4 should keep the workspace metadata but move detection responsibility into scanner-derived output.
- `DetectedFile`, `DetectedFileGroup`, `SampleRepoWorkspace`, and `sampleRepoWorkspace` already exist in `fixtures.ts`; extend or refactor these types conservatively instead of inventing unrelated shapes.
- `src/components/workbench/repo-rail.tsx` renders `workspace.detectedFileGroups` and expects each group to have `id`, `label`, and `files`.
- `src/components/workbench/detected-file-row.tsx` renders each detected file with `path`, `type`, and status label.
- `src/components/workbench/agent-studio-workbench.tsx` derives `detectedFileCount` from `workspace.detectedFileGroups`.
- `tests/e2e/sample-flow.spec.ts` already asserts all Story 1.3 visible paths, disabled future workflow controls, forbidden interactive CTAs, and mobile overflow.
- The workspace is not a git repository, so do not depend on git commands for implementation or verification.

### Expected File Changes

Likely new files:

- `src/lib/sample-repo/scanner.ts`
- `src/lib/sample-repo/scanner.test.ts`

Likely updated files:

- `src/lib/sample-repo/fixtures.ts`
- `tests/e2e/sample-flow.spec.ts`

Possible updated files if type imports or grouping semantics require it:

- `src/components/workbench/repo-rail.tsx`
- `src/components/workbench/detected-file-row.tsx`
- `src/components/workbench/agent-studio-workbench.tsx`

Do not add dependencies for this story. TypeScript, Vitest, and current UI dependencies are sufficient.

### Testing Requirements

- Scanner behavior must be covered by Vitest unit tests. This is the primary test surface for Story 1.4.
- E2E remains smoke-level: prove scanner-derived detected files appear and unknown files do not appear; do not click disabled future workflow actions.
- Run all verification commands listed in Tasks before moving to review.
- Boundary scan example: `rg -n "src/app/api|server action|use server|node:fs|from ['\\\"]fs|from ['\\\"]node:fs|octokit|github\\.com|OAuth|Connect repo|Playbook Library|Marketplace" src tests`.

### Latest Technical Information

- Vitest official docs continue to document `vitest run` as the one-shot test execution style appropriate for CI-like local verification. Use existing `pnpm test` rather than adding a new test runner. [Source: `https://vitest.dev/guide/`]
- Playwright locators provide auto-waiting/retry behavior and role/text locators remain the right pattern for E2E smoke assertions. Continue scoped role locators from Story 1.3. [Source: `https://playwright.dev/docs/locators`]

### Previous Story Intelligence

- Story 1.3 is `done` after code review.
- Story 1.3 added `sampleRepoWorkspace`, `RepoRail`, and `DetectedFileRow`; Story 1.4 should build on these instead of replacing the UI shell.
- Story 1.3 code review fixed missing repo/import status, missing Playbook sections, no-op rail buttons, enabled unavailable actions, missing mobile overflow coverage, and weak forbidden-action assertions. Do not regress any of those fixes.
- Story 1.3 currently disables `Download Patch`, `Create Agent Playbook`, `Preview`, and `Review`; keep them disabled because Playbook generation and exports are later stories.
- Story 1.3 verification passed after review patches: frozen install, typecheck, lint, unit tests, E2E smoke, build, touched-file Prettier check, and source boundary scan.
- Story 1.2 established `packageManager: pnpm@10.34.1`, Node `>=22.12.0 <23`, `typecheck` as `next typegen && tsc --noEmit`, Vitest, Playwright, and CI. Do not regress these scripts.

### Git Intelligence Summary

Git history is unavailable because `/Users/lamnh/Downloads/agent_std` is not currently a git repository.

### Project Context Reference

No `project-context.md` file was found in the workspace during workflow activation.

### Completion Note

Ultimate context engine analysis completed - comprehensive developer guide created.

## Dev Agent Record

### Agent Model Used

Codex GPT-5

### Debug Log References

- Red phase: `pnpm test -- src/lib/sample-repo/scanner.test.ts` failed because `src/lib/sample-repo/scanner.ts` did not exist yet.
- Touched-file Prettier check initially failed on `src/lib/sample-repo/scanner.ts`; running Prettier on the file fixed formatting.
- Boundary scan over `src` found no backend/API/server action/filesystem/GitHub/marketplace scope.

### Completion Notes List

- Added controlled `sampleRepoFiles` fixture data including required known files and unknown files used to prove ignored paths.
- Added pure deterministic `scanSampleRepoFiles()` and `groupDetectedFiles()` helpers in `src/lib/sample-repo/scanner.ts`.
- Refactored `sampleRepoWorkspace.detectedFileGroups` to derive from scanner output instead of manually duplicated static rows.
- Added scanner unit coverage for known detections, configured docs, ignored unknown paths, deterministic ordering, and `detected` statuses.
- Updated E2E smoke coverage to assert `README.md` is not displayed while existing detected files still render.
- Verified with frozen install, typecheck, lint, unit tests, E2E smoke, production build, touched-file Prettier check, and source boundary scan.

### File List

- `_bmad-output/implementation-artifacts/1-4-detect-agent-instruction-files-in-the-sample-repo.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `src/components/workbench/agent-studio-workbench.tsx`
- `src/lib/sample-repo/fixtures.ts`
- `src/lib/sample-repo/scanner.test.ts`
- `src/lib/sample-repo/scanner.ts`
- `tests/e2e/sample-flow.spec.ts`

## Change Log

- 2026-06-10: Created Story 1.4 context and moved story to ready-for-dev.
- 2026-06-10: Implemented Sample Repo scanner and moved story to review.
