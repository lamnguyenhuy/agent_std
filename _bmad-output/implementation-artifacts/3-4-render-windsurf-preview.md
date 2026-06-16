---
baseline_commit: NO_VCS
---

# Story 3.4: Render Windsurf Preview

Status: done

## Story

As a tech lead,
I want to preview the Windsurf output generated from the Playbook,
so that I can see how canonical behavior appears for Windsurf.

## Acceptance Criteria

1. Given a valid Agent Playbook exists, when the Windsurf tab is selected, then the preview shows representative Windsurf rules output.
2. Given the Windsurf preview is shown, then the preview includes a generated path under `.windsurf/rules/`.
3. Given the Windsurf preview is shown, then the preview includes provenance text referencing `.agent-studio/playbook.yaml`.
4. Given the user adds, edits, or removes a Rule, then the Windsurf preview updates from the current Playbook state.
5. Given generated Windsurf content is shown, then it is displayed in a readable code panel with copy action.

## Tasks / Subtasks

- [x] Replace the Windsurf stub renderer with representative Windsurf output. (AC: 1, 2, 3, 4)
  - [x] Keep the implementation inside `src/lib/translators/windsurf.ts`.
  - [x] Keep `windsurfTranslator` as the `TranslatorModule` with `id: "windsurf"` and `label: "Windsurf"`.
  - [x] Return a single artifact at `.windsurf/rules/playbook.md`; the frontmatter must include `trigger: always_on`.
  - [x] Include provenance text equivalent to `Generated from .agent-studio/playbook.yaml` in the generated artifact.
  - [x] Include a canonical-source warning: "This Windsurf rules preview is generated output. The Agent Playbook is canonical; update .agent-studio/playbook.yaml instead of editing this file directly."
  - [x] Render all current `playbook.rules` text so add/edit/remove changes are reflected automatically.
  - [x] Apply `normalizeMarkdownText` to all Playbook-provided text (name, description, repo, rule text) before rendering.
  - [x] Include an explicit deterministic empty-rules fallback ("No Playbook rules are currently defined.").
  - [x] Keep output deterministic: no dates, random IDs, locale-dependent sorting, or environment-derived values.
- [x] Preserve translator architecture boundaries. (AC: 1, 4)
  - [x] Do not import React, workbench components, fixture data, Claude Code translator, or Cursor translator into `src/lib/translators/windsurf.ts`.
  - [x] Do not mutate `AgentPlaybook` or store generated output in React state.
  - [x] Keep generated artifact path POSIX-style: `.windsurf/rules/playbook.md` exactly.
- [x] Add Windsurf translator unit tests. (AC: 1, 2, 3, 4)
  - [x] Add `src/lib/translators/windsurf.test.ts`.
  - [x] Assert artifact count (1) and path (`.windsurf/rules/playbook.md`).
  - [x] Assert `kind === "modified"` for the artifact (pre-existing pattern across translators).
  - [x] Assert provenance text (`Generated from .agent-studio/playbook.yaml`) is present.
  - [x] Assert canonical-source warning ("generated output", "Agent Playbook is canonical") is present.
  - [x] Assert frontmatter includes `trigger: always_on`.
  - [x] Assert representative rules content renders all current rule text.
  - [x] Assert deterministic output: calling `translate` twice returns identical results.
  - [x] Assert empty rules produce the explicit fallback string.
  - [x] Assert `normalizeMarkdownText` normalization: newlines, extra whitespace in name/description/repo/rules are collapsed to single spaces.
  - [x] Assert output changes when rule text changes, without relying on UI state.
- [x] Extend E2E coverage for Windsurf preview behavior. (AC: 1, 2, 3, 4, 5)
  - [x] In `tests/e2e/sample-flow.spec.ts`, after the Cursor section, select the Windsurf tab and assert `aria-selected="true"`.
  - [x] Assert `.windsurf/rules/playbook.md` path label is visible.
  - [x] Assert provenance text (`Generated from .agent-studio/playbook.yaml`) is visible.
  - [x] Add, edit, and remove a Rule through the existing Rules editor and assert the Windsurf preview reflects the current rule state.
  - [x] Assert the visible Windsurf code panel has a reachable/enabled copy action.

## Dev Notes

### Story Source

- Epic: Epic 3, `Cross-Tool Preview and Compatibility Notes`.
- Story requirement ID: `FR-11`.
- Source ACs: `_bmad-output/planning-artifacts/epics.md`, `Story 3.4: Render Windsurf Preview`.
- PRD requirement: Agent Studio renders a Windsurf output preview from the Agent Playbook, including representative Windsurf rules output, a generated path under `.windsurf/rules/`, and updates when Rules change. [Source: `_bmad-output/planning-artifacts/prds/prd-agent_std-2026-06-09/prd.md`, FR-11]
- Provenance requirement: generated tool output includes wording equivalent to `Generated from .agent-studio/playbook.yaml`, discourages direct editing where appropriate, and is visible in preview and export. [Source: `_bmad-output/planning-artifacts/prds/prd-agent_std-2026-06-09/prd.md`, FR-18]
- UX requirement: Preview Inspector uses Tool Translator tabs, code panels display generated output with copy action, and rule edits update previews immediately. [Source: `_bmad-output/planning-artifacts/ux-designs/ux-agent_std-2026-06-09/EXPERIENCE.md`, Tool Translator tabs, Code panel, Flow 2]

### Current Code State

- `src/lib/translators/windsurf.ts` currently contains a stub:
  - returns one artifact with `path: ".windsurf/rules/playbook.md"` and `kind: "modified"`;
  - renders rules via `playbook.rules.map((r) => \`- ${r.text}\`).join("\n")` — **no normalization**, no empty-state guard, no canonical-source warning;
  - includes a frontmatter `trigger: always_on` comment and a bare provenance comment;
  - `compatibilityNotes: []` (empty — no compatibility notes for Windsurf in this story).
- `src/lib/translators/types.ts` defines `GeneratedArtifact`, `CompatibilityNote`, `TranslatorResult`, and `TranslatorModule` — no changes needed.
- `src/lib/translators/index.ts` already registers `windsurfTranslator` in `TRANSLATORS` — no changes needed.
- `src/components/workbench/translator-preview.tsx` was updated in Story 3.3 to render all `result.artifacts` generically — no changes needed for Windsurf.
- `src/components/workbench/code-panel.tsx` already provides the readable code panel and guarded copy action — reuse it.
- `tests/e2e/sample-flow.spec.ts` already has Claude Code and Cursor preview assertions. Extend the same flow — do not add a disconnected test.
- `src/lib/translators/claude-code.ts` is the closest production reference pattern: pure render helpers, `normalizeMarkdownText`, empty-state guard, provenance comment, canonical-source warning.
- `src/lib/translators/cursor.ts` (now production) shows the single-quoted YAML frontmatter pattern and two-artifact flow — Windsurf is simpler (single artifact, no legacy compat).

### Previous Story Intelligence

Story 3.3 implemented Cursor preview. Code review produced these lessons to carry forward:

- **Apply `normalizeMarkdownText` to all Playbook-provided text** before rendering — covers name, description, repo, and every rule text. The current Windsurf stub does NOT do this. Fix it.
- **Guard the empty-rules branch explicitly** — the stub does not check `playbook.rules.length === 0`. Add the same explicit fallback used in Claude Code and Cursor: `"No Playbook rules are currently defined."`.
- **YAML frontmatter values must be safe** — in Cursor, the `description:` field was patched to use single-quoted YAML scalars (`'...'`) to prevent `:` and other special chars from corrupting the frontmatter. Windsurf's `trigger: always_on` is hardcoded so it is not at risk, but if the implementation adds a playbook-derived field to the frontmatter, apply the same single-quoting pattern.
- **E2E bounding box null check** — Story 3.3 patched the Y-coordinate ordering assertion to check `not.toBeNull()` before comparing. Apply the same pattern to any new positional assertions added for Windsurf.
- **E2E rule index pattern** — the `rulesSection.getByRole("article").count()` + `count + 1` label approach is an established convention; keep it consistent.

Stories 3.1 and 3.2 fixed these regressions — do not re-introduce them:

- `src/components/ui/tabs.tsx` must pass `orientation` to Radix and use selectors matching `data-orientation`.
- `src/components/workbench/code-panel.tsx` guards unavailable/rejected Clipboard API calls through `copyTextToClipboard`.
- The Preview aside wrapper in `agent-studio-workbench.tsx` must keep `aria-label="Preview and Review inspector"`, `className="min-h-[420px] rounded-lg border border-border bg-card"`, and `id="preview"`.

### Architecture Compliance

- Tool Translators must depend only on validated `AgentPlaybook` input, not React state. [Source: `_bmad-output/planning-artifacts/architecture.md`, Cross-Component Dependencies]
- `src/lib/translators/*` modules must be isolated by tool; Windsurf must not import Claude Code or Cursor translators. [Source: `_bmad-output/planning-artifacts/architecture.md`, AR-11/AR-12 and anti-patterns]
- Workbench components may call `src/lib/*`, but workbench components must not build generated tool output strings inline. [Source: `_bmad-output/planning-artifacts/architecture.md`, Component Boundaries]
- Generated native tool files are outputs; the Agent Playbook remains canonical. [Source: `_bmad-output/planning-artifacts/architecture.md`, state boundaries]
- File paths in generated artifacts use POSIX-style `/` separators. [Source: `_bmad-output/planning-artifacts/architecture.md`, file path convention]
- Do not add backend routes, server actions, auth, persistence, arbitrary filesystem access, Redux/Zustand, or external state libraries for this story.
- Do not implement Plan, Behavior Diff, export bundle changes, or the full compatibility-note UI in this story.

### Next.js / UI Guardrails

- AGENTS.md says this is not the familiar Next.js version; before code changes, read relevant local docs under `node_modules/next/dist/docs/`.
- Relevant local docs already identified for this epic:
  - `node_modules/next/dist/docs/index.md`: App Router uses framework-bundled React behavior; use local docs for version-specific guidance.
  - `node_modules/next/dist/docs/01-app/index.md`: App Router is the active app model.
  - `node_modules/next/dist/docs/03-architecture/accessibility.md`: keep accessible titles/controls and rely on linting to catch ARIA issues.
  - `node_modules/next/dist/docs/03-architecture/supported-browsers.md`: modern browser baseline; Clipboard API must remain guarded because permissions/support can still fail.
- Actual installed versions in `package.json`: Next.js `16.2.6`, React `19.2.4`, Radix UI `1.5.0`, shadcn `4.11.0`, Vitest `4.1.8`, Playwright `1.60.0`.
- `components.json` uses shadcn style `radix-nova`, TSX, Tailwind CSS variables, and lucide icons.

### Implementation Guidance

- **Mirror the cursor.ts production structure** closely — the Windsurf translator is simpler (single artifact, no legacy compat), so the resulting file should be shorter.
- Suggested render helpers in `src/lib/translators/windsurf.ts`:
  - `normalizeMarkdownText(value: string): string` — same regex as Claude Code and Cursor; do not import it from another translator.
  - `renderRulesSection(playbook: AgentPlaybook): string` — empty guard + map + join.
  - `renderWindsurfRules(playbook: AgentPlaybook): string` — compose frontmatter + provenance + canonical warning + description + rules section.
- Windsurf `.windsurf/rules/*.md` frontmatter uses `trigger: always_on` — this is the only frontmatter field needed for representative output. Do not invent additional frontmatter keys not required by the ACs.
- The `trigger: always_on` value is hardcoded and does not interpolate user data — no YAML quoting needed for that field.
- `compatibilityNotes` should remain `[]` for this story. Story 3.5 owns compatibility note rendering.
- Preserve the current order of `playbook.rules` — do not sort or reorder.
- Do not claim exact Windsurf runtime semantics beyond representative output for the MVP preview.

### Testing Requirements

- Follow TDD: write a failing test first, verify red, implement, verify green.
- Unit test target: `pnpm test -- src/lib/translators/windsurf.test.ts`.
- Full verification before marking dev complete:
  - `pnpm test`
  - `pnpm typecheck`
  - `pnpm lint`
  - `pnpm test:e2e tests/e2e/sample-flow.spec.ts`
- E2E selectors to use:
  - `page.getByRole("complementary", { name: "Preview and Review inspector" })` for the aside.
  - `inspector.getByRole("tab", { name: "Windsurf" })` for the tab.
  - After clicking the Windsurf tab, assert `aria-selected="true"` using `toHaveAttribute`.
  - Assert `.windsurf/rules/playbook.md` path label visibility with `inspector.getByText(".windsurf/rules/playbook.md", { exact: true })`.
  - Assert provenance with `inspector.getByText("Generated from .agent-studio/playbook.yaml")`.
  - Assert copy button with `inspector.getByRole("button", { name: "Copy to clipboard" })`.

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- 2026-06-15: Wrote 8 unit tests in `windsurf.test.ts`; confirmed RED — 3 failures on normalization, canonical warning, and empty-state.
- 2026-06-15: Replaced stub with `normalizeMarkdownText` + `renderRulesSection` + `renderWindsurfRules`; all 51 unit tests GREEN.
- 2026-06-15: Extended E2E sample-flow with Windsurf tab section; 3/3 E2E tests pass.
- 2026-06-15: Full verification passed: `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm test:e2e`.

### Completion Notes List

- Replaced Windsurf stub with production `renderWindsurfRules` renderer: `trigger: always_on` frontmatter, provenance comment, canonical-source warning, normalized name/description/repo/rules, deterministic empty-rules fallback.
- Added `normalizeMarkdownText` and `renderRulesSection` helpers — same pattern as Claude Code and Cursor translators, no cross-translator imports.
- Added 8 unit tests covering artifact path/kind, frontmatter, provenance, canonical warning, determinism, empty state, normalization, and rule-change reflection.
- Extended `sample-flow.spec.ts` with Windsurf tab assertions: tab selection, path label, provenance text, copy button, and rule add/edit/remove sync.

### File List

- `src/lib/translators/windsurf.ts`
- `src/lib/translators/windsurf.test.ts`
- `tests/e2e/sample-flow.spec.ts`
- `_bmad-output/implementation-artifacts/3-4-render-windsurf-preview.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Review Findings

- [x] [Review][Defer] `kind: "modified"` hardcoded for new generated artifact [`src/lib/translators/windsurf.ts:48`] — deferred, pre-existing (same pattern as Claude Code and Cursor translators)
- [x] [Review][Defer] `playbook.repo` containing `—` (em-dash) produces confusing double-separator in `# name — repo` heading — deferred, cosmetic MVP preview issue
- [x] [Review][Defer] Test `toContain(rule.text)` uses raw fixture text after normalization [`src/lib/translators/windsurf.test.ts:50`] — deferred, pre-existing (same item from Story 3.3, low risk with controlled fixture)
- [x] [Review][Defer] `playbook.rules` null/undefined guard absent in `renderRulesSection` — deferred, pre-existing (schema validation responsibility)
- [x] [Review][Defer] `compatibilityNotes: []` not asserted in edge-case test branches (empty rules, normalization) — deferred, function returns `[]` unconditionally, single assertion is sufficient
- [x] [Review][Defer] `normalizeMarkdownText` collapses intentional inline whitespace/formatting — deferred, pre-existing design decision from Story 3.2

### Change Log

- 2026-06-15: Created Story 3.4 for Windsurf preview implementation.
- 2026-06-15: Implemented Windsurf preview story and moved status to review.
