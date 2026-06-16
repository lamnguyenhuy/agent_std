---
baseline_commit: 2828957480173f92d19ccff7a626e894baae5de2
---

# Story 4.6: Handle Export Success and Failure Accessibly

Status: review

## Story

As a tech lead,
I want clear export feedback that preserves my work,
So that I know whether the review artifact is ready.

## Acceptance Criteria

1. Given the user triggers an export, when export succeeds, then Agent Studio shows a toast or inline confirmation (e.g., "Patch ready for review.").
2. Given export succeeds, when the confirmation appears, then it is announced through an `aria-live` region.
3. Given the user triggers an export, when export fails, then Agent Studio shows a destructive toast or inline error with a retry path.
4. Given export fails, when the error appears, then user Rule edits remain intact.
5. Given export fails, when the error appears, then keyboard users can retry or return to editing without losing focus context.

## Tasks / Subtasks

- [x] Task 1: Create accessible toast component. (AC: 2, 3)
  - [x] Create `src/components/export/toast.tsx`.
  - [x] Implement `ExportToast` with `role="status"` and `aria-live="polite"`.
  - [x] Support two variants: `success` (green/default) and `error` (destructive/red).
  - [x] Auto-dismiss after 5 seconds for success; persistent until dismissed for error.
  - [x] Include close/dismiss button for error variant.
  - [x] Include retry button for error variant.
  - [x] Animate in/out with CSS transitions.
  - [x] Create `src/components/export/toast.test.tsx` (render test).

- [x] Task 2: Create export feedback hook. (AC: 1, 2, 3, 4)
  - [x] Create `src/components/export/use-export-feedback.ts`.
  - [x] Implement `useExportFeedback()` returning `{ feedback, showSuccess, showError, dismiss }`.
  - [x] `feedback` shape: `{ type: "success" | "error" | null; message: string; retry?: () => void }`.
  - [x] `showSuccess(message)` sets success feedback.
  - [x] `showError(message, retry?)` sets error feedback with optional retry callback.
  - [x] `dismiss()` clears feedback.
  - [x] Create `src/components/export/use-export-feedback.test.ts`.

- [x] Task 3: Wire feedback into handleDownloadPatch. (AC: 1, 2, 3, 4, 5)
  - [x] In `agent-studio-workbench.tsx`, import `useExportFeedback`.
  - [x] Replace `catch { // Silently fail }` in `handleDownloadPatch` with `showError`.
  - [x] On success, call `showSuccess("Patch ready for review.")`.
  - [x] Use retry callback for error case: re-invoke `handleDownloadPatch`.
  - [x] Ensure focus returns to Download Patch button after dismiss.

- [x] Task 4: Wire feedback into handleDownloadGeneratedFiles. (AC: 1, 2, 3, 4)
  - [x] Same pattern as Task 3 for `handleDownloadGeneratedFiles`.
  - [x] Success message: "Generated files ready for review."
  - [x] Error message: descriptive error with retry.

- [x] Task 5: Verify overall behavior.
  - [x] Run `pnpm test` — all tests pass.
  - [x] Run `pnpm typecheck` — passes.
  - [x] Run `pnpm lint` — passes.

## Dev Notes

### Story Source

- Epic 4, Story 4.6.
- PRD: FR-16, FR-17.
- UX: Export Result surface is a toast or inline confirmation. No page-level modal.

### Current Code State

- `handleDownloadPatch` and `handleDownloadGeneratedFiles` both have `catch { // Silently fail }`.
- No feedback mechanism exists for export success/failure.
- No toast/notification component exists in the project.
- shadcn/ui is used but only `button.tsx` and `tabs.tsx` exist under `src/components/ui/`.
- Project uses Tailwind CSS already configured.

### Implementation Approach

- Build a minimal inline toast component — no external library needed.
- Use React portal or fixed positioning for overlay.
- `aria-live="polite"` for screen reader announcements.
- CSS transitions for enter/exit (Tailwind).
- Toast appears at top-right of the workbench.
- Error toast stays until dismissed; success auto-dismisses after 5 s.
- Retry button re-invokes the failed export handler.

### Architecture Compliance

- Export feedback components under `src/components/export/`.
- Custom hook for state management.
- No backend, API routes, auth, filesystem, or GitHub integration.
- Accessible by default: aria-live, keyboard-dismissable, focus management.

### Testing Requirements

- Component render test for `ExportToast`.
- Hook test for `useExportFeedback`: show/hide, success, error, retry.
- Source-string tests for workbench: confirm no `// Silently fail` comments remain.

## Dev Agent Record

### Agent Model Used

Codex GPT-5

### Implementation Plan

1. Create `ExportToast` component with aria-live, success/error variants, auto-dismiss, retry button.
2. Create `useExportFeedback` hook.
3. Wire into workbench: replace silent catches, add success/error feedback.
4. Verification.

### File List

- New: `src/components/export/toast.tsx`
- New: `src/components/export/toast.test.tsx`
- New: `src/components/export/use-export-feedback.ts`
- New: `src/components/export/use-export-feedback.test.ts`
- New: `vitest.setup.ts`
- Update: `vitest.config.ts`
- Update: `src/components/workbench/agent-studio-workbench.tsx`
- Install: `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`

## Change Log

- 2026-06-16: Story 4.6 created — ready-for-dev.
- 2026-06-16: Story 4.6 implemented — accessible toast with aria-live, useExportFeedback hook, wired into both export handlers. 169 tests pass. Status set to review.

---

## Dev Agent Record

### Agent Model Used

Codex GPT-5

### Completion Notes

- Task 1: Created `ExportToast` component with aria-live='polite', success/error variants, retry button, dismiss button, auto-dismiss for success.
- Task 2: Created `useExportFeedback` hook with showSuccess, showError(retry?), dismiss.
- Task 3: Wired feedback into `handleDownloadPatch` — success toast on download, error toast with retry on failure.
- Task 4: Wired feedback into `handleDownloadGeneratedFiles` — same pattern.
- Task 5: Full verification — 169 tests (27 files), typecheck, lint all clean.

Dependencies added: @testing-library/react, @testing-library/jest-dom, jsdom.
