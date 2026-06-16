# Blind Hunter — Story 4.3 Findings

## 1. `isDraftInvalid` uses `.trim()` missing zero-width and Unicode whitespace

`export-readiness.ts` line 9: `text.trim().length === 0`. JavaScript's `.trim()` strips standard whitespace but not zero-width spaces (`\u200B`, `\u200C`, `\u200D`, `\uFEFF`) or other Unicode space categories like `\u00A0` (non-breaking space). Meanwhile `validateRuleText` (in `update-rules.ts`) uses a regex `[\\s\\u200B-\\u200D\\uFEFF]` that catches those. A draft containing only zero-width characters passes `isDraftInvalid` (returns `false`, considered valid) but would fail `validateRuleText` (can never be committed). Export readiness reports ready-to-export while the rule text is effectively invisible.

## 2. Single generic error message hides which rules are invalid

`export-readiness.ts` line 20: `reason: "Fix invalid Rule text before exporting."` — when multiple drafts are invalid, the user has no indication which rules are broken or how many. They must inspect each rule manually.

## 3. Stale `ruleTextDrafts` entries can survive rule removal on error

In `agent-studio-workbench.tsx` lines 174-184, `handleRemoveRule` runs `setRuleTextDrafts` cleanup then `applyPlaybookUpdate`. If `applyPlaybookUpdate` (a `setPlaybook` call) throws or React bails mid-state-update, the draft cleanup has already committed — leaving orphaned draft entries for rule IDs that no longer exist in the playbook. These orphaned drafts don't affect correctness (they map to non-existent rules), but they inflate the drafts object and could mask real issues.

## 4. `computeExportReadiness` never inspects committed rule text

The function checks only `ruleTextDrafts` — it never validates `playbook.rules` directly. If committed rule text somehow becomes empty or whitespace-only (bypassing `validateRuleText` through a code path or future change), export readiness reports `true` regardless. The function assumes committed rules are always valid, which is a latent correctness dependency.

## 5. Button title swaps semantic description based on state

Lines 221-222: When `!exportReadiness.canExport`, `title` shows a *problem reason* (state description). When `exportReadiness.canExport`, `title` shows an *action instruction* ("Download the reviewable patch for this Playbook"). Assistive tech users get inconsistent role semantics — sometimes the button tells you what's wrong, sometimes what to do.

## 6. `useMemo` re-derives on every render regardless of actual value change

Lines 105-108: `useMemo(() => computeExportReadiness(...), [playbook, ruleTextDrafts])`. Every call to `setRuleTextDrafts` creates a new object reference (spread pattern on line 156-159), even when the functional content is identical. UseMemo cannot structurally compare — it always re-derives. This is minor for the current bundle size but breaks the "only re-derive when value changes" intent.

## 7. `getByRole("button", { name: /download/i })` in E2E is under-constrained

The E2E locator matches any element with role `button` whose name contains "download" case-insensitively. If a future button (or already-existing button) includes "download" in its label (e.g., a "Download Plan" or "Download Report" button), this test gives a false positive or interacts with the wrong element. The export-readiness assertions in the mobile viewport block (line ~418) duplicate this locator pattern.

## 8. `getRuleError` duplicates `isDraftInvalid` logic

`agent-studio-workbench.tsx` line 146: `draft.trim().length === 0` duplicates exactly the same check as `export-readiness.ts` line 9. If either changes the validation strategy (e.g., both should be upgraded to match `validateRuleText`), the other silently diverges.

## 9. `computeExportReadiness` has no runtime guard on `playbook.rules` presence

TypeScript enforces `AgentPlaybook | null` at compile time, but the function doesn't guard against a non-null playbook whose internal state violates the schema (e.g., `rules` is `undefined` at runtime from a corrupt state). The function only accesses `playbook` in the `== null` check, so this is safe in the current implementation, but a future addition of `playbook.rules.some(...)` would crash without a guard.

## 10. Export readiness doesn't account for `initialRules` baseline state

When `playbook` exists but `initialRules` is `null` (e.g., playbook was created from error recovery path on line 198-200), there's no baseline for behavior diff. Export readiness reports `true` even though the review surface is incomplete. The story's AC 4-5 only gate on rule text validity, not review-surface completeness.
