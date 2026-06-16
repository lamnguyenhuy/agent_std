# Edge Case Hunter Review Findings

**Reviewer:** Edge Case Hunter
**Input:** Diff + full project source access
**Files examined:**
- `tests/e2e/sample-flow.spec.ts` (full file)
- `src/components/workbench/behavior-diff.tsx`
- `src/lib/review/behavior-diff.ts`
- `src/lib/review/behavior-diff.test.ts`
- `src/components/workbench/review-panel.tsx`
- `src/components/workbench/code-panel.tsx`
- `src/lib/playbook/update-rules.ts`
- `src/lib/playbook/update-rules.test.ts`

---

## Findings

### E1 — Reindex order assumption after removal of edited rule (ACTUAL BUG)
**File:** `tests/e2e/sample-flow.spec.ts` lines 367–390

The test comment says:
```
// Remove edited imported Rule 1 — remaining: Rule 1 (was Rule 2), Rule 2 (added rule)
```
Then removes `"Remove rule 1"` → count 2, then removes `"Remove rule 2"` → count 1.

But the test modified Rule 1's text before removal. The removal targets `"Remove rule 1"` — this is a button with `name: "Remove rule 1"` which locates via `getByRole("button", { name: "Remove rule 1", exact: true })`. 

**Problem:** The `"Remove rule {index}"` button uses the *visual index* (1-based, after removal). If the component reindexes Rule 2 → Rule 1 after Rule 1 is removed, then `"Remove rule 2"` targets what *was* the added rule (entered as "All edge cases must be tested."), not the original Rule 2. The test *assumes* this — and the comment confirms this intent.

But if reindexing is based on *original imported order* rather than visual position, the button labels misalign. The test passes only because `generateBehaviorDiff` works from `currentRules` and `previousRules` independently — but the button removal targets DOM labels, not rule IDs. If the playbook state uses a stable sort-by-ID, the DOM order might not match the test's expectation.

**Severity:** High — test relies on implicit reindex contract not documented or verified.

### E2 — `getByRole("list", { name: "Behavior Diff" })` initial assertion before first interaction
**File:** `behavior-diff.tsx` line 31 — `<ul aria-label="Behavior Diff">`

The `<ul>` is in the DOM immediately when `items.length > 0`. The test at line 340 asserts `.toBeVisible()` — but the empty-state `<div>` renders when `items.length === 0`, so the `<ul>` literally does not exist during empty state.

Test flow:
1. Lines 315–323: empty state checks (heading visible, text visible, no semantic analysis) — at this point `<ul>` does not exist.
2. Line 327: add rule
3. Line 340: `getByRole("list", { name: "Behavior Diff" })` — now `<ul>` exists because `items.length > 0`.

No issue per se, but if the heading "Behavior Diff" matched both sections, the locator could resolve ambiguously. The heading `<h3>` is "Behavior Diff" and the `<ul>` has `aria-label="Behavior Diff"`. Both could match `getByRole("heading", { name: "Behavior Diff" })` and `getByRole("list", { name: "Behavior Diff" })` — these are distinct roles so no conflict.

### E3 — `<dl>` in edited items renders unconditionally by `kind`, not by `before`/`after` presence
**File:** `behavior-diff.tsx` lines 43–52

The `<dl>` renders when `item.kind === "edited"`. It assumes `item.before` and `item.after` are both defined. In `behavior-diff.ts`, the `edited` branch always sets both strings — good. But if a future code path creates an edited item missing `before` or `after`, the `<dl>` renders with empty `<dd>`. No type guard or assertion.

### E4 — `normalizeRuleText` whitespace handling vs. test `exact: true` assertions
**File:** `behavior-diff.ts` (lib) line 11, `behavior-diff.tsx` tests at lines 355–365

`normalizeRuleText` collapses all whitespace to single spaces via `replace(/\s+/g, " ")` and `.trim()`. But the test asserts:
```ts
await expect(inspector.getByText("Use the project standards before editing code.", { exact: true })).toBeVisible()
await expect(inspector.getByText("Use the project standards before editing code. Keep commits small.", { exact: true })).toBeVisible()
```

The `exact: true` in `getByText` matches against DOM text nodes — if React renders the text as-is (no extra whitespace), this is fine. But the diff only shows text that the user typed via `.fill()`, which is a single line — no multi-whitespace edge cases are tested. The lib unit test (`behavior-diff.test.ts`) *does* test multi-whitespace normalization at the lib level, so the coverage gap is limited to the E2E path.

**Severity:** Low — lib-level coverage exists, E2E gap is minor.

### E5 — No test for `validateRuleText` rejection path in the Behavior Diff flow
**File:** `update-rules.ts`

The validator rejects empty/special-whitespace rules. The E2E test adds valid text only. The 2nd test (`"lets the tech lead add, edit, and remove playbook rules"`) *does* test empty validation at lines 456–462, but the Behavior Diff block (lines 312–412) never exercises the reject path while Review is active.

If a user types empty text and the rule isn't added (no article renders, no new behavior diff item), the Behavior Diff assertions about article count and absence of empty-state text would behave unexpectedly. Not exercised.

**Severity:** Medium — untested edge case in this flow.

### E6 — "Added" badge in Behavior Diff could flicker on rapid re-renders
**File:** `behavior-diff.tsx` line 36 — `explicitLabel` is a const identity map (`Added: "Added"`, etc.)

The component uses `BehaviorDiffItem["label"]` as both the JSX content and the key. This is a no-op mapping — the `label` field is used directly. Redundant but not harmful. However, if `items` identity changes on every render (e.g., inline `generateBehaviorDiff(...)` in the parent), React re-renders the entire list.

The test at line 339 asserts `getByRole("list", { name: "Behavior Diff" })` — stable. The individual `<li>` items have `key={item.id}` so React reconciles by ID. No flicker issue.

### E7 — `copyTextToClipboard` in `code-panel.tsx` is `export async function` but not used in Behavior Diff
Not in scope for the diff. Not relevant.

### E8 — "No Rule behavior changes yet." text content duplicates empty-state branch check
`behavior-diff.tsx` line 20 renders `"No Rule behavior changes yet."` when `items.length === 0`.

Test line 319 asserts `getByText("No Rule behavior changes yet.", { exact: true }).toBeVisible()` — matches the div. After adding a rule, test line 333 asserts `toHaveCount(0)` for the same text — confirms the div is gone.

This works because empty state is a `<div>`, not a heading or other role. No ambiguity with other elements. Clean.

### E9 — `"Modified"` badge count (line 310) hardcoded at 5
Not part of the Behavior Diff diff block but adjacent. Line 310: `await expect(inspector.getByText("Modified")).toHaveCount(5)` — hardcoded count. If another translator or a sixth file gets a "Modified" status, this breaks. Not in scope of the Behavior Diff diff, but in the same test.

---

## Risk Summary

| # | Severity | Category |
|---|----------|----------|
| E1 | **High** | Reindex contract implicit |
| E2 | None | No issue |
| E3 | Low | Missing type guard |
| E4 | Low | Coverage gap (lib covers it) |
| E5 | Medium | Untested rejection path |
| E6 | None | No issue |
| E7 | None | Out of scope |
| E8 | None | No issue |
| E9 | Medium | Hardcoded count (adjacent) |

## Top Recommendation

**E1 must be addressed** by codifying the reindex contract. Either:
- (a) Remove by rule ID instead of 1-based visual index in E2E tests, or
- (b) Document that visual position = array index in playbook state, and the button label reflects the post-removal index.
