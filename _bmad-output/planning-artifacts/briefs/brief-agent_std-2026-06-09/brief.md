---
title: "Product Brief: Agent Studio"
status: draft
created: 2026-06-09
updated: 2026-06-09
---

# Product Brief: Agent Studio

## Executive Summary

Agent Studio is a web UI for making agent behavior reviewable, portable, and consistent across coding tools. The MVP is deliberately narrow: a demo workspace for a sample React/Next.js repo that imports scattered agent instructions, generates a Git-native `.agent-studio/playbook.yaml`, lets the user edit Playbook rules, previews translated outputs for Claude Code, Cursor, and Windsurf, and exports a reviewable patch.

The product starts from a simple belief: if agents are influencing how code gets written, their instructions should be reviewed like code. Today, AI-forward teams often keep agent behavior across `CLAUDE.md`, `.cursorrules`, skills folders, prompt files, and tool-specific settings. Those files are useful, but they become hard to compare, share, review, and keep consistent across a team.

Agent Studio introduces an Agent Playbook as the canonical source of truth. In the MVP, that Playbook lives in Git, not only in a SaaS database. The web app acts as a structured editor, translator, live preview, validator, and patch generator for that repo-owned Playbook.

## The Problem

AI coding tools are moving faster than team governance. Developers increasingly use Claude Code, Cursor, Windsurf, GitHub Copilot, and similar tools in parallel. Each tool has its own way to express project memory, rules, skills, or persistent instructions. Official docs already show this fragmentation: Claude Code uses project memory such as `CLAUDE.md` and supports team-defined skills under `.claude/skills/<name>/SKILL.md`; Cursor has project rules and still supports `.cursorrules` while moving toward `.cursor/rules`; Windsurf supports rules under `.windsurf/rules/` or repo-level `AGENTS.md` for durable shared guidance.

For a solo developer, direct file editing may be enough. For a team lead or DevEx/platform engineer, the problem is loss of control:

- Agent instructions are scattered across multiple files and tools.
- Behavior changes can affect real code output without an explicit review moment.
- Team members may use different rules for the same repo.
- Native config files are easy to edit directly, which creates drift.
- There is no clear way to preview how one behavior rule appears across tools.

The result is not just messy configuration. It is invisible operational behavior shaping team code without the review discipline teams already apply to source code, infrastructure, dependencies, and CI.

## The Solution

Agent Studio creates a Git-native Agent Playbook for a repo:

```text
.agent-studio/playbook.yaml
```

The Playbook captures the repo's agent behavior in a canonical structure:

- Skills
- Agents
- Rules
- Context
- Tool Translators

The MVP focuses on one tight loop:

1. Load a controlled React/Next.js sample repo.
2. Detect existing scattered configs such as `CLAUDE.md`, `.cursorrules`, `.claude/skills/*`, and docs.
3. Generate a draft `.agent-studio/playbook.yaml`.
4. Let the user edit Playbook rules.
5. Preview how the same Playbook renders for Claude Code, Cursor, and Windsurf.
6. Show a plan and simplified behavior diff.
7. Export a patch or generated files for review.

The central product moment is Cross-Tool Preview: one canonical Playbook becomes native-looking outputs for several coding tools. This is what separates Agent Studio from a prompt library or a prettier config editor.

## What Makes This Different

Agent Studio is not positioned as a generic prompt library. The differentiator is reviewable translation from a canonical, Git-owned Playbook into tool-specific outputs.

Key distinctions:

- **Reviewability first:** "Review agent behavior changes like code" is the primary message.
- **Git-native trust:** The canonical Playbook lives in the repo, so teams keep Git history, PR review, portability, and direct editing escape hatches.
- **Translator, not exporter:** Tool Translators map Playbook semantics into native Claude Code, Cursor, and Windsurf outputs. Export/download is an action after preview.
- **Projects-first mental model:** The product starts from "this repo uses this Playbook," not "browse a library of prompts."
- **Scope discipline:** The MVP does not attempt workflow orchestration, governance, marketplace, OAuth, or live GitHub PR creation.

## Who This Serves

**Primary persona: AI-forward tech lead.**  
They are accountable for code quality while their team increasingly uses multiple AI coding tools. They want agent behavior to be visible, consistent, and reviewable without forcing every developer into the same editor.

**Secondary persona: DevEx or platform engineer.**  
They want a repeatable way to standardize agent setup across repos, but they do not yet need a full enterprise control plane.

**Tertiary persona: power user or consultant.**  
They maintain reusable agent instructions across projects or clients and want a path to package, preview, and share them later.

## MVP Scope

### In Scope

- Controlled sample React/Next.js demo workspace.
- Fixed sample repo with `CLAUDE.md`, `.cursorrules`, `.claude/skills/*`, and docs context.
- Config scanner for the fixed sample structure.
- Draft `.agent-studio/playbook.yaml` generation.
- Playbook viewer/editor with rules editable first.
- Imported skills, agents, and context displayed read-only or lightly editable.
- Claude Code, Cursor, and Windsurf preview panels.
- Compatibility notes for tool translation differences.
- Plan view showing file changes.
- Template-based behavior diff.
- Downloadable patch or generated files.

### Out of Scope

- Arbitrary local repo support.
- GitHub OAuth, GitHub App, or actual PR creation.
- Workflow orchestration between agents.
- Marketplace, ratings, reviews, or paid packages.
- Multi-org dashboard.
- Full permissions, audit, rollback, policy, or governance.
- AI semantic behavior analysis.
- Real-time collaboration.
- Runtime observability, usage analytics, or cost dashboard.
- Full CRUD for every Playbook section.

## MVP Demo Narrative

Hero message:

```text
Your agents are writing code.
Who's reviewing their instructions?
```

Demo flow:

1. Agent Studio loads a sample Next.js repo and finds scattered Claude/Cursor agent config.
2. The user creates a draft Agent Playbook from discovered files.
3. The user adds one rule: "All UI components must include loading, error, and empty states when applicable."
4. The preview updates across Claude Code, Cursor, and Windsurf outputs.
5. The plan shows canonical and generated file changes.
6. The behavior diff summarizes the agent behavior change.
7. The user downloads a reviewable patch.

## Success Criteria

Early success should be validated qualitatively before investing in integrations.

- Users understand the Playbook as the source of truth within 2 minutes of the demo.
- Users can explain why Cross-Tool Preview is different from a prompt library.
- At least 5 target users say they would prefer reviewing Playbook changes through Git/patch/PR over manually comparing native config files. [ASSUMPTION]
- At least 3 target users identify an existing repo where their team has scattered agent instructions today. [ASSUMPTION]
- The sample demo can complete the full loop in under 5 minutes without manual setup.
- Generated output differences are visible enough that users do not perceive the Translator as simple copy-paste. [ASSUMPTION]

## Validation Priorities

1. **Canonical trust:** Will users edit Playbook first, or do they still prefer native config files?
2. **Fragmentation pain:** How many teams actually maintain agent behavior across multiple files/tools today?
3. **Translator value:** Are Claude/Cursor/Windsurf output differences meaningful enough to justify a canonical layer?
4. **Review workflow:** Do users prefer patch/download first, or is actual GitHub PR creation needed immediately?
5. **Import quality:** Is a rough structured draft enough if uncertain items are marked for review?

## Vision

If the MVP validates, Agent Studio can grow from a reviewable Playbook editor into a broader control plane with design-system UX for agentic development.

The expansion path should add one complexity layer at a time:

- **v1:** Git-native Playbooks, translators, preview, behavior diff, patch export.
- **v1.1:** Local repo support and actual GitHub PR creation.
- **v2:** Workflows for multi-agent orchestration.
- **v3:** Governance with approval, audit, rollback, policy, and org indexing.
- **v4:** Playbook library and marketplace for reusable team/community packages.

The long-term product is not just a place to store prompts. It is the system where teams define, review, translate, and eventually govern how agents behave across their development environment.

## Source Notes

- Brainstorm input: `_bmad-output/brainstorming/brainstorming-session-2026-06-09-091832.md`
- Claude Code grounding: Claude Help Center notes project memory through `CLAUDE.md` and team-defined skills in `.claude/skills/<name>/SKILL.md`.
- Cursor grounding: Cursor docs describe project rules and note `.cursorrules` is still supported but will be deprecated.
- Windsurf grounding: Windsurf docs describe durable shared rules under `.windsurf/rules/` or repo-level `AGENTS.md`.
