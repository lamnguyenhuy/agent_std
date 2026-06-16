import { describe, expect, it } from "vitest"
import { generateBehaviorDiff } from "@/lib/review/behavior-diff"
import type { PlaybookRule } from "@/lib/playbook/schema"

function importedRule(id: string, text: string): PlaybookRule {
  return {
    id,
    text,
    origin: "imported",
    sourcePath: "AGENTS.md",
  }
}

function editedRule(id: string, text: string): PlaybookRule {
  return {
    id,
    text,
    origin: "edited",
  }
}

describe("generateBehaviorDiff", () => {
  it("describes added rules with a plus marker and template summary", () => {
    const result = generateBehaviorDiff([], [
      editedRule("rule-new", "Run focused tests before handing off."),
    ])

    expect(result).toEqual([
      {
        id: "added-rule-new",
        kind: "added",
        marker: "+",
        label: "Added",
        summary: 'Agents must follow: "Run focused tests before handing off."',
        after: "Run focused tests before handing off.",
      },
    ])
  })

  it("describes removed rules with a minus marker and template summary", () => {
    const result = generateBehaviorDiff(
      [importedRule("rule-old", "Keep implementation notes current.")],
      []
    )

    expect(result).toEqual([
      {
        id: "removed-rule-old",
        kind: "removed",
        marker: "-",
        label: "Removed",
        summary:
          'Agents no longer must follow: "Keep implementation notes current."',
        before: "Keep implementation notes current.",
      },
    ])
  })

  it("describes edited rules with old and new rule text", () => {
    const result = generateBehaviorDiff(
      [importedRule("rule-1", "Prefer small focused changes.")],
      [editedRule("rule-1", "Prefer small focused changes with tests.")]
    )

    expect(result).toEqual([
      {
        id: "edited-rule-1",
        kind: "edited",
        marker: "~",
        label: "Edited",
        summary: "Agents must follow updated Rule text.",
        before: "Prefer small focused changes.",
        after: "Prefer small focused changes with tests.",
      },
    ])
  })

  it("returns no items for unchanged rules", () => {
    const result = generateBehaviorDiff(
      [importedRule("rule-1", "Use project standards.")],
      [editedRule("rule-1", "Use project standards.")]
    )

    expect(result).toEqual([])
  })

  it("orders removals by previous rules and additions or edits by current rules", () => {
    const result = generateBehaviorDiff(
      [
        importedRule("removed-a", "Remove first."),
        importedRule("kept-edit", "Old text."),
        importedRule("removed-b", "Remove second."),
      ],
      [
        editedRule("added-a", "Add first."),
        editedRule("kept-edit", "New text."),
        editedRule("added-b", "Add second."),
      ]
    )

    expect(result.map((item) => item.id)).toEqual([
      "removed-removed-a",
      "removed-removed-b",
      "added-added-a",
      "edited-kept-edit",
      "added-added-b",
    ])
  })

  it("is deterministic for the same previous and current rules", () => {
    const previous = [
      importedRule("rule-1", "Old text."),
      importedRule("rule-2", "Removed text."),
    ]
    const current = [
      editedRule("rule-1", "New text."),
      editedRule("rule-3", "Added text."),
    ]

    expect(generateBehaviorDiff(previous, current)).toEqual(
      generateBehaviorDiff(previous, current)
    )
  })

  it("normalizes whitespace in rule text for template output", () => {
    const result = generateBehaviorDiff(
      [importedRule("rule-1", "Use   project\nstandards.")],
      [editedRule("rule-1", "Use project standards.\n\nRun tests.")]
    )

    expect(result[0]).toMatchObject({
      summary: "Agents must follow updated Rule text.",
      before: "Use project standards.",
      after: "Use project standards. Run tests.",
    })
  })
})
