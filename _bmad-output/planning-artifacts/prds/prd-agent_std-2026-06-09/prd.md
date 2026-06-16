---
title: "PRD: Agent Studio MVP"
status: draft
created: 2026-06-09
updated: 2026-06-09
---

# PRD: Agent Studio MVP

## 0. Document Purpose

This PRD defines the first Agent Studio MVP: a narrow, demo-ready web experience that proves reviewable, Git-native, cross-tool agent behavior using a controlled React/Next.js sample repo. It is for product, UX, architecture, and story-planning workflows. Requirements are grouped by feature with stable FR IDs. Technical details, schemas, and parked expansion ideas live in `addendum.md`.

## 1. Vision

Agent Studio helps teams review agent behavior changes like code. The MVP turns scattered agent instructions from a sample repo into one Git-native Agent Playbook, then translates that Playbook into native-looking outputs for Claude Code, Cursor, and Windsurf.

The product exists because agents increasingly influence how code is written, but their instructions are often scattered across tool-specific files such as `CLAUDE.md`, `.cursorrules`, skills folders, and rules directories. Teams already review source code, infrastructure, dependencies, and CI changes. Agent Studio brings that same review discipline to agent behavior.

The MVP is intentionally constrained. It does not connect arbitrary repos or create live GitHub PRs. It proves the core loop first: import a sample repo, generate `.agent-studio/playbook.yaml`, edit Playbook rules, preview translated outputs, show a plan and behavior summary, and export reviewable changes.

## 2. Target User

### 2.1 Jobs To Be Done

- When my team uses multiple AI coding tools, I want one reviewable source of truth for repo-level agent behavior so that agent instructions do not drift across tools and machines.
- When agent rules change, I want to see what behavior changed and what files will be affected before those changes are applied.
- When I evaluate Agent Studio, I want a fast demo that proves the value without granting repo permissions or installing tooling.
- When I standardize a repo, I want to import existing instructions instead of rebuilding everything from a blank canvas.

### 2.2 Primary User

The primary user for v1 is an AI-forward tech lead evaluating whether Agent Studio can restore control over team agent behavior. They care about reviewability, consistency, and cross-tool portability, but they do not need enterprise governance in the first demo.

### 2.3 Non-Users for MVP

- Solo developers who are comfortable editing one native config file directly and do not care about reviewability.
- Enterprise admins seeking org-wide policy, audit, rollback, or SSO.
- Marketplace creators selling reusable agent packages.
- Teams needing multi-agent workflow orchestration.

### 2.4 Key User Journeys

- **UJ-1. Taylor reviews agent behavior for a sample repo.**  
  Taylor, an AI-forward tech lead, opens Agent Studio and chooses the sample React/Next.js repo. The app detects `CLAUDE.md`, `.cursorrules`, `.claude/skills/*`, and docs. Taylor creates a draft Agent Playbook, sees imported rules and skills, adds one UI behavior rule, previews Claude/Cursor/Windsurf outputs, reviews the plan and behavior summary, and downloads a patch. The value lands when Taylor sees one canonical Playbook produce reviewable, tool-specific changes.

- **UJ-2. Taylor checks whether Cross-Tool Preview is real value.**  
  Taylor edits the rule "All UI components must include loading, error, and empty states when applicable." Agent Studio updates the Claude Code, Cursor, and Windsurf previews side by side. Taylor sees compatibility notes where a tool flattens or adapts concepts. The value lands when the previews are meaningfully different enough to show this is not copy-paste.

- **UJ-3. Taylor validates reviewability without GitHub integration.**  
  Taylor opens the Plan and Behavior Diff. The Plan lists `.agent-studio/playbook.yaml` and generated tool files that would change. The Behavior Diff summarizes the behavior impact in plain language. Taylor downloads a patch or generated files and understands how these changes could be reviewed in Git later.

## 3. Glossary

- **Agent Studio** — The web app that imports sample repo agent instructions, generates an Agent Playbook, previews Tool Translator outputs, and exports reviewable changes.
- **Sample Repo** — The controlled React/Next.js demo repository bundled with the MVP.
- **Agent Playbook** — The canonical Git-native source of truth for repo-level agent behavior, represented as `.agent-studio/playbook.yaml`.
- **Skill** — A reusable instruction asset imported from the Sample Repo, such as `.claude/skills/code-review.md`.
- **Agent** — A named role or behavior profile in the Agent Playbook, such as `frontend-dev` or `pr-reviewer`.
- **Rule** — A behavior instruction in the Agent Playbook. Rules are the only fully editable Playbook section in the MVP.
- **Context** — Project documentation references imported into the Agent Playbook, such as `docs/architecture.md`.
- **Tool Translator** — A renderer that turns the Agent Playbook into tool-specific output for Claude Code, Cursor, or Windsurf.
- **Cross-Tool Preview** — The side-by-side UI showing generated outputs from multiple Tool Translators.
- **Plan** — A preview of canonical and generated file changes.
- **Behavior Diff** — A template-based summary of behavior changes caused by Playbook edits.
- **Patch Export** — A downloadable artifact containing generated changes for review.

## 4. Features

### 4.1 Sample Repo Demo Workspace

**Description:** Agent Studio opens with a Projects-first demo workspace centered on one bundled React/Next.js Sample Repo. The workspace avoids arbitrary filesystem complexity while letting users experience the full value loop. Realizes UJ-1.

**Functional Requirements:**

#### FR-1: Load Sample Repo

Agent Studio can load a controlled React/Next.js Sample Repo from bundled data.

**Consequences:**
- The Sample Repo includes representative `CLAUDE.md`, `.cursorrules`, `.claude/skills/code-review.md`, `.claude/skills/test-writer.md`, `docs/architecture.md`, `docs/conventions.md`, and `docs/glossary.md`.
- The workspace displays the Sample Repo name and detected source files.
- No user filesystem permissions are required.

#### FR-2: Projects-First Workspace

Agent Studio presents the Sample Repo as the primary workspace object.

**Consequences:**
- The primary page communicates "this repo uses this Playbook" rather than "browse a prompt library."
- The page exposes Playbook status, detected files, and available actions.
- Playbook Library, marketplace, and tools settings are not primary navigation in MVP.

### 4.2 Config Scanner and Playbook Draft

**Description:** Agent Studio scans the fixed Sample Repo structure and creates a draft Agent Playbook. The scanner does not need to handle arbitrary repo layouts in v1. Realizes UJ-1.

**Functional Requirements:**

#### FR-3: Detect Existing Agent Configs

Agent Studio detects known agent instruction artifacts in the Sample Repo.

**Consequences:**
- The scanner identifies `CLAUDE.md`.
- The scanner identifies `.cursorrules`.
- The scanner identifies files under `.claude/skills/`.
- The scanner identifies configured docs under `docs/`.
- Unknown files are ignored in MVP.

#### FR-4: Generate Draft Agent Playbook

Agent Studio generates a draft `.agent-studio/playbook.yaml` from detected Sample Repo artifacts.

**Consequences:**
- The draft includes Playbook name, version, repo, description, skills, agents, rules, context, and enabled Tool Translators.
- Imported items are traceable to source files where possible.
- The generated draft can be previewed in the UI before export.
- The draft is deterministic for the bundled Sample Repo.

#### FR-5: Mark Imported Content State

Agent Studio distinguishes imported content from user-edited content.

**Consequences:**
- Imported skills, agents, and context are labeled as imported.
- User-added rules are labeled or visually distinguishable from imported rules.
- The Plan can show whether a change comes from draft generation or user edit.

### 4.3 Agent Playbook Viewer and Rules Editor

**Description:** Agent Studio shows the Agent Playbook in a structured UI. Rules are fully editable in MVP; skills, agents, and context are displayed read-only or lightly editable. Realizes UJ-1 and UJ-2.

**Functional Requirements:**

#### FR-6: View Playbook Sections

Agent Studio displays the Agent Playbook sections: Skills, Agents, Rules, Context, and Tool Translators.

**Consequences:**
- Users can inspect imported skills.
- Users can inspect imported agents.
- Users can inspect imported context references.
- Users can inspect enabled Tool Translators.
- The UI uses the term "Tool Translator," not "Exporter," for the translation layer.

#### FR-7: Edit Rules

Agent Studio lets users add, edit, and remove Playbook Rules.

**Consequences:**
- Users can add the demo rule: "All UI components must include loading, error, and empty states when applicable."
- Rule edits update the Agent Playbook preview state.
- Empty rules cannot be saved.
- Rules are stored in the generated Agent Playbook structure.

#### FR-8: Restrict Full CRUD for Non-Rule Sections

Agent Studio does not provide full editing workflows for Skills, Agents, or Context in MVP.

**Consequences:**
- Skills, Agents, and Context can be read-only or minimally editable.
- The UI does not imply full lifecycle management for those sections.
- Users can still understand that those sections exist in the Agent Playbook.

### 4.4 Cross-Tool Preview

**Description:** Agent Studio translates the Agent Playbook into side-by-side outputs for Claude Code, Cursor, and Windsurf. Cross-Tool Preview is the central aha moment. Realizes UJ-2.

**Functional Requirements:**

#### FR-9: Render Claude Code Preview

Agent Studio renders a Claude Code output preview from the Agent Playbook.

**Consequences:**
- The preview includes representative `CLAUDE.md` content.
- The preview references imported skills where appropriate.
- The preview updates when Rules change.

#### FR-10: Render Cursor Preview

Agent Studio renders a Cursor output preview from the Agent Playbook.

**Consequences:**
- The preview includes representative Cursor rules output.
- The preview can show legacy `.cursorrules` compatibility output for the sample. [ASSUMPTION]
- The preview updates when Rules change.

#### FR-11: Render Windsurf Preview

Agent Studio renders a Windsurf output preview from the Agent Playbook.

**Consequences:**
- The preview includes representative Windsurf rules output.
- The preview updates when Rules change.
- The preview can show a file path under `.windsurf/rules/` for generated output.

#### FR-12: Show Compatibility Notes

Agent Studio shows lightweight compatibility notes when a Tool Translator adapts or flattens Playbook concepts.

**Consequences:**
- Notes explain when a tool output cannot preserve a Playbook concept natively.
- Notes are informational and do not block export.
- Notes use plain language, for example: "Cursor output flattens this skill guidance into project rules."

### 4.5 Plan and Behavior Diff

**Description:** Agent Studio makes the consequences of Playbook edits visible before export. The Plan shows file-level changes; the Behavior Diff summarizes behavior impact. Realizes UJ-3.

**Functional Requirements:**

#### FR-13: Generate Plan

Agent Studio generates a Plan for the current Playbook state.

**Consequences:**
- The Plan lists `.agent-studio/playbook.yaml` as a canonical generated file.
- The Plan lists generated or updated Claude Code output.
- The Plan lists generated or updated Cursor output.
- The Plan lists generated or updated Windsurf output.
- The Plan distinguishes added files from modified files.

#### FR-14: Generate Template-Based Behavior Diff

Agent Studio generates a template-based Behavior Diff for Rule changes.

**Consequences:**
- Added rules produce a summary such as `+ Agents must follow: "{rule}"`.
- Removed rules produce a summary such as `- Agents no longer must follow: "{rule}"`.
- Edited rules show old and new rule text where available.
- The Behavior Diff does not claim full AI semantic analysis.

#### FR-15: Keep Plan and Behavior Diff Synchronized

Agent Studio updates Plan and Behavior Diff when the user changes Rules.

**Consequences:**
- Adding a rule updates the relevant generated output previews.
- Adding a rule updates the Plan.
- Adding a rule updates the Behavior Diff.
- The full update should feel immediate for the bundled Sample Repo.

### 4.6 Patch Export

**Description:** Agent Studio exports generated changes for review without requiring GitHub OAuth or live PR creation. Realizes UJ-3.

**Functional Requirements:**

#### FR-16: Export Generated Files

Agent Studio can export generated files from the current Playbook state.

**Consequences:**
- The export includes `.agent-studio/playbook.yaml`.
- The export includes generated Claude Code output.
- The export includes generated Cursor output.
- The export includes generated Windsurf output.

#### FR-17: Export Reviewable Patch

Agent Studio can export a reviewable patch or equivalent diff artifact.

**Consequences:**
- The patch includes canonical Playbook changes.
- The patch includes generated tool output changes.
- The patch can be downloaded from the browser.
- The patch does not require GitHub authentication.

#### FR-18: Add Generated File Provenance

Generated tool output files include provenance text pointing to the Agent Playbook.

**Consequences:**
- Generated outputs include wording equivalent to "Generated from `.agent-studio/playbook.yaml`."
- Generated outputs discourage direct editing where appropriate.
- Provenance text is visible in preview and export.

## 5. Cross-Cutting NFRs

- **NFR-1: Demo reliability.** The sample demo flow from load to export should complete without manual setup.
- **NFR-2: Responsiveness.** Rule edits should update previews, Plan, and Behavior Diff within 500 ms for the bundled Sample Repo. [ASSUMPTION]
- **NFR-3: Accessibility.** The MVP web UI should support keyboard navigation for the primary flow and maintain readable contrast for preview panels.
- **NFR-4: Terminology consistency.** The UI and docs must use Agent Playbook, Tool Translator, Cross-Tool Preview, Plan, Behavior Diff, and Patch Export exactly as defined in the Glossary.
- **NFR-5: No repo write permissions.** MVP must not require GitHub OAuth, filesystem write permissions, or arbitrary repo access.
- **NFR-6: Deterministic generation.** Given the bundled Sample Repo and the same Rule set, generated Playbook and preview outputs should be deterministic.

## 6. Non-Goals

- Agent Studio is not a marketplace in MVP.
- Agent Studio is not a workflow automation engine in MVP.
- Agent Studio is not an enterprise governance console in MVP.
- Agent Studio is not a runtime observability product in MVP.
- Agent Studio is not a full replacement for native tool config editing in MVP.
- Agent Studio does not create live GitHub PRs in MVP.
- Agent Studio does not support arbitrary local repos in MVP.

## 7. MVP Scope

### 7.1 In Scope

- Controlled React/Next.js Sample Repo.
- Projects-first demo workspace.
- Fixed-structure config scanner.
- Draft Agent Playbook generation.
- Structured Playbook viewer.
- Full Rules editing.
- Read-only or lightly editable Skills, Agents, and Context.
- Claude Code, Cursor, and Windsurf Tool Translator previews.
- Compatibility notes.
- Plan generation.
- Template-based Behavior Diff.
- Generated files export.
- Reviewable patch export.

### 7.2 Out of Scope for MVP

- Arbitrary repo import.
- Local filesystem permissions and path handling.
- GitHub OAuth, GitHub App, branch management, or actual PR creation.
- Multi-user collaboration.
- Full Playbook Library.
- Templates marketplace.
- Workflow orchestration.
- Org-wide policy and audit.
- Rollback.
- Usage analytics and runtime telemetry.
- AI semantic analysis of behavior changes.

## 8. Success Metrics

**Primary**

- **SM-1: Demo comprehension.** At least 5 target users can explain that Agent Studio creates a Git-native Playbook as the source of truth after a 5-minute demo. Validates FR-4, FR-6, FR-13.
- **SM-2: Cross-Tool aha.** At least 5 target users can explain why Cross-Tool Preview is different from a prompt library. Validates FR-9, FR-10, FR-11, FR-12.
- **SM-3: Reviewability pull.** At least 5 target users say reviewing Playbook changes through a patch or PR would be preferable to manually comparing native config files. Validates FR-13, FR-14, FR-17. [ASSUMPTION]

**Secondary**

- **SM-4: Flow speed.** A first-time user can complete the sample flow from load to patch export in under 5 minutes. Validates FR-1 through FR-17.
- **SM-5: Scope discipline.** Demo feedback asks for local repo/GitHub PR support more often than unrelated features such as marketplace or workflow orchestration. Validates that MVP wedge is focused. [ASSUMPTION]

**Counter-metrics**

- **SM-C1: Do not optimize raw feature count.** Adding more editable Playbook sections is not success if it weakens the demo loop.
- **SM-C2: Do not optimize export automation before trust.** Live GitHub PR creation is not success until users validate Playbook trust and Cross-Tool Preview.

## 9. Constraints and Guardrails

- The MVP must remain sample-repo-first.
- The MVP must keep Rules as the only fully editable Playbook section.
- The MVP must not require users to connect a real GitHub account.
- The MVP must not claim governance, audit, rollback, or policy enforcement.
- The MVP must label unsupported or adapted translation behavior honestly.
- The MVP must not imply generated native config files are the canonical source of truth.

## 10. Open Questions

1. Will target users accept `.agent-studio/playbook.yaml` as the canonical source of truth if it lives in Git?
2. Are Claude Code, Cursor, and Windsurf output differences meaningful enough to make the Tool Translator feel valuable?
3. Should the first real integration after MVP be local repo support or GitHub PR creation?
4. What minimum import quality is enough for users to trust a draft Agent Playbook?
5. Which persona validates strongest first: AI-forward tech lead, DevEx/platform engineer, or power user/consultant?
6. Should Cursor output target `.cursor/rules` first with `.cursorrules` as legacy compatibility, or keep `.cursorrules` visible because users recognize it?

## 11. Assumptions Index

- §4.4 / FR-10 — Cursor preview may include `.cursorrules` compatibility output even though modern Cursor project rules live under `.cursor/rules`.
- §5 / NFR-2 — 500 ms preview update target is assumed feasible for the bundled Sample Repo.
- §8 / SM-3 — Target users will prefer reviewable patch/PR flow over manual native config comparison.
- §8 / SM-5 — Focused feedback will prefer local repo or PR support over marketplace/workflow expansion.

## 12. Source Inputs

- Product brief: `_bmad-output/planning-artifacts/briefs/brief-agent_std-2026-06-09/brief.md`
- Brief addendum: `_bmad-output/planning-artifacts/briefs/brief-agent_std-2026-06-09/addendum.md`
- Brainstorm session: `_bmad-output/brainstorming/brainstorming-session-2026-06-09-091832.md`
- Tool documentation grounding:
  - Anthropic Claude Code memory docs: https://code.claude.com/docs/en/memory
  - Cursor Rules docs: https://docs.cursor.com/context/rules
  - Windsurf AGENTS.md docs: https://docs.windsurf.com/windsurf/cascade/agents-md
