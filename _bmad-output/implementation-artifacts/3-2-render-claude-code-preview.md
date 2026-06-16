---
baseline_commit: NO_VCS
---

# Story 3.2: Render Claude Code Preview

Status: done

## Story

As a tech lead,
I want to preview the Claude Code output generated from the Playbook,
so that I can see how canonical behavior appears for Claude Code.

## Acceptance Criteria

1. Given a valid Agent Playbook exists, when the Claude Code tab is selected, then the preview shows representative `CLAUDE.md` content.
2. Given the Claude Code preview is shown, then the preview includes provenance text referencing `.agent-studio/playbook.yaml`.
3. Given the Playbook includes imported skills, then the Claude Code preview references those skills where appropriate.
4. Given the user adds, edits, or removes a Rule, then the Claude Code preview updates from the current Playbook state.
5. Given generated Claude Code content is shown, then it is displayed in the existing readable code panel with copy action.

## Tasks / Subtasks

- [x] Replace the Claude Code stub renderer with representative `CLAUDE.md` output. (AC: 1, 2, 3, 4)
  - [x] Keep the implementation inside `src/lib/translators/claude-code.ts`.
  - [x] Keep `claudeCodeTranslator` as the `TranslatorModule` with `id: "claude-code"`, `label: "Claude Code"`, one `CLAUDE.md` artifact, and `compatibilityNotes: []`.
  - [x] Render a Markdown document that includes the Playbook name, provenance text equivalent to `Generated from .agent-studio/playbook.yaml`, and wording that generated native files are outputs rather than the canonical source.
  - [x] Include a rules section that renders all current `playbook.rules` text so add/edit/remove changes are reflected automatically.
  - [x] Include imported skill references when `playbook.skills` is non-empty. Reference skill names and source paths such as `.claude/skills/code-review.md`; do not inline or duplicate full skill instructions unless clearly needed for representative Claude Code output.
- [x] Preserve translator architecture boundaries. (AC: 1, 3, 4)
  - [x] Do not import React, workbench components, fixture data, Cursor translator, or Windsurf translator into `src/lib/translators/claude-code.ts`.
  - [x] Do not mutate `AgentPlaybook` or store generated output in React state.
  - [x] Keep generated artifact paths POSIX-style; Claude Code artifact path remains exactly `CLAUDE.md`.
- [x] Extend Claude Code translator unit tests. (AC: 1, 2, 3, 4)
  - [x] Add tests in `src/lib/translators/claude-code.test.ts` for representative heading/content, provenance text, generated-output warning, imported skill names/source paths, all rule text, deterministic output, `path === "CLAUDE.md"`, `kind === "modified"`, and empty `compatibilityNotes`.
  - [x] Add a regression test proving output changes when rule text changes and does not require UI state.
- [x] Extend E2E coverage for the Preview Inspector. (AC: 1, 4, 5)
  - [x] In `tests/e2e/sample-flow.spec.ts`, after creating the Playbook, assert the Claude Code tab shows `CLAUDE.md`, provenance text, imported skill references, and at least one imported rule.
  - [x] Add/edit/remove a rule through the existing Rules editor and assert the Claude Code preview reflects the current rule state.
  - [x] Assert the copy action remains visible/reachable in the Claude Code code panel.

### Review Findings

- [x] [Review][Patch] Normalize Playbook-provided text before rendering generated Markdown [src/lib/translators/claude-code.ts:12]
- [x] [Review][Patch] Add unit coverage for empty rules and empty imported skills branches [src/lib/translators/claude-code.ts:8]
- [x] [Review][Patch] Harden Claude preview E2E assertions for selected tab, copy action enabled state, and stable baseline content after rule removal [tests/e2e/sample-flow.spec.ts:153]

## Dev Notes

### Story Source

- Epic: Epic 3, `Cross-Tool Preview and Compatibility Notes`.
- Story requirement ID: `FR-9`.
- Source ACs: `_bmad-output/planning-artifacts/epics.md`, `Story 3.2: Render Claude Code Preview`.
- PRD requirement: Agent Studio renders a Claude Code output preview from the Agent Playbook; the preview includes representative `CLAUDE.md` content, references imported skills where appropriate, and updates when Rules change. [Source: `_bmad-output/planning-artifacts/prds/prd-agent_std-2026-06-09/prd.md`, FR-9]
- Provenance requirement: generated tool output includes wording equivalent to `Generated from .agent-studio/playbook.yaml`, discourages direct editing where appropriate, and is visible in preview and export. [Source: `_bmad-output/planning-artifacts/prds/prd-agent_std-2026-06-09/prd.md`, generated file provenance]
- UX requirement: Preview Inspector defaults to Claude Code after Playbook generation, code panels display generated output with copy action, and rule edits update previews immediately. [Source: `_bmad-output/planning-artifacts/ux-designs/ux-agent_std-2026-06-09/EXPERIENCE.md`, Tool Translator tabs, Code panel, State Patterns, Flow 2]

### Current Code State

- `src/lib/translators/types.ts` defines `GeneratedArtifact`, `CompatibilityNote`, `TranslatorResult`, and `TranslatorModule`.
- `src/lib/translators/index.ts` registers `claudeCodeTranslator`, `cursorTranslator`, and `windsurfTranslator` in `TRANSLATORS`.
- `src/lib/translators/claude-code.ts` currently contains a stub:
  - returns one artifact with `path: "CLAUDE.md"` and `kind: "modified"`;
  - includes playbook name, provenance text, and rule bullets;
  - returns `compatibilityNotes: []`.
- `src/components/workbench/translator-preview.tsx` already derives translator results with `useMemo` from the current `playbook` and passes the first artifact to `CodePanel`.
- `src/components/workbench/code-panel.tsx` already provides the readable code panel and guarded copy action; reuse it.
- `tests/e2e/sample-flow.spec.ts` already creates a Playbook and verifies Tool Translator tabs and Cursor tab switching. Extend the same flow instead of adding a disconnected path.

### Previous Story Intelligence

Story 3.1 established the translator contract and preview shell, then code review fixed three issues:

- `src/components/ui/tabs.tsx` must pass `orientation` to Radix and use selectors matching `data-orientation`.
- `src/components/workbench/code-panel.tsx` guards unavailable/rejected Clipboard API calls through `copyTextToClipboard`.
- The Preview aside wrapper in `agent-studio-workbench.tsx` must keep `aria-label="Preview and Review inspector"`, `className="min-h-[420px] rounded-lg border border-border bg-card"`, and `id="preview"`.

Do not regress those fixes while implementing Claude Code output.

### Architecture Compliance

- Tool Translators must depend only on validated `AgentPlaybook` input, not React state. [Source: `_bmad-output/planning-artifacts/architecture.md`, Pattern Examples and Project Structure & Boundaries]
- `src/lib/translators/*` modules must be isolated by tool; Claude Code must not import Cursor or Windsurf translators. [Source: `_bmad-output/planning-artifacts/architecture.md`, AR-11/AR-12 and anti-patterns]
- Workbench components may call `src/lib/*`, but workbench components must not build generated tool output strings inline. [Source: `_bmad-output/planning-artifacts/architecture.md`, Component Boundaries]
- Generated native tool files are outputs; the Agent Playbook remains canonical. [Source: `_bmad-output/planning-artifacts/architecture.md`, anti-patterns and state boundaries]
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

- Prefer small pure render helpers in `src/lib/translators/claude-code.ts`, for example:
  - `renderClaudeCode(playbook: AgentPlaybook): string`
  - `renderRulesSection(playbook.rules)`
  - `renderSkillsSection(playbook.skills)`
- Keep output deterministic: no dates, random IDs, locale-dependent sorting, or environment-derived values.
- Preserve current order from the Playbook arrays unless a source explicitly requires sorting.
- Representative `CLAUDE.md` should be meaningful enough for the demo but not overclaim real Claude Code behavior. It should show:
  - title/name;
  - provenance and generated-output warning;
  - repo/context summary if useful;
  - rules from `playbook.rules`;
  - imported skill references from `playbook.skills` with source paths.
- Do not implement Cursor/Windsurf real output or compatibility note rendering in this story; those belong to Stories 3.3, 3.4, and 3.5.

### Testing Requirements

- Follow TDD for implementation changes: write a failing test first, verify red, implement, verify green.
- Unit tests: `pnpm test -- src/lib/translators/claude-code.test.ts`.
- Full verification before marking dev complete:
  - `pnpm test`
  - `pnpm typecheck`
  - `pnpm lint`
  - `pnpm test:e2e tests/e2e/sample-flow.spec.ts`
- E2E should keep using `page.getByRole("complementary", { name: "Preview and Review inspector" })` for the aside and `getByRole("tab", { name: "Claude Code" })` for the tab.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `pnpm test -- src/lib/translators/claude-code.test.ts` failed in RED phase for missing generated-output warning and imported skill references.
- `pnpm test -- src/lib/translators/claude-code.test.ts` passed after Claude renderer implementation.
- `pnpm test`, `pnpm typecheck`, `pnpm lint`, and `pnpm test:e2e tests/e2e/sample-flow.spec.ts` passed after implementation.
- `pnpm test -- src/lib/translators/claude-code.test.ts` failed in RED phase for review-found markdown normalization coverage.
- `pnpm test`, `pnpm typecheck`, `pnpm lint`, and `pnpm test:e2e tests/e2e/sample-flow.spec.ts` passed after review patches.

### Completion Notes List

- Replaced the Claude Code translator stub with deterministic representative `CLAUDE.md` content containing provenance, canonical-source warning, repo metadata, rules, and imported skill references.
- Kept Claude Code translation as pure domain logic in `src/lib/translators/claude-code.ts`; no UI state, fixture imports, or cross-translator imports were introduced.
- Extended unit coverage for artifact shape, provenance, generated-output warning, skill references, rule text, deterministic output, and rule-change sensitivity.
- Extended E2E coverage so the Preview Inspector verifies Claude Code preview content, copy control visibility, and live add/edit/remove Rule updates.
- Addressed code review findings by normalizing Playbook-provided Markdown text, covering empty rules/skills branches, and hardening E2E assertions for selected tab, copy enabled state, and stable baseline content after rule removal.

### File List

- `_bmad-output/implementation-artifacts/3-2-render-claude-code-preview.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `src/lib/translators/claude-code.ts`
- `src/lib/translators/claude-code.test.ts`
- `tests/e2e/sample-flow.spec.ts`

### Change Log

- 2026-06-15: Implemented Story 3.2 Claude Code preview and test coverage.
- 2026-06-15: Addressed code review findings for Story 3.2.
