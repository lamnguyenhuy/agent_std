# Blind Hunter Review Findings

**Reviewer:** Blind Hunter
**Input:** Diff only (`tests/e2e/sample-flow.spec.ts` lines 309–412)
**Project context:** None

---

## Findings

### F1 — `getByLabel("Rule 1")` / `getByLabel("Rule 2")` couples to label format
If the label changes (e.g. `"Rule #1"` or `"Rule: 1"`), fill operations silently fail. No locator fallback. Applies to `getByLabel("New rule")` too.

### F2 — `getByRole("list", { name: "Behavior Diff" })` needs explicit accessible name
The `<ul>` must have `aria-label="Behavior Diff"` or matching `aria-labelledby`. If absent, locator returns empty — no error, just `toHaveCount(0)`-style silent pass.

### F3 — `getByRole("article")` count sequence assumes synchronous reindex
After removing rule 1 (count 3→2) then rule 2 (2→1), test assumes reindex happens synchronously. If React batches or suspends, `toHaveCount` races.

### F4 — Long `exact: true` text matches brittle
Lines like `"Use the project standards before editing code. Keep commits small."` with `{ exact: true }` break on whitespace normalization, trailing space, or DOM text splitting. The lib code normalizes whitespace via `normalizeRuleText`, but the test asserts raw text directly.

### F5 — Negative assertions (`toHaveCount(0)`) timing-sensitive
`inspector.getByText(/AI semantic analysis|semantic analysis/i).toHaveCount(0)` asserts absence. Negative assertions pass if element hasn't rendered yet. No preceding `waitFor` or stability check.

### F6 — "New rule" field assumed always visible
After removing down to 1 rule and re-adding, test fills "New rule" and clicks "Add Rule". If the field autohides at max capacity, the fill succeeds but click does nothing — count stays 1, assertion fails (or passes silently if something else renders).

### F7 — No boundary/value-coverage in diff
Empty string, very long string, special characters, Unicode, zero-width characters — none tested in this diff block.

### F8 — Locator scoping from outside diff block
`inspector` and `rulesSection` are defined before line 309. If scoping changed (e.g. page navigated, panel recreated), assertions use stale handles.

---

## Risk Summary

| # | Severity | Category |
|---|----------|----------|
| F1 | Medium | Locator coupling |
| F2 | High | Accessibility contract |
| F3 | Medium | Race condition |
| F4 | Low | Whitespace fragility |
| F5 | Medium | Timing / false pass |
| F6 | Medium | State assumption |
| F7 | Low | Coverage gap |
| F8 | Low | Scoping assumption |
