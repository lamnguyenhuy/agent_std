import type { AgentPlaybook } from "@/lib/playbook/schema"
import type {
  TranslatorModule,
  TranslatorResult,
} from "@/lib/translators/types"

function normalizeMarkdownText(value: string): string {
  return value.replace(/\s+/g, " ").trim()
}

function renderRulesSection(playbook: AgentPlaybook): string {
  if (playbook.rules.length === 0) {
    return "No Playbook rules are currently defined."
  }

  return playbook.rules
    .map((rule) => `- ${normalizeMarkdownText(rule.text)}`)
    .join("\n")
}

function renderSkillsSection(playbook: AgentPlaybook): string {
  if (playbook.skills.length === 0) {
    return "No imported Claude skills are referenced by this Playbook."
  }

  return playbook.skills
    .map(
      (skill) =>
        `- ${normalizeMarkdownText(skill.name)} (${normalizeMarkdownText(skill.sourcePath)})`
    )
    .join("\n")
}

function renderClaudeCode(playbook: AgentPlaybook): string {
  return `# ${normalizeMarkdownText(playbook.name)}

<!-- Generated from .agent-studio/playbook.yaml -->

This CLAUDE.md preview is generated output. The Agent Playbook is canonical; update .agent-studio/playbook.yaml instead of editing this file directly.

## Repository

- Repo: ${normalizeMarkdownText(playbook.repo)}
- Playbook version: ${normalizeMarkdownText(playbook.version)}

## Rules

${renderRulesSection(playbook)}

## Imported Skills

${renderSkillsSection(playbook)}
`
}

export const claudeCodeTranslator: TranslatorModule = {
  id: "claude-code",
  label: "Claude Code",
  translate(playbook: AgentPlaybook): TranslatorResult {
    return {
      artifacts: [
        {
          path: "CLAUDE.md",
          content: renderClaudeCode(playbook),
          kind: "modified",
        },
      ],
      compatibilityNotes: [],
    }
  },
}
