---
baseline_commit: NO_VCS
---

# Story 1.2: Establish Test and CI Harness

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a tech lead,
I want the demo app to include automated test and CI foundations,
so that future implementation stories can verify deterministic behavior and demo reliability.

## Acceptance Criteria

1. Given the starter app has been initialized, when the test harness is configured, then Vitest is available for domain unit tests.
2. Given the starter app has been initialized, when the test harness is configured, then Playwright is available for the sample-flow smoke test.
3. Given the harness is configured, when a developer inspects `package.json`, then package scripts exist for typecheck, lint, unit tests, and E2E smoke testing.
4. Given CI runs for the project, when the workflow executes, then CI runs typecheck, lint, and unit tests at minimum.
5. Given the harness is configured, when reviewing the implementation, then no backend, auth, database, GitHub integration, local filesystem permission flow, or remote service integration scope is introduced.
6. Given the current shell exists, when the initial smoke tests run, then they verify the route renders the Agent Studio shell without implementing later Sample Repo, Playbook generation, translator, review, or export behavior.

## Tasks / Subtasks

- [x] Add Vitest unit-test foundation. (AC: 1, 3)
  - [x] Install Vitest as a dev dependency using `pnpm`.
  - [x] Add a `vitest.config.ts` or equivalent project-appropriate config for TypeScript unit tests.
  - [x] Add `test` and `test:watch` scripts to `package.json`.
  - [x] Add one minimal unit test that exercises existing app/domain-safe code without introducing future feature logic.
- [x] Add Playwright smoke-test foundation. (AC: 2, 3, 6)
  - [x] Install `@playwright/test` as a dev dependency using `pnpm`.
  - [x] Add `playwright.config.ts` with a local Next dev-server web server.
  - [x] Add `test:e2e` script to `package.json`.
  - [x] Add `tests/e2e/sample-flow.spec.ts` that visits `/` and verifies existing Story 1.1 shell copy: `Agent Studio`, `Sample Repo`, `Create Agent Playbook`, `Preview`, `Review`, and `Download Patch`.
  - [x] Keep the E2E test a smoke test only; do not assert Sample Repo scanning, Playbook generation, translators, Plan, Behavior Diff, or export readiness yet.
- [x] Add minimum CI workflow. (AC: 3, 4, 5)
  - [x] Create `.github/workflows/ci.yml`.
  - [x] Configure CI to install pnpm, install dependencies with the lockfile, and run `pnpm typecheck`, `pnpm lint`, and `pnpm test`.
  - [x] Do not require Playwright browsers in the minimum CI path for this story unless the implementation keeps it reliable and fast.
  - [x] Do not add secrets, environment variables, deployment steps, GitHub API calls, or PR creation steps.
- [x] Preserve MVP scope boundaries. (AC: 5, 6)
  - [x] Do not create `src/app/api/*`, server actions, auth middleware, database files, ORM config, migrations, GitHub OAuth code, local filesystem access, or remote service integration.
  - [x] Do not implement bundled Sample Repo fixtures, scanner, Playbook generation, Rules editing, Tool Translators, Plan, Behavior Diff, Patch Export, or downloads.
  - [x] Keep any test-only fixture or assertion focused on the existing shell.
- [x] Verify the harness locally. (AC: 1, 2, 3, 4, 6)
  - [x] Run `pnpm install --frozen-lockfile`.
  - [x] Run `pnpm typecheck`.
  - [x] Run `pnpm lint`.
  - [x] Run `pnpm test`.
  - [x] Run `pnpm test:e2e` if browser dependencies are available locally; if browser install is required, document the exact blocker and command needed.
  - [x] Run `pnpm build` to ensure the harness does not break production build.

### Review Findings

- [x] [Review][Patch] Package manager and Node versions are not declared [package.json:1]
- [x] [Review][Patch] `test:e2e` fails on clean checkout without installed Playwright browser [package.json:15]
- [x] [Review][Patch] Playwright can reuse an unrelated app on port 3000 during local runs [playwright.config.ts:17]
- [x] [Review][Patch] E2E smoke selectors use broad `.first()` matches for duplicated shell labels [tests/e2e/sample-flow.spec.ts:9]

## Dev Notes

Story 1.2 is a foundation story. Its purpose is to add reliable verification scaffolding for later deterministic domain work and the current shell. It must not implement product behavior beyond tests and CI.

### Story Source

- Epic: Epic 1, `Demo Workspace and Git-Native Playbook Foundation`.
- Story requirement IDs: `AR-20`, `AR-21`, `AR-22`, `NFR-1`, `NFR-6`.
- Source acceptance criteria: `_bmad-output/planning-artifacts/epics.md`, Story 1.2.
- PRD context: Agent Studio must prove reviewable, deterministic, Git-native agent behavior, and the MVP demo must work without repo permissions or setup complexity. [Source: `_bmad-output/planning-artifacts/prds/prd-agent_std-2026-06-09/prd.md#1-vision`]

### Architecture Compliance

- Use the existing Next.js App Router + React + TypeScript + shadcn/ui + Tailwind foundation created in Story 1.1. Do not replace the scaffold. [Source: `_bmad-output/planning-artifacts/architecture.md#Selected Starter: shadcn/ui Next template on Next.js`]
- Keep the MVP browser/client-heavy with no backend service, API routes, server actions, auth, databases, GitHub integration, arbitrary filesystem access, or persistence. [Source: `_bmad-output/planning-artifacts/architecture.md#Core Architectural Decisions`]
- Use Vitest for pure domain module tests and Playwright for one smoke test of the complete demo flow. [Source: `_bmad-output/planning-artifacts/architecture.md#Core Architectural Decisions`]
- Minimum CI pipeline is typecheck, lint, unit tests, with Playwright smoke optional. [Source: `_bmad-output/planning-artifacts/architecture.md#CI/CD`]
- Keep domain unit tests co-located with domain modules when those modules exist later; keep the E2E smoke test under `tests/e2e/sample-flow.spec.ts`. [Source: `_bmad-output/planning-artifacts/architecture.md#Test Organization`]
- Do not scatter sample data across UI components; Story 1.2 should not add sample repo fixture content. [Source: `_bmad-output/planning-artifacts/architecture.md#File Structure Patterns`]

### Current Codebase State

- Story 1.1 created a working app shell under `src/app/*`, `src/components/ui/button.tsx`, `src/components/workbench/agent-studio-workbench.tsx`, and `src/lib/utils.ts`.
- The current `package.json` already has `dev`, `build`, `start`, `lint`, `format`, and `typecheck` scripts.
- `typecheck` currently runs `next typegen && tsc --noEmit`; keep this pattern because Next 16 regenerates `next-env.d.ts` and route type files before TypeScript checking.
- The workspace is not a git repository, so do not depend on git commands for implementation or verification.
- Existing dev server may already be running on `http://localhost:3000`; Playwright config should still be able to launch or reuse a local server predictably.

### Expected File Changes

Likely new files:

- `.github/workflows/ci.yml`
- `vitest.config.ts`
- `playwright.config.ts`
- `tests/e2e/sample-flow.spec.ts`
- A minimal unit test, preferably near existing reusable code such as `src/lib/utils.test.ts`

Likely updated files:

- `package.json`
- `pnpm-lock.yaml`
- Possibly `.gitignore` or `.prettierignore` only if generated test artifacts need ignoring.

Do not move existing Story 1.1 files or planning artifacts.

### Testing Requirements

- Unit test foundation must be useful immediately, but minimal. A good initial test is `cn()` class merging behavior in `src/lib/utils.ts`, because it exercises existing reusable app code without inventing future domain modules.
- E2E smoke must verify only existing shell copy and route rendering. It must not click `Create Agent Playbook` expecting future behavior.
- CI must use lockfile installation, not a floating install.
- Keep Playwright out of required CI for this story unless browser setup is intentionally included and stable.
- Run all verification commands listed in Tasks before moving the story to review.

### Latest Technical Information

- Vitest official docs document `vitest run` for one-shot test execution, which is the right CI-style command for `pnpm test`. [Source: `https://vitest.dev/guide/`]
- Playwright official docs document installing `@playwright/test` and running specs with `playwright test`; Node.js 20, 22, and 24 are supported major lines. [Source: `https://playwright.dev/docs/intro`]
- Next.js official testing docs list Vitest for unit testing and Playwright for E2E testing in Next apps. [Source: `https://nextjs.org/docs/app/guides/testing`]
- `pnpm/action-setup` official action notes that it installs pnpm but does not set up Node.js; CI should pair it with `actions/setup-node`. [Source: `https://github.com/pnpm/action-setup`]
- Registry check on 2026-06-09 returned Vitest `4.1.8`, `@playwright/test` `1.60.0`, and `jsdom` `29.1.1`. Use the package manager and lockfile to capture resolved versions rather than hard-coding versions in source.

### Previous Story Intelligence

- Story 1.1 completed successfully and is `done`.
- Corepack signature verification failed when trying to enable pnpm; the prior implementation installed pnpm `10.34.1` globally. Avoid relying on Corepack behavior during local verification.
- Latest pnpm at that time required Node `>=22.13`; local Node was `22.12.0`, so commands should work with the installed pnpm `10.34.1`.
- Story 1.1 code review fixed a durable Next 16 typecheck issue by changing `typecheck` to run `next typegen && tsc --noEmit`. Do not regress that script.
- Story 1.1 verification passed: `pnpm lint`, `pnpm typecheck`, `pnpm build`, dev server startup, and route smoke check.

### Git Intelligence Summary

Git history is unavailable because `/Users/lamnh/Downloads/agent_std` is not currently a git repository.

### Project Context Reference

No `project-context.md` file was found in the workspace during workflow activation.

## Dev Agent Record

### Agent Model Used

Codex GPT-5

### Debug Log References

- `pnpm test` initially failed because no test script or Vitest harness existed.
- `pnpm add -D vitest@4.1.8 @playwright/test@1.60.0` installed test dependencies and updated `pnpm-lock.yaml`.
- `pnpm test:e2e` initially failed because Playwright Chromium was not installed locally; `pnpm exec playwright install chromium` installed the required browser.
- `pnpm test:e2e` then failed once because `Preview` and `Review` shell buttons are intentionally duplicated in the repo rail and inspector. The smoke spec was adjusted to assert visible shell copy without assuming uniqueness.
- `pnpm test:e2e` passed after switching Playwright base URL to `http://localhost:3000` and using `.first()` for duplicated shell controls.
- Boundary scan confirmed no `src/app/api/*`, server actions, auth, database, GitHub OAuth/API, local filesystem access, or remote service integration files were introduced.

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Added Vitest unit-test foundation with `vitest.config.ts`, `test`, and `test:watch` scripts.
- Added a minimal `cn()` unit test for existing reusable app code without introducing future product behavior.
- Added Playwright smoke-test foundation with `playwright.config.ts`, `test:e2e`, and a shell-only route test.
- Added minimum GitHub Actions CI for lockfile install, typecheck, lint, and unit tests.
- Kept Playwright out of required CI and preserved MVP boundaries: no backend, auth, database, GitHub integration, filesystem permission flow, sample repo fixture, scanner, Playbook generation, translators, review surfaces, or export behavior.
- Verified with frozen install, typecheck, lint, unit tests, E2E smoke, production build, format check, and boundary scan.
- Applied Chunk A code review patches: declared package manager and Node engine range, made `test:e2e` install Chromium on clean checkout, moved Playwright's default local server to an isolated port, tightened smoke selectors with scoped landmarks, and ignored Playwright artifacts in ESLint.

### File List

- `.github/workflows/ci.yml`
- `.gitignore`
- `eslint.config.mjs`
- `package.json`
- `playwright.config.ts`
- `src/components/workbench/agent-studio-workbench.tsx`
- `pnpm-lock.yaml`
- `src/lib/utils.test.ts`
- `tests/e2e/sample-flow.spec.ts`
- `vitest.config.ts`
- `_bmad-output/implementation-artifacts/1-2-establish-test-and-ci-harness.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

## Change Log

- 2026-06-09: Created Story 1.2 context and moved story to ready-for-dev.
- 2026-06-09: Implemented test and CI harness and moved story to review.
- 2026-06-10: Applied code review patches and moved story to done.
