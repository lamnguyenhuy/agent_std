import { describe, expect, it } from "vitest"

import { derivePlaybookSections } from "@/components/workbench/playbook-sections"
import type { AgentPlaybook } from "@/lib/playbook/schema"

function createPlaybook(
  overrides: Partial<AgentPlaybook> = {}
): AgentPlaybook {
  return {
    name: "Sample Next.js Repo",
    version: "0.1.0",
    repo: "sample-nextjs-repo",
    description: "Draft Agent Playbook generated from detected files.",
    skills: [],
    agents: [],
    rules: [],
    context: [],
    translators: [{ tool: "claude-code", enabled: true }],
    ...overrides,
  }
}

describe("derivePlaybookSections", () => {
  it("marks imported sections as imported and read-only when content exists", () => {
    const sections = derivePlaybookSections(
      createPlaybook({
        skills: [
          {
            id: "skill-code-review",
            name: "code-review",
            instructions: "Review for correctness.",
            origin: "imported",
            sourcePath: ".claude/skills/code-review.md",
          },
        ],
        agents: [
          {
            id: "agent-workspace-default",
            name: "workspace-default",
            role: "Repository coding assistant",
            instructions: ["Use standards."],
            origin: "imported",
            sourcePaths: ["CLAUDE.md"],
          },
        ],
        context: [
          {
            id: "context-architecture",
            label: "architecture",
            path: "docs/architecture.md",
            origin: "imported",
            sourcePath: "docs/architecture.md",
          },
        ],
      })
    )

    expect(sections).toEqual(
      expect.arrayContaining([
        { name: "Skills", status: "imported" },
        { name: "Agents", status: "imported" },
        { name: "Context", status: "imported" },
      ])
    )
  })

  it("keeps empty imported sections pending so detail cards stay consistent", () => {
    const sections = derivePlaybookSections(createPlaybook())

    expect(sections).toEqual(
      expect.arrayContaining([
        { name: "Skills", status: "pending" },
        { name: "Agents", status: "pending" },
        { name: "Context", status: "pending" },
      ])
    )
  })
})
