import { describe, expect, it } from "vitest"

import { generatePlaybookDraft } from "@/lib/playbook/generate"
import type { AgentPlaybook } from "@/lib/playbook/schema"
import { sampleRepoFiles } from "@/lib/sample-repo/fixtures"
import { scanSampleRepoFiles } from "@/lib/sample-repo/scanner"
import { cursorTranslator } from "@/lib/translators/cursor"

const detectedFiles = scanSampleRepoFiles(sampleRepoFiles)
const testPlaybook = generatePlaybookDraft(detectedFiles, sampleRepoFiles)

function withPlaybook(overrides: Partial<AgentPlaybook>): AgentPlaybook {
  return {
    ...testPlaybook,
    ...overrides,
  }
}

describe("cursorTranslator", () => {
  it("returns modern Cursor rules first and legacy .cursorrules second", () => {
    const result = cursorTranslator.translate(testPlaybook)

    expect(result.artifacts).toHaveLength(2)
    expect(result.artifacts[0].path).toBe(".cursor/rules/playbook.mdc")
    expect(result.artifacts[1].path).toBe(".cursorrules")
    expect(result.artifacts[0].kind).toBe("modified")
    expect(result.artifacts[1].kind).toBe("modified")
  })

  it("includes provenance and canonical source warning in every artifact", () => {
    const result = cursorTranslator.translate(testPlaybook)

    for (const artifact of result.artifacts) {
      expect(artifact.content).toContain(
        "Generated from .agent-studio/playbook.yaml"
      )
      expect(artifact.content).toContain("generated output")
      expect(artifact.content).toContain("Agent Playbook is canonical")
    }
  })

  it("renders representative Cursor content and all current rule text", () => {
    const result = cursorTranslator.translate(testPlaybook)
    const modern = result.artifacts[0].content
    const legacy = result.artifacts[1].content

    expect(modern).toContain("description:")
    expect(modern).toContain("globs:")
    expect(modern).toContain("alwaysApply:")
    expect(legacy).toContain(".cursorrules")
    for (const rule of testPlaybook.rules) {
      expect(modern).toContain(rule.text)
      expect(legacy).toContain(rule.text)
    }
  })

  it("explains modern .cursor/rules is primary and .cursorrules is legacy compatibility", () => {
    const result = cursorTranslator.translate(testPlaybook)
    const combined = [
      ...result.artifacts.map((artifact) => artifact.content),
      ...result.compatibilityNotes.map((note) => note.message),
    ].join("\n")

    expect(combined).toContain(".cursor/rules")
    expect(combined).toContain("primary")
    expect(combined).toContain(".cursorrules")
    expect(combined).toContain("legacy compatibility")
  })

  it("calling translate twice with the same playbook returns identical output", () => {
    const result1 = cursorTranslator.translate(testPlaybook)
    const result2 = cursorTranslator.translate(testPlaybook)

    expect(result1).toEqual(result2)
  })

  it("renders explicit empty state text when no rules exist", () => {
    const result = cursorTranslator.translate(withPlaybook({ rules: [] }))

    for (const artifact of result.artifacts) {
      expect(artifact.content).toContain(
        "No Playbook rules are currently defined."
      )
    }
  })

  it("normalizes playbook-provided text before rendering generated markdown", () => {
    const unsafePlaybook = withPlaybook({
      name: "Unsafe\nInjected Name",
      description: "Description\nInjected Description",
      repo: "sample\nInjected Repo",
      rules: [
        {
          id: "rule-unsafe",
          origin: "edited",
          text: "First line\nInjected Rule",
        },
      ],
    })

    const result = cursorTranslator.translate(unsafePlaybook)
    const combined = result.artifacts
      .map((artifact) => artifact.content)
      .join("\n")

    expect(combined).not.toContain("\nInjected Name")
    expect(combined).not.toContain("\nInjected Description")
    expect(combined).not.toContain("\nInjected Repo")
    expect(combined).not.toContain("\nInjected Rule")
    expect(combined).toContain("First line Injected Rule")
  })

  it("reflects rule changes from the current playbook input", () => {
    const changedRuleText =
      "Prefer Cursor rules that keep generated behavior reviewable."
    const changedPlaybook = {
      ...testPlaybook,
      rules: [
        ...testPlaybook.rules,
        {
          id: "rule-user-cursor-review",
          origin: "edited" as const,
          text: changedRuleText,
        },
      ],
    }

    const original = cursorTranslator.translate(testPlaybook)
    const changed = cursorTranslator.translate(changedPlaybook)

    expect(changed.artifacts[0].content).toContain(changedRuleText)
    expect(changed.artifacts[1].content).toContain(changedRuleText)
    expect(changed).not.toEqual(original)
  })
})
