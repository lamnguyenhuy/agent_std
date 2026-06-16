import { describe, expect, it } from "vitest"

import { sampleRepoFiles } from "@/lib/sample-repo/fixtures"
import { scanSampleRepoFiles } from "@/lib/sample-repo/scanner"

describe("scanSampleRepoFiles", () => {
  it("detects only supported sample repo agent instruction files in deterministic order", () => {
    const detectedFiles = scanSampleRepoFiles(sampleRepoFiles)

    expect(detectedFiles).toEqual([
      {
        path: "CLAUDE.md",
        type: "Claude instructions",
        status: "detected",
      },
      {
        path: ".cursorrules",
        type: "Cursor rules",
        status: "detected",
      },
      {
        path: ".claude/skills/code-review.md",
        type: "Claude skill",
        status: "detected",
      },
      {
        path: ".claude/skills/test-writer.md",
        type: "Claude skill",
        status: "detected",
      },
      {
        path: "docs/architecture.md",
        type: "Project docs",
        status: "detected",
      },
      {
        path: "docs/conventions.md",
        type: "Project docs",
        status: "detected",
      },
      {
        path: "docs/glossary.md",
        type: "Project docs",
        status: "detected",
      },
    ])
  })

  it("ignores unknown files, unknown docs, unsupported nested configs, and non-Markdown skills", () => {
    const detectedPaths = scanSampleRepoFiles(sampleRepoFiles).map(
      (file) => file.path
    )

    expect(detectedPaths).not.toContain("README.md")
    expect(detectedPaths).not.toContain("docs/random-notes.md")
    expect(detectedPaths).not.toContain(".claude/skills/archive/old.md")
    expect(detectedPaths).not.toContain(".claude/skills/not-markdown.txt")
    expect(detectedPaths).not.toContain("packages/web/CLAUDE.md")
  })
})
