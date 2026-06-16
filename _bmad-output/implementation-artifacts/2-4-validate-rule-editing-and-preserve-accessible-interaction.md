---
baseline_commit: NO_VCS
---

# Story 2.4: Validate Rule Editing and Preserve Accessible Interaction

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a tech lead,
I want invalid rule edits to be blocked clearly,
so that the Playbook remains valid and reviewable.

## Acceptance Criteria

1. Given the user is editing a Rule, when the Rule text is empty or whitespace-only, then the UI shows inline validation text `Rule cannot be empty.`
2. Given the user is editing a Rule, when the Rule text is empty or whitespace-only, then the error text is associated with the affected input via `aria-describedby`.
3. Given the user is editing a Rule, when the Rule text is empty or whitespace-only, then invalid Rules are not committed to the canonical export-ready Playbook state.
4. Given the user has produced a validation error, when the user types valid text into the Rule textarea, then the error clears and the rule is committed to Playbook state.
5. Given the Rules section is visible, keyboard users can add, edit, remove, and recover from validation errors using Tab/Shift-Tab and Enter navigation.
6. Given the Rules section is visible, focus rings are visible on Rule textareas, Add Rule button, and Remove rule buttons.

## Tasks / Subtasks

- [x] Create `src/lib/errors.ts` with `AppError` type. (AC: 3)
  - [x] Export `type AppError = { code: string; message: string; details?: Record<string, unknown> }`.
  - [x] This is the canonical error shape for all domain validation failures in the app.
- [x] Create `src/lib/result.ts` with `Result<T, E>` type. (AC: 3)
  - [x] Export `type Result<T, E = AppError> = { ok: true; data: T } | { ok: false; error: E }`.
- [x] Create `src/lib/playbook/update-rules.ts` with rule validation logic. (AC: 1, 2, 3, 4)
  - [x] Export `validateRuleText(text: string): Result<string, AppError>` — returns `{ ok: true, data: trimmedText }` for valid input, `{ ok: false, error: { code: "rule-empty", message: "Rule cannot be empty." } }` for empty/whitespace-only.
  - [x] Trimmed text is returned in the `ok: true` branch (this is the canonical stored value).
- [x] Create `src/lib/playbook/update-rules.test.ts` with Vitest unit tests. (AC: 1, 3)
  - [x] Test: empty string returns `{ ok: false, error: { code: "rule-empty" } }`.
  - [x] Test: whitespace-only string (`"   "`, `"\n"`, `"\t"`) returns `{ ok: false, ... }`.
  - [x] Test: valid text returns `{ ok: true, data: trimmedText }` with trimming applied.
- [x] Update `agent-studio-workbench.tsx` to use draft-state validation. (AC: 1, 2, 3, 4)
  - [x] REMOVE the P1 patch guard `if (nextText.trim().length === 0) return` from `handleRuleTextChange` — Story 2.4 replaces it with proper validation.
  - [x] Add `const [ruleTextDrafts, setRuleTextDrafts] = useState<Record<string, string>>({})` — tracks raw user input when it differs from canonical state (i.e., when the draft is invalid).
  - [x] Update `handleRuleTextChange`: call `validateRuleText(nextText)`. If `ok: false` → store raw text in `ruleTextDrafts` and do NOT call `applyPlaybookUpdate`. If `ok: true` → clear the draft from `ruleTextDrafts` and call `applyPlaybookUpdate` with `result.data` (the trimmed text).
  - [x] Derive `getRuleDisplayText(rule: PlaybookRule): string` = `ruleTextDrafts[rule.id] ?? rule.text`.
  - [x] Derive `getRuleError(ruleId: string): string | undefined` = when `ruleTextDrafts[ruleId]` exists and its trimmed length is 0, return `"Rule cannot be empty."`.
  - [x] Clear `ruleTextDrafts` on `handleRemoveRule` for the removed rule id (avoid stale draft).
  - [x] Pass `getRuleDisplayText` and `getRuleError` to `RulesEditor`.
- [x] Update `rules-editor.tsx` to show inline validation. (AC: 1, 2, 5, 6)
  - [x] Add props: `getDisplayText: (ruleId: string) => string` and `getError: (ruleId: string) => string | undefined`.
  - [x] For each rule textarea: use `id={`rule-input-${rule.id}`}` and `aria-describedby` pointing to the error element id when an error exists.
  - [x] Render error element: `<p id={`rule-error-${rule.id}`} className="text-sm text-destructive" role="alert">Rule cannot be empty.</p>` — only when `getError(rule.id)` returns a string.
  - [x] Use `getDisplayText(rule.id)` as the textarea `value` instead of `rule.text`.
  - [x] Add `aria-invalid={!!getError(rule.id)}` to the textarea.
  - [x] Confirm focus ring styles are present on the textarea (`focus-visible:ring-3 focus-visible:ring-ring/50` — already in Story 2.3 implementation, just verify not removed).
  - [x] Confirm the Add Rule button and Remove rule buttons also have visible focus rings (Button component already has them via shadcn — verify and document).
- [x] Extend `tests/e2e/sample-flow.spec.ts` with validation flow coverage. (AC: 1, 2, 3, 4, 5)
  - [x] In the existing CRUD test: after adding a rule, clear the added rule textarea (fill with `""`), assert the validation message `"Rule cannot be empty."` appears in the rules section.
  - [x] Assert that the canonical rule count (by article role) is consistent with the last valid state (the cleared rule remains in the list but is visually invalid — the rule article should still exist).
  - [x] Fill the cleared rule with valid text and assert the error message disappears.

### Review Findings

- [x] [Review][Patch] Cải thiện logic validate — `trim()` không xử lý được zero-width space [update-rules.ts:5]
- [x] [Review][Patch] Sửa fallback sinh ID — `Date.now()` có thể gây trùng lặp [agent-studio-workbench.tsx:94]
- [x] [Review][Patch] Bổ sung `aria-live` — thông báo lỗi không có aria-live cho screen reader [rules-editor.tsx:101]
- [x] [Review][Patch] Sửa lỗi có thể crash UI — `group.files` có thể undefined khi gọi map() [agent-studio-workbench.tsx:44]
- [x] [Review][Defer] Không giới hạn độ dài input — rule text có thể quá dài [update-rules.ts:4] — deferred, pre-existing
- [x] [Review][Defer] Magic strings bị hardcode — tên section dễ vỡ [agent-studio-workbench.tsx:73] — deferred, pre-existing
- [x] [Review][Defer] Button disabled không truy cập được title bằng screen reader [agent-studio-workbench.tsx:186] — deferred, pre-existing
- [x] [Review][Defer] Xử lý lỗi hời hợt — không có telemetry/log khi catch error [agent-studio-workbench.tsx:163] — deferred, pre-existing
- [x] [Review][Defer] Unit test coverage chưa bao phủ các edge cases phức tạp [update-rules.test.ts] — deferred, pre-existing
- [x] [Review][Defer] Mảng `playbook.translators` rỗng không có empty state [agent-studio-workbench.tsx:429] — deferred, pre-existing

## Dev Notes

### Story Source

- Epic: Epic 2, `Playbook Workbench and Rules Editing`.
- Story requirement ID: `FR-7`.
- Source ACs: `_bmad-output/planning-artifacts/epics.md`, `Story 2.4`.
- PRD requirement: "Empty rules cannot be saved." and "Inline validation: Rule cannot be empty." [UX-DR12, UX-DR13]
- UX requirement: inline error "Rule cannot be empty." associated with the affected input; export disabled for invalid state; focus rings on Rule inputs and actions. [EXPERIENCE.md lines 83, 107, 110]

### Critical Context: Replacing the P1 Code Review Patch

Story 2.3 code review identified P1: `handleRuleTextChange` silently rejected empty edits with `if (nextText.trim().length === 0) return`. This was an interim fix. **Story 2.4 must remove this guard and replace it with the draft-state validation approach.**

The correct behavior is:
- User clears a rule → textarea shows empty, error message appears, canonical playbook state retains the previous valid text
- User re-types valid text → error disappears, canonical playbook state updates to the new trimmed text

Do NOT keep the silent guard — the whole point of this story is surfacing the error to the user.

### Current Code State

- `src/components/workbench/agent-studio-workbench.tsx` — state owner. Has P1 patch (remove it). Add `ruleTextDrafts` state and derive helpers. Pass to `RulesEditor`.
- `src/components/workbench/rules-editor.tsx` — presentational editor. Current props: `newRuleText`, `onAddRule`, `onNewRuleTextChange`, `onRemoveRule`, `onRuleTextChange`, `rules`. Add `getDisplayText` and `getError` props. Show inline error.
- `src/lib/playbook/schema.ts` — existing Zod schemas. No changes needed.
- `src/lib/playbook/generate.ts` — no changes needed.
- `src/lib/playbook/update-rules.ts` — does NOT exist. Create it.
- `src/lib/errors.ts` — does NOT exist. Create it.
- `src/lib/result.ts` — does NOT exist. Create it.
- `tests/e2e/sample-flow.spec.ts` — extend validation test coverage.

### Draft-State Design (Critical Implementation Detail)

The canonical `playbook.rules` must remain clean (no whitespace-only text). Use a separate `ruleTextDrafts` map to hold in-progress invalid input for display only:

```
                    User types "" into Rule 1 textarea
                            ↓
              validateRuleText("") → { ok: false }
                            ↓
    ruleTextDrafts["rule-id"] = ""   (raw display value)
    playbook.rules[0].text unchanged  (keeps "previous valid text")
    getRuleError("rule-id") → "Rule cannot be empty."
    getRuleDisplayText("rule-id") → ""  (textarea shows "")
```

```
                  User types "New rule text" into Rule 1 textarea
                            ↓
        validateRuleText("New rule text") → { ok: true, data: "New rule text" }
                            ↓
    delete ruleTextDrafts["rule-id"]    (clear draft)
    applyPlaybookUpdate → playbook.rules[0].text = "New rule text"
    getRuleError("rule-id") → undefined  (no error)
    getRuleDisplayText("rule-id") → "New rule text"  (from rule.text, no draft)
```

### Architecture Compliance

- `src/lib/errors.ts` and `src/lib/result.ts` are required by architecture (AR-15). Create them minimally.
- `src/lib/playbook/update-rules.ts` is mapped to FR-6-FR-8 in architecture requirements-to-structure section.
- Error code must be `"rule-empty"` (architecture specifies this code name exactly).
- Domain validation must use `Result<T, AppError>` — do not throw for expected user validation errors.
- `src/components/workbench/*` may call `src/lib/*`; `src/lib/*` must not import from `src/components/*`.
- No global state library. Keep validation state local to `AgentStudioWorkbench`.

### Scope Boundaries — Do NOT Implement

- Do NOT implement preview, Plan, or Behavior Diff synchronization from Epic 3/4.
- Do NOT disable the Download Patch button for invalid rules (Epic 4 story 4.3 handles export readiness).
- Do NOT show export-readiness pausing or any indicator beyond the inline error text.
- Do NOT add error affordances to the Add Rule form (only existing rule rows need validation; adding empty rule is already silently blocked in `handleAddRule`).
- Do NOT change the `handleAddRule` guard — it already rejects empty input correctly without showing an error, and this story does not add validation to the add flow.
- Do NOT add focus-ring CSS from scratch — the Button component (shadcn) and the textarea already have focus-visible styles. Verify they work; don't redesign them.

### File Structure Requirements

- `src/lib/errors.ts` (NEW)
- `src/lib/result.ts` (NEW)
- `src/lib/playbook/update-rules.ts` (NEW)
- `src/lib/playbook/update-rules.test.ts` (NEW)
- `src/components/workbench/agent-studio-workbench.tsx` (UPDATE)
- `src/components/workbench/rules-editor.tsx` (UPDATE)
- `tests/e2e/sample-flow.spec.ts` (UPDATE)

Do NOT create a separate `rule-row.tsx` component — the existing `rules-editor.tsx` can own the per-rule rendering for this story's scope. Architecture lists `rule-row.tsx` but Story 2.3 didn't create it and the inline approach works.

### Testing Requirements

- Follow TDD: write failing unit tests in `update-rules.test.ts` before implementing `validateRuleText`.
- Vitest pattern (from `generate.test.ts`): `import { describe, expect, it } from "vitest"` and `import { validateRuleText } from "@/lib/playbook/update-rules"`.
- E2E: extend the CRUD test to cover: clear rule → see error → type valid text → error gone.
- Run `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:e2e`, `pnpm build` before marking story ready for review.

### Previous Story Intelligence

From Story 2.3 (code review patches applied):

- `handleRuleTextChange` has `if (nextText.trim().length === 0) return` at line 107 — **REMOVE THIS** in Story 2.4.
- `ruleOriginUi` has fallback `?? ruleOriginUi.edited` — keep this, don't regress it.
- E2E test uses `initialRuleCount` dynamic count instead of hard-coded "Rule 3" — preserve this pattern.
- E2E test asserts `"Imported"` badge count equals `initialRuleCount` after add — preserve this assertion.
- `RulesEditor` receives `rules={playbook.rules}` — Story 2.4 adds `getDisplayText` and `getError` props alongside existing ones.
- All imported sections (Skills, Agents, Context) remain read-only — do not touch them.
- `imported-section-state.ts` has `getImportedSectionAffordance` and `getImportedSectionEmptyState` helpers — do not modify.

From Story 2.2: imported sections have accessible `aria-label` region names — do not regress.

From Story 2.1: section status language uses `playbookSectionStatusUi` — do not modify.

### Technical Guardrails

- This repo uses Next.js `16.2.6`, React `19.2.4`, TypeScript, Tailwind CSS, Zod `4.4.3`, Vitest `4.1.8`, Playwright `1.60.0`.
- Keep `"use client"` in `agent-studio-workbench.tsx`. No server components for interactive state.
- Do not add Redux, Zustand, or any global state library.
- Zod schemas live in `schema.ts`. Validation logic lives in `update-rules.ts`. Do not add validation inline in UI components.
- `aria-describedby` connects the textarea to its error paragraph via matching `id` attributes. Both must exist when the error is shown, and `aria-describedby` must be absent (or point to an existing visible element) when there is no error.

### Latest Tech Information

- React 19.2.4: controlled inputs work as expected. The `value` prop on a textarea controls the display value. When `ruleTextDrafts[rule.id]` exists, use it as value; otherwise use `rule.text`.
- Playwright `getByRole("alert")` or `getByText("Rule cannot be empty.")` can locate the error element in E2E tests.
- Vitest `describe`/`it`/`expect` pattern is already used in `generate.test.ts` — follow exactly.

### Project Context Reference

- No `project-context.md` found.
- No git repository (baseline_commit: NO_VCS).

### Completion Note

Ultimate context engine analysis completed - comprehensive developer guide created.

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

No blockers encountered. All tasks implemented cleanly on first pass.

### Implementation Plan

1. Created `src/lib/errors.ts` and `src/lib/result.ts` as minimal architecture-required types (AR-15).
2. Wrote failing Vitest unit tests for `validateRuleText` (TDD red phase) before implementing.
3. Created `src/lib/playbook/update-rules.ts` with `validateRuleText` — tests turned green.
4. Updated `agent-studio-workbench.tsx`: removed P1 guard, added `ruleTextDrafts` state, derived `getRuleDisplayText`/`getRuleError`, updated `handleRuleTextChange` and `handleRemoveRule`, passed new props to `RulesEditor`.
5. Updated `rules-editor.tsx`: added `getDisplayText`/`getError` props, wired `aria-describedby`/`aria-invalid`, rendered conditional error `<p role="alert">`.
6. Extended E2E test: clear rule → assert error appears + article count stable → retype valid text → assert error gone. All 3 E2E tests pass.

### Completion Notes List

- ✅ P1 patch guard removed from `handleRuleTextChange` as required by story
- ✅ Draft-state design implemented: canonical playbook state never receives whitespace-only text
- ✅ `aria-describedby` connects textarea to error paragraph when error exists; absent when no error
- ✅ `aria-invalid` set on textarea when error is present
- ✅ `role="alert"` on error paragraph for screen reader announcement
- ✅ Focus ring styles preserved on textarea (`focus-visible:ring-3 focus-visible:ring-ring/50`)
- ✅ Button component (shadcn) provides focus rings on Add Rule and Remove rule buttons
- ✅ Stale draft cleared on `handleRemoveRule`
- ✅ All checks pass: typecheck ✓, lint ✓, unit tests 18/18 ✓, E2E 3/3 ✓, build ✓

### File List

- src/lib/errors.ts (NEW)
- src/lib/result.ts (NEW)
- src/lib/playbook/update-rules.ts (NEW)
- src/lib/playbook/update-rules.test.ts (NEW)
- src/components/workbench/agent-studio-workbench.tsx (UPDATED)
- src/components/workbench/rules-editor.tsx (UPDATED)
- tests/e2e/sample-flow.spec.ts (UPDATED)

## Change Log

- 2026-06-15: Created Story 2.4 context and moved story to ready-for-dev.
- 2026-06-15: Implemented all tasks — validation logic, draft-state UI, aria attributes, E2E coverage. Status → review.
