import { describe, expect, it } from "vitest"

import { generatePlaybookDraft } from "@/lib/playbook/generate"
import { AgentPlaybookSchema } from "@/lib/playbook/schema"
import { sampleRepoFiles } from "@/lib/sample-repo/fixtures"
import { scanSampleRepoFiles } from "@/lib/sample-repo/scanner"

describe("generatePlaybookDraft", () => {
  it("creates a deterministic schema-valid playbook from the sample repo", () => {
    const detectedFiles = scanSampleRepoFiles(sampleRepoFiles)

    const playbook = generatePlaybookDraft(detectedFiles, sampleRepoFiles)
    const playbookAgain = generatePlaybookDraft(detectedFiles, sampleRepoFiles)

    expect(playbookAgain).toEqual(playbook)
    expect(() => AgentPlaybookSchema.parse(playbook)).not.toThrow()
    expect(playbook).toEqual({
      name: "Sample Next.js Repo",
      version: "0.1.0",
      repo: "sample-nextjs-repo",
      description:
        "Draft Agent Playbook generated from detected Sample Repo instructions.",
      skills: [
        {
          id: "skill-code-review",
          name: "code-review",
          instructions:
            "Review for correctness, maintainability, and test coverage.",
          origin: "imported",
          sourcePath: ".claude/skills/code-review.md",
        },
        {
          id: "skill-test-writer",
          name: "test-writer",
          instructions: "Write focused tests for behavior and edge cases.",
          origin: "imported",
          sourcePath: ".claude/skills/test-writer.md",
        },
      ],
      agents: [
        {
          id: "agent-workspace-default",
          name: "workspace-default",
          role: "Repository coding assistant",
          instructions: [
            "Use the project standards before editing code.",
            "Prefer small focused changes and keep tests current.",
          ],
          origin: "imported",
          sourcePaths: ["CLAUDE.md", ".cursorrules"],
        },
      ],
      rules: [
        {
          id: "rule-claude-md",
          text: "Use the project standards before editing code.",
          origin: "imported",
          sourcePath: "CLAUDE.md",
        },
        {
          id: "rule-cursorrules",
          text: "Prefer small focused changes and keep tests current.",
          origin: "imported",
          sourcePath: ".cursorrules",
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
        {
          id: "context-conventions",
          label: "conventions",
          path: "docs/conventions.md",
          origin: "imported",
          sourcePath: "docs/conventions.md",
        },
        {
          id: "context-glossary",
          label: "glossary",
          path: "docs/glossary.md",
          origin: "imported",
          sourcePath: "docs/glossary.md",
        },
      ],
      translators: [
        { tool: "claude-code", enabled: true },
        { tool: "cursor", enabled: true },
        { tool: "windsurf", enabled: true },
      ],
    })
  })

  it("rejects conflicting case-variant source files", () => {
    const detectedFiles = [
      { path: "CLAUDE.md", type: "Claude instructions", status: "detected" },
      { path: "claude.md", type: "Claude instructions", status: "detected" },
    ] as const
    const sourceFiles = [
      { path: "CLAUDE.md", content: "Uppercase config" },
      { path: "claude.md", content: "Lowercase config" },
    ]

    expect(() =>
      generatePlaybookDraft(
        [...detectedFiles],
        sourceFiles,
        "sample-nextjs-repo"
      )
    ).toThrow(/case-variant/i)
  })
})
