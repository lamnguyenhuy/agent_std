import { describe, expect, it } from "vitest"
import { generatePlan } from "@/lib/review/plan"

describe("generatePlan", () => {
  it("puts .agent-studio/playbook.yaml as the first entry", () => {
    const result = generatePlan([])
    expect(result[0].path).toBe(".agent-studio/playbook.yaml")
  })

  it("marks the playbook entry as modified", () => {
    const result = generatePlan([])
    expect(result[0].kind).toBe("modified")
  })

  it("labels the playbook entry as Canonical Playbook", () => {
    const result = generatePlan([])
    expect(result[0].label).toBe("Canonical Playbook")
  })

  it("returns only the playbook entry when given empty items", () => {
    const result = generatePlan([])
    expect(result).toHaveLength(1)
  })

  it("appends translator artifacts after the playbook entry", () => {
    const result = generatePlan([
      {
        label: "Claude Code",
        artifacts: [{ path: "CLAUDE.md", content: "", kind: "modified" }],
      },
    ])
    expect(result).toHaveLength(2)
    expect(result[1]).toEqual({
      path: "CLAUDE.md",
      kind: "modified",
      label: "Claude Code",
    })
  })

  it("preserves artifact kind from translator result", () => {
    const result = generatePlan([
      {
        label: "Claude Code",
        artifacts: [{ path: "CLAUDE.md", content: "", kind: "added" }],
      },
    ])
    expect(result[1].kind).toBe("added")
  })

  it("preserves POSIX-style artifact paths unchanged", () => {
    const result = generatePlan([
      {
        label: "Cursor",
        artifacts: [
          { path: ".cursor/rules/playbook.mdc", content: "", kind: "modified" },
          { path: ".cursorrules", content: "", kind: "modified" },
        ],
      },
    ])
    expect(result[1].path).toBe(".cursor/rules/playbook.mdc")
    expect(result[2].path).toBe(".cursorrules")
    expect(result.every((r) => !r.path.includes("\\"))).toBe(true)
  })

  it("maps all three translators to correct entries in order", () => {
    const result = generatePlan([
      {
        label: "Claude Code",
        artifacts: [{ path: "CLAUDE.md", content: "", kind: "modified" }],
      },
      {
        label: "Cursor",
        artifacts: [
          { path: ".cursor/rules/playbook.mdc", content: "", kind: "modified" },
          { path: ".cursorrules", content: "", kind: "modified" },
        ],
      },
      {
        label: "Windsurf",
        artifacts: [
          {
            path: ".windsurf/rules/playbook.md",
            content: "",
            kind: "modified",
          },
        ],
      },
    ])
    expect(result).toHaveLength(5)
    expect(result.map((r) => r.path)).toEqual([
      ".agent-studio/playbook.yaml",
      "CLAUDE.md",
      ".cursor/rules/playbook.mdc",
      ".cursorrules",
      ".windsurf/rules/playbook.md",
    ])
    expect(result.map((r) => r.label)).toEqual([
      "Canonical Playbook",
      "Claude Code",
      "Cursor",
      "Cursor",
      "Windsurf",
    ])
  })
})
