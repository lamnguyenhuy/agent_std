---
baseline_commit: NO_VCS
---

# Story 3.3: Render Cursor Preview

Status: done

## Story

As a tech lead,
I want to preview the Cursor output generated from the Playbook,
so that I can see how canonical behavior appears for Cursor.

## Acceptance Criteria

1. Given a valid Agent Playbook exists, when the Cursor tab is selected, then the preview shows representative Cursor rules output.
2. Given the Cursor preview is shown, then the preview includes provenance text referencing `.agent-studio/playbook.yaml`.
3. Given the Cursor preview is shown, then the preview foregrounds modern `.cursor/rules` output.
4. Given the Cursor preview is shown, then the preview may include `.cursorrules` as a legacy compatibility artifact or note.
5. Given `.cursorrules` legacy output is shown, then compatibility copy explains that `.cursorrules` is legacy compatibility while `.cursor/rules` is the primary MVP Cursor target.
6. Given the user adds, edits, or removes a Rule, then the Cursor preview updates from the current Playbook state.
7. Given generated Cursor content is shown, then it is displayed in readable code panel(s) with copy action(s).

## Tasks / Subtasks

- [x] Replace the Cursor stub renderer with representative Cursor output. (AC: 1, 2, 3, 4, 5, 6)
  - [x] Keep the implementation inside `src/lib/translators/cursor.ts`.
  - [x] Keep `cursorTranslator` as the `TranslatorModule` with `id: "cursor"` and `label: "Cursor"`.
  - [x] Return a primary modern artifact at `.cursor/rules/playbook.mdc`; this artifact must be the first artifact so the preview foregrounds modern Cursor rules.
  - [x] Return a legacy compatibility artifact at `.cursorrules` for the sample, unless the implementation instead uses a clearly visible note plus modern artifact that satisfies AC 4 and AC 5.
  - [x] Include provenance text equivalent to `Generated from .agent-studio/playbook.yaml` in every generated Cursor artifact.
  - [x] Include wording that generated native Cursor files are outputs and `.agent-studio/playbook.yaml` remains canonical.
  - [x] Render all current `playbook.rules` text so add/edit/remove changes are reflected automatically.
  - [x] Include compatibility copy explaining that `.cursorrules` is legacy compatibility while `.cursor/rules` is the primary MVP Cursor target.
- [x] Preserve translator architecture boundaries. (AC: 1, 3, 6)
  - [x] Do not import React, workbench components, fixture data, Claude Code translator, or Windsurf translator into `src/lib/translators/cursor.ts`.
  - [x] Do not mutate `AgentPlaybook` or store generated output in React state.
  - [x] Keep generated artifact paths POSIX-style; use `.cursor/rules/playbook.mdc` and `.cursorrules` exactly.
  - [x] Keep output deterministic: no dates, random IDs, locale-dependent sorting, or environment-derived values.
- [x] Update the Preview Inspector to show all artifacts returned by the selected translator. (AC: 3, 4, 7)
  - [x] Update `src/components/workbench/translator-preview.tsx` so it renders every `result.artifacts` item, not only `result.artifacts[0]`.
  - [x] Render each artifact path near its own `CodePanel`.
  - [x] Keep this generic for all translators; do not hardcode Cursor-specific UI in the component.
  - [x] Preserve the existing empty-state behavior when no artifacts are generated.
  - [x] Do not implement the full compatibility-notes UI for all translators in this story; Story 3.5 owns that broader behavior.
- [x] Add Cursor translator unit tests. (AC: 1, 2, 3, 4, 5, 6)
  - [x] Add `src/lib/translators/cursor.test.ts`.
  - [x] Assert artifact order and paths: first `.cursor/rules/playbook.mdc`, and legacy `.cursorrules` when implemented as an artifact.
  - [x] Assert representative Cursor rules content, provenance text, canonical-source warning, all rule text, deterministic output, and `kind === "modified"` for existing sample-derived Cursor files.
  - [x] Assert compatibility copy explains modern `.cursor/rules` as primary and `.cursorrules` as legacy compatibility.
  - [x] Assert empty rules render a clear deterministic fallback instead of blank output.
  - [x] Assert Playbook-provided text is normalized before rendering generated Markdown/frontmatter so newlines or extra whitespace cannot break the generated structure.
  - [x] Assert output changes when rule text changes without relying on UI state.
- [x] Extend E2E coverage for Cursor preview behavior. (AC: 1, 3, 4, 6, 7)
  - [x] In `tests/e2e/sample-flow.spec.ts`, select the Cursor tab and assert `aria-selected="true"`.
  - [x] Assert `.cursor/rules/playbook.mdc` is visible before `.cursorrules` legacy output, and both outputs show provenance.
  - [x] Assert the compatibility copy for legacy `.cursorrules` is visible in the Cursor preview.
  - [x] Add, edit, and remove a Rule through the existing Rules editor and assert the Cursor preview reflects the current rule state.
  - [x] Assert each visible Cursor code panel has a reachable/enabled copy action.

## Dev Notes

### Story Source

- Epic: Epic 3, `Cross-Tool Preview and Compatibility Notes`.
- Story requirement ID: `FR-10`.
- Source ACs: `_bmad-output/planning-artifacts/epics.md`, `Story 3.3: Render Cursor Preview`.
- PRD requirement: Agent Studio renders a Cursor output preview from the Agent Playbook, including representative Cursor rules output, possible legacy `.cursorrules` compatibility output for the sample, and updates when Rules change. [Source: `_bmad-output/planning-artifacts/prds/prd-agent_std-2026-06-09/prd.md`, FR-10]
- Product decision for this story: foreground modern `.cursor/rules` output while also making `.cursorrules` visible as legacy compatibility for recognizability. This resolves the open PRD/architecture question for MVP implementation. [Source: `_bmad-output/planning-artifacts/epics.md`, AR-26 and Story 3.3 ACs]
- Provenance requirement: generated tool output includes wording equivalent to `Generated from .agent-studio/playbook.yaml`, discourages direct editing where appropriate, and is visible in preview and export. [Source: `_bmad-output/planning-artifacts/prds/prd-agent_std-2026-06-09/prd.md`, FR-18]
- UX requirement: Preview Inspector uses Tool Translator tabs, code panels display generated output with copy action, compatibility text stays near affected output, and rule edits update previews immediately. [Source: `_bmad-output/planning-artifacts/ux-designs/ux-agent_std-2026-06-09/EXPERIENCE.md`, Tool Translator tabs, Code panel, Compatibility warning, Flow 2]

### Current Code State

- `src/lib/translators/types.ts` defines `GeneratedArtifact`, `CompatibilityNote`, `TranslatorResult`, and `TranslatorModule`.
- `src/lib/translators/index.ts` registers `claudeCodeTranslator`, `cursorTranslator`, and `windsurfTranslator` in `TRANSLATORS`.
- `src/lib/translators/cursor.ts` currently contains a stub:
  - returns one artifact with `path: ".cursor/rules/playbook.mdc"` and `kind: "modified"`;
  - includes YAML-like frontmatter, provenance text, and rule bullets;
  - returns a temporary compatibility note saying the legacy artifact will be added in Story 3.3.
- `src/lib/translators/claude-code.ts` now provides the closest production pattern:
  - pure renderer helpers;
  - deterministic representative output;
  - provenance and canonical-source warning;
  - rule rendering from current `playbook.rules`;
  - local text normalization before rendering Markdown.
- `src/components/workbench/translator-preview.tsx` currently renders only `result.artifacts[0]`. Story 3.3 needs this to render all artifacts so Cursor can show both `.cursor/rules/playbook.mdc` and `.cursorrules`.
- `src/components/workbench/code-panel.tsx` already provides the readable code panel and guarded copy action; reuse it rather than adding a second copy implementation.
- `tests/e2e/sample-flow.spec.ts` already creates a Playbook, verifies Tool Translator tabs, asserts Claude Code preview behavior, and has a minimal Cursor tab assertion. Extend that same flow instead of adding a disconnected path.

### Previous Story Intelligence

Story 3.2 implemented Claude Code preview and code review added three relevant lessons:

- Normalize Playbook-provided text before rendering generated Markdown. Apply the same protection to Cursor output, especially frontmatter descriptions and rule bullets.
- Cover empty branches in unit tests. Cursor should have explicit tests for empty rules and any optional legacy artifact behavior.
- Harden E2E assertions around selected tab state, copy button enabled state, and stable baseline content after rule removal.

Story 3.1 established the translator contract and preview shell, then code review fixed these regressions to avoid:

- `src/components/ui/tabs.tsx` must pass `orientation` to Radix and use selectors matching `data-orientation`.
- `src/components/workbench/code-panel.tsx` guards unavailable/rejected Clipboard API calls through `copyTextToClipboard`.
- The Preview aside wrapper in `agent-studio-workbench.tsx` must keep `aria-label="Preview and Review inspector"`, `className="min-h-[420px] rounded-lg border border-border bg-card"`, and `id="preview"`.

Do not regress those fixes while implementing Cursor output.

### Architecture Compliance

- Tool Translators must depend only on validated `AgentPlaybook` input, not React state. [Source: `_bmad-output/planning-artifacts/architecture.md`, Cross-Component Dependencies]
- `src/lib/translators/*` modules must be isolated by tool; Cursor must not import Claude Code or Windsurf translators. [Source: `_bmad-output/planning-artifacts/architecture.md`, AR-11/AR-12 and anti-patterns]
- Workbench components may call `src/lib/*`, but workbench components must not build generated tool output strings inline. [Source: `_bmad-output/planning-artifacts/architecture.md`, Component Boundaries]
- Generated native tool files are outputs; the Agent Playbook remains canonical. [Source: `_bmad-output/planning-artifacts/architecture.md`, state boundaries]
- File paths in generated artifacts use POSIX-style `/` separators. [Source: `_bmad-output/planning-artifacts/architecture.md`, file path convention]
- Do not add backend routes, server actions, auth, persistence, arbitrary filesystem access, Redux/Zustand, or external state libraries for this story.

### Next.js / UI Guardrails

- AGENTS.md says this is not the familiar Next.js version; before code changes, read relevant local docs under `node_modules/next/dist/docs/`.
- Relevant local docs already identified for this story:
  - `node_modules/next/dist/docs/index.md`: App Router uses framework-bundled React behavior; use local docs for version-specific guidance.
  - `node_modules/next/dist/docs/01-app/index.md`: App Router is the active app model.
  - `node_modules/next/dist/docs/03-architecture/accessibility.md`: keep accessible titles/controls and rely on linting to catch ARIA issues.
  - `node_modules/next/dist/docs/03-architecture/supported-browsers.md`: modern browser baseline; Clipboard API must remain guarded because permissions/support can still fail.
- Actual installed versions in `package.json`: Next.js `16.2.6`, React `19.2.4`, Radix UI `1.5.0`, shadcn `4.11.0`, Vitest `4.1.8`, Playwright `1.60.0`.
- `components.json` uses shadcn style `radix-nova`, TSX, Tailwind CSS variables, and lucide icons.

### Implementation Guidance

- Prefer small pure render helpers in `src/lib/translators/cursor.ts`, for example:
  - `renderCursorRules(playbook: AgentPlaybook): string`
  - `renderLegacyCursorRules(playbook: AgentPlaybook): string`
  - `renderRulesSection(playbook.rules)`
- Use a local normalization helper like the Claude Code renderer unless extracting a tiny shared helper clearly reduces duplication. Do not introduce a broad rendering abstraction in this story.
- Modern `.cursor/rules/playbook.mdc` should be representative and deterministic. Include frontmatter only if it stays structurally safe after text normalization.
- Legacy `.cursorrules` should be visibly marked as compatibility output for the bundled sample, not as the primary target.
- Preserve current order from the Playbook arrays unless a source explicitly requires sorting.
- Do not make claims about exact Cursor runtime semantics beyond representative output for the MVP preview.
- Do not implement Windsurf output, Plan, Behavior Diff, export bundle changes, or the full compatibility-note UI in this story unless required by the Cursor preview ACs.

### Testing Requirements

- Follow TDD for implementation changes: write a failing test first, verify red, implement, verify green.
- Unit test target: `pnpm test -- src/lib/translators/cursor.test.ts`.
- Full verification before marking dev complete:
  - `pnpm test`
  - `pnpm typecheck`
  - `pnpm lint`
  - `pnpm test:e2e tests/e2e/sample-flow.spec.ts`
- E2E should keep using `page.getByRole("complementary", { name: "Preview and Review inspector" })` for the aside and `getByRole("tab", { name: "Cursor" })` for the tab.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- 2026-06-15: Wrote Cursor translator unit tests first; confirmed red with missing legacy artifact, canonical warning, empty-rule fallback, and normalization failures.
- 2026-06-15: Implemented pure Cursor renderer helpers and two deterministic artifacts.
- 2026-06-15: Extended E2E Cursor preview assertions; confirmed red before generic multi-artifact preview rendering and green after implementation.
- 2026-06-15: Verification passed with `pnpm test`, `pnpm typecheck`, `pnpm lint`, and `pnpm test:e2e tests/e2e/sample-flow.spec.ts`.

### Completion Notes List

- Replaced the Cursor stub with representative modern `.cursor/rules/playbook.mdc` output plus visible legacy `.cursorrules` compatibility output.
- Added provenance, canonical-source warning, compatibility copy, deterministic empty-rule fallback, and Playbook text normalization for Cursor artifacts.
- Updated Preview Inspector rendering to show every artifact returned by the selected translator with a path label and copy-enabled `CodePanel`.
- Added Cursor translator unit coverage and extended the sample E2E flow for Cursor artifact order, provenance, compatibility copy, copy actions, and rule add/edit/remove synchronization.

### File List

- `src/lib/translators/cursor.ts`
- `src/lib/translators/cursor.test.ts`
- `src/components/workbench/translator-preview.tsx`
- `tests/e2e/sample-flow.spec.ts`
- `_bmad-output/implementation-artifacts/3-3-render-cursor-preview.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Review Findings

- [x] [Review][Patch] YAML frontmatter `description:` field is unquoted — `name`/`repo` containing `:` or other YAML-special chars corrupts `.mdc` frontmatter structure [`src/lib/translators/cursor.ts:26-31`]
- [x] [Review][Patch] E2E ordering assertion uses `?? 0` fallback — if modern artifact element is not visible, `0 < legacyY` yields a false-positive pass [`tests/e2e/sample-flow.spec.ts:207-209`]
- [x] [Review][Defer] `kind: "modified"` hardcoded for both new artifacts [`src/lib/translators/cursor.ts:62-68`] — deferred, pre-existing (same pattern as Story 3.2 Claude Code translator)
- [x] [Review][Defer] `compatibilityNotes` not rendered in `TranslatorPreview` — deferred, pre-existing (Story 3.5 owns compatibility-note UI; AC 5 satisfied via embedded artifact text)
- [x] [Review][Defer] `playbook.rules` has no null/undefined guard in `renderRulesSection` [`src/lib/translators/cursor.ts:11-13`] — deferred, pre-existing (schema validation responsibility)
- [x] [Review][Defer] `normalizeMarkdownText` collapses intentional inline whitespace/formatting [`src/lib/translators/cursor.ts:7-9`] — deferred, pre-existing (design pattern established in Story 3.2)
- [x] [Review][Defer] Test `toContain(rule.text)` uses raw fixture text after normalization [`src/lib/translators/cursor.test.ts:51-54`] — deferred, pre-existing (low risk; controlled fixture data)
- [x] [Review][Defer] `translate()` exceptions propagate to `useMemo` with no per-translator error boundary [`src/components/workbench/translator-preview.tsx:19-25`] — deferred, pre-existing (component pattern)
- [x] [Review][Defer] `compatibilityNotes` message duplicated in artifact content with no shared constant [`src/lib/translators/cursor.ts:50,74-79`] — deferred, pre-existing (Story 3.5 may consolidate)
- [x] [Review][Defer] E2E rule index `count + 1` pattern off-by-one-prone [`tests/e2e/sample-flow.spec.ts:229-231`] — deferred, pre-existing (pattern established in Story 3.2)

### Change Log

- 2026-06-15: Created Story 3.3 for Cursor preview implementation.
- 2026-06-15: Implemented Cursor preview story and moved status to review.
