# Addendum: Agent Studio MVP PRD Detail

This addendum preserves technical shape and follow-on detail that should not expand the main PRD.

## Proposed Sample Repo Structure

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

## Proposed Agent Playbook Shape

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

## Demo Rule

```text
All UI components must include loading, error, and empty states when applicable.
```

## Template-Based Behavior Diff Examples

```text
Rule added:
+ Agents must follow: "{rule}"

Rule removed:
- Agents no longer must follow: "{rule}"

Rule edited:
- Old rule: "{old_rule}"
+ New rule: "{new_rule}"

Adapter warning:
! {tool} will flatten "{concept}" because native support is unavailable.
```

## Plan Preview Example

```text
Agent Studio Plan

+ .agent-studio/playbook.yaml
~ CLAUDE.md
~ .cursor/rules/frontend-standard.mdc
+ .windsurf/rules/frontend-standard.md
! Cursor may flatten some imported skill guidance into project rules.
```

## Expansion Path

- **v1:** Git-native Playbooks, translators, preview, behavior diff, patch export.
- **v1.1:** Local repo support and actual GitHub PR creation.
- **v2:** Workflows for multi-agent orchestration.
- **v3:** Governance with approval, audit, rollback, policy, and org indexing.
- **v4:** Playbook library and marketplace.

## Parked Architecture Concerns

- Parser implementation for native config files.
- YAML schema validation and error recovery.
- Diff generation format and browser download implementation.
- Whether patch export should use unified diff, zip bundle, or both.
- How to model generated file provenance consistently across markdown and rules formats.
- How to handle direct edits to generated files once local repo support exists.
