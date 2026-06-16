---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - "_bmad-output/planning-artifacts/briefs/brief-agent_std-2026-06-09/brief.md"
  - "_bmad-output/planning-artifacts/prds/prd-agent_std-2026-06-09/prd.md"
  - "_bmad-output/planning-artifacts/architecture.md"
  - "_bmad-output/planning-artifacts/ux-designs/ux-agent_std-2026-06-09/DESIGN.md"
  - "_bmad-output/planning-artifacts/ux-designs/ux-agent_std-2026-06-09/EXPERIENCE.md"
project_name: "agent_std"
workflowType: "epics-and-stories"
lastStep: 4
status: "complete"
completedAt: "2026-06-09"
updated: "2026-06-09"
---

# agent_std - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for agent_std, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR-1: Agent Studio can load a controlled React/Next.js Sample Repo from bundled data, including representative `CLAUDE.md`, `.cursorrules`, `.claude/skills/code-review.md`, `.claude/skills/test-writer.md`, `docs/architecture.md`, `docs/conventions.md`, and `docs/glossary.md`, without requiring user filesystem permissions.

FR-2: Agent Studio presents the Sample Repo as the primary workspace object, communicating "this repo uses this Playbook" and exposing Playbook status, detected files, and available actions without primary Playbook Library, marketplace, or tools settings navigation.

FR-3: Agent Studio detects known agent instruction artifacts in the Sample Repo, including `CLAUDE.md`, `.cursorrules`, `.claude/skills/*`, and configured docs under `docs/`, while ignoring unknown files in MVP.

FR-4: Agent Studio generates a deterministic draft `.agent-studio/playbook.yaml` from detected Sample Repo artifacts, including Playbook name, version, repo, description, skills, agents, rules, context, and enabled Tool Translators.

FR-5: Agent Studio distinguishes imported content from user-edited content, labeling imported skills, agents, and context and making user-added rules visually distinguishable so the Plan can show draft generation versus user edits.

FR-6: Agent Studio displays Agent Playbook sections for Skills, Agents, Rules, Context, and Tool Translators, using the term "Tool Translator" for the translation layer.

FR-7: Agent Studio lets users add, edit, and remove Playbook Rules; rule edits update preview state, empty rules cannot be saved, and rules are stored in the generated Agent Playbook structure.

FR-8: Agent Studio does not provide full editing workflows for Skills, Agents, or Context in MVP; these sections are read-only or minimally editable and must not imply full lifecycle management.

FR-9: Agent Studio renders a Claude Code output preview from the Agent Playbook, including representative `CLAUDE.md` content, imported skill references where appropriate, and updates when Rules change.

FR-10: Agent Studio renders a Cursor output preview from the Agent Playbook, including representative Cursor rules output, possible legacy `.cursorrules` compatibility output for the sample, and updates when Rules change.

FR-11: Agent Studio renders a Windsurf output preview from the Agent Playbook, including representative Windsurf rules output, a generated path under `.windsurf/rules/`, and updates when Rules change.

FR-12: Agent Studio shows lightweight compatibility notes when a Tool Translator adapts or flattens Playbook concepts; notes are informational, non-blocking, and written in plain language.

FR-13: Agent Studio generates a Plan for the current Playbook state listing `.agent-studio/playbook.yaml`, generated or updated Claude Code output, Cursor output, and Windsurf output, with added versus modified file status.

FR-14: Agent Studio generates a template-based Behavior Diff for Rule changes, showing added, removed, and edited rule summaries without claiming AI semantic analysis.

FR-15: Agent Studio keeps Plan and Behavior Diff synchronized with Rule changes so previews, Plan, and Behavior Diff update immediately for the bundled Sample Repo.

FR-16: Agent Studio exports generated files from the current Playbook state, including `.agent-studio/playbook.yaml`, Claude Code output, Cursor output, and Windsurf output.

FR-17: Agent Studio exports a reviewable patch or equivalent diff artifact containing canonical Playbook changes and generated tool output changes, downloadable from the browser without GitHub authentication.

FR-18: Generated tool output files include provenance text pointing to `.agent-studio/playbook.yaml`, discourage direct editing where appropriate, and show that provenance in both preview and export.

### NonFunctional Requirements

NFR-1: Demo reliability. The sample demo flow from load to export should complete without manual setup.

NFR-2: Responsiveness. Rule edits should update previews, Plan, and Behavior Diff within 500 ms for the bundled Sample Repo. [ASSUMPTION]

NFR-3: Accessibility. The MVP web UI should support keyboard navigation for the primary flow and maintain readable contrast for preview panels.

NFR-4: Terminology consistency. The UI and docs must use Agent Playbook, Tool Translator, Cross-Tool Preview, Plan, Behavior Diff, and Patch Export exactly as defined in the PRD glossary.

NFR-5: No repo write permissions. MVP must not require GitHub OAuth, filesystem write permissions, or arbitrary repo access.

NFR-6: Deterministic generation. Given the bundled Sample Repo and the same Rule set, generated Playbook and preview outputs should be deterministic.

### Additional Requirements

AR-1: Initialize the implementation from the shadcn/ui Next template with `pnpm dlx shadcn@latest init -t next`; this affects Epic 1 Story 1.

AR-2: Use Next.js App Router, React, TypeScript, Tailwind CSS, and shadcn/ui as the frontend foundation.

AR-3: Use pnpm as the package manager.

AR-4: Keep the MVP browser/client-heavy with no backend service, API routes, server actions, database, authentication, GitHub integration, or arbitrary filesystem access.

AR-5: Represent the Sample Repo as static fixture data inside the app, not as user-uploaded files or public static assets.

AR-6: Validate fixture input, generated Playbook state, rule edits, and export readiness using Zod schemas.

AR-7: Model `.agent-studio/playbook.yaml` as the canonical Agent Playbook and treat native tool files as generated outputs only.

AR-8: Keep Rules as the only fully editable Playbook section in MVP.

AR-9: Implement pure domain modules under `src/lib/sample-repo`, `src/lib/playbook`, `src/lib/translators`, `src/lib/review`, and `src/lib/export`.

AR-10: Keep React UI components under `src/components/workbench` thin around rendering, events, and accessibility; do not build generated output strings inline inside UI components.

AR-11: Implement isolated Tool Translator modules for Claude Code, Cursor, and Windsurf using a shared `ToolTranslator` contract.

AR-12: Ensure translators depend only on validated Agent Playbook input and do not mutate Playbook state or import each other.

AR-13: Use one top-level Workbench state owner and derive previews, Plan, Behavior Diff, and export artifacts from source Playbook state.

AR-14: Do not add Redux, Zustand, server-state libraries, persistence libraries, event buses, or service layers in MVP.

AR-15: Use typed Result/AppError patterns for recoverable domain failures, with error codes such as `rule-empty`, `playbook-invalid`, `export-failed`, and `translator-warning`.

AR-16: Generate all artifact paths with POSIX-style `/` separators.

AR-17: Implement browser-generated export artifacts, likely using JSZip, containing generated files and a reviewable patch/diff artifact.

AR-18: Keep exact patch artifact format as an implementation-level decision, but ensure it remains reviewable and downloadable without GitHub auth.

AR-19: Use memoized pure transformations where needed so translator outputs, Plan, Behavior Diff, and export readiness remain responsive.

AR-20: Add domain unit tests with Vitest for scanner, Playbook generation, rule validation/update, translators, Plan, Behavior Diff, and export.

AR-21: Add a Playwright E2E smoke test covering Sample Repo load, Playbook creation, demo Rule addition, preview updates, Plan/Behavior Diff updates, and export readiness.

AR-22: Configure minimum CI steps for typecheck, lint, unit tests, and optional Playwright smoke test.

AR-23: Implement deployment as a standard static/client-heavy Next.js app with no required secrets or environment variables.

AR-24: Prevent accidental MVP scope expansion by excluding local repo support, GitHub PR creation, backend APIs, auth, persistence, marketplace, workflows, governance, audit, and rollback.

AR-25: Preserve future seams for local repo support and GitHub PR creation behind explicit future boundaries, without building those boundaries now.

AR-26: Decide during implementation whether Cursor preview should foreground modern `.cursor/rules` while showing `.cursorrules` as legacy compatibility, or keep `.cursorrules` visible for recognizability.

AR-27: Keep generated output deterministic for the same fixture and Rule set; tests should verify important generated substrings and artifact paths.

AR-28: Do not introduce database tables, migrations, ORM models, persistence adapters, or storage abstractions.

### UX Design Requirements

UX-DR1: Implement a quiet, precise developer-tool visual identity using the DESIGN.md color tokens for background, foreground, surfaces, borders, primary teal, action blue, success, warning, destructive, info, and code surfaces.

UX-DR2: Implement typography tokens from DESIGN.md, including compact Inter/system UI text, functional headings, label styles, and code text using JetBrains Mono or system monospace at 12px or larger.

UX-DR3: Implement spacing and sizing tokens from DESIGN.md, including `gutter`, fixed desktop rail width near 280px, and inspector width near 420px.

UX-DR4: Use crisp tool-like radius values: small for inputs/controls, medium for buttons/cards, large for modal or sheet containers, and pill shapes only for status badges and tool labels.

UX-DR5: Use borders and tonal surfaces instead of heavy shadows; avoid decorative gradients, oversized hero sections, or illustrative cards inside the product.

UX-DR6: Build the MVP as a desktop-first 3-panel Playbook Workbench with left repo rail, center Playbook editor, and right Preview/Review inspector.

UX-DR7: Provide a top bar showing Agent Studio, Sample Repo context, status, and the primary Export Patch action.

UX-DR8: Implement a Demo Workspace or equivalent initial state with the Sample Repo already available and a primary Create Agent Playbook action.

UX-DR9: Implement a left Repo rail that shows the Sample Repo, detected files, Playbook sections, and import status.

UX-DR10: Implement Detected File rows that show file path, type, and imported/detected status and remain read-only in MVP.

UX-DR11: Implement a Playbook section list that uses exact glossary names and marks Rules as editable while Skills, Agents, and Context are imported/read-only.

UX-DR12: Implement a center Rules editor where users can add, edit, and remove Rule rows, with immediate validation and synchronized preview updates.

UX-DR13: Show inline validation "Rule cannot be empty." for empty Rule input, associate the error with the affected input, pause export readiness for invalid state, and keep user edits intact.

UX-DR14: Implement read-only imported sections for Skills, Agents, and Context that show source paths and an explicit MVP read-only affordance.

UX-DR15: Implement Preview/Review inspector mode using tabs or segmented controls and preserve editor state when switching modes.

UX-DR16: Implement Tool Translator tabs for Claude Code, Cursor, and Windsurf, with selected tab clearly indicated and tool tab changes announced for accessibility.

UX-DR17: Implement code panels for generated output previews with the code surface token, stable height where possible, readable 12px+ code text, line wrapping behavior, and a copy action.

UX-DR18: Provide copy actions for every code panel with short confirmation feedback.

UX-DR19: Show compatibility notes inline near the affected Tool Translator preview, using the warning note visual style and non-blocking behavior.

UX-DR20: Implement Review Inspector content with a Plan list, Behavior Diff, and export controls.

UX-DR21: Implement Plan rows that show added or modified status, file path, and generated/canonical meaning using badges and code-style file path presentation.

UX-DR22: Implement Behavior Diff rows using `+`, `-`, and labels in addition to color, with success styling for additions, destructive styling for removals, and warning styling for adapter warnings.

UX-DR23: Make Download Patch the primary export action and Download Generated Files secondary.

UX-DR24: Provide Export Success feedback as a toast or inline confirmation with the wording "Patch ready for review." or equivalent.

UX-DR25: Provide Export Failure feedback as a destructive toast or inline error with a retry path while preserving user edits.

UX-DR26: Use direct, review-oriented microcopy such as "Detected 5 agent instruction files.", "Create Agent Playbook", "Generated from `.agent-studio/playbook.yaml`.", and "Download reviewable patch".

UX-DR27: Explicitly disclose MVP limits at point of need: Sample Repo is controlled demo data, Skills/Agents/Context are read-only, Patch Export does not create a GitHub PR, and compatibility notes explain translation limitations.

UX-DR28: Reinforce source-of-truth trust by consistently presenting `.agent-studio/playbook.yaml` as canonical and generated native config files as outputs.

UX-DR29: Ensure keyboard users can complete the full flow from Create Agent Playbook to Download Patch, with tab order left rail, center editor, right inspector, and top actions.

UX-DR30: Maintain WCAG 2.2 AA minimum for interactive controls and preview text, visible focus rings, aria-live announcements for export success/failure, and non-color-only diff semantics.

UX-DR31: Support responsive behavior: full 3-panel workbench at `>= 1200px`, collapsed repo rail at `900px - 1199px`, single-column stack with sticky Playbook/Preview/Review switcher below `900px`, and mobile inspection mode below `640px`.

UX-DR32: Do not use drag interactions or hover-only controls; any row action visible on hover must be reachable by keyboard and touch.

UX-DR33: Align implementation to the key Playbook Workbench desktop mock at `_bmad-output/planning-artifacts/ux-designs/ux-agent_std-2026-06-09/mockups/playbook-workbench.html`.

UX-DR34: Keep Download Generated Files lower emphasis than Download Patch unless product explicitly changes the export hierarchy.

### FR Coverage Map

FR-1: Epic 1 - Load bundled Sample Repo.

FR-2: Epic 1 - Present Projects-first workspace.

FR-3: Epic 1 - Detect known agent configs.

FR-4: Epic 1 - Generate deterministic draft Agent Playbook.

FR-5: Epic 1 - Mark imported versus user-edited content.

FR-6: Epic 2 - Display Agent Playbook sections.

FR-7: Epic 2 - Add, edit, and remove Rules.

FR-8: Epic 2 - Restrict full CRUD for non-Rule sections.

FR-9: Epic 3 - Render Claude Code preview.

FR-10: Epic 3 - Render Cursor preview.

FR-11: Epic 3 - Render Windsurf preview.

FR-12: Epic 3 - Show compatibility notes.

FR-13: Epic 4 - Generate file-level Plan.

FR-14: Epic 4 - Generate template-based Behavior Diff.

FR-15: Epic 4 - Keep previews, Plan, and Behavior Diff synchronized.

FR-16: Epic 4 - Export generated files.

FR-17: Epic 4 - Export reviewable patch.

FR-18: Epic 4 - Add generated file provenance.

## Epic List

### Epic 1: Demo Workspace and Git-Native Playbook Foundation

User can open Agent Studio, see the Sample Repo as the primary workspace, detect scattered agent instruction files, and generate a canonical `.agent-studio/playbook.yaml`.

**FRs covered:** FR-1, FR-2, FR-3, FR-4, FR-5

### Epic 2: Playbook Workbench and Rules Editing

User can inspect the Agent Playbook in a structured workbench, understand imported Skills/Agents/Context, and add/edit/remove Rules as the only fully editable MVP behavior surface.

**FRs covered:** FR-6, FR-7, FR-8

### Epic 3: Cross-Tool Preview and Compatibility Notes

User can see the same Agent Playbook translated into Claude Code, Cursor, and Windsurf outputs, with honest compatibility notes where behavior is adapted or flattened.

**FRs covered:** FR-9, FR-10, FR-11, FR-12

### Epic 4: Review Plan, Behavior Diff, and Patch Export

User can review the file-level Plan, understand behavior changes through a template-based Behavior Diff, and download generated files or a reviewable patch with clear provenance.

**FRs covered:** FR-13, FR-14, FR-15, FR-16, FR-17, FR-18

## Epic 1: Demo Workspace and Git-Native Playbook Foundation

User can open Agent Studio, see the Sample Repo as the primary workspace, detect scattered agent instruction files, and generate a canonical `.agent-studio/playbook.yaml`.

### Story 1.1: Set Up Initial Project from Starter Template

**Requirements:** FR-1, FR-2

As a tech lead,
I want to open Agent Studio in a polished demo workspace,
So that I can evaluate the product without setup or repo permissions.

**Acceptance Criteria:**

**Given** the app is installed locally
**When** the developer runs the app
**Then** Agent Studio opens as a Next.js + shadcn/ui + Tailwind web app
**And** the implementation uses the architecture-approved starter path
**And** the UI applies the Agent Studio visual tokens, typography, spacing, and workbench shell
**And** no auth, backend API, database, GitHub integration, or filesystem permission flow is present.

### Story 1.2: Establish Test and CI Harness

**Requirements:** AR-20, AR-21, AR-22, NFR-1, NFR-6

As a tech lead,
I want the demo app to include automated test and CI foundations,
So that future implementation stories can verify deterministic behavior and demo reliability.

**Acceptance Criteria:**

**Given** the starter app has been initialized
**When** the test harness is configured
**Then** Vitest is available for domain unit tests
**And** Playwright is available for the sample-flow smoke test
**And** package scripts exist for typecheck, lint, unit tests, and E2E smoke testing
**And** CI runs typecheck, lint, and unit tests at minimum
**And** the initial test setup does not introduce backend, auth, database, GitHub, or filesystem integration scope.

### Story 1.3: Show Sample Repo as the Primary Workspace

**Requirements:** FR-1, FR-2

As a tech lead,
I want to see the bundled Sample Repo as the primary workspace,
So that I understand Agent Studio manages agent behavior per repo.

**Acceptance Criteria:**

**Given** Agent Studio loads
**When** the Demo Workspace is shown
**Then** the Sample Repo is visible as the primary workspace object
**And** the UI communicates repo-first context rather than Playbook Library navigation
**And** the workspace shows detected-file areas for `CLAUDE.md`, `.cursorrules`, `.claude/skills/*`, and docs
**And** Sample Repo copy clearly states the repo is controlled demo data
**And** no arbitrary repo connection or GitHub OAuth action is offered.

### Story 1.4: Detect Agent Instruction Files in the Sample Repo

**Requirements:** FR-3

As a tech lead,
I want Agent Studio to detect scattered agent instruction files,
So that I can see what will be consolidated into a Playbook.

**Acceptance Criteria:**

**Given** the bundled Sample Repo fixture exists
**When** Agent Studio scans the fixture
**Then** it detects `CLAUDE.md`
**And** it detects `.cursorrules`
**And** it detects files under `.claude/skills/`
**And** it detects configured docs under `docs/`
**And** unknown fixture files are ignored for MVP
**And** detected files are displayed with path, type, and detected/imported status.

### Story 1.5: Generate Draft Agent Playbook from Detected Files

**Requirements:** FR-4, FR-5

As a tech lead,
I want to generate a draft `.agent-studio/playbook.yaml` from detected files,
So that scattered instructions become one Git-native source of truth.

**Acceptance Criteria:**

**Given** detected Sample Repo artifacts are available
**When** the user clicks `Create Agent Playbook`
**Then** Agent Studio generates a deterministic draft Agent Playbook
**And** the Playbook includes name, version, repo, description, skills, agents, rules, context, and enabled Tool Translators
**And** imported items preserve source-file traceability where possible
**And** imported content is visually distinguishable from user-edited content
**And** `.agent-studio/playbook.yaml` is presented as canonical
**And** generated native config files are not presented as the source of truth.

## Epic 2: Playbook Workbench and Rules Editing

User can inspect the Agent Playbook in a structured workbench, understand imported Skills/Agents/Context, and add/edit/remove Rules as the only fully editable MVP behavior surface.

### Story 2.1: Display Agent Playbook Sections in the Workbench

**Requirements:** FR-6

As a tech lead,
I want to inspect the generated Agent Playbook by section,
So that I can understand what behavior was imported before editing it.

**Acceptance Criteria:**

**Given** a draft Agent Playbook has been generated
**When** the Playbook Workbench opens
**Then** the UI displays Skills, Agents, Rules, Context, and Tool Translators sections
**And** section labels use the exact PRD glossary terms
**And** Rules is marked as editable
**And** Skills, Agents, and Context are marked as imported/read-only
**And** Tool Translator is used instead of Exporter in the UI.

### Story 2.2: Show Imported Skills, Agents, and Context as Read-Only

**Requirements:** FR-8

As a tech lead,
I want to inspect imported Skills, Agents, and Context with source paths,
So that I trust the Playbook draft without expecting full CRUD in MVP.

**Acceptance Criteria:**

**Given** imported Playbook content exists
**When** the user views Skills, Agents, or Context
**Then** each imported item shows its name or label
**And** each imported item shows its source path where available
**And** the section includes an explicit MVP read-only affordance
**And** no add/edit/delete lifecycle controls are shown for these sections
**And** the UI does not imply marketplace, workflow, or governance capabilities.

### Story 2.3: Add, Edit, and Remove Playbook Rules

**Requirements:** FR-7

As a tech lead,
I want to add, edit, and remove Playbook Rules,
So that I can change repo-level agent behavior through the canonical Playbook.

**Acceptance Criteria:**

**Given** the Rules section is visible
**When** the user adds the rule `All UI components must include loading, error, and empty states when applicable.`
**Then** the rule appears in the Rules list
**And** the rule is stored in the Agent Playbook state
**And** the rule is visually distinguishable as user-edited content
**And** editing the rule updates the Playbook state
**And** removing the rule removes it from the Playbook state.

### Story 2.4: Validate Rule Editing and Preserve Accessible Interaction

**Requirements:** FR-7, FR-8

As a tech lead,
I want invalid rule edits to be blocked clearly,
So that the Playbook remains valid and reviewable.

**Acceptance Criteria:**

**Given** the user is editing a Rule
**When** the Rule text is empty or whitespace-only
**Then** the UI shows inline validation text `Rule cannot be empty.`
**And** the error text is associated with the affected input
**And** invalid Rules cannot be saved into export-ready Playbook state
**And** keyboard users can add, edit, remove, and recover from validation errors
**And** focus rings remain visible on Rule inputs and actions.

## Epic 3: Cross-Tool Preview and Compatibility Notes

User can see the same Agent Playbook translated into Claude Code, Cursor, and Windsurf outputs, with honest compatibility notes where behavior is adapted or flattened.

### Story 3.1: Implement Tool Translator Contract and Preview Shell

**Requirements:** FR-9, FR-10, FR-11, FR-12

As a tech lead,
I want Tool Translator previews to share a consistent structure,
So that I can compare Claude Code, Cursor, and Windsurf outputs from one Playbook.

**Acceptance Criteria:**

**Given** a valid Agent Playbook exists
**When** the Preview Inspector loads
**Then** the UI shows Tool Translator tabs for Claude Code, Cursor, and Windsurf
**And** switching tabs preserves Playbook and Rule editor state
**And** each translator returns generated artifacts and compatibility notes through a shared contract
**And** translators depend only on the validated Agent Playbook
**And** no translator mutates Playbook state or imports another translator.

### Story 3.2: Render Claude Code Preview

**Requirements:** FR-9

As a tech lead,
I want to preview the Claude Code output generated from the Playbook,
So that I can see how canonical behavior appears for Claude Code.

**Acceptance Criteria:**

**Given** a valid Agent Playbook exists
**When** the Claude Code tab is selected
**Then** the preview shows representative `CLAUDE.md` content
**And** the preview includes provenance text referencing `.agent-studio/playbook.yaml`
**And** imported skills are referenced where appropriate
**And** adding, editing, or removing a Rule updates the Claude Code preview
**And** generated content is displayed in a readable code panel with copy action.

### Story 3.3: Render Cursor Preview

**Requirements:** FR-10

As a tech lead,
I want to preview the Cursor output generated from the Playbook,
So that I can see how canonical behavior appears for Cursor.

**Acceptance Criteria:**

**Given** a valid Agent Playbook exists
**When** the Cursor tab is selected
**Then** the preview shows representative Cursor rules output
**And** the preview includes provenance text referencing `.agent-studio/playbook.yaml`
**And** the preview foregrounds modern `.cursor/rules` output
**And** the preview may include `.cursorrules` as a legacy compatibility artifact or note
**And** compatibility copy explains that `.cursorrules` is legacy compatibility while `.cursor/rules` is the primary MVP Cursor target
**And** adding, editing, or removing a Rule updates the Cursor preview
**And** generated content is displayed in a readable code panel with copy action.

### Story 3.4: Render Windsurf Preview

**Requirements:** FR-11

As a tech lead,
I want to preview the Windsurf output generated from the Playbook,
So that I can see how canonical behavior appears for Windsurf.

**Acceptance Criteria:**

**Given** a valid Agent Playbook exists
**When** the Windsurf tab is selected
**Then** the preview shows representative Windsurf rules output
**And** the preview includes a generated path under `.windsurf/rules/`
**And** the preview includes provenance text referencing `.agent-studio/playbook.yaml`
**And** adding, editing, or removing a Rule updates the Windsurf preview
**And** generated content is displayed in a readable code panel with copy action.

### Story 3.5: Show Compatibility Notes for Adapted Output

**Requirements:** FR-12

As a tech lead,
I want compatibility notes near translated output,
So that I understand where a tool adapts or flattens Playbook concepts.

**Acceptance Criteria:**

**Given** a Tool Translator adapts or flattens a Playbook concept
**When** the affected preview is displayed
**Then** Agent Studio shows an inline compatibility note near the affected generated output
**And** the note is informational and does not block export readiness
**And** the note uses plain language such as `Cursor output flattens this skill guidance into project rules.`
**And** the note uses warning styling without relying on color alone
**And** compatibility notes do not claim unsupported tool capabilities.

## Epic 4: Review Plan, Behavior Diff, and Patch Export

User can review the file-level Plan, understand behavior changes through a template-based Behavior Diff, and download generated files or a reviewable patch with clear provenance.

### Story 4.1: Generate File-Level Plan for Current Playbook

**Requirements:** FR-13

As a tech lead,
I want to see which files would be added or modified,
So that I can review agent behavior changes before applying them.

**Acceptance Criteria:**

**Given** a valid Agent Playbook and Tool Translator outputs exist
**When** the user opens the Review Inspector
**Then** Agent Studio shows a Plan listing `.agent-studio/playbook.yaml`
**And** the Plan lists generated Claude Code output
**And** the Plan lists generated Cursor output
**And** the Plan lists generated Windsurf output
**And** each Plan row distinguishes added versus modified status
**And** file paths use POSIX-style `/` separators.

### Story 4.2: Generate Template-Based Behavior Diff for Rule Changes

**Requirements:** FR-14

As a tech lead,
I want a plain-language summary of Rule behavior changes,
So that I can review the impact without reading every generated file.

**Acceptance Criteria:**

**Given** the user changes Rules from their initial imported state
**When** the Behavior Diff is displayed
**Then** added Rules produce summaries like `+ Agents must follow: "{rule}"`
**And** removed Rules produce summaries like `- Agents no longer must follow: "{rule}"`
**And** edited Rules show old and new Rule text where available
**And** Behavior Diff rows use `+`, `-`, and labels in addition to color
**And** the UI does not claim AI semantic analysis.

### Story 4.3: Keep Review Surfaces Synchronized with Rule Edits

**Requirements:** FR-15

As a tech lead,
I want previews, Plan, Behavior Diff, and export readiness to stay synchronized,
So that the review surface always reflects the current Playbook.

**Acceptance Criteria:**

**Given** the user adds, edits, removes, or invalidates a Rule
**When** the Playbook state changes
**Then** Tool Translator previews update from the current Playbook
**And** the Plan updates from the current Playbook and generated artifacts
**And** the Behavior Diff updates from previous versus current Rules
**And** export readiness is disabled when the current Rule state is invalid
**And** updates complete within the 500 ms target for the bundled Sample Repo.

### Story 4.4: Export Generated Files Bundle

**Requirements:** FR-16, FR-18

As a tech lead,
I want to download the generated files from the current Playbook,
So that I can inspect the canonical Playbook and native tool outputs outside the app.

**Acceptance Criteria:**

**Given** the current Playbook state is valid
**When** the user chooses Download Generated Files
**Then** the browser downloads an export bundle containing `.agent-studio/playbook.yaml`
**And** the bundle contains generated Claude Code output
**And** the bundle contains generated Cursor output
**And** the bundle contains generated Windsurf output
**And** generated native config files include provenance text referencing `.agent-studio/playbook.yaml`
**And** the export does not require GitHub authentication or filesystem write permissions.

### Story 4.5: Export Reviewable Patch

**Requirements:** FR-17, FR-18

As a tech lead,
I want to download a zip archive containing a unified diff patch,
So that agent behavior changes can be reviewed like code.

**Acceptance Criteria:**

**Given** the current Playbook state is valid
**When** the user clicks Download Patch
**Then** the browser downloads a zip archive for patch review
**And** the archive includes `agent-studio.patch` as a unified diff artifact
**And** `agent-studio.patch` includes canonical Playbook changes
**And** `agent-studio.patch` includes generated Claude Code, Cursor, and Windsurf output changes
**And** the archive also includes the generated files for direct inspection
**And** Download Patch is visually treated as the primary export action
**And** Download Generated Files is visually secondary
**And** no GitHub OAuth, branch, commit, or PR creation flow is required.

### Story 4.6: Handle Export Success and Failure Accessibly

**Requirements:** FR-16, FR-17

As a tech lead,
I want clear export feedback that preserves my work,
So that I know whether the review artifact is ready.

**Acceptance Criteria:**

**Given** the user triggers an export
**When** export succeeds
**Then** Agent Studio shows a toast or inline confirmation such as `Patch ready for review.`
**And** the confirmation is announced through an aria-live region
**When** export fails
**Then** Agent Studio shows a destructive toast or inline error with a retry path
**And** user Rule edits remain intact
**And** keyboard users can retry or return to editing without losing focus context.
