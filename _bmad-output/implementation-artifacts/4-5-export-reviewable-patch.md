---
baseline_commit: 2828957480173f92d19ccff7a626e894baae5de2
---

# Story 4.5: Export Reviewable Patch

Status: review

## Story

As a tech lead,
I want to download a zip archive containing a unified diff patch,
So that agent behavior changes can be reviewed like code.

## Acceptance Criteria

1. Given the current Playbook state is valid, when the user clicks "Download Patch", then the browser downloads a zip archive for patch review.
2. Given the user clicks "Download Patch", when the archive is created, then it includes `agent-studio.patch` as a unified diff artifact.
3. Given the user clicks "Download Patch", when the archive is created, then `agent-studio.patch` includes canonical Playbook changes (diff between initial playbook YAML and current playbook YAML).
4. Given the user clicks "Download Patch", when the archive is created, then `agent-studio.patch` includes generated Claude Code, Cursor, and Windsurf output changes (diff between initial and current generated outputs).
5. Given the user clicks "Download Patch", when the archive is created, then it also includes the generated files bundle (same as Story 4.4) for direct inspection.
6. Given both export buttons are visible, then "Download Patch" is visually treated as the primary export action and "Download Generated Files" is secondary (`variant="outline"`).
7. Given the user initiates an export, when the patch is ready, then the browser downloads without requiring GitHub authentication or filesystem write permissions.

## Tasks / Subtasks

- [x] Task 1: Create unified diff generator module. (AC: 2, 3)
  - [x] Create `src/lib/export/generate-patch.ts`.
  - [x] Implement `generateUnifiedDiff(before: string, after: string, filePath: string): string` — produces standard unified diff format.
  - [x] Implement `generatePatchBundle(initialYaml: string, currentYaml: string, initialArtifacts: GeneratedArtifact[], currentArtifacts: GeneratedArtifact[]): string` — concatenates all file diffs.
  - [x] Include `--- a/<path>` and `+++ b/<path>` headers per diff convention.
  - [x] Handle new files (added) with `/dev/null` as the `a/` source.
  - [x] Handle deleted files (removed) with `/dev/null` as the `b/` target.
  - [x] Create `src/lib/export/generate-patch.test.ts`.

- [x] Task 2: Capture initial generated artifacts for diff baseline. (AC: 3, 4)
  - [x] In `agent-studio-workbench.tsx`, capture `initialGeneratedArtifacts` when playbook is created (alongside `initialRules`).
  - [x] Generate initial artifacts by translating the playbook at creation time via `TRANSLATORS`.
  - [x] Store as component state or ref.

- [x] Task 3: Wire "Download Patch" button to generate and download patch archive. (AC: 1, 2, 3, 4, 5)
  - [x] Create `src/lib/export/generate-patch-archive.ts`.
  - [x] Generate ZIP containing: `agent-studio.patch` + generated files bundle (same as Story 4.4).
  - [x] Implement `handleDownloadPatch` in workbench.
  - [x] Wire the existing "Download Patch" button's `onClick` to `handleDownloadPatch`.
  - [x] Remove the old placeholder `title` text; replace with dynamic title.
  - [x] Update `agent-studio-workbench.test.ts` with source-string tests.
  - [x] Update E2E in `tests/e2e/sample-flow.spec.ts`.

- [x] Task 4: Download Patch is primary, Download Generated Files is secondary. (AC: 6)
  - [x] Verify "Download Patch" uses default button variant (primary).
  - [x] Verify "Download Generated Files" uses `variant="outline"` (secondary) — already done in Story 4.4.
  - [x] Ensure visual order: Download Patch first, Download Generated Files second — already correct.

- [x] Task 5: Final verification.
  - [x] Run `pnpm test` — all tests pass.
  - [x] Run `pnpm typecheck` — passes.
  - [x] Run `pnpm lint` — passes.
  - [x] Run `pnpm test:e2e tests/e2e/sample-flow.spec.ts` — passes.

## Dev Notes

### Story Source

- Epic 4, Story 4.5.
- PRD: FR-17 (Export Reviewable Patch), FR-18 (Generated File Provenance).
- UX: Download Patch is primary export action in top bar. Download Generated Files is secondary.

### Current Code State

- Story 4.4 implemented: `generateExportBundle`, `serializePlaybookToYaml`, `addProvenance`, `downloadBlob`, `bundleToBlob`.
- "Download Patch" button exists with `disabled={!exportReadiness.canExport}` and title but no `onClick` handler.
- "Download Generated Files" button exists with `onClick={handleDownloadGeneratedFiles}`, `variant="outline"`.
- `initialRules` captured at playbook creation for behavior diff baseline.
- `TRANSLATORS` array provides artifacts per tool.
- `generatePlan` computes plan from translator results.

### Implementation Approach

- **Unified diff format**: Use the standard POSIX unified diff format. No external diff library needed for string comparison. Implement a simple line-by-line diff using the LCS (Longest Common Subsequence) algorithm, or use a simpler approach: compute additions/removals by line.
  - For MVP, a simple line-based diff (not word-level) is sufficient.
  - Format per file: `--- a/<path>\n+++ b/<path>\n@@ ... @@\n` + diff hunks.
  - Added files: `--- /dev/null` as source.
  - Removed files: `+++ /dev/null` as target.
- **Patch archive**: Reuse `generateExportBundle`-style approach. Create a JSZip containing `agent-studio.patch` plus the full generated files bundle.
- **Initial artifacts**: Capture at playbook creation time alongside `initialRules`. Store in a ref/state variable.
- **No external diff library**: Implement a minimal Myers diff or simple LCS-based line diff. The playbook YAML and generated outputs are small enough for a simple approach.

### Architecture Compliance

- Export domain stays under `src/lib/export/`.
- Diff generation is a pure function — no side effects.
- Reuse `generateExportBundle` for the files portion of the archive.
- Reuse `downloadBlob` for browser download.
- No backend, API routes, auth, filesystem, or GitHub integration.

### Testing Requirements

- Unit tests for `generateUnifiedDiff`: added file, removed file, modified file, empty content.
- Unit tests for `generatePatchBundle`: multiple file diffs, no changes case.
- Source-string tests for workbench: `handleDownloadPatch` wired, `initialGeneratedArtifacts` captured.
- E2E: after playbook creation, click Download Patch, verify download triggers.

## Dev Agent Record

### Agent Model Used

Codex GPT-5

### Implementation Plan

1. Implement `generateUnifiedDiff` and `generatePatchBundle` in `src/lib/export/generate-patch.ts`.
2. Implement `generatePatchArchive` in `src/lib/export/generate-patch-archive.ts`.
3. Capture `initialGeneratedArtifacts` in workbench.
4. Wire `handleDownloadPatch` to existing button.
5. Tests and verification.

### File List

- New: `src/lib/export/generate-patch.ts`
- New: `src/lib/export/generate-patch.test.ts`
- New: `src/lib/export/generate-patch-archive.ts`
- New: `src/lib/export/generate-patch-archive.test.ts`
- Update: `src/components/workbench/agent-studio-workbench.tsx`
- Update: `src/components/workbench/agent-studio-workbench.test.ts`
- Update: `tests/e2e/sample-flow.spec.ts`

## Change Log

- 2026-06-16: Story 4.5 created — ready-for-dev.
- 2026-06-16: Story 4.5 implemented — LCS-based unified diff generator, patch archive with ZIP, wired Download Patch button. 158 tests pass. Status set to review.

---

## Dev Agent Record

### Agent Model Used

Codex GPT-5

### Completion Notes

- Task 1: Implemented `computeLineDiff` (LCS-based), `generateUnifiedDiff`, and `generatePatchBundle` in `generate-patch.ts`. Handles added/removed/modified files, /dev/null markers for new/deleted files.
- Task 2: Captured `initialGeneratedArtifacts` at playbook creation time alongside `initialRules`. Stores as state variable.
- Task 3: Implemented `generatePatchArchive` in `generate-patch-archive.ts`. Creates ZIP with `agent-studio.patch` + `playbook.yaml` + all translator artifacts with provenance.
- Task 4: Wired `handleDownloadPatch` to existing Download Patch button. Button now generates and downloads patch archive on click.
- Task 5: Full verification — 158 tests (25 files), typecheck, lint all clean.

## Review Findings

### patch
- [x] [Review][Patch] Three translation calls per click [agent-studio-workbench.tsx:244-270] — TRANSLATORS.map runs 2-3 times. Fix: compute once and reuse.
- [x] [Review][Patch] Empty patch when no changes [generate-patch.ts:75-77] — empty agent-studio.patch in ZIP. Fix: skip patch or write "(no changes)" message.
- [x] [Review][Patch] bundleToBlob not reused [agent-studio-workbench.tsx:275-276] — inline new Blob instead of calling existing helper.
- [x] [Review][Patch] Zip slip via artifact paths [generate-patch-archive.ts:22] — artifact paths with '../' not sanitized.

### defer
- [x] [Review][Defer] Hunk boundary trimming edge case [generate-patch.ts:118] — theoretical. Deferred.
- [x] [Review][Defer] LCS DP table O(m×n) memory [generate-patch.ts:22] — fine for small files. Deferred.
- [x] [Review][Defer] Trailing newline / \r\n endings [generate-patch.ts:17-18] — generated files use LF. Deferred.
- [x] [Review][Defer] Archive out of sync with diff [generate-patch-archive.ts:18-24] — unlikely race. Deferred.
- [x] [Review][Defer] File paths not escaped [generate-patch.ts:139-140] — internal paths safe. Deferred.
- [x] [Review][Defer] Three-loop pair building fragile [agent-studio-workbench.tsx:252-266] — functional. Deferred.
- [x] [Review][Defer] Archive filename hardcoded [generate-patch-archive.ts:28] — acceptable for MVP. Deferred.

### dismiss
- Translation failure during init — caught by try/catch.
