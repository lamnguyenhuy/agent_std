import type { GeneratedArtifact } from "@/lib/translators/types"

export type PlanChange = {
  path: string
  kind: "added" | "modified"
  label: string
}

export function generatePlan(
  items: Array<{ label: string; artifacts: GeneratedArtifact[] }>
): PlanChange[] {
  const playbookEntry: PlanChange = {
    path: ".agent-studio/playbook.yaml",
    kind: "modified",
    label: "Canonical Playbook",
  }
  return [
    playbookEntry,
    ...items.flatMap(({ label, artifacts }) =>
      artifacts.map(
        (artifact): PlanChange => ({
          path: artifact.path,
          kind: artifact.kind,
          label,
        })
      )
    ),
  ]
}
