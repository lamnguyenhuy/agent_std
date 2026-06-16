import type { AgentPlaybook, ToolId } from "@/lib/playbook/schema"

export type GeneratedArtifact = {
  path: string
  content: string
  kind: "added" | "modified"
}

export type CompatibilityNote = {
  id: string
  message: string
}

export type TranslatorResult = {
  artifacts: GeneratedArtifact[]
  compatibilityNotes: CompatibilityNote[]
}

export type TranslatorModule = {
  id: ToolId
  label: string
  translate: (playbook: AgentPlaybook) => TranslatorResult
}
