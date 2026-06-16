---
baseline_commit: NO_VCS
---

# Story 1.3: Show Sample Repo as the Primary Workspace

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a tech lead,
I want to see the bundled Sample Repo as the primary workspace,
so that I understand Agent Studio manages agent behavior per repo.

## Acceptance Criteria

1. Given Agent Studio loads, when the Demo Workspace is shown, then the Sample Repo is visible as the primary workspace object.
2. Given the Demo Workspace is shown, then the UI communicates repo-first context rather than Playbook Library navigation.
3. Given the Demo Workspace is shown, then the workspace shows detected-file areas for `CLAUDE.md`, `.cursorrules`, `.claude/skills/*`, and docs.
4. Given the Demo Workspace is shown, then Sample Repo copy clearly states the repo is controlled demo data.
5. Given the Demo Workspace is shown, then no arbitrary repo connection or GitHub OAuth action is offered.

## Tasks / Subtasks

- [x] Present the Sample Repo as the primary workspace object. (AC: 1, 2, 4)
  - [x] Update `src/components/workbench/agent-studio-workbench.tsx` so the top bar and main content clearly frame the current object as a repo workspace, not a Playbook library.
  - [x] Use the sample repo name from UX guidance, `sample-nextjs-repo`, unless implementation has a better planning-approved name.
  - [x] Show the repo status and Playbook status in plain copy, for example `No Playbook yet` / `Ready to create .agent-studio/playbook.yaml`.
  - [x] Add explicit controlled-demo disclosure near the repo context, for example `Sample Repo is controlled demo data`.
- [x] Add detected-file display areas without implementing scanner behavior. (AC: 3)
  - [x] Show grouped file areas for `CLAUDE.md`, `.cursorrules`, `.claude/skills/*`, and `docs/*`.
  - [x] Include representative rows for the required sample files: `CLAUDE.md`, `.cursorrules`, `.claude/skills/code-review.md`, `.claude/skills/test-writer.md`, `docs/architecture.md`, `docs/conventions.md`, and `docs/glossary.md`.
  - [x] Treat these rows as read-only demo workspace presentation for this story. Do not implement actual fixture scanning, parsing, import status derivation, or Playbook generation yet.
  - [x] Prefer extracting small UI components if useful: `src/components/workbench/repo-rail.tsx` and `src/components/workbench/detected-file-row.tsx` are architecture-mapped locations.
- [x] Preserve MVP scope boundaries and existing shell behavior. (AC: 1, 2, 5)
  - [x] Keep the app opening directly at `/` through `src/app/page.tsx` rendering `AgentStudioWorkbench`.
  - [x] Do not add primary navigation for Playbook Library, marketplace, tools settings, templates, or OAuth.
  - [x] Do not add arbitrary repo connection, file picker, filesystem permission flow, GitHub OAuth, GitHub App, branch, commit, or PR creation UI.
  - [x] Do not create backend/API routes, server actions, auth, database, local filesystem access, remote service calls, analytics, or telemetry.
  - [x] Keep `Create Agent Playbook`, preview, review, and `Download Patch` visible only as current/future workflow actions; do not make them generate or export real data in this story.
- [x] Update the E2E smoke coverage for the new workspace state. (AC: 1, 2, 3, 4, 5)
  - [x] Update `tests/e2e/sample-flow.spec.ts` to assert `sample-nextjs-repo`, controlled demo copy, repo-first workspace copy, and detected file paths.
  - [x] Assert the current ARIA landmarks remain discoverable with scoped selectors: `Sample Repo rail`, `Playbook editor`, and `Preview and Review inspector`, unless the implementation intentionally renames them and updates tests accordingly.
  - [x] Assert forbidden actions/copy are absent, including at minimum `Connect repo`, `GitHub`, `OAuth`, `Playbook Library`, and `Marketplace`.
  - [x] Keep the E2E test a smoke test. Do not click `Create Agent Playbook` expecting Story 1.5 behavior.
- [x] Verify implementation locally. (AC: 1-5)
  - [x] Run `pnpm install --frozen-lockfile`.
  - [x] Run `pnpm typecheck`.
  - [x] Run `pnpm lint`.
  - [x] Run `pnpm test`.
  - [x] Run `pnpm test:e2e`.
  - [x] Run `pnpm build`.
  - [x] Run a boundary scan confirming no forbidden backend/auth/GitHub/filesystem scope was introduced.

### Review Findings

- [x] [Review][Patch] Missing explicit repo status copy [`src/components/workbench/agent-studio-workbench.tsx:62`]
- [x] [Review][Patch] Repo rail omits Playbook sections and import status [`src/components/workbench/repo-rail.tsx:31`]
- [x] [Review][Patch] Future workflow controls are enabled before behavior exists [`src/components/workbench/agent-studio-workbench.tsx:27`, `src/components/workbench/repo-rail.tsx:31`]
- [x] [Review][Patch] E2E smoke test does not cover responsive overflow [`tests/e2e/sample-flow.spec.ts:3`]
- [x] [Review][Patch] Forbidden-action assertions only check exact text, not interactive controls [`tests/e2e/sample-flow.spec.ts:69`]

## Dev Notes

Story 1.3 is a presentation/workspace-context story. Its job is to make the product thesis visible: Agent Studio manages agent behavior per repo. It must not implement the scanner, draft Playbook generation, Rules editing, translators, Plan, Behavior Diff, or patch export behavior owned by later stories.

### Story Source

- Epic: Epic 1, `Demo Workspace and Git-Native Playbook Foundation`.
- Story requirement IDs: `FR-1`, `FR-2`.
- Source acceptance criteria: `_bmad-output/planning-artifacts/epics.md`, `Story 1.3: Show Sample Repo as the Primary Workspace`.
- PRD requirement: the Sample Repo is a controlled React/Next.js demo repo including `CLAUDE.md`, `.cursorrules`, `.claude/skills/code-review.md`, `.claude/skills/test-writer.md`, `docs/architecture.md`, `docs/conventions.md`, and `docs/glossary.md`; no user filesystem permissions are required. [Source: `_bmad-output/planning-artifacts/prds/prd-agent_std-2026-06-09/prd.md#FR-1-Load-Sample-Repo`]
- PRD requirement: the primary page must communicate "this repo uses this Playbook" rather than "browse a prompt library", expose Playbook status, detected files, and available actions, and avoid primary Playbook Library, marketplace, and tools settings navigation. [Source: `_bmad-output/planning-artifacts/prds/prd-agent_std-2026-06-09/prd.md#FR-2-Projects-First-Workspace`]

### UX Requirements

- Keep the single-surface workbench: top bar, left repo rail, center editor/workspace panel, right preview/review inspector. [Source: `_bmad-output/planning-artifacts/ux-designs/ux-agent_std-2026-06-09/EXPERIENCE.md#Primary-Workbench-Layout`]
- Initial load should show the Sample Repo already available with the primary action `Create Agent Playbook`. [Source: `_bmad-output/planning-artifacts/ux-designs/ux-agent_std-2026-06-09/EXPERIENCE.md#State-Model`]
- The no-Playbook state should show detected files and explain that Agent Studio can create `.agent-studio/playbook.yaml`. [Source: `_bmad-output/planning-artifacts/ux-designs/ux-agent_std-2026-06-09/EXPERIENCE.md#State-Model`]
- Repo rail should show the Sample Repo, detected files, Playbook sections, and import status. [Source: `_bmad-output/planning-artifacts/ux-designs/ux-agent_std-2026-06-09/EXPERIENCE.md#Primary-Workbench-Layout`]
- Detected file rows should show path, type, and detected/imported status and be read-only in MVP presentation. [Source: `_bmad-output/planning-artifacts/ux-designs/ux-agent_std-2026-06-09/EXPERIENCE.md#Component-and-Interaction-Specifications`]
- Scope disclosure is required at point of need: Sample Repo is controlled demo data. [Source: `_bmad-output/planning-artifacts/ux-designs/ux-agent_std-2026-06-09/EXPERIENCE.md#MVP-Scope-Disclosures`]
- Do not add in-app explanatory training text, hero composition, decorative graphics, nested cards, oversized marketing sections, or visual clutter. The app should feel like a quiet developer tool. [Source: `_bmad-output/planning-artifacts/ux-designs/ux-agent_std-2026-06-09/DESIGN.md#Visual-Design-Direction`]

### Architecture Compliance

- Continue using Next.js App Router, React, TypeScript, Tailwind, and shadcn/ui. Do not replace the existing scaffold. [Source: `_bmad-output/planning-artifacts/architecture.md#Technology-Stack`]
- Keep the MVP client-heavy and deterministic. Do not add backend services, API routes, server actions, database, auth, GitHub OAuth, arbitrary filesystem access, or remote service integration. [Source: `_bmad-output/planning-artifacts/architecture.md#Core-Architectural-Decisions`]
- FR-1 to FR-2 are mapped to `src/lib/sample-repo/fixtures.ts`, `src/lib/sample-repo/scanner.ts`, `src/components/workbench/agent-studio-workbench.tsx`, `src/components/workbench/repo-rail.tsx`, and `src/components/workbench/detected-file-row.tsx`. For this story, prioritize the UI presentation path and avoid implementing scanner behavior that belongs to Story 1.4. [Source: `_bmad-output/planning-artifacts/architecture.md#Requirements-to-Structure-Mapping`]
- Sample Repo fixture content should ultimately live in TypeScript modules under `src/lib/sample-repo`, not in `public/`. If this story introduces a tiny static display model, keep it typed and easy to replace with real fixture/scanner output in Story 1.4. [Source: `_bmad-output/planning-artifacts/architecture.md#Asset-Organization`]
- Domain logic should live under `src/lib/*`; UI components should stay thin. Do not embed parsing or scanner logic inside React components. [Source: `_bmad-output/planning-artifacts/architecture.md#Logical-Modules`]

### Current Codebase State

- `src/app/page.tsx` renders `AgentStudioWorkbench`; keep this route entry point.
- `src/components/workbench/agent-studio-workbench.tsx` currently contains the whole workbench shell: top bar, left rail, center editor placeholder, and right preview/review inspector.
- Existing shell landmarks are used by Playwright: `Sample Repo rail`, `Playbook editor`, and `Preview and Review inspector`.
- `tests/e2e/sample-flow.spec.ts` currently asserts the Story 1.1/1.2 shell only and should be updated for Story 1.3 copy and file rows.
- The workspace is not a git repository, so do not depend on git commands for implementation or verification.

### Expected File Changes

Likely updated files:

- `src/components/workbench/agent-studio-workbench.tsx`
- `tests/e2e/sample-flow.spec.ts`

Possible new files if the implementation keeps components clearer:

- `src/components/workbench/repo-rail.tsx`
- `src/components/workbench/detected-file-row.tsx`
- `src/lib/sample-repo/fixtures.ts` only if used as a small typed display model, not as scanner/parser implementation.

Do not change `package.json` dependencies for this story unless a current dependency is missing for already-approved UI work. The existing Story 1.1 and Story 1.2 stack is sufficient.

### Testing Requirements

- E2E is the primary verification for this UI story. Use Playwright role/landmark selectors scoped to stable regions to avoid duplicated labels.
- Keep Vitest passing. Add unit tests only if introducing non-trivial pure data helpers; do not create tests for scanner or Playbook generation yet.
- Required verification commands: `pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:e2e`, and `pnpm build`.
- Run a boundary scan such as `find src -maxdepth 4 -type f | sort` plus `rg -n "GitHub|OAuth|Connect repo|Playbook Library|Marketplace|fs\\b|node:fs|src/app/api|server action|use server" src tests`.

### Latest Technical Information

- Next.js App Router routes continue to be defined by files under `app`, with `page` files rendering route UI and `layout` files wrapping route segments. Keep Story 1.3 in the existing App Router entry point instead of adding a separate routing model. [Source: `https://nextjs.org/docs/app`]
- Playwright recommends resilient user-facing locators such as role locators. Continue using scoped `getByRole` assertions instead of brittle CSS selectors. [Source: `https://playwright.dev/docs/locators`]

### Previous Story Intelligence

- Story 1.2 is `done` and established Vitest, Playwright, CI, package manager metadata, and Node engine metadata.
- `package.json` declares `packageManager: pnpm@10.34.1` and Node `>=22.12.0 <23`; do not rely on Corepack auto-upgrade behavior.
- `typecheck` runs `next typegen && tsc --noEmit`; do not regress this script.
- `playwright.config.ts` starts the app at `http://127.0.0.1:3100` by default and installs Chromium through `pretest:e2e`; keep E2E reliable on clean checkout.
- Story 1.2 code review fixed broad `.first()` E2E selectors by scoping to landmarks. Continue that pattern.
- Story 1.2 verification passed: frozen install, typecheck, lint, unit tests, E2E smoke, build, Prettier check, and boundary scan.

### Git Intelligence Summary

Git history is unavailable because `/Users/lamnh/Downloads/agent_std` is not currently a git repository.

### Project Context Reference

No `project-context.md` file was found in the workspace during workflow activation.

### Completion Note

Ultimate context engine analysis completed - comprehensive developer guide created.

## Dev Agent Record

### Agent Model Used

Codex GPT-5

### Debug Log References

- Red phase: `pnpm test:e2e` failed because `sample-nextjs-repo` did not exist in the Story 1.1/1.2 shell.
- First green run failed once because the initial `sample-nextjs-repo` assertion was too broad and matched header, rail, and editor copies; the test was tightened to scoped landmark selectors.
- Boundary scan over `src` found no backend/API/server action/auth/GitHub/filesystem/marketplace scope. The only forbidden-copy hits were intentional E2E absence assertions.
- Code review patch run initially hit a stale manually started dev server; after stopping it, E2E ran through the configured Playwright server.
- Code review patch E2E failed once because the `Skills` assertion matched `.claude/skills/*` paths; the selector was tightened to exact text.

### Completion Notes List

- Implemented a typed static Sample Repo workspace display model for `sample-nextjs-repo` with required detected file groups and rows.
- Reworked the workbench to present a repo-first workspace with `This repo uses a Playbook`, `No Playbook yet`, `Ready to create .agent-studio/playbook.yaml`, and controlled demo disclosure copy.
- Added thin `RepoRail` and `DetectedFileRow` components to show read-only detected files without scanner/parser behavior.
- Updated the Playwright smoke test to assert repo-first context, controlled demo copy, required detected file paths, current landmarks, and absence of forbidden repo/GitHub/marketplace actions.
- Verified with frozen install, typecheck, lint, unit tests, E2E smoke, production build, touched-file Prettier check, and source boundary scan.
- Resolved all five code review patch findings: added explicit repo/import status, added Playbook sections, converted rail navigation to anchor links, disabled unavailable future workflow controls with explanatory titles, and hardened E2E for mobile overflow and forbidden interactive CTAs.
- Re-verified after review patches with frozen install, typecheck, lint, unit tests, E2E smoke, production build, touched-file Prettier check, and source boundary scan.

### File List

- `_bmad-output/implementation-artifacts/1-3-show-sample-repo-as-the-primary-workspace.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `src/components/workbench/agent-studio-workbench.tsx`
- `src/components/workbench/detected-file-row.tsx`
- `src/components/workbench/repo-rail.tsx`
- `src/lib/sample-repo/fixtures.ts`
- `tests/e2e/sample-flow.spec.ts`

## Change Log

- 2026-06-10: Created Story 1.3 context and moved story to ready-for-dev.
- 2026-06-10: Implemented Sample Repo primary workspace UI and moved story to review.
- 2026-06-10: Applied code review patches and moved story to done.
