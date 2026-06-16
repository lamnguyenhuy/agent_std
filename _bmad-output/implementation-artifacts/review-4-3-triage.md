# Triage — Story 4.3

## Normalized + Deduplicated Findings

### 1. isDraftInvalid zero-width gap [blind+edge+auditor]
Location: `export-readiness.ts:9`, `agent-studio-workbench.tsx:146`
Detail: `text.trim()` doesn't strip zero-width spaces (`\u200B-\u200D`, `\uFEFF`). Draft with only zero-width chars passes `isDraftInvalid` (returns false, considered valid) but would fail `validateRuleText`. Also duplicated in `getRuleError` line 146.
Classification: **defer** — pre-existing divergence between trim-based and regex-based validation. Requires cross-story decision on validation strategy.

### 2. Single generic error message [blind+edge]
Location: `export-readiness.ts:20`
Detail: `reason: "Fix invalid Rule text before exporting."` — single message regardless of how many drafts are invalid. No indication which rules need fixing.
Classification: **defer** — UX enhancement, not a correctness bug. Non-blocking.

### 3. Stale draft entries on remove error [blind+edge]
Location: `agent-studio-workbench.tsx:174-184`
Detail: `setRuleTextDrafts` cleanup and `applyPlaybookUpdate` are independent setState calls. If second call throws, draft cleanup already committed — orphaned entries for removed rule IDs.
Classification: **defer** — unlikely in React 18 concurrent mode with synchronous event handlers. Batched by default.

### 4. No committed rules check in export readiness [blind]
Location: `export-readiness.ts:14-24`
Detail: `computeExportReadiness` checks only `ruleTextDrafts`, never `playbook.rules` directly. If committed rule text somehow becomes invalid, export readiness reports true.
Classification: **defer** — defensive only; committed rules always valid via validateRuleText gate.

### 5. Button title swaps semantic role [blind]
Location: `agent-studio-workbench.tsx:221-222`
Detail: Button title is a problem reason when disabled, an action instruction when enabled. Inconsistent semantics for assistive tech.
Classification: **defer** — UX pattern established in existing codebase.

### 6. useMemo re-derives on every render [blind+edge]
Location: `agent-studio-workbench.tsx:105-108`
Detail: `ruleTextDrafts` state update always creates new object reference (spread pattern). useMemo can't structurally compare — recomputes every render.
Classification: **defer** — minor perf concern, existing pattern across the component.

### 7. E2E locator under-constrained [blind+edge]
Location: `tests/e2e/sample-flow.spec.ts`
Detail: `getByRole("button", { name: /download/i })` matches any button with "download" in accessible name.
Classification: **patch** — trivial fix: use `{ name: "Download Patch", exact: true }`.

### 8. getRuleError duplicates isDraftInvalid [blind]
Location: `agent-studio-workbench.tsx:145-148`
Detail: `draft.trim().length === 0` duplicated at line 146 instead of importing `isDraftInvalid` from export-readiness.
Classification: **patch** — trivial fix: export and reuse `isDraftInvalid`.

### 9. No runtime guard on playbook.rules [blind]
Location: `export-readiness.ts`
Detail: No guard if non-null playbook has corrupt internal state at runtime.
Classification: **defer** — TypeScript compile-time check sufficient; function doesn't access rules.

### 10. Export readiness ignores initialRules baseline [blind+edge]
Location: `export-readiness.ts`
Detail: Reports ready when playbook exists + valid drafts, even if `initialRules` is null (e.g., playbook created via error recovery path).
Classification: **defer** — out of scope for ACs 4-5 (only rule text validity specified).

### 11. AC 6: 500 ms target unverifiable [auditor]
Detail: No benchmark or performance assertion in diff.
Classification: **defer** — performance concern, not actionable from this diff.

## Summary

| Category | Count |
|----------|-------|
| patch    | 2     |
| defer    | 9     |
| dismiss  | 0     |
