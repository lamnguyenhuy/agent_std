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

function renderWindsurfRules(playbook: AgentPlaybook): string {
  const name = normalizeMarkdownText(playbook.name)
  const description = normalizeMarkdownText(playbook.description)
  const repo = normalizeMarkdownText(playbook.repo)

  return `---
trigger: always_on
---

<!-- Generated from .agent-studio/playbook.yaml -->

This Windsurf rules preview is generated output. The Agent Playbook is canonical; update .agent-studio/playbook.yaml instead of editing this file directly.

# ${name} — ${repo}

${description}

## Rules

${renderRulesSection(playbook)}
`
}

export const windsurfTranslator: TranslatorModule = {
  id: "windsurf",
  label: "Windsurf",
  translate(playbook: AgentPlaybook): TranslatorResult {
    return {
      artifacts: [
        {
          path: ".windsurf/rules/playbook.md",
          content: renderWindsurfRules(playbook),
          kind: "modified",
        },
      ],
      compatibilityNotes: [],
    }
  },
}
