---
baseline_commit: NO_VCS
status: in-progress
---

# Story 3.5: Show Compatibility Notes for Adapted Output

Status: done

## Story

As a tech lead,
I want compatibility notes near translated output,
So that I understand where a tool adapts or flattens Playbook concepts.

## Acceptance Criteria

1. Given a Tool Translator adapts or flattens a Playbook concept, when the affected preview is displayed, then Agent Studio shows an inline compatibility note near the affected generated output.
2. Given a compatibility note is shown, then the note is informational and does not block export readiness.
3. Given a compatibility note is shown, then the note uses plain language (example: ".cursor/rules is the primary Cursor target. .cursorrules is included as legacy compatibility for the sample.").
4. Given a compatibility note is shown, then it uses warning styling without relying on color alone.
5. Given a compatibility note is shown, then it does not claim unsupported tool capabilities.

## Tasks / Subtasks

- [x] Add unit tests for `translator-preview.tsx` compatibility note rendering contract. (AC: 1, 3, 4)
  - [x] Create `src/components/workbench/translator-preview.test.ts`.
  - [x] Assert `translator-preview.tsx` source references `compatibilityNotes`.
  - [x] Assert source uses `role="note"` for each note element.
  - [x] Assert source applies `--warning-surface` and `--warning` CSS variable styling.
  - [x] Assert source uses `TriangleAlert` (non-color visual indicator) from `lucide-react`.
  - [x] Assert source only renders the note block when `compatibilityNotes.length > 0`.
- [x] Update `translator-preview.tsx` to render compatibility notes. (AC: 1, 2, 3, 4, 5)
  - [x] Import `TriangleAlert` from `lucide-react`.
  - [x] Import `CompatibilityNote` type from `@/lib/translators/types`.
  - [x] In each `TabsContent`, after the artifacts section, render a notes block when `result.compatibilityNotes.length > 0`.
  - [x] Render each note as `role="note"` with `TriangleAlert` icon (aria-hidden) plus the note message text.
  - [x] Use `bg-[var(--warning-surface)]`, `border-[var(--warning)]`, and `text-[var(--warning)]` for warning styling.
  - [x] Do not block or disable any UI element based on note presence.
  - [x] Do not add notes to the null/no-playbook empty state.
- [x] Extend E2E coverage for compatibility note visibility. (AC: 1, 3, 4)
  - [x] In `tests/e2e/sample-flow.spec.ts`, in the Cursor tab section, assert the compatibility note is visible via `inspector.getByRole("note")`.
  - [x] Assert the Cursor compatibility note message text appears twice in the Cursor tab (once in the code panel artifact content, once as a rendered note).
  - [x] Assert the Claude Code tab shows zero note elements (no notes for Claude Code).
  - [x] Assert the Windsurf tab shows zero note elements (no notes for Windsurf).

## Dev Notes

### Story Source

- Epic: Epic 3, `Cross-Tool Preview and Compatibility Notes`.
- Story requirement ID: `FR-12`.
- Source ACs: `_bmad-output/planning-artifacts/epics.md`, `Story 3.5: Show Compatibility Notes for Adapted Output`.
- PRD requirement: Agent Studio shows lightweight compatibility notes when a Tool Translator adapts or flattens Playbook concepts; notes are informational, non-blocking, and written in plain language. [Source: `_bmad-output/planning-artifacts/prds/prd-agent_std-2026-06-09/prd.md`, FR-12]
- UX requirement: Show compatibility notes inline near the affected Tool Translator preview, using the warning note visual style and non-blocking behavior. [Source: `_bmad-output/planning-artifacts/ux-designs/ux-agent_std-2026-06-09/EXPERIENCE.md`, UX-DR19]

### Current Code State

- `src/components/workbench/translator-preview.tsx` renders each translator's `result.artifacts` but **completely ignores `result.compatibilityNotes`**. This is the only file that needs to change for UI rendering.
- `src/lib/translators/cursor.ts` already returns one `compatibilityNote`:
  ```typescript
  compatibilityNotes: [
    {
      id: "cursor-legacy",
      message: ".cursor/rules is the primary Cursor target. .cursorrules is included as legacy compatibility for the sample.",
    },
  ]
  ```
- `src/lib/translators/claude-code.ts` returns `compatibilityNotes: []` — no notes for Claude Code.
- `src/lib/translators/windsurf.ts` returns `compatibilityNotes: []` — no notes for Windsurf.
- `src/lib/translators/types.ts` defines `CompatibilityNote = { id: string; message: string }` and `TranslatorResult = { artifacts: GeneratedArtifact[]; compatibilityNotes: CompatibilityNote[] }` — no changes needed.
- **CSS variables** already defined in `src/app/globals.css` under `:root`:
  - `--warning: #B45309` (amber text)
  - `--warning-surface: #FFF7ED` (warm cream background)
  - Dark mode: these variables are NOT overridden in `.dark` — the `:root` values apply in both modes at the MVP.
- **Lucide icons**: `lucide-react@^1.17.0` is installed. `TriangleAlert` is the warning-triangle icon. Existing usage pattern: import named icon from `"lucide-react"` (see `code-panel.tsx:4: import { Copy } from "lucide-react"`).
- **No Alert/Badge UI component in `src/components/ui/`** — only `button.tsx` and `tabs.tsx` exist. Implement note styling with Tailwind utility classes directly, using the CSS variable pattern established in `translator-preview.tsx` (e.g., `bg-[var(--surface-code)]`).

### Current `translator-preview.tsx` Structure

The component (83 lines) has two rendering branches:
1. **Null/no-playbook branch** (lines 27–44): renders disabled tabs with placeholder message. Do NOT add notes here.
2. **Active branch** (lines 46–82): renders `Tabs` → `TabsContent` per translator → artifacts section. Add notes rendering here, after the artifacts block.

Current `TabsContent` structure (lines 56–78):
```tsx
{results.map(({ translator, result }) => (
  <TabsContent key={translator.id} value={translator.id}>
    {result.artifacts.length > 0 ? (
      <div className="mt-3 grid gap-3">
        {result.artifacts.map((artifact) => (
          <div className="grid gap-1" key={artifact.path}>
            <p className="px-1 font-mono text-xs text-muted-foreground">
              {artifact.path}
            </p>
            <CodePanel
              content={artifact.content}
              label={`${translator.label} generated output: ${artifact.path}`}
            />
          </div>
        ))}
      </div>
    ) : (
      <div className="mt-3 rounded-md bg-[var(--surface-code)] p-3 font-mono text-xs leading-[1.55] text-[var(--foreground-code)]">
        No artifacts generated.
      </div>
    )}
  </TabsContent>
))}
```

The compatibility notes block belongs **after** the artifacts section (after the closing `}` of the `result.artifacts.length > 0` ternary, but still inside `TabsContent`).

### Suggested Implementation for `TabsContent`

```tsx
{results.map(({ translator, result }) => (
  <TabsContent key={translator.id} value={translator.id}>
    {result.artifacts.length > 0 ? (
      <div className="mt-3 grid gap-3">
        {result.artifacts.map((artifact) => (
          <div className="grid gap-1" key={artifact.path}>
            <p className="px-1 font-mono text-xs text-muted-foreground">
              {artifact.path}
            </p>
            <CodePanel
              content={artifact.content}
              label={`${translator.label} generated output: ${artifact.path}`}
            />
          </div>
        ))}
      </div>
    ) : (
      <div className="mt-3 rounded-md bg-[var(--surface-code)] p-3 font-mono text-xs leading-[1.55] text-[var(--foreground-code)]">
        No artifacts generated.
      </div>
    )}
    {result.compatibilityNotes.length > 0 && (
      <div className="mt-3 grid gap-2">
        {result.compatibilityNotes.map((note) => (
          <div
            key={note.id}
            role="note"
            className="flex items-start gap-2 rounded-md border border-[var(--warning)] bg-[var(--warning-surface)] px-3 py-2 text-xs text-[var(--warning)]"
          >
            <TriangleAlert aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <p>{note.message}</p>
          </div>
        ))}
      </div>
    )}
  </TabsContent>
))}
```

### Unit Test Approach

No React Testing Library is available. The project tests component-level structural contracts by reading source as a string (see `src/components/workbench/agent-studio-workbench.test.ts:1-19` which uses `readFileSync` to assert source code contains required structural strings).

Use the same pattern for `translator-preview.test.ts`:

```typescript
import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const source = readFileSync("src/components/workbench/translator-preview.tsx", "utf8")

describe("TranslatorPreview compatibility note rendering contracts", () => {
  it("references compatibilityNotes in rendering logic", () => {
    expect(source).toContain("compatibilityNotes")
  })
  it("uses role='note' for compatibility note elements", () => {
    expect(source).toContain('role="note"')
  })
  it("applies warning-surface background styling", () => {
    expect(source).toContain("warning-surface")
  })
  it("applies warning color styling", () => {
    expect(source).toContain("--warning")
  })
  it("uses TriangleAlert as non-color visual indicator", () => {
    expect(source).toContain("TriangleAlert")
  })
  it("guards note rendering with compatibilityNotes.length check", () => {
    expect(source).toContain("compatibilityNotes.length")
  })
})
```

All 6 tests will be RED before implementation (current source has none of these strings), GREEN after.

### E2E Note on Existing Cursor Tab Assertions

The current E2E in `sample-flow.spec.ts` (lines 218–219) asserts:
```typescript
await expect(
  inspector.getByText(
    ".cursor/rules is the primary Cursor target. .cursorrules is included as legacy compatibility for the sample."
  )
).toBeVisible()
```

This currently passes because the cursor-legacy compatibility note message text is embedded inside the `.cursorrules` artifact content (rendered inside CodePanel). After Story 3.5, the same text will ALSO appear as a rendered `role="note"` element, meaning `getByText(...)` will match **twice** — once inside the code panel, once in the note UI.

The E2E extension should:
1. Assert `inspector.getByRole("note")` is visible (at least one, in Cursor tab) — this is the new UI element
2. Assert the compatibility note text `toHaveCount(2)` in the Cursor tab (once in artifact, once in note UI)
3. Assert the Claude Code tab has `inspector.getByRole("note")` count of 0
4. Assert the Windsurf tab has `inspector.getByRole("note")` count of 0

**Ordering of E2E additions**: Add the Claude Code tab note-absence check right after the existing Claude Code assertions (before the `// Switch to Cursor tab` comment), add Cursor note assertions in the existing Cursor section, add Windsurf note-absence check in the existing Windsurf section.

**Important**: When checking the Cursor tab for `getByText(message)` count, verify the expected count matches your implementation. The text appears in the `.cursorrules` artifact content AND in the note UI — total 2 occurrences.

### Previous Story Intelligence

Story 3.4 learnings:
- **No React Testing Library** — use `readFileSync` source assertions for component structural contracts.
- **lucide-react icons**: import named exports directly (`import { TriangleAlert } from "lucide-react"`).
- **CSS variable pattern**: `bg-[var(--surface-code)]` is established in `translator-preview.tsx`. Reuse the same bracket notation for `--warning-surface` and `--warning`.
- **E2E null/count guards**: add `not.toBeNull()` before any bounding box comparisons; story 3.5 doesn't need bounding box tests.
- **Port reuse**: run E2E with `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3100 pnpm test:e2e tests/e2e/sample-flow.spec.ts` if the dev server is already running on 3100.

Story 3.3 learnings:
- **YAML safety pattern** applies to cursor.ts — not needed in translator-preview.tsx for this story.
- **E2E bounding box null check** — apply `not.toBeNull()` if using positional assertions (not expected here).

### Architecture Compliance

- `translator-preview.tsx` is a workbench component — it may call `src/lib/*` but must not build generated output strings inline. Notes are rendered from the translator result, not constructed in the component. [Source: `_bmad-output/planning-artifacts/architecture.md`, Component Boundaries]
- Do not import from other translator modules inside `translator-preview.tsx` — it consumes `TRANSLATORS` from `src/lib/translators/index.ts`, which is already imported.
- Do not mutate `AgentPlaybook` or translator results.
- Do not add backend routes, server actions, auth, persistence, or new state libraries.
- Do not implement Plan, Behavior Diff, or export changes.

### Next.js / UI Guardrails

- Relevant local docs already identified for this epic (same as Stories 3.3/3.4).
- Installed versions: Next.js `16.2.6`, React `19.2.4`, Radix UI `1.5.0`, shadcn `4.11.0`, Vitest `4.1.8`, Playwright `1.60.0`, lucide-react `^1.17.0`.
- `"use client"` directive is already at the top of `translator-preview.tsx` — keep it.
- `TriangleAlert` is available in lucide-react `^1.17.0`.

### Testing Requirements

- Follow TDD: write failing tests first, verify RED, implement, verify GREEN.
- Unit test target: `pnpm test -- src/components/workbench/translator-preview.test.ts`.
- Full verification before marking dev complete:
  - `pnpm test`
  - `pnpm typecheck`
  - `pnpm lint`
  - `pnpm test:e2e tests/e2e/sample-flow.spec.ts`
- E2E selectors:
  - `inspector.getByRole("note")` — compatibility note elements.
  - `inspector.getByText("<note message text>")` — note message text (will match both code panel and note UI).
  - Check counts: Cursor tab has 1 note element; Claude Code and Windsurf tabs have 0 note elements.

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- 2026-06-15: Wrote 6 unit tests in `translator-preview.test.ts` using `readFileSync` source assertion pattern; confirmed RED — all 6 failing on current source.
- 2026-06-15: Added `TriangleAlert` import and compatibility notes rendering block to `translator-preview.tsx`; all 6 unit tests GREEN (57 total passing).
- 2026-06-15: Extended E2E: added Claude Code note-absence assert, Cursor note-count assert (1), message count assert (2), Windsurf note-absence assert; 3/3 E2E tests passed.
- 2026-06-15: Full verification passed: `pnpm test` (57/57), `pnpm typecheck`, `pnpm lint`, `pnpm test:e2e` (3/3).

### Completion Notes List

- Added `TriangleAlert` icon from `lucide-react` as non-color visual indicator inside each compatibility note — satisfies "warning styling without relying on color alone" (AC 4).
- Compatibility notes rendered with `role="note"`, amber border/background/text via `--warning` and `--warning-surface` CSS variables, after the artifacts section inside each `TabsContent` — satisfies AC 1, 3, 4.
- Notes block guarded by `result.compatibilityNotes.length > 0` — only Cursor tab shows a note (1 note); Claude Code and Windsurf show none — satisfies AC 2 (non-blocking, no UI disabled).
- Unit tests use `readFileSync` source assertion pattern (matching `agent-studio-workbench.test.ts` precedent) — 6 contract tests all GREEN.
- E2E: Cursor note message now appears twice (once inside `.cursorrules` artifact content, once as rendered note UI), Claude Code and Windsurf have 0 notes — all assertions pass.

### File List

- `src/components/workbench/translator-preview.tsx`
- `src/components/workbench/translator-preview.test.ts`
- `tests/e2e/sample-flow.spec.ts`
- `_bmad-output/implementation-artifacts/3-5-show-compatibility-notes-for-adapted-output.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Review Findings

- [x] [Review][Defer] Dark mode: `--warning` and `--warning-surface` only in `:root`, not overridden in `.dark` [`src/app/globals.css:71-72`] — deferred, pre-existing design gap; light-mode amber values still render in dark mode (not invisible, just potentially off-palette); acknowledged in story dev notes as MVP scope
- [x] [Review][Defer] No null/undefined guard on `result.compatibilityNotes` before `.length` access [`src/components/workbench/translator-preview.tsx:78`] — deferred, pre-existing pattern; `result.artifacts.length > 0` follows the same unguarded pattern; TypeScript type requires the field
- [x] [Review][Defer] E2E `toHaveCount(2)` for note message text is coupled to cursor.ts artifact content [`tests/e2e/sample-flow.spec.ts:217-221`] — deferred, intentional per story spec (text appears in `.cursorrules` content AND rendered note); fragile if cursor.ts artifact text ever diverges from note message
- [x] [Review][Defer] Source-string test for `"--warning"` coincidentally matches via `"--warning-surface"` substring [`src/components/workbench/translator-preview.test.ts:23`] — deferred, minor limitation of `readFileSync` test pattern; consistent with established project approach (`agent-studio-workbench.test.ts`)
- [x] [Review][Defer] `note.id` React key stability not enforced by type system [`src/components/workbench/translator-preview.tsx:81`] — deferred, pre-existing pattern; current translators use stable hardcoded IDs; future translators would be reviewed before merging
- [x] [Review][Defer] No visible text label "Compatibility note:" — only `TriangleAlert` icon as non-color indicator [`src/components/workbench/translator-preview.tsx:86-89`] — deferred, icon satisfies AC4 "without relying on color alone" for sighted users; `role="note"` provides semantic framing for AT
- [x] [Review][Defer] Zero-artifact + non-empty notes renders both "No artifacts generated" block and notes — untested state [`src/components/workbench/translator-preview.tsx:73-93`] — deferred, no current translator hits this case; pre-existing gap
- [x] [Review][Defer] Claude Code tab note-absence only asserted once before Cursor tab switch, not verified after returning [`tests/e2e/sample-flow.spec.ts:194`] — deferred, coverage gap, not a regression; initial state assertion is sufficient for MVP
- [x] [Review][Defer] No DOM order test verifying notes appear after artifacts (not before) [`src/components/workbench/translator-preview.tsx:78`] — deferred, implementation is correct; DOM positional testing is not the established pattern
- [x] [Review][Defer] Note container `div` has no `aria-label` — `role="note"` plus `<p>` text is the only AT signal [`src/components/workbench/translator-preview.tsx:82-93`] — deferred, `role="note"` + visible text content is sufficient for basic AT at MVP level

### Change Log

- 2026-06-15: Created Story 3.5 for compatibility notes rendering.
- 2026-06-15: Implemented compatibility notes rendering; moved status to review.
