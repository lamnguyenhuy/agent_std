import { describe, expect, it } from "vitest"

import { AgentPlaybookSchema } from "@/lib/playbook/schema"

describe("AgentPlaybookSchema", () => {
  it("accepts a valid imported playbook payload", () => {
    const parsed = AgentPlaybookSchema.parse({
      name: "Sample Next.js Repo",
      version: "0.1.0",
      repo: "sample-nextjs-repo",
      description: "Draft Agent Playbook generated from detected files.",
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
          instructions: ["Use the project standards before editing code."],
          origin: "imported",
          sourcePaths: ["CLAUDE.md"],
        },
      ],
      rules: [
        {
          id: "rule-claude-md",
          text: "Use the project standards before editing code.",
          origin: "imported",
          sourcePath: "CLAUDE.md",
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
      translators: [
        { tool: "claude-code", enabled: true },
        { tool: "cursor", enabled: true },
        { tool: "windsurf", enabled: true },
      ],
    })

    expect(parsed.repo).toBe("sample-nextjs-repo")
    expect(parsed.translators).toHaveLength(3)
  })

  it("rejects invalid translator ids and missing required arrays", () => {
    const result = AgentPlaybookSchema.safeParse({
      name: "Broken",
      version: "0.1.0",
      repo: "sample-nextjs-repo",
      description: "Invalid payload",
      skills: [],
      agents: [],
      rules: [],
      context: [],
      translators: [{ tool: "github-copilot", enabled: true }],
    })

    expect(result.success).toBe(false)
  })

  it("rejects imported rules without a source path", () => {
    const result = AgentPlaybookSchema.safeParse({
      name: "Broken",
      version: "0.1.0",
      repo: "sample-nextjs-repo",
      description: "Invalid payload",
      skills: [],
      agents: [],
      rules: [
        {
          id: "rule-without-source",
          text: "Missing traceability",
          origin: "imported",
        },
      ],
      context: [],
      translators: [{ tool: "claude-code", enabled: true }],
    })

    expect(result.success).toBe(false)
  })
})
