---
baseline_commit: NO_VCS
---

# Story 3.1: Implement Tool Translator Contract and Preview Shell

Status: done

## Story

As a tech lead,
I want Tool Translator previews to share a consistent structure,
so that I can compare Claude Code, Cursor, and Windsurf outputs from one Playbook.

## Acceptance Criteria

1. Given a valid Agent Playbook exists, when the Preview Inspector loads, then the UI shows Tool Translator tabs for Claude Code, Cursor, and Windsurf.
2. Given the Preview Inspector is showing, when the user switches Tool Translator tabs, then the Playbook and Rule editor state are preserved unchanged.
3. Given the Preview Inspector is showing, when a Tool Translator tab is selected, then the content area shows the artifacts returned by that translator's `translate()` function.
4. Given a Tool Translator is called, when it runs, then it returns a `TranslatorResult` containing `artifacts` and `compatibilityNotes` arrays through the shared `TranslatorModule` contract.
5. Given a Tool Translator module exists, when it runs, then it depends only on the validated `AgentPlaybook` input — it does not read React state, import other translator modules, or mutate Playbook state.
6. Given the Preview Inspector is showing, when no Playbook has been created yet, then the preview remains in its placeholder/disabled state.

## Tasks / Subtasks

- [x] Add shadcn Tabs UI component. (AC: 1, 2)
  - [x] Run `pnpm dlx shadcn@latest add tabs` to install `src/components/ui/tabs.tsx`.
  - [x] Verify the component file exists and exports `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`.
- [x] Create `src/lib/translators/types.ts` with shared translator contract. (AC: 4, 5)
  - [x] Export `type GeneratedArtifact = { path: string; content: string; kind: "added" | "modified" }`.
  - [x] Export `type CompatibilityNote = { id: string; message: string }`.
  - [x] Export `type TranslatorResult = { artifacts: GeneratedArtifact[]; compatibilityNotes: CompatibilityNote[] }`.
  - [x] Export `type TranslatorModule = { id: ToolId; label: string; translate: (playbook: AgentPlaybook) => TranslatorResult }`.
  - [x] Import `ToolId` and `AgentPlaybook` from `@/lib/playbook/schema` — do NOT redefine them.
  - [x] NOTE: `ToolTranslator` is already exported from `@/lib/playbook/schema` as `{ tool: ToolId, enabled: boolean }`. Use `TranslatorModule` here to avoid name collision.
- [x] Create `src/lib/translators/claude-code.ts` — stub translator. (AC: 3, 4, 5)
  - [x] Export `const claudeCodeTranslator: TranslatorModule` with `id: "claude-code"`, `label: "Claude Code"`.
  - [x] `translate(playbook)` returns one artifact: `{ path: "CLAUDE.md", content: renderClaudeCodeStub(playbook), kind: "modified" }`, `compatibilityNotes: []`.
  - [x] `renderClaudeCodeStub`: return a stub string like `# ${playbook.name}\n\n<!-- Generated from .agent-studio/playbook.yaml -->\n\n## Rules\n\n${playbook.rules.map(r => `- ${r.text}`).join("\n")}\n`.
  - [x] Pure function — no side effects, no imports from cursor/windsurf.
- [x] Create `src/lib/translators/cursor.ts` — stub translator. (AC: 3, 4, 5)
  - [x] Export `const cursorTranslator: TranslatorModule` with `id: "cursor"`, `label: "Cursor"`.
  - [x] `translate(playbook)` returns one artifact: `{ path: ".cursor/rules/playbook.mdc", content: renderCursorStub(playbook), kind: "modified" }`, `compatibilityNotes: [{ id: "cursor-legacy", message: "Cursor output targets .cursor/rules (modern). A .cursorrules legacy artifact will be added in Story 3.3." }]`.
  - [x] `renderCursorStub`: return `---\ndescription: ${playbook.name} rules\nglobs:\n  - "**/*"\n---\n\n<!-- Generated from .agent-studio/playbook.yaml -->\n\n${playbook.rules.map(r => `- ${r.text}`).join("\n")}\n`.
  - [x] Pure function — no side effects, no imports from claude-code/windsurf.
- [x] Create `src/lib/translators/windsurf.ts` — stub translator. (AC: 3, 4, 5)
  - [x] Export `const windsurfTranslator: TranslatorModule` with `id: "windsurf"`, `label: "Windsurf"`.
  - [x] `translate(playbook)` returns one artifact: `{ path: ".windsurf/rules/playbook.md", content: renderWindsurfStub(playbook), kind: "modified" }`, `compatibilityNotes: []`.
  - [x] `renderWindsurfStub`: return `---\ntrigger: always_on\n---\n\n<!-- Generated from .agent-studio/playbook.yaml -->\n\n${playbook.rules.map(r => `- ${r.text}`).join("\n")}\n`.
  - [x] Pure function — no side effects, no imports from claude-code/cursor.
- [x] Create `src/lib/translators/index.ts`. (AC: 4, 5)
  - [x] Export `const TRANSLATORS: TranslatorModule[]` = `[claudeCodeTranslator, cursorTranslator, windsurfTranslator]`.
  - [x] Export `function getTranslator(id: ToolId): TranslatorModule` that returns the matching translator (throws if not found — programmer error, not user error).
  - [x] Re-export `type { TranslatorModule, TranslatorResult, GeneratedArtifact, CompatibilityNote }` from `./types`.
- [x] Create `src/lib/translators/claude-code.test.ts` with unit tests. (AC: 3, 4, 5)
  - [x] Import test playbook fixture from `generate.test.ts` pattern (use `generatePlaybookDraft` + `scanSampleRepoFiles` + `sampleRepoFiles`).
  - [x] Test: `claudeCodeTranslator.translate(playbook)` returns one artifact with `path === "CLAUDE.md"`.
  - [x] Test: artifact content includes the playbook name.
  - [x] Test: artifact content includes `".agent-studio/playbook.yaml"` as provenance reference.
  - [x] Test: artifact content includes each rule text when rules exist.
  - [x] Test: `compatibilityNotes` is an empty array.
  - [x] Test: calling translate twice with the same playbook returns identical output (deterministic).
- [x] Create `src/components/workbench/code-panel.tsx`. (AC: 3)
  - [x] Props: `content: string`, `label: string` (accessible label for the panel), `className?: string`.
  - [x] Render a `<pre>` or code-surface div with the content using the existing code surface tokens: `bg-[var(--surface-code)]`, `text-[var(--foreground-code)]`, `font-mono text-xs leading-[1.55]`.
  - [x] Include a copy button (`Copy` icon from lucide-react) that calls `navigator.clipboard.writeText(content)`.
  - [x] Show brief "Copied!" confirmation text for ~1.5s after copying (local `useState` for feedback).
  - [x] Add `aria-label={label}` to the panel region, `role="region"`.
  - [x] Keyboard: copy button must be reachable by Tab and activated by Enter/Space.
  - [x] Do NOT wrap content in a code block for now — plain pre with overflow-x-auto is fine.
- [x] Create `src/components/workbench/translator-preview.tsx`. (AC: 1, 2, 3, 6)
  - [x] Props: `playbook: AgentPlaybook | null`, `defaultTranslatorId?: ToolId`.
  - [x] Use shadcn `Tabs` component from `@/components/ui/tabs`.
  - [x] Render `TabsList` with three `TabsTrigger` items: one per translator from `TRANSLATORS`.
  - [x] Each `TabsTrigger` value = translator id, label = translator label.
  - [x] Each `TabsContent` calls `translator.translate(playbook)` when playbook is non-null and renders the first artifact using `CodePanel`.
  - [x] When `playbook` is null: render a disabled/placeholder state — show the tabs as inactive and a placeholder message "Create an Agent Playbook to see previews." inside the content area.
  - [x] Tab switch must not affect parent state — all state is local to this component.
  - [x] Accessibility: `TabsList` has `aria-label="Tool Translator tabs"`. Tab change is announced naturally by the shadcn Tabs (Radix handles `role="tablist"`, `role="tab"`, `aria-selected` automatically).
  - [x] Default selected tab: `"claude-code"` (first, or `defaultTranslatorId` if provided).
- [x] Update `agent-studio-workbench.tsx` to wire the real preview inspector. (AC: 1, 2, 6)
  - [x] Remove the current placeholder `<aside>` content (disabled Preview/Review buttons and the static code surface div).
  - [x] Replace with the real inspector structure using shadcn `Tabs` for Preview/Review mode switching — `defaultValue="preview"` enabled only when `playbook != null`.
  - [x] When `playbook == null`: keep the aside showing a disabled/placeholder Preview panel (similar to current placeholder).
  - [x] When `playbook != null`: render `Tabs` with two tabs: `"preview"` and `"review"`. Preview tab renders `<TranslatorPreview playbook={playbook} />`. Review tab renders a placeholder `"Review — coming in Epic 4"` for now.
  - [x] Import `TranslatorPreview` from `@/components/workbench/translator-preview`.
  - [x] Import `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` from `@/components/ui/tabs`.
  - [x] Keep the `aria-label="Preview and Review inspector"` on the aside.
  - [x] Do NOT add `selectedTranslatorId` to workbench state — TranslatorPreview owns that locally.
- [x] Add basic E2E coverage for the Preview Inspector. (AC: 1, 2, 3, 6)
  - [x] In `tests/e2e/sample-flow.spec.ts`, extend the existing main test: after creating the Playbook, assert the inspector aside contains a tab with text "Claude Code".
  - [x] Assert "Cursor" tab is visible.
  - [x] Assert "Windsurf" tab is visible.
  - [x] Click "Cursor" tab and assert that content area contains `.cursor/rules` path text.
  - [x] Assert the Rules editor (center panel) is still visible after switching tabs — verifying state is preserved.

### Review Findings

- [x] [Review][Patch] Tabs component does not pass orientation to Radix and uses non-matching orientation selectors [src/components/ui/tabs.tsx:15]
- [x] [Review][Patch] Copy button does not handle unavailable or rejected Clipboard API writes [src/components/workbench/code-panel.tsx:17]
- [x] [Review][Patch] Preview aside wrapper class changed despite story requiring the wrapper attributes to remain unchanged [src/components/workbench/agent-studio-workbench.tsx:478]

## Dev Notes

### Story Source

- Epic: Epic 3, `Cross-Tool Preview and Compatibility Notes`.
- Story requirement ID: `FR-9`, `FR-10`, `FR-11`, `FR-12` (foundation story).
- Source ACs: `_bmad-output/planning-artifacts/epics.md`, `Story 3.1`.
- PRD requirement: Tool Translator tabs for Claude Code, Cursor, Windsurf; switching tabs preserves editor state; translators return artifacts and compatibility notes through shared contract; translators depend only on validated Playbook. [FR-9 to FR-12]
- UX requirement: Preview Inspector with Tool Translator tabs; Code panel for generated output; tab change announced for accessibility; default to Claude Code tab after Playbook creation. [EXPERIENCE.md — Tool Translator tabs, Code panel, State Patterns: "Playbook generated → Preview Inspector defaults to Claude Code tab"]

### Critical Context: This is the Foundation Story for Epic 3

Story 3.1 establishes the `TranslatorModule` contract and the Preview Inspector shell. Stories 3.2, 3.3, and 3.4 **replace** the stub implementations with real generated content. Story 3.5 adds compatibility notes rendering. **Do not implement real translator output in this story** — stubs are intentional and correct for 3.1 scope.

The stubs only need to:

1. Return the correct artifact path for each tool (so later stories know what to replace)
2. Include provenance text referencing `.agent-studio/playbook.yaml`
3. Render rule text so the preview responds to Rule edits

### Naming Conflict: `ToolTranslator` vs `TranslatorModule`

`src/lib/playbook/schema.ts` already exports `type ToolTranslator = { tool: ToolId, enabled: boolean }` — this is the Playbook's translator entry (which tools are enabled).

The architecture spec calls the translator module interface `ToolTranslator`, but that name is taken. **Use `TranslatorModule`** in `src/lib/translators/types.ts` for the module interface. This avoids the naming collision while matching the spirit of the architecture intent.

Do NOT rename schema.ts's `ToolTranslator` — that would break existing code.

### Current Code State

**Files to CREATE (NEW):**

- `src/components/ui/tabs.tsx` — add via `pnpm dlx shadcn@latest add tabs`
- `src/lib/translators/types.ts`
- `src/lib/translators/claude-code.ts`
- `src/lib/translators/cursor.ts`
- `src/lib/translators/windsurf.ts`
- `src/lib/translators/index.ts`
- `src/lib/translators/claude-code.test.ts`
- `src/components/workbench/code-panel.tsx`
- `src/components/workbench/translator-preview.tsx`

**Files to UPDATE:**

- `src/components/workbench/agent-studio-workbench.tsx` — replace placeholder aside content
- `tests/e2e/sample-flow.spec.ts` — add Preview Inspector assertions

**Current state of the right panel (the `<aside>`) in `agent-studio-workbench.tsx` lines ~451-482:**

```tsx
<aside
  aria-label="Preview and Review inspector"
  className="min-h-[420px] rounded-lg border border-border bg-card"
  id="preview"
>
  <div className="flex items-center gap-2 border-b border-border px-4 py-3">
    <Button disabled size="sm" variant="secondary">
      Preview
    </Button>
    <Button disabled size="sm" variant="ghost">
      Review
    </Button>
  </div>
  <div className="p-4">
    <div className="rounded-md bg-[var(--surface-code)] p-3 font-mono text-xs leading-[1.55] text-[var(--foreground-code)]">
      {playbook == null
        ? "Preview"
        : "Generated native tool files remain outputs, not the source of truth."}
    </div>
  </div>
</aside>
```

This entire `<aside>` JSX block must be replaced. Keep the `<aside>` wrapper with the same `aria-label`, `className`, and `id` attributes — only replace what's inside it.

### Architecture Compliance

From `architecture.md`:

**Translator contract (use this shape):**

```ts
// src/lib/translators/types.ts
type TranslatorModule = {
  // NOTE: architecture says "ToolTranslator" but that name is taken
  id: ToolId
  label: string
  translate(playbook: AgentPlaybook): TranslatorResult
}

type TranslatorResult = {
  artifacts: GeneratedArtifact[]
  compatibilityNotes: CompatibilityNote[]
}
```

**Example pure translator (architecture pattern):**

```ts
export function translateClaudeCode(playbook: AgentPlaybook): TranslatorResult {
  return {
    artifacts: [
      {
        path: "CLAUDE.md",
        content: renderClaudeMarkdown(playbook),
        kind: "modified",
      },
    ],
    compatibilityNotes: [],
  }
}
```

**Mandatory rules (AR-11, AR-12):**

- `src/lib/translators/*` must be isolated — each translator module must NOT import from another translator
- Translators must NOT mutate `AgentPlaybook`
- Translators must NOT import from `src/components/*`
- `src/components/workbench/*` MAY import from `src/lib/*`

**State architecture rule (from architecture):**

```ts
// Derive outputs — do NOT store as independent state
const translatorOutput = translator.translate(playbook)
```

Translators should be called inline during render or in a `useMemo` — not stored separately in `useState`.

### Derived State Pattern for Translator Outputs

The architecture says to derive, not store. In `TranslatorPreview`, the pattern should be:

```tsx
// Inside TranslatorPreview, when rendering a tab's content:
const result = useMemo(
  () => (playbook ? translator.translate(playbook) : null),
  [playbook, translator]
)
```

Each tab computes its result from current `playbook` only when selected (or all upfront via memo). Since Epic 2 properly established `playbook` as the canonical state, translator outputs automatically stay in sync.

### shadcn Tabs Component Notes

The project uses `style: "radix-nova"` in `components.json` and `radix-ui ^1.5.0`. The shadcn CLI command `pnpm dlx shadcn@latest add tabs` installs the Tabs component based on the project's configured style.

The shadcn Tabs wraps Radix UI Tabs primitives. Radix handles all ARIA roles (`role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`) automatically. You do NOT need to add these manually — this is different from the manual aria work in Story 2-4.

**Important:** `TabsTrigger` has `data-[state=active]` styling built in. Do not add active state manually.

Tab keyboard navigation (left/right arrow between tabs) is provided by Radix automatically.

### CodePanel Component Design

The `code-panel.tsx` must use existing design tokens already present in the codebase:

- `bg-[var(--surface-code)]` — code surface background
- `text-[var(--foreground-code)]` — code surface foreground
- `font-mono text-xs leading-[1.55]` — matches current workbench placeholder style

These are confirmed to exist in `globals.css` (already used in the current placeholder `<aside>`).

Copy button: use `navigator.clipboard.writeText()`. In the browser environment this is available. Brief "Copied!" confirmation state via `useState<boolean>`.

### File Path Convention

All artifact `path` values must use POSIX-style `/` separators (AR-16). The translator stubs must produce:

- Claude Code: `"CLAUDE.md"` (root)
- Cursor: `".cursor/rules/playbook.mdc"` (modern target)
- Windsurf: `".windsurf/rules/playbook.md"`

### E2E Test Pattern Continuity

The existing E2E test structure (from Story 2.4):

```ts
const editor = page.getByRole("region", { name: "Playbook editor" })
// Use: page.getByRole("complementary", { name: "Preview and Review inspector" })
// for the aside — it has aria-label="Preview and Review inspector"
```

The `<aside>` with `aria-label="Preview and Review inspector"` maps to `role="complementary"` in ARIA. Use `page.getByRole("complementary", { name: "Preview and Review inspector" })` to select it in Playwright.

Within the inspector, tabs have `role="tab"` — use `page.getByRole("tab", { name: "Claude Code" })`.

### Testing Requirements

- Follow TDD: write failing unit tests for `claudeCodeTranslator` before implementing it.
- Vitest pattern (same as `generate.test.ts`): `import { describe, expect, it } from "vitest"`.
- Tests for each translator should use the real `AgentPlaybook` from `generatePlaybookDraft` (same sample fixture used in existing tests).
- Run `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:e2e`, `pnpm build` before marking story ready for review.

### Previous Story Intelligence

From Story 2.4 (latest):

- `agent-studio-workbench.tsx` has `ruleTextDrafts` state, `getRuleDisplayText`, `getRuleError`, and passes them to `RulesEditor`. Do NOT touch these.
- The `<aside aria-label="Preview and Review inspector">` is the target for replacement. Its outer wrapper must stay — only replace the inner content.
- `validateRuleText` is imported from `@/lib/playbook/update-rules` — do not remove this import.
- `group.files` was patched to use optional chaining `??` safety — ensure this is preserved in `toImportedWorkspace`.

From Story 2.3 code review:

- `ruleOriginUi` fallback `?? ruleOriginUi.edited` must stay in `rules-editor.tsx`.
- E2E test uses `initialRuleCount` dynamic pattern — preserve this.

### Scope Boundaries — Do NOT Implement

- Do NOT implement real Claude Code, Cursor, or Windsurf output — stubs only. Real output is Stories 3.2, 3.3, 3.4.
- Do NOT add compatibility notes UI rendering — that is Story 3.5.
- Do NOT implement the Review tab content (Plan, Behavior Diff, Export) — that is Epic 4.
- Do NOT disable the Download Patch button based on invalid rules or export readiness — that is Story 4.3.
- Do NOT create `rule-row.tsx` — the existing `rules-editor.tsx` inline approach is correct for this scope.
- Do NOT add `translate` to the `AgentPlaybook` Zod schema — translators are pure functions, not schema fields.

### Project Context Reference

- No `project-context.md` found.
- No git repository (`baseline_commit: NO_VCS`).
- `src/lib/errors.ts` and `src/lib/result.ts` exist (created in Story 2.4).
- `src/lib/translators/` does NOT exist yet — create the entire directory and all files.

### Completion Note

Ultimate context engine analysis completed - comprehensive developer guide created.

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- TDD Red phase: `claude-code.test.ts` initially failed with "Cannot find package" — expected failure confirming tests are real.
- TDD Green phase: `claude-code.ts` created; 6 tests pass.
- E2E fix 1: `.cursor/rules` text not found because `CodePanel` renders artifact content, not the path. Fixed by rendering `result.artifacts[0].path` as a visible path label in `TranslatorPreview`.
- E2E fix 2: Mobile horizontal overflow test failed because `<pre>` content expanded container. Fixed by adding `min-w-0 overflow-hidden` to `CodePanel`, `TranslatorPreview`, and the `<aside>` element.

### Implementation Plan

1. Installed shadcn Tabs via `pnpm dlx shadcn@latest add tabs`.
2. Created `src/lib/translators/types.ts` with `GeneratedArtifact`, `CompatibilityNote`, `TranslatorResult`, `TranslatorModule`.
3. TDD: wrote `claude-code.test.ts` (6 failing tests), then implemented `claude-code.ts` (6 passing).
4. Implemented `cursor.ts` and `windsurf.ts` as pure stub translators.
5. Created `index.ts` exporting `TRANSLATORS` array, `getTranslator()`, and re-exporting types.
6. Created `CodePanel` component with copy button and `role="region"`.
7. Created `TranslatorPreview` using shadcn Tabs; `useMemo` derives translator results from playbook.
8. Updated `agent-studio-workbench.tsx`: aside now conditionally renders `TranslatorPreview` (when `playbook==null`) or Preview/Review tabs (when `playbook!=null`).
9. Updated E2E test with Preview Inspector assertions (tabs visible, Cursor content, state preservation).

### Completion Notes List

- ✅ All 6 `claudeCodeTranslator` unit tests pass (TDD red→green).
- ✅ Total test suite: 24 unit tests passing (8 test files).
- ✅ All 3 E2E tests pass including new Preview Inspector assertions.
- ✅ `pnpm typecheck`, `pnpm lint`, `pnpm build` all clean.
- ✅ `TranslatorModule` naming used (avoiding collision with existing `ToolTranslator` in schema.ts).
- ✅ Each translator is isolated — no cross-imports between translator modules.
- ✅ Translator outputs derived via `useMemo` — not stored in separate `useState`.

### File List

New files:

- src/components/ui/tabs.tsx
- src/lib/translators/types.ts
- src/lib/translators/claude-code.ts
- src/lib/translators/claude-code.test.ts
- src/lib/translators/cursor.ts
- src/lib/translators/windsurf.ts
- src/lib/translators/index.ts
- src/components/workbench/code-panel.tsx
- src/components/workbench/translator-preview.tsx

Modified files:

- src/components/workbench/agent-studio-workbench.tsx
- tests/e2e/sample-flow.spec.ts
- \_bmad-output/implementation-artifacts/sprint-status.yaml

## Change Log

- 2026-06-15: Story 3.1 created — Tool Translator Contract and Preview Shell.
- 2026-06-15: Story 3.1 implemented — TranslatorModule contract, three stub translators, CodePanel, TranslatorPreview, workbench wired, E2E coverage added.
