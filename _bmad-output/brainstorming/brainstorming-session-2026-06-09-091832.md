---
stepsCompleted: [1, 2]
inputDocuments: []
session_topic: 'Agent Studio: web UI for managing reusable skills, agents, project context, and integrations with agentic coding tools'
session_goals: 'Clarify product positioning and target users; identify differentiation versus markdown files, repo templates, prompt libraries, and manual config; define MVP scope and early aha moment'
selected_approach: 'progressive-flow'
techniques_used: ['Analogical Thinking', 'Mind Mapping', 'Six Thinking Hats', 'Resource Constraints']
ideas_generated: []
context_file: ''
---

# Brainstorming Session Results

**Facilitator:** Lamnh
**Date:** 2026-06-09 09:18:32 +07

## Session Overview

**Topic:** Agent Studio: web UI for managing reusable skills, agents, project context, and integrations with agentic coding tools.

**Goals:** Clarify product positioning and target users; identify differentiation versus markdown files, repo templates, prompt libraries, and manual config; define MVP scope and early aha moment.

### Context Guidance

No external context file was provided for this session.

### Session Setup

The session will focus on Agent Studio as a product concept for teams that need a shared way to create, manage, reuse, and connect skills and agents across projects and agentic coding tools such as Claude, Cursor, Windsurf, and GitHub Copilot.

The primary brainstorming outcomes are:

- Product positioning and target user clarity.
- Differentiation from current lightweight or manual approaches such as `.md` files, repository templates, prompt libraries, and hand-authored configuration.
- MVP scope, including what to include, what to defer, and the earliest compelling aha moment.

## Technique Selection

**Approach:** Progressive Technique Flow
**Journey Design:** Systematic development from exploration to action.

**Progressive Techniques:**

- **Phase 1 - Exploration:** Analogical Thinking for maximum breadth across adjacent and unexpected product categories.
- **Phase 2 - Pattern Recognition:** Mind Mapping for organizing user segments, pains, workflows, integrations, trust, reuse, governance, and monetization.
- **Phase 3 - Development:** Six Thinking Hats for refining the most promising concepts through facts, emotions, benefits, risks, creative alternatives, and process.
- **Phase 4 - Action Planning:** Resource Constraints for forcing an MVP scope and earliest aha moment.

**Journey Rationale:** This flow starts by escaping the obvious framing of Agent Studio as just a prompt or skill manager, then clusters the strongest patterns, stress-tests product concepts, and finally compresses the result into a practical MVP.

## Technique Execution

### Phase 1 - Analogical Thinking

**Technique Focus:** Explore Agent Studio through analogies from adjacent product categories to discover stronger positioning, differentiation, and MVP directions.

**[Positioning #1]: Agent Design System**
_Concept_: Agent Studio becomes a design system for agentic coding behavior: skills, agent roles, workflow standards, project context, and integration presets are versioned, reviewed, published, reused, and forked by the team. It solves the current "freestyle prompt/config" problem the way design systems solved every developer writing CSS differently.
_Novelty_: It manages team-standardized operational behavior, not just prompt text or isolated config files.

**[Ecosystem #2]: GitHub Marketplace for Agents**
_Concept_: Agent Studio becomes a discovery and trust layer where developers can find existing skills and agents, see who built them, assess quality, and choose verified or reviewed assets. This opens paths toward ratings, reviews, verified publishers, security scanning, paid skills, team licenses, and enterprise ecosystem models.
_Novelty_: It shifts Agent Studio from internal standardization toward marketplace dynamics, where network effects and trust become core product value.

**[Platform #3]: Internal Developer Platform for Agents**
_Concept_: Agent Studio becomes an internal developer platform for agentic workflows: golden paths for common tasks, self-service project setup, centralized integrations with coding tools, and dashboards for usage, performance, and cost. Developers can provision the right agent setup without repeatedly asking platform or tooling teams.
_Novelty_: It frames the product as infrastructure and automation for agentic development at scale, not merely a library.

**[Registry #4]: npm for Skills and Agents**
_Concept_: Agent Studio becomes a package registry for reusable agent behavior, with dependency management, semantic versioning, lock files, publishing workflows, and conflict handling. Projects can pin specific skill/agent versions so agent behavior is reproducible.
_Novelty_: It treats agent behavior as a dependency graph with reproducibility and breaking-change semantics.

**[Workspace #5]: Notion Workspace for Agents**
_Concept_: Agent Studio becomes a flexible collaborative workspace where teams organize skills, agents, templates, permissions, comments, and edits in ways that fit their working style. It lowers the barrier for non-specialists to participate in agent configuration and reuse.
_Novelty_: It emphasizes accessibility, real-time collaboration, templates, and flexible information architecture over rigid engineering process.

**[Delivery #6]: CI/CD Pipeline for Agents**
_Concept_: Agent Studio becomes a quality and deployment pipeline for agent behavior: lint, test, review, staged rollout, canary deploy, rollback, and publish. Teams can change how agents behave without blindly pushing new prompts or configs to everyone.
_Novelty_: It introduces software delivery discipline to agent behavior, creating safety gates before team-wide adoption.

**[Infrastructure #7]: Control Plane for Agent Behavior**
_Concept_: Agent Studio reframes from a tool that manages artifacts into an infrastructure layer for agent operations. It controls which agent behavior versions are active, who approved behavior changes, what projects consume them, what blast radius an update has, and how teams rollback when an agent starts behaving incorrectly.
_Novelty_: It surfaces a second buyer persona beyond everyday developers: team leads, platform engineers, and security/governance stakeholders who care about permission, auditability, policy, and operational safety.

**[Positioning #8]: Control Plane with Design System UX**
_Concept_: Agent Studio can present itself externally as an approachable "Agent Design System for your team" while implementing control-plane capabilities underneath: authorization, versioning, audit trails, rollback, and project mapping. This keeps the product accessible for small teams while leaving room for enterprise governance as teams mature.
_Novelty_: It resolves the tension between approachable UX and serious operational value by separating customer-facing framing from underlying architecture.

**Control Layers Identified:**

- **Layer 1 - Skill/Prompt Control:** Versioned skill files, approvals, breaking changes, and artifact governance.
- **Layer 2 - Agent Behavior Control:** Agent roles, permissions, workflow sequencing, and context/memory access.
- **Layer 3 - Integration Control:** Coding tool consumption, project-to-behavior mapping, API/model config, and rate/cost controls.

**Positioning Paths Identified:**

- **Path A:** External positioning as Agent Design System, internal architecture as control plane.
- **Path B:** Direct positioning as the control plane for agentic development, targeting platform engineers, team leads, and engineering managers.

**[MVP Wedge #9]: Project Behavior Set**
_Concept_: The preferred MVP wedge is a project-level behavior set: each project has a bundle of skills, agents, rules, standards, and tool adapters that can be synced into agentic coding tools such as Claude, Cursor, Windsurf, and GitHub Copilot. Instead of managing isolated prompts, teams manage the behavior configuration that makes a project's agents act consistently.
_Novelty_: This avoids the weak positioning of a generic prompt library and creates a direct workflow aha moment: a team can attach a standardized behavior set to a real project and immediately reduce freestyle agent configuration.

**[Primitive #10]: Agent Playbook**
_Concept_: The core MVP primitive should be a Playbook: a versionable, shareable, syncable package of skills, agents, rules, project context, workflows, and integrations for a specific project or team standard. It communicates "how agents should work here" without forcing users to understand control-plane terminology.
_Novelty_: Playbook is broader and more actionable than profile or policy pack, while staying friendlier than stack or environment. It can naturally support versioning, sharing, review, and tool sync.

**[Onboarding #11]: Hybrid Playbook Creation**
_Concept_: The MVP should create Playbooks through a hybrid flow: import existing agent configs or start from a proven template, then manually refine. Users with existing `.claude`, `.cursor`, prompt files, or skills folders can import and normalize scattered assets, while users starting fresh can select a template before editing.
_Novelty_: This avoids the blank canvas problem without betting the MVP on risky repo-scan intelligence. It unifies both paths into the same primitive: a draft Agent Playbook that can be reviewed, previewed, synced, and shared.

**[MVP Flow #12]: Import or Template to Synced Repo**
_Concept_: The core flow is connect repo, choose how to create the first Agent Playbook, import existing configs or start from template, refine skills/agents/rules/context/tool adapters, preview generated configs, sync to repo, and share with team.
_Novelty_: The first aha moment becomes operational rather than editorial: scattered prompts, rules, and configs are transformed into one trusted Playbook that can generate tool-specific outputs for a real repo.

**Default Early-Adopter Path:** Import existing configs should be the default for early adopters because it targets users with current pain: distributed prompt/config files, copy-paste sharing, inconsistent versions, and no clear source of truth.

**[Aha Moment #13]: Cross-Tool Preview**
_Concept_: The central MVP aha moment is previewing how one Agent Playbook translates into multiple tool-specific outputs such as Claude Code config, Cursor rules, and Windsurf config. Consolidation creates relief and team sharing creates expansion, but cross-tool preview proves Agent Studio is a source of truth for agent behavior across tools.
_Novelty_: This is the moment that differentiates Agent Studio from a prompt library: the user sees one canonical Playbook become operational across multiple agentic coding environments.

**Phase 1 Transition:** The exploration phase produced enough signal to move from divergent analogies into pattern recognition. The strongest emerging thread is Agent Studio as an approachable Agent Playbook system with control-plane capabilities underneath, centered on cross-tool translation and repo-level behavior consistency.

### Phase 2 - Mind Mapping

**Technique Focus:** Organize the 13+ insights from Phase 1 into visible clusters, relationships, tensions, and priority paths.

**Mind Map Center:** Agent Studio = Agent Playbooks for repo-level behavior across coding tools.

**Initial Branches:**

- **User / Buyer:** AI-forward tech lead, Platform/DevEx engineer, power user/consultant, team developer.
- **Core Pain:** Scattered prompts/configs, freestyle behavior, multi-tool fragmentation, no source of truth, fear of breaking working setup.
- **Core Primitive:** Agent Playbook containing skills, agents, rules, project context, workflows, and tool adapters.
- **Aha Moments:** Consolidation, Cross-Tool Preview, Team Share/Sync.
- **Differentiation:** Source of truth that translates across tools; not merely prompt library, repo template, or skill registry.
- **MVP Flow:** Connect repo, import/template, draft Playbook, refine, preview outputs, sync, share.
- **Expansion Path:** Versioning, review, approval, rollback, dashboards, marketplace/templates, governance.

**Priority Branch:** Core Primitive is the most important branch for MVP clarity. If Agent Playbook is not precisely defined, the MVP flow, aha moments, differentiation, and buyer understanding all remain fuzzy.

**Pattern #1:** Product organization should start with repo -> Playbook -> tool outputs, not skill-first navigation.

**[Primitive Boundary #14]: Defer Workflows**
_Concept_: Workflows should be deferred from the MVP. The v1 Playbook should stay flat: Skills, Agents, Rules, Context, and Tool Adapters. Workflow orchestration introduces sequencing, triggers, conditional transitions, failure handling, and agent-to-agent handoff, which would pull the product toward a workflow automation platform.
_Novelty_: This creates a clean boundary: v1 defines and syncs behavior; v2 can orchestrate behavior once users ask for skill or agent sequences.

**MVP Playbook Schema:**

```yaml
playbook:
  name: "Frontend React Standard"
  version: "1.0.0"
  repo: "acme/webapp"
  description: "Team standard for React frontend projects"

  skills:
    - name: "code-review"
      version: "1.2.0"
      source: "team/code-review-skill"
    - name: "test-writer"
      version: "0.8.1"

  agents:
    - name: "frontend-dev"
      role: "Senior React developer"
      allowed_actions: ["write code", "write tests", "refactor"]
    - name: "pr-reviewer"
      role: "Code reviewer focused on quality and standards"

  rules:
    - "Always use Tailwind, never inline styles"
    - "Write tests before implementation"
    - "No direct database queries from components"

  context:
    - path: "./docs/architecture.md"
    - path: "./docs/conventions.md"
    - path: "./docs/glossary.md"

  adapters:
    claude-code:
      enabled: true
      output_format: "skills-folder + CLAUDE.md"
    cursor:
      enabled: true
      output_format: ".cursorrules + prompts"
    windsurf:
      enabled: false
      output_format: "agent-config.yaml"
```

**Expansion Path:**

- **v1:** Playbook = Skills + Agents + Rules + Context + Adapters.
- **v2:** Add Workflows for multi-agent orchestration.
- **v3:** Add Governance with approval, audit, rollback, and policy.
- **v4:** Add Marketplace for sharing or selling Playbooks.

**[Adapter Model #15]: Tool Translator and Preview**
_Concept_: In MVP language, a Tool Adapter should primarily be understood as a Translator: it renders a canonical Agent Playbook into tool-specific outputs. Export and sync are actions after preview, while compatibility checking is a support feature.
_Novelty_: Translator explains Cross-Tool Preview and source-of-truth differentiation better than Exporter, Sync Target, or Compatibility Layer.

**Adapter Capability Maturity:**

1. **Translate:** Canonical Playbook -> tool-specific config.
2. **Preview:** Show side-by-side outputs before writing anything.
3. **Check Compatibility:** Flag unsupported or flattened semantics.
4. **Sync / Export:** Download, copy, create PR, commit to repo, or push to tool config directories.

**UI Pattern:** Adapter Preview should be a central MVP screen. Users edit canonical Playbook behavior and see equivalent Claude Code, Cursor, and Windsurf outputs update side-by-side. Compatibility notes explain where a tool cannot preserve a Playbook concept natively.

**Product Copy Candidates:**

- "Agent Studio translates your Playbook into the native format of every coding tool."
- "Write behavior once. Preview it everywhere."

**[Navigation Model #16]: Projects / Repos First**
_Concept_: Primary navigation should be Projects/Repos, not Playbooks, Tools, or Templates. The core mental model is "this repo uses this Playbook," which reinforces the MVP wedge of repo-level agent behavior.
_Novelty_: Projects-first positioning prevents Agent Studio from feeling like a Playbook library. It frames the product as the place teams manage agent behavior for real repositories.

**MVP Navigation Structure:**

```text
PRIMARY: Projects
├─ acme/webapp
│   └─ Playbook: Frontend React Standard v2.1
│       ├─ Edit Playbook
│       ├─ Preview: Claude | Cursor | Windsurf
│       └─ Sync to repo
├─ acme/api-service
│   └─ Playbook: Backend API Standard v1.0
└─ acme/mobile-app
    └─ No Playbook (set up now)

SECONDARY: Playbook Library
├─ My Playbooks
├─ Team Playbooks
└─ Templates

UTILITY: Tools
├─ Claude Code
├─ Cursor
└─ Windsurf
```

**Pattern #2:** Playbook Library is secondary for reuse and power users. Tools are utility configuration. The default workspace should always return users to Projects because the value is grounded in repo-specific behavior.

**First-Time Journey:** Welcome screen can offer both "Connect a repo" and "Create a Playbook," but after onboarding the main workspace should become Projects view.

**Phase 2 Consolidation Summary:**

- MVP wedge: Project Behavior Set.
- Core primitive: Agent Playbook.
- Playbook v1 parts: Skills, Agents, Rules, Context, and Tool Translators.
- Deferred primitive: Workflows.
- Central aha moment: Cross-Tool Preview.
- Adapter metaphor: Translator + Preview.
- Primary navigation: Projects / Repos first.
- Secondary navigation: Playbook Library.
- Strategic frame: Control plane with Design System UX.

**Phase 2 Transition:** Pattern recognition clarified that Agent Studio should manage agent behavior per repo, with Playbooks as reusable behavior packages and Tool Translators as the cross-tool rendering layer.

### Phase 3 - Six Thinking Hats

**Technique Focus:** Stress-test the Agent Studio MVP concept through multiple perspectives: facts, emotions, benefits, risks, creative alternatives, and process.

#### White Hat - Facts and Validation

**Riskiest Assumption:** Users will trust a canonical Playbook more than editing native tool files directly.

If users prefer to edit `.cursorrules`, `CLAUDE.md`, Windsurf config, or other native files directly, then Agent Studio loses its role as source of truth and risks becoming a one-time generator/exporter.

**Why This Is Foundational:**

- It determines whether the Playbook primitive is real.
- It requires behavior change from developers who are used to editing files in repos.
- It affects MVP UX decisions around drift detection, round-trip import, generated file headers, and PR-based sync.

**Second Major Risk:** Tool-specific outputs must differ enough for Translator value to be obvious. If the preview is just the same markdown copied into three boxes, the cross-tool aha moment fails.

**Missing Facts to Validate:**

- **File ownership / drift behavior:** Who is the source of truth after generated files land in the repo?
- **Review workflow fit:** Should Playbook changes be reviewed in Agent Studio, Git PRs, or both?
- **Tool adoption overlap:** How many target teams actively use multiple coding tools versus standardizing on one?
- **Minimum viable import:** Import does not need to be perfect, but it must produce a structured draft useful enough to earn trust.

**Validation Questions:**

1. If Agent Studio creates a Playbook and generates native tool files, where would you prefer to edit a rule afterward: Playbook UI or native files?
2. Where does your team currently maintain agent instructions, prompts, rules, and project context?
3. Does seeing one rule render differently for Claude, Cursor, and Windsurf feel valuable?
4. Should Agent Studio sync directly into the repo or create a PR for generated changes?

**White Hat Conclusion:** If users do not accept Playbook as source of truth, the concept must pivot from control plane/source of truth toward import/export assistant.

#### Black Hat - Risks and Failure Modes

**Primary Failure Mode:** Agent Studio fails if users do not trust the web UI as the source of truth and continue editing native tool files directly.

```text
Agent Studio says: "Edit the Playbook."
Developer says: "I trust Git files more than your UI."
```

If this happens, users generate once, edit `.cursorrules`, `CLAUDE.md`, or Windsurf config directly, create drift, and stop returning to Agent Studio.

**Architecture Decision:** MVP should be Git-native.

The canonical Playbook should live in the repo:

```text
Repo
├─ .agent-studio/
│   └─ playbook.yaml          # canonical source of truth, in Git
├─ CLAUDE.md                  # generated from playbook.yaml
├─ .cursorrules               # generated from playbook.yaml
└─ .windsurf/                 # generated from playbook.yaml
```

**Why Git-Native Wins for MVP:**

- Removes the trust barrier because the canonical Playbook lives in the user's repo.
- Fits existing PR review workflows.
- Avoids SaaS lock-in concerns.
- Allows offline or direct YAML editing.
- Makes drift detection clearer because generated files can point back to `.agent-studio/playbook.yaml`.
- Lets team collaboration rely on existing repo permissions instead of requiring every collaborator to adopt Agent Studio immediately.

**Reframed Agent Studio Value:** Agent Studio is not primarily a database that hosts Playbooks. It is a structured editor, live preview, translator, validator, importer, and PR generator for `.agent-studio/playbook.yaml`.

**MVP Git-Native Workflow:**

1. Connect repo through GitHub App or local flow.
2. Scan `.claude/`, `.cursorrules`, prompt files, and existing `.agent-studio/playbook.yaml`.
3. Generate draft `.agent-studio/playbook.yaml`.
4. Let user refine skills, agents, rules, context, and tool translators in the web UI.
5. Show live preview for Claude Code, Cursor, and Windsurf outputs.
6. Create a PR containing both canonical Playbook changes and generated tool files.
7. Team reviews and merges through normal Git workflow.
8. Future edits can happen through Agent Studio or direct YAML edits, with validation and regeneration.

**Generated File Provenance:**

```text
Generated from .agent-studio/playbook.yaml.
Do not edit directly. Edit playbook.yaml instead.
```

**Black Hat Risks of Git-Native Model and Mitigations:**

- Users break YAML manually -> provide web validation and later CLI linting.
- Users question the need for UI -> live cross-tool preview and translation are the core answer.
- Playbook Library is harder -> index or import Playbooks from repos instead of owning them.
- Central dashboards are harder -> add org repo indexing through GitHub API later.
- Offline edits skip validation -> add CLI validation later.

**Black Hat Conclusion:** Git-native architecture de-risks the biggest failure mode. Agent Studio's value is not hosting Playbooks; it is making `.agent-studio/playbook.yaml` easier to create, understand, translate, validate, and review.

#### Yellow Hat - Benefits and Upside

**Primary MVP Message:** "Review agent behavior changes like code."

Reviewability is the strongest landing/demo message because it captures the advantage of Git-native architecture. The Playbook is a YAML file in the repo, changes go through PRs, and teams can review, diff, version, and rollback agent behavior using workflows they already trust.

**Why Reviewability Wins:**

- It turns the problem of scattered prompts into an engineering workflow opportunity.
- It makes consistency and portability feel credible because they are grounded in Git and PR review.
- It gives tech leads and platform engineers a reason to care immediately.
- It differentiates Agent Studio from manual `.md` editing by making agent behavior explicit, reviewable, and generated from a canonical source.

**Secondary Benefits:**

- **Consistency:** Stop freestyle agent behavior across the team.
- **Portability:** Write behavior once and translate it across Claude, Cursor, and Windsurf.
- **Onboarding:** New repo, trusted agent setup in minutes.
- **De-risking:** No SaaS lock-in; Playbook lives in Git.

**Yellow Hat Conclusion:** Reviewability should lead MVP messaging. Portability and consistency should support it, while Git-native de-risking provides trust.

#### Red Hat - Emotion and User Pull

**Primary Emotional Hook:** Loss of control -> restored control.

Tech leads feel accountable for team output, but agent behavior is often uncontrolled, invisible, and different across machines, developers, and tools. This negative emotion creates stronger urgency than positive promises alone.

**Amplifier:** Fear of invisible change.

Prompt and config changes may be invisible, but they can change real code output. This compounds the loss-of-control feeling.

**Emotional Hook Ranking:**

1. **Loss of control -> restored control:** Strongest acquisition hook for AI-forward tech leads.
2. **Fear of invisible change:** Urgency amplifier.
3. **Relief from chaos:** Strongest onboarding emotion when scattered configs become a Playbook.
4. **Professionalization:** Retention emotion; agent behavior becomes an engineering artifact.
5. **Confidence to scale AI coding:** Expansion emotion; teams can safely increase agent usage.

**Journey Mapping:**

- **Discover:** Loss of control.
- **Try:** Fear of invisible change.
- **Onboard:** Relief from chaos.
- **Adopt:** Professionalization.
- **Scale:** Confidence.

**Landing Narrative Candidate:**

```text
Your agents are writing code.
Who's reviewing their instructions?

Agent Studio turns scattered prompts, rules,
and configs into one reviewable Playbook
that works across Claude, Cursor, and Windsurf.
```

**Red Hat Conclusion:** Acquisition should lead with loss of control and invisible agent behavior. Reviewability is the mechanism that restores control.

#### Green Hat - Creative Alternatives

**Selected Concept:** Combine Agent Instructions PR, Terraform-style Plan, and simplified Agent Behavior Diff.

The MVP should use three layers:

1. **Plan / Preview:** Show what Agent Studio will generate or change before writing files.
2. **Simplified Behavior Diff:** Summarize behavior changes with template-based summaries rather than full AI semantic analysis.
3. **PR Creation:** Deliver canonical Playbook changes and generated tool output changes through a normal Git PR.

**Why This Works for MVP:**

- Preview shows cross-tool translation before sync.
- Behavior Diff makes invisible instruction changes easier to review.
- PR creation grounds the workflow in Git and reinforces reviewability.
- Template-based summaries keep the feature feasible for a 2-4 week MVP.

**Example Flow:**

```text
Agent Studio Plan

+ Add test-first rule to Playbook
~ Regenerate CLAUDE.md
~ Update .cursorrules
! Cursor will flatten skill dependency into project rule

Behavior Summary

- Agents may currently suggest tests after implementation.
+ Agents must write or update tests before implementation.

Create PR

+ .agent-studio/playbook.yaml
~ CLAUDE.md
~ .cursorrules
+ .windsurf/agent-config.yaml
```

**Green Hat Conclusion:** MVP demo should not stop at side-by-side preview. It should flow from plan -> behavior summary -> PR creation to make reviewability tangible.

#### Blue Hat - Process and Scope Control

**MVP Scope Decision:** Use downloadable patch / local preview instead of actual GitHub PR creation for the 2-4 week MVP.

Actual GitHub PR creation is a stronger end-to-end demo, but it adds integration, auth, permissions, branch management, conflict handling, and error-state complexity. A downloadable patch or local commit preview proves reviewability while saving several implementation days.

**Build in MVP v1:**

- Projects-first dashboard.
- Select or connect one repo locally.
- Import existing config files such as `CLAUDE.md`, `.cursorrules`, `.claude/skills/*`, and optional Windsurf config.
- Generate `.agent-studio/playbook.yaml`.
- Playbook editor for skills, agents, rules, context, and translators.
- Cross-tool preview for Claude Code, Cursor, and Windsurf.
- Plan view and simplified behavior diff.
- Downloadable patch or local preview showing canonical Playbook changes and generated files.

**Do Not Build in MVP v1:**

- Workflow orchestration.
- Marketplace.
- Ratings or reviews.
- Multi-org dashboard.
- Full permissions or governance.
- AI semantic behavior analysis.
- Real-time collaboration.
- Deep runtime observability.
- Actual GitHub PR creation.

**v1.1 Candidate:** Actual GitHub PR creation after the core Playbook, Translator, Preview, and reviewability workflow are validated.

**Blue Hat Conclusion:** The MVP should prove the full conceptual loop without over-investing in repo hosting integrations: import/template -> edit Playbook -> preview translations -> behavior summary -> downloadable patch/local review.

**Phase 3 Consolidation Summary:**

- Biggest risk: users may not trust canonical Playbook over native tool files.
- Architecture answer: Git-native `.agent-studio/playbook.yaml`.
- Primary message: "Review agent behavior changes like code."
- Emotional hook: loss of control -> restored control.
- MVP review workflow: Plan + simplified Behavior Diff + downloadable patch/local preview.
- Deferred to v1.1: actual GitHub PR creation.

**Phase 3 Transition:** The concept has been stress-tested enough to move into action planning. The remaining task is to compress the idea into a 2-4 week MVP that proves reviewable, Git-native, cross-tool agent behavior.

### Phase 4 - Resource Constraints

**Technique Focus:** Force the Agent Studio concept into a practical MVP scope under tight time and engineering constraints.

**[MVP Constraint #17]: Sample Repo / Demo Workspace First**
_Concept_: For a 2-week MVP with one developer, Agent Studio should use a controlled sample repo or demo workspace instead of arbitrary local repo folder support. The sample repo should contain representative agent config artifacts such as `CLAUDE.md`, `.cursorrules`, `.claude/skills/*`, and docs context files.
_Novelty_: This validates the core product concept without spending the MVP window on path handling, permissions, symlinks, file encoding, large repos, or arbitrary filesystem edge cases.

**Why Sample Repo Wins for 2-Week MVP:**

- Saves development time for the core workflow: import -> edit -> preview -> patch.
- Keeps demo reproducible and focused on the story.
- Still validates core assumptions: scattered config import, draft Playbook generation, cross-tool preview, Git-native trust, and template-based behavior diff.
- Leaves a clean v1.1 path to local repo support after concept validation.

**2-Week Demo Flow:**

1. Load sample repo or demo workspace.
2. Detect `CLAUDE.md`, `.cursorrules`, `.claude/skills/*`, and context docs.
3. Ask user to create a Playbook from discovered configs.
4. Generate draft `.agent-studio/playbook.yaml`.
5. Let user edit skills, agents, rules, and context in the Playbook UI.
6. Render Claude Code, Cursor, and Windsurf output previews.
7. Show a Plan with canonical and generated file changes.
8. Show simplified Behavior Diff.
9. Download `agent-studio-changes.zip`, patch diff, or generated files.

**2-Week Scope:**

- **Week 1:** Sample repo loader, config scanner, Playbook generator, Playbook editor, cross-tool preview, plan preview, simplified behavior diff, and patch/generated file output.
- **Week 2:** UI polish, compatibility warnings, demo script, storytelling, and internal feedback.

**v1.1 Expansion:** Add local repo folder support, arbitrary path handling, Git-aware patch generation, and keep sample repo as "Try with demo."

**[Demo Repo #18]: React / Next.js Frontend Repo**
_Concept_: The MVP sample repo should be a React/Next.js frontend project because it is broadly understandable, has clear coding standards, and makes cross-tool agent instructions easy to demonstrate.
_Novelty_: This avoids a domain-specific backend or meta-agent workflow demo and lets the audience focus on Agent Studio's value rather than learning the sample domain.

**[MVP Scope Cut #19]: Rules Editable First**
_Concept_: For the 2-week MVP, only the Rules section needs to be fully editable. Skills, Agents, and Context can be imported and displayed read-only or lightly editable. This keeps the demo focused on behavior change while avoiding a full Playbook CRUD surface.
_Novelty_: Editing one rule is enough to prove the core loop: canonical Playbook change, cross-tool translation, behavior summary, and reviewable patch.

**Sample Repo Structure:**

```text
sample-nextjs-repo/
├─ CLAUDE.md
├─ .cursorrules
├─ .claude/
│  └─ skills/
│     ├─ code-review.md
│     └─ test-writer.md
├─ docs/
│  ├─ architecture.md
│  ├─ conventions.md
│  └─ glossary.md
└─ app/
   └─ components/
      └─ Button.tsx
```

**Best Demo Edit:**

```text
All UI components must include loading, error, and empty states when applicable.
```

**Why This Demo Edit Works:**

- Concrete and easy to understand.
- Shows meaningful behavior impact.
- Renders differently across Claude Code, Cursor, and Windsurf.
- Makes template-based Behavior Diff feel useful.

**Final 2-Week MVP Definition:**

Agent Studio MVP is a demo workspace for a sample React/Next.js repo that imports scattered agent configs, generates a Git-native `.agent-studio/playbook.yaml`, lets the user edit Playbook rules, previews translated outputs for Claude Code, Cursor, and Windsurf, shows a plan plus simplified behavior diff, and exports a patch/generated files for review.
