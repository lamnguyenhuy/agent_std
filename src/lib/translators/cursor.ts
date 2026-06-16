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

function renderCursorRules(playbook: AgentPlaybook): string {
  const name = normalizeMarkdownText(playbook.name)
  const description = normalizeMarkdownText(playbook.description)
  const repo = normalizeMarkdownText(playbook.repo)
  const yamlName = name.replace(/'/g, "''")
  const yamlRepo = repo.replace(/'/g, "''")

  return `---
description: '${yamlName} Agent Playbook rules for ${yamlRepo}'
globs:
  - "**/*"
alwaysApply: true
---

<!-- Generated from .agent-studio/playbook.yaml -->

This Cursor rules preview is generated output. The Agent Playbook is canonical; update .agent-studio/playbook.yaml instead of editing this file directly.

${description}

## Rules

${renderRulesSection(playbook)}
`
}

function renderLegacyCursorRules(playbook: AgentPlaybook): string {
  return `# .cursorrules legacy compatibility

# Generated from .agent-studio/playbook.yaml

This .cursorrules preview is generated output. .cursor/rules is the primary Cursor target. .cursorrules is included as legacy compatibility for the sample. The Agent Playbook is canonical; update .agent-studio/playbook.yaml instead of editing this file directly.

${renderRulesSection(playbook)}
`
}

export const cursorTranslator: TranslatorModule = {
  id: "cursor",
  label: "Cursor",
  translate(playbook: AgentPlaybook): TranslatorResult {
    return {
      artifacts: [
        {
          path: ".cursor/rules/playbook.mdc",
          content: renderCursorRules(playbook),
          kind: "modified",
        },
        {
          path: ".cursorrules",
          content: renderLegacyCursorRules(playbook),
          kind: "modified",
        },
      ],
      compatibilityNotes: [
        {
          id: "cursor-legacy",
          message:
            ".cursor/rules is the primary Cursor target. .cursorrules is included as legacy compatibility for the sample.",
        },
      ],
    }
  },
}
