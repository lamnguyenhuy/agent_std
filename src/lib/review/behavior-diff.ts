import type { PlaybookRule } from "@/lib/playbook/schema"

export type BehaviorDiffItem = {
  id: string
  kind: "added" | "removed" | "edited"
  marker: "+" | "-" | "~"
  label: "Added" | "Removed" | "Edited"
  summary: string
  before?: string
  after?: string
}

function normalizeRuleText(text: string): string {
  return text.replace(/\s+/g, " ").trim()
}

export function generateBehaviorDiff(
  previousRules: PlaybookRule[],
  currentRules: PlaybookRule[]
): BehaviorDiffItem[] {
  const currentRulesById = new Map(currentRules.map((rule) => [rule.id, rule]))
  const previousRulesById = new Map(
    previousRules.map((rule) => [rule.id, rule])
  )

  const removedItems = previousRules
    .filter((rule) => !currentRulesById.has(rule.id))
    .map((rule): BehaviorDiffItem => {
      const before = normalizeRuleText(rule.text)
      return {
        id: `removed-${rule.id}`,
        kind: "removed",
        marker: "-",
        label: "Removed",
        summary: `Agents no longer must follow: "${before}"`,
        before,
      }
    })

  const addedAndEditedItems = currentRules.flatMap((rule): BehaviorDiffItem[] => {
    const previousRule = previousRulesById.get(rule.id)
    const after = normalizeRuleText(rule.text)

    if (previousRule == null) {
      return [
        {
          id: `added-${rule.id}`,
          kind: "added",
          marker: "+",
          label: "Added",
          summary: `Agents must follow: "${after}"`,
          after,
        },
      ]
    }

    const before = normalizeRuleText(previousRule.text)
    if (before === after) {
      return []
    }

    return [
      {
        id: `edited-${rule.id}`,
        kind: "edited",
        marker: "~",
        label: "Edited",
        summary: "Agents must follow updated Rule text.",
        before,
        after,
      },
    ]
  })

  return [...removedItems, ...addedAndEditedItems]
}
