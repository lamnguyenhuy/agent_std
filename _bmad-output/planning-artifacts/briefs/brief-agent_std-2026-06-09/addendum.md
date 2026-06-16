# Addendum: Agent Studio Detail Parking Lot

This addendum preserves detail from brainstorming that is useful for PRD, architecture, or later product planning but too detailed for the brief.

## Tight MVP Definition

Agent Studio MVP is a demo workspace for a sample React/Next.js repo that imports scattered agent configs, generates a Git-native `.agent-studio/playbook.yaml`, lets the user edit Playbook rules, previews translated outputs for Claude Code, Cursor, and Windsurf, shows a plan plus simplified behavior diff, and exports a patch/generated files for review.

## Sample Repo Structure

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

## MVP Playbook Schema

```yaml
playbook:
  name: "Frontend React Standard"
  version: "0.1.0"
  repo: "sample-nextjs-repo"
  description: "Team standard for React frontend projects"

  skills:
    - name: "code-review"
      source: ".claude/skills/code-review.md"
    - name: "test-writer"
      source: ".claude/skills/test-writer.md"

  agents:
    - name: "frontend-dev"
      role: "Senior React developer"
    - name: "pr-reviewer"
      role: "Code reviewer focused on quality and standards"

  rules:
    - "Use Tailwind classes, never inline styles."
    - "Write or update tests before implementation."
    - "Prefer accessible components with semantic HTML."

  context:
    - path: "docs/architecture.md"
    - path: "docs/conventions.md"
    - path: "docs/glossary.md"

  translators:
    claude-code:
      enabled: true
      output_format: "CLAUDE.md + .claude/skills"
    cursor:
      enabled: true
      output_format: ".cursor/rules or .cursorrules compatibility output"
    windsurf:
      enabled: true
      output_format: ".windsurf/rules"
```

## Best Demo Edit

```text
All UI components must include loading, error, and empty states when applicable.
```

This rule is concrete, easy to understand, behaviorally meaningful, and can be rendered differently across tools.

## Simplified Behavior Diff Pattern

```text
Rule added:
+ Agents must follow: "{rule}"

Skill added:
+ Agents can now use skill: "{skill.name}"

Adapter warning:
! {tool} will flatten "{concept}" because native support is unavailable
```

## Plan Preview Pattern

```text
Agent Studio Plan

+ Add UI state coverage rule to Playbook
~ Regenerate CLAUDE.md
~ Update Cursor rules output
+ Add Windsurf rule file
! Cursor may flatten some skill guidance into project rules
```

## Expansion Path

- **v1:** Git-native Playbooks, translators, preview, behavior diff, patch export.
- **v1.1:** Local repo support and actual GitHub PR creation.
- **v2:** Workflows for multi-agent orchestration.
- **v3:** Governance with approval, audit, rollback, policy, and org indexing.
- **v4:** Playbook library and marketplace.

## Risks to Validate

1. Users may still prefer editing native config files directly.
2. Translator previews may not look different enough across tools.
3. Import quality may feel too rough unless uncertain items are clearly marked.
4. The sample repo may validate demo clarity but not real-world repo edge cases.
5. Tool-specific config formats may change quickly and require adapter maintenance.
