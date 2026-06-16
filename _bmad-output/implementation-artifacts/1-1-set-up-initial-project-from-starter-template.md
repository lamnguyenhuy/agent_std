---
baseline_commit: NO_VCS
---

# Story 1.1: Set Up Initial Project from Starter Template

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a tech lead,
I want to open Agent Studio in a polished demo workspace,
so that I can evaluate the product without setup or repo permissions.

## Acceptance Criteria

1. Given the app is installed locally, when the developer runs the app, then Agent Studio opens as a Next.js + shadcn/ui + Tailwind web app.
2. The implementation uses the architecture-approved starter path.
3. The UI applies the Agent Studio visual tokens, typography, spacing, and workbench shell.
4. No auth, backend API, database, GitHub integration, or filesystem permission flow is present.

## Tasks / Subtasks

- [x] Initialize the Next.js/shadcn application foundation. (AC: 1, 2)
  - [x] Use `pnpm` as the package manager.
  - [x] Use the architecture-approved shadcn Next template command: `pnpm dlx shadcn@latest init -t next`.
  - [x] Configure or confirm TypeScript, Tailwind CSS, App Router, `src/` directory, ESLint, and `@/*` import alias.
  - [x] Preserve existing `_bmad/`, `.agents/`, and `_bmad-output/` planning artifacts; do not delete or move planning files.
- [x] Create the initial Agent Studio app shell. (AC: 1, 3)
  - [x] Implement `src/app/layout.tsx`, `src/app/page.tsx`, and `src/app/globals.css` as needed by the scaffold.
  - [x] Add a single workbench shell component under `src/components/workbench/agent-studio-workbench.tsx`.
  - [x] Render a top bar, left repo rail placeholder, center workbench placeholder, and right preview/review inspector placeholder.
  - [x] Use direct product copy only: `Agent Studio`, `Sample Repo`, `Create Agent Playbook`, `Preview`, `Review`, and `Download Patch`.
- [x] Apply product visual tokens and layout rules. (AC: 3)
  - [x] Map the DESIGN.md color, typography, radius, and spacing tokens into CSS variables or Tailwind-compatible styles.
  - [x] Use neutral surfaces, borders, compact text, and restrained accents; do not use landing-page hero styling, decorative gradients, or large marketing cards.
  - [x] Make the desktop shell a 3-panel workbench with a left rail near `280px`, right inspector near `420px`, and `16px` gutters.
  - [x] Keep code/text preview placeholder styles at `12px` or larger where code surfaces appear.
- [x] Enforce MVP scope boundaries in the starter. (AC: 4)
  - [x] Do not create `src/app/api/*`, server actions, auth middleware, database files, ORM config, migrations, GitHub OAuth code, local filesystem access, or remote service integration.
  - [x] Do not implement sample repo scanning, Playbook generation, Rule editing, Tool Translators, Plan, Behavior Diff, or Patch Export in this story.
  - [x] Leave clear placeholders only where later stories will attach behavior.
- [x] Verify the starter runs locally. (AC: 1)
  - [x] Confirm `pnpm dev` starts the app.
  - [x] Confirm `pnpm lint` or the scaffolded lint command runs, if available from the starter.
  - [x] Confirm the root route renders the Agent Studio shell without runtime errors.

### Review Findings

- [x] [Review][Patch] Typecheck depends on ignored generated Next route types [next-env.d.ts:3]
- [x] [Review][Patch] Prettier Tailwind stylesheet path points outside `src/` [`.prettierrc`:9]
- [x] [Review][Patch] Center workbench header can overflow on narrow viewports [src/components/workbench/agent-studio-workbench.tsx:39]
- [x] [Review][Patch] Shared Button defaults to submit behavior inside forms [src/components/ui/button.tsx:57]

## Dev Notes

Story 1.1 is the project foundation story. Its job is to create a reliable, visually aligned shell, not the full demo workflow. Later stories own test/CI harness, Sample Repo data, scanner, Playbook generation, Rules editing, translators, review surfaces, and export behavior.

### Story Source

- Epic: Epic 1, `Demo Workspace and Git-Native Playbook Foundation`.
- Story requirement IDs: `FR-1`, `FR-2`.
- Source acceptance criteria: `_bmad-output/planning-artifacts/epics.md`, Story 1.1.
- Readiness status: `_bmad-output/planning-artifacts/implementation-readiness-report-2026-06-09.md` marked the planning set `READY`.

### Architecture Compliance

- Use Next.js App Router + React + TypeScript + shadcn/ui + Tailwind. [Source: `_bmad-output/planning-artifacts/architecture.md#Selected Starter: shadcn/ui Next template on Next.js`]
- Use the architecture-approved initialization command: `pnpm dlx shadcn@latest init -t next`. [Source: `_bmad-output/planning-artifacts/architecture.md#Initialization Command`]
- Use a browser/client-heavy MVP. Do not introduce backend services, API routes, server actions, auth, databases, GitHub integration, arbitrary filesystem access, or persistence. [Source: `_bmad-output/planning-artifacts/architecture.md#Authentication & Security`]
- Keep app code under the architecture structure:
  - `src/app/page.tsx`
  - `src/app/layout.tsx`
  - `src/app/globals.css`
  - `src/components/workbench/*`
  - `src/components/ui/*`
  - `src/lib/*` for future domain modules only. [Source: `_bmad-output/planning-artifacts/architecture.md#Complete Project Directory Structure`]
- Use kebab-case filenames for component files and PascalCase React component names. [Source: `_bmad-output/planning-artifacts/architecture.md#Naming Patterns`]

### UX Requirements for This Story

- The product should feel like a focused developer tool, closer to a Git diff viewer, API console, or internal developer platform than a marketing SaaS page. [Source: `_bmad-output/planning-artifacts/ux-designs/ux-agent_std-2026-06-09/DESIGN.md#Brand & Style`]
- Use these core visual tokens:
  - background `#F7F8FA`
  - foreground `#15181D`
  - surface `#FFFFFF`
  - border `#D8DDE3`
  - primary teal `#0F766E`
  - action blue `#2563EB`
  - code surface `#101418`
  - code foreground `#E7EEF5`
  - destructive `#B91C1C`
  - warning `#B45309`
- Typography must be compact:
  - body: Inter/system UI, `14px`, line height `1.5`, letter spacing `0`
  - label: `12px`, weight `600`
  - heading: `18px`, weight around `650`
  - code: JetBrains Mono/system monospace, `12px` minimum. [Source: `_bmad-output/planning-artifacts/ux-designs/ux-agent_std-2026-06-09/DESIGN.md#Typography`]
- The workbench shell should be desktop-first:
  - left rail: Sample Repo / Playbook structure placeholder
  - center: Playbook editor placeholder
  - right inspector: Preview / Review placeholder
  - top bar: Agent Studio / Sample Repo / status / Export Patch placeholder. [Source: `_bmad-output/planning-artifacts/ux-designs/ux-agent_std-2026-06-09/EXPERIENCE.md#Primary Workbench Layout`]
- Avoid setup wizards, landing heroes, decorative gradients, oversized cards, hover-only controls, and hidden primary actions.

### Scope Boundaries

This story must not implement:

- Actual bundled Sample Repo fixture content.
- Detection of `CLAUDE.md`, `.cursorrules`, `.claude/skills/*`, or `docs/*`.
- `.agent-studio/playbook.yaml` generation.
- Rules editor behavior.
- Claude/Cursor/Windsurf translators.
- Plan, Behavior Diff, patch generation, JSZip, or downloads.
- Auth, backend, API routes, server actions, database, local filesystem access, GitHub OAuth, GitHub PR creation, analytics, telemetry, marketplace, workflows, governance, audit, or rollback.

The shell may show static placeholder text for future areas, but placeholder copy must not imply those future features already work.

### Latest Technical Information

- Official shadcn/ui Next installation docs support scaffolding a new Next.js project with `pnpm dlx shadcn@latest init -t next`; the CLI also documents `-t, --template` with `next` as a supported template. [Source: `https://ui.shadcn.com/docs/installation/next`; `https://ui.shadcn.com/docs/cli`]
- Official shadcn/ui docs say that for existing Next projects, recommended `create-next-app` defaults include Tailwind CSS, App Router, and `@/*`; with `--src-dir`, the alias points to `./src/*`. [Source: `https://ui.shadcn.com/docs/installation/next`]
- Official Next.js App Router installation docs indicate `create-next-app` prompts for TypeScript, Tailwind CSS, `src/`, App Router, and import alias; `app/layout.tsx` and `app/page.tsx` render the root route. [Source: `https://nextjs.org/docs/app/getting-started/installation`]
- Do not hard-code framework versions in source files. Let the scaffold and lockfile capture resolved versions, unless architecture is explicitly updated to pin versions.

### Project Structure Notes

- Current workspace contains BMad planning artifacts but no application source tree yet.
- This workspace is not currently a git repository, so there is no previous implementation history to preserve beyond files already present on disk.
- Preserve existing planning folders:
  - `_bmad/`
  - `.agents/`
  - `_bmad-output/`
- Expected new implementation files after this story include root Next/shadcn config files plus `src/app/*`, `src/components/ui/*`, and `src/components/workbench/agent-studio-workbench.tsx`.

### Testing Requirements

- Story 1.2 owns formal Vitest, Playwright, package test scripts, and CI setup.
- For Story 1.1, minimum verification is:
  - `pnpm dev` runs successfully.
  - The root route renders the Agent Studio shell.
  - Scaffolded lint command runs if available.
  - No forbidden backend/auth/db/filesystem/GitHub files are introduced.
- Do not create a full test harness in this story unless the scaffold includes one by default.

### Previous Story Intelligence

No previous story exists. This is the first implementation story.

### Git Intelligence Summary

Git history is unavailable because `/Users/lamnh/Downloads/agent_std` is not currently a git repository.

### Project Context Reference

No `project-context.md` file was found in the workspace during workflow activation.

## Dev Agent Record

### Agent Model Used

Codex GPT-5

### Debug Log References

- `corepack enable pnpm && pnpm --version && pnpm dlx shadcn@latest init -t next` failed because Corepack signature verification could not resolve the pnpm key.
- `npm install -g pnpm@latest` failed because latest pnpm required Node `>=22.13`; current Node is `22.12.0`.
- `corepack disable pnpm && npm install -g pnpm@10 && pnpm --version` installed pnpm `10.34.1`.
- `pnpm dlx shadcn@latest init -t next` was run and scaffolded through a temporary `agent-studio-app` directory because the current workspace already existed.
- `pnpm install` installed root app dependencies.
- `pnpm lint` passed.
- `pnpm typecheck` passed.
- `pnpm build` passed.
- `pnpm dev` started successfully at `http://localhost:3000`.
- `curl -s http://localhost:3000 | rg -o "Agent Studio|Sample Repo|Create Agent Playbook|Preview|Review|Download Patch" | sort | uniq -c` confirmed root route rendered expected product copy.

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Implemented the Next.js App Router + shadcn/ui + Tailwind foundation using pnpm.
- Normalized scaffold output into the architecture-required `src/` structure with `@/*` mapped to `./src/*`.
- Added the initial `AgentStudioWorkbench` shell with top bar, left repo rail, center workbench area, and right Preview/Review inspector.
- Applied Agent Studio design tokens in `src/app/globals.css` and kept the visual style neutral, compact, and workbench-like.
- Preserved BMad planning artifacts and did not add API routes, auth, database, GitHub integration, filesystem access, or future MVP behavior logic.
- Formal unit/E2E test harness is intentionally deferred to Story 1.2 per story Testing Requirements; this story was verified with lint, typecheck, production build, dev server startup, route render smoke check, and boundary scans.

### File List

- `.gitignore`
- `.prettierignore`
- `.prettierrc`
- `AGENTS.md`
- `README.md`
- `components.json`
- `eslint.config.mjs`
- `next-env.d.ts`
- `next.config.ts`
- `package.json`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`
- `postcss.config.mjs`
- `public/.gitkeep`
- `src/app/favicon.ico`
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/components/.gitkeep`
- `src/components/ui/button.tsx`
- `src/components/workbench/agent-studio-workbench.tsx`
- `src/hooks/.gitkeep`
- `src/lib/.gitkeep`
- `src/lib/utils.ts`
- `tsconfig.json`
- `_bmad-output/implementation-artifacts/1-1-set-up-initial-project-from-starter-template.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Change Log

- 2026-06-09: Implemented Story 1.1 foundation shell and moved story to review.
- 2026-06-09: Applied code review patches and moved story to done.
