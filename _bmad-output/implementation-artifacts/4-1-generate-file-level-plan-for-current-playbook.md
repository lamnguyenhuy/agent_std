---
baseline_commit: NO_VCS
---

# Story 4.1: Generate File-Level Plan for Current Playbook

Status: done

## Story

As a tech lead,
I want to see which files would be added or modified,
so that I can review agent behavior changes before applying them.

## Acceptance Criteria

1. Given a valid Agent Playbook and Tool Translator outputs exist, when the user opens the Review Inspector, then Agent Studio shows a Plan listing `.agent-studio/playbook.yaml`.
2. Given the Plan is shown, then it lists the generated Claude Code output artifact (`CLAUDE.md`).
3. Given the Plan is shown, then it lists the generated Cursor output artifacts (`.cursor/rules/playbook.mdc` and `.cursorrules`).
4. Given the Plan is shown, then it lists the generated Windsurf output artifact (`.windsurf/rules/playbook.md`).
5. Given the Plan is shown, then each Plan row distinguishes added versus modified status using a visible badge.
6. Given the Plan is shown, then file paths use POSIX-style `/` separators (no backslashes).

## Tasks / Subtasks

- [x] Task 1: Create unit tests for `generatePlan` pure function (RED phase). (AC: 1–6)
  - [x] Create `src/lib/review/plan.test.ts`.
  - [x] Test: `.agent-studio/playbook.yaml` is always the first entry with `kind: "modified"` and `label: "Canonical Playbook"`.
  - [x] Test: all translator artifacts appear after the playbook entry in TRANSLATORS order.
  - [x] Test: `kind` from translator artifact is preserved in `PlanChange`.
  - [x] Test: `label` from the translator (e.g. `"Claude Code"`) is preserved in `PlanChange`.
  - [x] Test: POSIX paths are preserved unchanged (no backslashes introduced).
  - [x] Test: empty translator list returns exactly one entry (the playbook entry).
  - [x] Test: full sample-repo call — 3 translators → 5 entries total in correct order.
  - [x] Confirm all tests are RED before implementing `plan.ts`.
- [x] Task 2: Implement `src/lib/review/plan.ts` (GREEN phase). (AC: 1–6)
  - [x] Create the directory `src/lib/review/` (new).
  - [x] Define and export `PlanChange` type: `{ path: string; kind: "added" | "modified"; label: string }`.
  - [x] Implement and export `generatePlan(items: Array<{ label: string; artifacts: GeneratedArtifact[] }>): PlanChange[]`.
  - [x] First entry is always `{ path: ".agent-studio/playbook.yaml", kind: "modified", label: "Canonical Playbook" }`.
  - [x] Remaining entries: `items.flatMap(({ label, artifacts }) => artifacts.map(a => ({ path: a.path, kind: a.kind, label })))`.
  - [x] Confirm all `plan.test.ts` tests are GREEN; run `pnpm test` (no regressions).
- [x] Task 3: Create `plan-list.tsx` with source-string contract tests (RED → GREEN). (AC: 1–5, UX-DR21)
  - [x] Create `src/components/workbench/plan-list.test.ts` using `readFileSync` source-string pattern.
  - [x] Assert source imports `StatusBadge`.
  - [x] Assert source imports `PlanChange` from `@/lib/review/plan`.
  - [x] Assert source uses `aria-label` on the list element.
  - [x] Assert source renders `change.path` with `font-mono` styling.
  - [x] Assert source uses `change.kind` to determine badge variant.
  - [x] Assert source renders `change.label`.
  - [x] Confirm all tests RED before implementation.
  - [x] Create `src/components/workbench/plan-list.tsx`.
  - [x] Props: `{ plan: PlanChange[] }`.
  - [x] Render `<ul aria-label="Plan">` with one `<li>` per change.
  - [x] Each row: `<StatusBadge label={change.kind === "added" ? "Added" : "Modified"} variant={change.kind === "added" ? "accent" : "subtle"} />` + `<span className="... font-mono text-xs ...">{change.path}</span>` + `<span className="... text-muted-foreground ...">{change.label}</span>`.
  - [x] Confirm all plan-list tests GREEN; `pnpm test` passes.
- [x] Task 4: Create `review-panel.tsx` with source-string contract tests (RED → GREEN). (AC: 1)
  - [x] Create `src/components/workbench/review-panel.test.ts` using `readFileSync` pattern.
  - [x] Assert source imports `PlanList` from `./plan-list`.
  - [x] Assert source renders a "Plan" heading.
  - [x] Assert source accepts `plan` prop.
  - [x] Assert source renders an empty/null state when plan is null.
  - [x] Confirm all tests RED before implementation.
  - [x] Create `src/components/workbench/review-panel.tsx`.
  - [x] Props: `{ plan: PlanChange[] | null }`.
  - [x] Null state: `<div className="p-4 text-sm text-muted-foreground">Create an Agent Playbook to see the Plan.</div>`.
  - [x] Plan state: `<div className="p-4"><h3 className="mb-3 text-sm font-semibold">Plan</h3><PlanList plan={plan} /></div>`.
  - [x] Add `"use client"` directive.
  - [x] Confirm all review-panel tests GREEN; `pnpm test` passes.
- [x] Task 5: Wire ReviewPanel into workbench and add source-string tests (RED → GREEN). (AC: 1–6)
  - [x] Extend `src/components/workbench/agent-studio-workbench.test.ts` with new source-string assertions.
  - [x] Assert workbench source imports `ReviewPanel` from `./review-panel`.
  - [x] Assert workbench source imports `generatePlan` from `@/lib/review/plan`.
  - [x] Assert workbench source contains `generatePlan(` usage.
  - [x] Assert workbench source contains `ReviewPanel` usage.
  - [x] Confirm new tests RED before changes.
  - [x] In `agent-studio-workbench.tsx`, add imports: `ReviewPanel` from `@/components/workbench/review-panel`, `generatePlan` from `@/lib/review/plan`, and `TRANSLATORS` from `@/lib/translators/index` (if not already imported).
  - [x] Add `plan` useMemo (after `translatorSection`): `const plan = useMemo(() => { if (playbook == null) return null; return generatePlan(TRANSLATORS.map((t) => ({ label: t.label, artifacts: t.translate(playbook).artifacts }))); }, [playbook])`.
  - [x] Replace the Review tab placeholder (`<div className="p-4 ...">Review — coming in Epic 4</div>`) with `<ReviewPanel plan={plan} />`.
  - [x] Confirm all workbench tests GREEN; `pnpm test` passes.
- [x] Task 6: Extend E2E test for Review tab Plan. (AC: 1–6)
  - [x] In `tests/e2e/sample-flow.spec.ts`, add a "Switch to Review tab and assert Plan" section after the Windsurf section (before the final "Rules editor still visible" assertion).
  - [x] Click outer `inspector.getByRole("tab", { name: "Review" })` and assert `aria-selected: "true"`.
  - [x] Assert `inspector.getByRole("heading", { name: "Plan", exact: true })` is visible.
  - [x] Assert `.agent-studio/playbook.yaml` is visible (plan row 1).
  - [x] Assert `"Canonical Playbook"` label is visible (plan row 1).
  - [x] Assert `"CLAUDE.md"` is visible (plan row 2, exact: true).
  - [x] Assert `".cursor/rules/playbook.mdc"` is visible (plan row 3, exact: true).
  - [x] Assert `".cursorrules"` is visible (plan row 4, exact: true).
  - [x] Assert `".windsurf/rules/playbook.md"` is visible (plan row 5, exact: true).
  - [x] Assert `inspector.getByText("Modified")` has count 5 (all current translators hardcode `kind: "modified"`).
  - [x] Run `pnpm test:e2e tests/e2e/sample-flow.spec.ts` and confirm 3/3 E2E tests pass.
- [x] Task 7: Final full verification. (All ACs)
  - [x] `pnpm test` — all unit tests pass (zero regressions).
  - [x] `pnpm typecheck` — zero TypeScript errors.
  - [x] `pnpm lint` — zero lint errors.
  - [x] `pnpm test:e2e tests/e2e/sample-flow.spec.ts` — 3/3 E2E tests pass.

## Dev Notes

### Story Source

- Epic: Epic 4, `Review Plan, Behavior Diff, and Patch Export`.
- Story requirement ID: `FR-13`.
- Source ACs: `_bmad-output/planning-artifacts/epics.md`, `Story 4.1: Generate File-Level Plan for Current Playbook`.
- PRD requirement: Agent Studio shows a file-level Plan of which files would be added or modified, derived from the current Playbook and Tool Translator outputs. [Source: `_bmad-output/planning-artifacts/prds/prd-agent_std-2026-06-09/prd.md`, FR-13]
- UX requirements: UX-DR20 (Review Inspector shows Plan list), UX-DR21 (Plan rows show added/modified status badge, code-style file path, and generated/canonical meaning). [Source: `_bmad-output/planning-artifacts/ux-designs/ux-agent_std-2026-06-09/EXPERIENCE.md`]

### Files to Create

| File | Type | Purpose |
|------|------|---------|
| `src/lib/review/plan.ts` | NEW domain module | `PlanChange` type + `generatePlan()` pure function |
| `src/lib/review/plan.test.ts` | NEW unit tests | Real logic tests for `generatePlan` |
| `src/components/workbench/plan-list.tsx` | NEW component | Renders `PlanChange[]` as a styled list |
| `src/components/workbench/plan-list.test.ts` | NEW source-string tests | Contract tests for `plan-list.tsx` |
| `src/components/workbench/review-panel.tsx` | NEW component | Review tab panel: "Plan" heading + `PlanList` |
| `src/components/workbench/review-panel.test.ts` | NEW source-string tests | Contract tests for `review-panel.tsx` |

### Files to Modify

| File | Change |
|------|--------|
| `src/components/workbench/agent-studio-workbench.tsx` | Add `plan` useMemo + imports; replace Review tab placeholder with `<ReviewPanel plan={plan} />` |
| `src/components/workbench/agent-studio-workbench.test.ts` | Extend with source-string tests for new imports/usage |
| `tests/e2e/sample-flow.spec.ts` | Add Review tab Plan assertions |
| `_bmad-output/implementation-artifacts/sprint-status.yaml` | `4-1-*` → `ready-for-dev` (done by create-story) |

### Domain Module: `src/lib/review/plan.ts`

This is a **pure function** — no React, no imports from `src/components/`. It lives in `src/lib/review/` which must be created (directory does not exist yet).

```typescript
import type { GeneratedArtifact } from "@/lib/translators/types"

export type PlanChange = {
  path: string
  kind: "added" | "modified"
  label: string
}

export function generatePlan(
  items: Array<{ label: string; artifacts: GeneratedArtifact[] }>
): PlanChange[] {
  const playbookEntry: PlanChange = {
    path: ".agent-studio/playbook.yaml",
    kind: "modified",
    label: "Canonical Playbook",
  }
  return [
    playbookEntry,
    ...items.flatMap(({ label, artifacts }) =>
      artifacts.map((artifact): PlanChange => ({
        path: artifact.path,
        kind: artifact.kind,
        label,
      }))
    ),
  ]
}
```

The `.agent-studio/playbook.yaml` entry is **always `kind: "modified"`** — it is the canonical Playbook that already exists and is being updated.

### Plan Entries for the Sample Repo

When called with `TRANSLATORS.map(t => ({ label: t.label, artifacts: t.translate(playbook).artifacts }))`, the result is:

| # | path | kind | label |
|---|------|------|-------|
| 1 | `.agent-studio/playbook.yaml` | `modified` | `Canonical Playbook` |
| 2 | `CLAUDE.md` | `modified` | `Claude Code` |
| 3 | `.cursor/rules/playbook.mdc` | `modified` | `Cursor` |
| 4 | `.cursorrules` | `modified` | `Cursor` |
| 5 | `.windsurf/rules/playbook.md` | `modified` | `Windsurf` |

All 5 entries have `kind: "modified"` because the current translators hardcode `kind: "modified"` (pre-existing deferred issue from Story 3.2/3.3/3.4 code reviews).

### Architecture Requirements for this Story

- **AR-9**: `plan.ts` is a pure domain module — no React, no UI imports, no side effects.
- **AR-10**: `plan-list.tsx` and `review-panel.tsx` are thin UI wrappers — do NOT construct generated output strings inside them.
- **AR-13**: The workbench is the single state owner. Plan is derived via `useMemo` from `playbook` state.
- **AR-16**: All artifact paths already use POSIX `/` separators — preserve them unchanged, do NOT transform.
- **AR-19**: Use `useMemo` for `plan` derivation (same pattern as existing `translatorSection` useMemo).
- **AR-20**: Unit tests in `plan.test.ts` must cover the pure function; source-string tests cover component contracts.

### Do NOT implement in this story

- **Story 4.2** (Behavior Diff): `behavior-diff.ts`, `behavior-diff.tsx` — do not create these files yet.
- **Story 4.3** (Synchronization): No reactive re-run on every keystroke yet. The `plan` useMemo already re-runs when `playbook` changes, which is sufficient for Story 4.1.
- **Stories 4.4–4.6** (Export): `export-actions.tsx`, Download Patch/Files buttons — not in scope.
- `compatibility-note.tsx` (separate component mentioned in architecture) — not needed for Story 4.1.

### Component: `plan-list.tsx`

Props: `{ plan: PlanChange[] }`

```tsx
"use client"

import { StatusBadge } from "@/components/workbench/status-badge"
import type { PlanChange } from "@/lib/review/plan"

export function PlanList({ plan }: { plan: PlanChange[] }) {
  return (
    <ul aria-label="Plan" className="grid gap-2">
      {plan.map((change) => (
        <li
          key={change.path}
          className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2"
        >
          <StatusBadge
            label={change.kind === "added" ? "Added" : "Modified"}
            variant={change.kind === "added" ? "accent" : "subtle"}
          />
          <span className="min-w-0 flex-1 font-mono text-xs break-all text-foreground">
            {change.path}
          </span>
          <span className="shrink-0 text-xs text-muted-foreground">
            {change.label}
          </span>
        </li>
      ))}
    </ul>
  )
}
```

No empty-state needed in `PlanList` — the parent `ReviewPanel` handles the null case before ever rendering `PlanList`.

### Component: `review-panel.tsx`

Props: `{ plan: PlanChange[] | null }`

```tsx
"use client"

import { PlanList } from "@/components/workbench/plan-list"
import type { PlanChange } from "@/lib/review/plan"

type ReviewPanelProps = {
  plan: PlanChange[] | null
}

export function ReviewPanel({ plan }: ReviewPanelProps) {
  if (plan == null) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Create an Agent Playbook to see the Plan.
      </div>
    )
  }
  return (
    <div className="p-4">
      <h3 className="mb-3 text-sm font-semibold">Plan</h3>
      <PlanList plan={plan} />
    </div>
  )
}
```

### Workbench Changes (`agent-studio-workbench.tsx`)

**Imports to add** (at the top, with other workbench imports):
```typescript
import { ReviewPanel } from "@/components/workbench/review-panel"
import { generatePlan } from "@/lib/review/plan"
import { TRANSLATORS } from "@/lib/translators/index"
```

**`plan` useMemo to add** (after `translatorSection` useMemo, around line 75 in the current file):
```typescript
const plan = useMemo(() => {
  if (playbook == null) return null
  return generatePlan(
    TRANSLATORS.map((t) => ({
      label: t.label,
      artifacts: t.translate(playbook).artifacts,
    }))
  )
}, [playbook])
```

**Review tab replacement** (around lines 503–507 — replace the placeholder):
```tsx
// BEFORE:
<TabsContent value="review">
  <div className="p-4 text-sm text-muted-foreground">
    Review — coming in Epic 4
  </div>
</TabsContent>

// AFTER:
<TabsContent value="review">
  <ReviewPanel plan={plan} />
</TabsContent>
```

### Unit Tests: `src/lib/review/plan.test.ts`

These are **real logic tests** (not source-string), because `generatePlan` is a pure function:

```typescript
import { describe, expect, it } from "vitest"
import { generatePlan } from "@/lib/review/plan"

describe("generatePlan", () => {
  it("puts .agent-studio/playbook.yaml as the first entry", () => {
    const result = generatePlan([])
    expect(result[0].path).toBe(".agent-studio/playbook.yaml")
  })

  it("marks the playbook entry as modified", () => {
    const result = generatePlan([])
    expect(result[0].kind).toBe("modified")
  })

  it("labels the playbook entry as Canonical Playbook", () => {
    const result = generatePlan([])
    expect(result[0].label).toBe("Canonical Playbook")
  })

  it("returns only the playbook entry when given empty items", () => {
    const result = generatePlan([])
    expect(result).toHaveLength(1)
  })

  it("appends translator artifacts after the playbook entry", () => {
    const result = generatePlan([
      { label: "Claude Code", artifacts: [{ path: "CLAUDE.md", content: "", kind: "modified" }] },
    ])
    expect(result).toHaveLength(2)
    expect(result[1]).toEqual({ path: "CLAUDE.md", kind: "modified", label: "Claude Code" })
  })

  it("preserves artifact kind from translator result", () => {
    const result = generatePlan([
      { label: "Claude Code", artifacts: [{ path: "CLAUDE.md", content: "", kind: "added" }] },
    ])
    expect(result[1].kind).toBe("added")
  })

  it("preserves POSIX-style artifact paths unchanged", () => {
    const result = generatePlan([
      { label: "Cursor", artifacts: [
        { path: ".cursor/rules/playbook.mdc", content: "", kind: "modified" },
        { path: ".cursorrules", content: "", kind: "modified" },
      ]},
    ])
    expect(result[1].path).toBe(".cursor/rules/playbook.mdc")
    expect(result[2].path).toBe(".cursorrules")
    expect(result.every(r => !r.path.includes("\\"))).toBe(true)
  })

  it("maps all three translators to correct entries in order", () => {
    const result = generatePlan([
      { label: "Claude Code", artifacts: [{ path: "CLAUDE.md", content: "", kind: "modified" }] },
      { label: "Cursor", artifacts: [
        { path: ".cursor/rules/playbook.mdc", content: "", kind: "modified" },
        { path: ".cursorrules", content: "", kind: "modified" },
      ]},
      { label: "Windsurf", artifacts: [{ path: ".windsurf/rules/playbook.md", content: "", kind: "modified" }] },
    ])
    expect(result).toHaveLength(5)
    expect(result.map(r => r.path)).toEqual([
      ".agent-studio/playbook.yaml",
      "CLAUDE.md",
      ".cursor/rules/playbook.mdc",
      ".cursorrules",
      ".windsurf/rules/playbook.md",
    ])
    expect(result.map(r => r.label)).toEqual([
      "Canonical Playbook",
      "Claude Code",
      "Cursor",
      "Cursor",
      "Windsurf",
    ])
  })
})
```

### Source-String Tests: `plan-list.test.ts`

```typescript
import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const source = readFileSync("src/components/workbench/plan-list.tsx", "utf8")

describe("PlanList rendering contracts", () => {
  it("imports StatusBadge", () => {
    expect(source).toContain("StatusBadge")
  })
  it("imports PlanChange type", () => {
    expect(source).toContain("PlanChange")
  })
  it("uses aria-label on the list", () => {
    expect(source).toContain("aria-label")
  })
  it("renders path with font-mono styling", () => {
    expect(source).toContain("font-mono")
  })
  it("uses change.kind for badge variant logic", () => {
    expect(source).toContain("change.kind")
  })
  it("renders change.label", () => {
    expect(source).toContain("change.label")
  })
})
```

### Source-String Tests: `review-panel.test.ts`

```typescript
import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const source = readFileSync("src/components/workbench/review-panel.tsx", "utf8")

describe("ReviewPanel rendering contracts", () => {
  it("imports PlanList", () => {
    expect(source).toContain("PlanList")
  })
  it("renders a Plan heading", () => {
    expect(source).toContain("Plan")
  })
  it("accepts plan prop", () => {
    expect(source).toContain("plan")
  })
  it("renders a null/empty state", () => {
    expect(source).toContain("null")
  })
})
```

### Source-String Tests to add to `agent-studio-workbench.test.ts`

Add inside the existing `describe` block:

```typescript
it("imports ReviewPanel for the review tab", () => {
  expect(workbenchSource).toContain("ReviewPanel")
})
it("imports generatePlan for plan derivation", () => {
  expect(workbenchSource).toContain("generatePlan")
})
it("computes plan with useMemo", () => {
  expect(workbenchSource).toContain("generatePlan(")
})
it("does not contain the Epic 4 placeholder text", () => {
  expect(workbenchSource).not.toContain("Review — coming in Epic 4")
})
```

### E2E Additions: `tests/e2e/sample-flow.spec.ts`

Insert after the Windsurf section (after the `await rulesSection.getByRole("button", ...).click()` that removes the Windsurf rule, before `// Rules editor (center panel) still visible after tab switch`):

```typescript
// Switch to Review tab and assert Plan
const reviewTab = inspector.getByRole("tab", { name: "Review" })
await reviewTab.click()
await expect(reviewTab).toHaveAttribute("aria-selected", "true")
await expect(
  inspector.getByRole("heading", { name: "Plan", exact: true })
).toBeVisible()
// Plan row 1: canonical playbook
await expect(
  inspector.getByText(".agent-studio/playbook.yaml", { exact: true })
).toBeVisible()
await expect(
  inspector.getByText("Canonical Playbook", { exact: true })
).toBeVisible()
// Plan row 2: Claude Code
await expect(inspector.getByText("CLAUDE.md", { exact: true })).toBeVisible()
// Plan row 3–4: Cursor
await expect(
  inspector.getByText(".cursor/rules/playbook.mdc", { exact: true })
).toBeVisible()
await expect(
  inspector.getByText(".cursorrules", { exact: true })
).toBeVisible()
// Plan row 5: Windsurf
await expect(
  inspector.getByText(".windsurf/rules/playbook.md", { exact: true })
).toBeVisible()
// All 5 entries show Modified badge (current translators hardcode kind: "modified")
await expect(inspector.getByText("Modified")).toHaveCount(5)
```

**Selector notes:**
- `inspector.getByRole("tab", { name: "Review" })` — matches the outer Preview/Review tab, NOT the inner Claude Code/Cursor/Windsurf tool translator tabs (which are inside the hidden Preview TabsContent when Review is active).
- When the outer Review tab is active, the inner tool translator tabs are hidden inside the inactive Preview TabsContent. Playwright's `toBeVisible()` will not match hidden elements.
- `".agent-studio/playbook.yaml"` with `exact: true` matches the plan row path, NOT the longer "Generated from .agent-studio/playbook.yaml" text inside the hidden Preview code panels.
- `inspector.getByText("CLAUDE.md", { exact: true })` — When Review tab is active, the "CLAUDE.md" artifact label in the Preview content is hidden; only the Plan row `CLAUDE.md` is visible.

### Testing Approach

**TDD cycle per task:**
1. Write tests → confirm RED (file or assertions don't exist yet)
2. Implement → confirm GREEN
3. Run full suite → confirm no regressions

**Test commands:**
```bash
pnpm test -- src/lib/review/plan.test.ts                           # Task 1
pnpm test -- src/components/workbench/plan-list.test.ts            # Task 3
pnpm test -- src/components/workbench/review-panel.test.ts         # Task 4
pnpm test -- src/components/workbench/agent-studio-workbench.test.ts  # Task 5
pnpm test                                                           # Full suite (no regressions)
pnpm typecheck
pnpm lint
pnpm test:e2e tests/e2e/sample-flow.spec.ts                        # Task 6
```

E2E command (if dev server already running on port 3100):
```bash
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3100 pnpm test:e2e tests/e2e/sample-flow.spec.ts
```

### StatusBadge Reference

`StatusBadge` is at `src/components/workbench/status-badge.tsx`:
- Props: `{ label: string; variant?: "accent" | "subtle" }`
- `"accent"` → teal/primary pill (use for `"Added"`)
- `"subtle"` → muted gray pill (use for `"Modified"`)

Since all current translators hardcode `kind: "modified"`, all 5 Plan rows will render with `variant="subtle"` / "Modified" badge. The `"Added"` variant is wired correctly for when future translators produce `kind: "added"`.

### Previous Story Intelligence (Story 3.5)

- **`readFileSync` source-string pattern**: unit tests for components use `readFileSync("src/...", "utf8")` and assert `toContain(...)`. This is the established pattern (see `translator-preview.test.ts` and `agent-studio-workbench.test.ts`). No React Testing Library available.
- **`"use client"` directive**: all workbench components have `"use client"` at line 1. Add it to `plan-list.tsx` and `review-panel.tsx`.
- **Lucide icons**: not needed for this story — `StatusBadge` provides the visual distinction, no new icons required.
- **YAML safety pattern**: not needed for this story's new files.
- **E2E port reuse**: dev server may be on 3100 — use `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3100`.
- **useMemo pattern**: existing `translatorSection` useMemo in `agent-studio-workbench.tsx` follows `const x = useMemo(() => { if (playbook == null) return null; ... }, [playbook])` — match this pattern exactly for `plan`.

### Architecture Compliance Checklist

- [ ] `plan.ts` is pure — no React imports, no `useState`/`useEffect`, no UI imports.
- [ ] `plan-list.tsx` does NOT construct generated file content strings inline.
- [ ] `review-panel.tsx` does NOT import from `src/lib/translators/` — it only renders `PlanChange[]`.
- [ ] `plan` derivation uses `useMemo` in workbench (AR-19: memoized pure transformation).
- [ ] No new Redux, Zustand, Context providers, event buses (AR-14).
- [ ] No backend routes, server actions, persistence (out of scope for MVP).
- [ ] All paths in assertions and rendered output use POSIX `/` separators (AR-16).
- [ ] `behavior-diff.ts` and `behavior-diff.tsx` are NOT created in this story.
- [ ] `export-actions.tsx` is NOT created or modified in this story.

### Installed Package Versions

- Next.js `16.2.6`
- React `19.2.4`
- TypeScript `5.x`
- Tailwind CSS `4.x`
- Radix UI `1.5.0`
- Vitest `4.1.8`
- Playwright `1.60.0`
- lucide-react `^1.17.0`

### References

- Epic 4 requirements: `_bmad-output/planning-artifacts/epics.md` — Epic 4, Story 4.1
- Architecture: `_bmad-output/planning-artifacts/architecture.md` — AR-9, AR-10, AR-13, AR-16, AR-19, AR-20; FR-13 to FR-15 mapping; `src/lib/review/` and `src/components/workbench/` directory structure
- UX: `_bmad-output/planning-artifacts/ux-designs/ux-agent_std-2026-06-09/EXPERIENCE.md` — UX-DR20, UX-DR21
- `StatusBadge` component: `src/components/workbench/status-badge.tsx`
- Translator types: `src/lib/translators/types.ts` — `GeneratedArtifact`, `TranslatorResult`, `TranslatorModule`
- Translator index: `src/lib/translators/index.ts` — `TRANSLATORS` array order: `[claudeCodeTranslator, cursorTranslator, windsurfTranslator]`
- Existing workbench: `src/components/workbench/agent-studio-workbench.tsx` — Review tab placeholder at lines 503–507
- Existing workbench test: `src/components/workbench/agent-studio-workbench.test.ts` — extend with source-string assertions
- E2E: `tests/e2e/sample-flow.spec.ts` — insert Review tab assertions after Windsurf section (before line 283)
- Previous story (3.5): `_bmad-output/implementation-artifacts/3-5-show-compatibility-notes-for-adapted-output.md`

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- 2026-06-16: Resumed Story 4.1 in-progress with implementation files already present in the working tree.
- 2026-06-16: Verified targeted Story 4.1 tests with `pnpm test -- src/lib/review/plan.test.ts src/components/workbench/plan-list.test.ts src/components/workbench/review-panel.test.ts src/components/workbench/agent-studio-workbench.test.ts`.
- 2026-06-16: E2E initially could not spawn its web server because port 3100 was already in use; confirmed existing server returned HTTP 200 and reran with `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3100`.
- 2026-06-16: Full verification passed with `pnpm test`, `pnpm typecheck`, `pnpm lint`, and `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3100 pnpm test:e2e tests/e2e/sample-flow.spec.ts`.

### Completion Notes List

- Added the pure `generatePlan` domain module that always lists `.agent-studio/playbook.yaml` first and then preserves translator artifact order, labels, kinds, and POSIX paths.
- Added Plan UI components for the Review Inspector with visible Added/Modified badges, code-style file paths, and generated/canonical labels.
- Wired the Review tab to derive its Plan from the current Playbook and all registered Tool Translator artifacts.
- Extended unit/source-string/E2E coverage for Plan generation, Review tab wiring, visible Plan rows, and Modified badge counts.

### File List

- `src/lib/review/plan.ts`
- `src/lib/review/plan.test.ts`
- `src/components/workbench/plan-list.tsx`
- `src/components/workbench/plan-list.test.ts`
- `src/components/workbench/review-panel.tsx`
- `src/components/workbench/review-panel.test.ts`
- `src/components/workbench/agent-studio-workbench.tsx`
- `src/components/workbench/agent-studio-workbench.test.ts`
- `tests/e2e/sample-flow.spec.ts`
- `_bmad-output/implementation-artifacts/4-1-generate-file-level-plan-for-current-playbook.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Change Log

- 2026-06-15: Story 4.1 created — ready-for-dev.
- 2026-06-16: Completed Story 4.1 implementation verification and moved status to review.
