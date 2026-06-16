import type { AgentPlaybook } from "@/lib/playbook/schema"
import type { PlaybookSection } from "@/lib/sample-repo/fixtures"

function importedSectionStatus(count: number): PlaybookSection["status"] {
  return count > 0 ? "imported" : "pending"
}

export function derivePlaybookSections(
  playbook: AgentPlaybook
): PlaybookSection[] {
  return [
    {
      name: "Skills",
      status: importedSectionStatus(playbook.skills.length),
    },
    {
      name: "Agents",
      status: importedSectionStatus(playbook.agents.length),
    },
    {
      name: "Rules",
      status: "editable",
    },
    {
      name: "Context",
      status: importedSectionStatus(playbook.context.length),
    },
    {
      name: "Tool Translators",
      status: playbook.translators.some((translator) => translator.enabled)
        ? "enabled"
        : "pending",
    },
  ]
}

export function getPlaybookSectionStatus(
  sections: PlaybookSection[],
  name: PlaybookSection["name"]
): PlaybookSection["status"] {
  return (
    sections.find((section) => section.name === name)?.status ?? "pending"
  )
}
