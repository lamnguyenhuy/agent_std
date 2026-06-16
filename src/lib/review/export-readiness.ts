import type { AgentPlaybook } from "@/lib/playbook/schema"

export type ExportReadiness = {
  canExport: boolean
  reason?: string
}

export function isDraftInvalid(text: string): boolean {
  return text.trim().length === 0
}

export function computeExportReadiness(
  playbook: AgentPlaybook | null,
  ruleTextDrafts: Record<string, string>
): ExportReadiness {
  if (playbook == null) {
    return {
      canExport: false,
      reason: "Create an Agent Playbook before exporting.",
    }
  }

  const draftValues = Object.values(ruleTextDrafts)
  if (draftValues.length > 0 && draftValues.some(isDraftInvalid)) {
    return {
      canExport: false,
      reason: "Fix invalid Rule text before exporting.",
    }
  }

  return { canExport: true }
}
