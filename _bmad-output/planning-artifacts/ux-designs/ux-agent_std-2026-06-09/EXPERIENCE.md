---
name: Agent Studio
status: draft
sources:
  - ../../prds/prd-agent_std-2026-06-09/prd.md
updated: 2026-06-09
---

# Agent Studio — Experience Spine

## Foundation

Agent Studio MVP is a single-surface responsive web app for a controlled demo workspace. The primary surface is desktop/laptop. Mobile and tablet layouts are supported for inspection but are not the ideal demo environment.

[ASSUMPTION] The UI system is shadcn/ui on Next.js + Tailwind. `DESIGN.md` is the visual identity reference and names the product-layer tokens. This spine owns information architecture, behavior, states, interactions, accessibility, and journeys.

The UX must protect the MVP scope: no arbitrary repo connection, no GitHub OAuth, no live PR creation, no marketplace, no workflows, and no governance console.

## Information Architecture

| Surface | Reached from | Purpose | MVP status |
|---|---|---|---|
| Demo Workspace | App open | Projects-first entry for the Sample Repo | Required |
| Playbook Workbench | Demo Workspace / Create Playbook | Main surface for Playbook structure, Rules editing, Tool Translator preview, Plan, Behavior Diff, and Patch Export | Required |
| Preview Inspector | Right panel inside Playbook Workbench | Cross-Tool Preview for Claude Code, Cursor, and Windsurf | Required |
| Review Inspector | Right panel tab inside Playbook Workbench | Plan, Behavior Diff, export actions | Required |
| Export Result | Toast or inline confirmation after export | Confirms patch/generated files are ready | Required |
| Settings / Tools | Not primary nav | Tool connection settings | Out of scope |
| Playbook Library | Not primary nav | Reuse and templates | Out of scope |

### Primary Workbench Layout

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ Top bar: Agent Studio / Sample Repo / status / Export Patch                 │
├───────────────┬───────────────────────────────────────┬─────────────────────┤
│ Repo rail      │ Playbook editor                       │ Preview / Review    │
│ - detected     │ - Playbook summary                    │ - Tool tabs         │
│ - playbook     │ - Rules editor                        │ - generated output  │
│ - sections     │ - read-only Skills/Agents/Context     │ - Plan / Diff       │
└───────────────┴───────────────────────────────────────┴─────────────────────┘
```

The workbench is the product. Avoid routing users through setup wizards after the first Create Playbook action; the demo should move directly into the review loop.

## Voice and Tone

Microcopy should be direct, factual, and review-oriented. Brand voice lives in `DESIGN.md`.

| Use | Avoid |
|---|---|
| "Detected 5 agent instruction files." | "We found some magic for you." |
| "Create Agent Playbook" | "Let's get started!" |
| "Generated from `.agent-studio/playbook.yaml`." | "Auto-generated content." |
| "Cursor output flattens this skill guidance into project rules." | "Cursor may behave differently." |
| "Download reviewable patch" | "Sync changes" |
| "Rules are editable in this MVP. Skills and Context are imported read-only." | Letting users infer unavailable editing features |

## Component Patterns

| Component | Use | Behavioral rules |
|---|---|---|
| Repo rail | Left panel | Shows Sample Repo, detected files, Playbook sections, and import status. Selecting a section scrolls or focuses the center editor. |
| Detected file row | Repo rail | Shows file path, type, and imported/detected status. Read-only in MVP. |
| Playbook section list | Repo rail / center | Uses exact Glossary names. Rules is marked editable; Skills, Agents, Context are marked imported. |
| Rules editor | Center panel | Add/edit/remove Rule rows. Empty rules cannot save. Changes update previews immediately. |
| Read-only imported section | Center panel | Shows imported Skills, Agents, Context with source path and a disabled or "MVP read-only" affordance. |
| Tool Translator tabs | Preview Inspector | Tabs: Claude Code, Cursor, Windsurf. Switching tabs preserves editor state. |
| Code panel | Preview Inspector | Displays generated output with copy action. Uses `{components.code-panel}`. |
| Compatibility note | Preview Inspector | Inline warning explaining adapted/flattened output. Uses `{components.warning-note}`. |
| Plan list | Review Inspector | Lists added/modified generated files with path and status. |
| Behavior Diff | Review Inspector | Template-based summaries for Rule changes; no AI semantic claims. |
| Export controls | Review Inspector / top bar | Primary action is Download Patch. Secondary action is Download Generated Files. |

## State Patterns

| State | Surface | Treatment |
|---|---|---|
| Initial load | Demo Workspace | Sample Repo card appears already available. Primary action: Create Agent Playbook. |
| No Playbook yet | Demo Workspace | Show detected files and explanation that Agent Studio can create `.agent-studio/playbook.yaml`. |
| Playbook generated | Playbook Workbench | Center editor opens with Rules visible. Preview Inspector defaults to Claude Code tab. |
| Rule edit valid | Rules editor | Save/apply state is immediate; previews, Plan, and Behavior Diff update. |
| Rule edit empty | Rules editor | Inline validation: "Rule cannot be empty." Export disabled until resolved. |
| Compatibility warning | Preview Inspector | Inline note near affected generated output. Does not block export. |
| Export ready | Review Inspector | Download Patch enabled once Playbook exists and current rule edits are valid. |
| Export success | Global / Review Inspector | Toast or inline confirmation: "Patch ready for review." |
| Export failure | Global / Review Inspector | Destructive toast with retry action; keep user edits intact. |
| Mobile viewport | All | Single-column stack with sticky surface switcher: Playbook, Preview, Review. |

## Interaction Primitives

- **Tabs:** Use for Tool Translator previews and for Preview / Review inspector mode.
- **Segmented controls:** Use only where a compact binary or small set switch is needed, such as Preview vs Review.
- **Buttons:** Use icon+label for primary commands: Create Agent Playbook, Add Rule, Download Patch.
- **Badges:** Use for Imported, Editable, Generated, Modified, Added, Warning.
- **Keyboard:** Tab order follows left rail -> center editor -> right inspector -> top actions.
- **Copy actions:** Every code panel has a copy button. Copy action gives short confirmation.
- **No drag interactions:** Reordering Rules is out of scope unless added explicitly later.
- **No hover-only controls:** Any row action visible on hover must also be reachable by keyboard and touch.

## Accessibility Floor

- WCAG 2.2 AA minimum for all interactive controls and preview text.
- Code panels must remain readable at 12px or larger.
- Preview tab changes announce the selected tool.
- Behavior Diff additions/removals must not rely on color alone; use `+`, `-`, and labels.
- Inline validation must associate error text with the affected Rule input.
- Export success/failure toasts must be announced through an aria-live region.
- Keyboard users can complete the full flow from Create Playbook to Download Patch.
- Focus rings use the inherited ring token and must remain visible on code panels, tabs, buttons, and Rule inputs.

## Responsive & Platform

| Breakpoint | Behavior |
|---|---|
| `>= 1200px` | Full 3-panel workbench. Repo rail fixed at `{spacing.rail}`; inspector fixed near `{spacing.inspector}`. |
| `900px - 1199px` | Repo rail collapses to icon/section rail; center and inspector remain side by side. |
| `< 900px` | Single-column stack with sticky tabs for Playbook, Preview, Review. |
| `< 640px` | Mobile inspection mode. Code panels wrap; long file paths truncate with accessible title text. |

Agent Studio MVP is responsive web, not native mobile. The demo should be presented on desktop/laptop.

## Product-Specific UX Concerns

### Reviewability

Reviewability is the climax of the experience. The user must always understand:

- What the canonical Playbook contains.
- Which Rule changed.
- Which generated files are affected.
- How each Tool Translator renders the same behavior.
- What can be downloaded for review.

### Scope Disclosure

The UI should explicitly disclose MVP limits at the point of need:

- Skills, Agents, and Context are imported/read-only in MVP.
- Patch Export does not create a GitHub PR.
- Sample Repo is controlled demo data.
- Compatibility notes explain translation limitations honestly.

### Source-of-Truth Trust

The UI must consistently reinforce that `.agent-studio/playbook.yaml` is canonical. Generated native config files are outputs, not sources of truth.

## Key Flows

### Flow 1 — Taylor creates a Playbook from the Sample Repo

1. Taylor opens Agent Studio on a desktop browser.
2. The Demo Workspace shows `sample-nextjs-repo` with detected files: `CLAUDE.md`, `.cursorrules`, `.claude/skills/*`, and docs.
3. Taylor clicks **Create Agent Playbook**.
4. The Playbook Workbench opens. The center panel shows `.agent-studio/playbook.yaml` summary with Rules selected.
5. **Climax:** Taylor sees that scattered files have become one Agent Playbook, while detected Skills, Agents, and Context remain traceable to source paths.
6. Taylor continues to Rule editing.

Failure: if Playbook generation fails, the workspace shows a destructive inline error and keeps detected file state visible for retry.

### Flow 2 — Taylor edits a Rule and checks Cross-Tool Preview

1. Taylor adds the Rule: "All UI components must include loading, error, and empty states when applicable."
2. The Rule row validates immediately.
3. The Claude Code preview updates.
4. Taylor switches to Cursor and Windsurf tabs.
5. Compatibility notes explain any flattened or adapted output.
6. **Climax:** Taylor sees the same canonical Rule render into different native-looking tool outputs and understands Agent Studio is a Tool Translator, not a prompt library.

Failure: if the Rule is emptied, the input shows "Rule cannot be empty," preview updates pause for that row, and export is disabled.

### Flow 3 — Taylor reviews the Plan, Behavior Diff, and exports changes

1. Taylor opens the Review tab.
2. The Plan lists `.agent-studio/playbook.yaml`, Claude Code output, Cursor output, and Windsurf output with added/modified status.
3. The Behavior Diff summarizes the Rule addition.
4. Taylor clicks **Download Patch**.
5. **Climax:** Taylor receives a reviewable patch without granting GitHub access.
6. The UI confirms "Patch ready for review."

Failure: if patch generation fails, Taylor sees a retryable export error and does not lose Rule edits.

## Mock Coverage

The MVP can be specified from spines alone for architecture and story creation. One key-screen mock is recommended for implementation alignment:

- Playbook Workbench desktop: repo rail, Rules editor, Cross-Tool Preview, Review tab affordances.

[NOTE FOR UX] Additional mobile mock is not required unless implementation begins with responsive polish.

## Open Questions

1. Should the visual system explicitly use shadcn/ui, or should DESIGN.md remain framework-neutral?
2. Should Cursor preview foreground `.cursor/rules` while showing `.cursorrules` as legacy compatibility?
3. Should Download Generated Files be equal weight to Download Patch, or clearly secondary?
4. Should the initial Demo Workspace be a separate surface, or should the app open directly into Playbook Workbench with an empty/pre-create state?

## Assumptions Index

- Foundation — shadcn/ui on Next.js + Tailwind is the assumed UI system.
- DESIGN.md Brand & Style — conservative dev-tool visual identity is assumed acceptable.
- Responsive & Platform — desktop/laptop is the primary demo viewport.
