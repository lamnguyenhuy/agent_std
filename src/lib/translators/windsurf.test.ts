import { describe, expect, it } from "vitest"

import { generatePlaybookDraft } from "@/lib/playbook/generate"
import type { AgentPlaybook } from "@/lib/playbook/schema"
import { sampleRepoFiles } from "@/lib/sample-repo/fixtures"
import { scanSampleRepoFiles } from "@/lib/sample-repo/scanner"
import { windsurfTranslator } from "@/lib/translators/windsurf"

const detectedFiles = scanSampleRepoFiles(sampleRepoFiles)
const testPlaybook = generatePlaybookDraft(detectedFiles, sampleRepoFiles)

function withPlaybook(overrides: Partial<AgentPlaybook>): AgentPlaybook {
  return {
    ...testPlaybook,
    ...overrides,
  }
}

describe("windsurfTranslator", () => {
  it("returns exactly one artifact at .windsurf/rules/playbook.md", () => {
    const result = windsurfTranslator.translate(testPlaybook)

    expect(result.artifacts).toHaveLength(1)
    expect(result.artifacts[0].path).toBe(".windsurf/rules/playbook.md")
    expect(result.artifacts[0].kind).toBe("modified")
  })

  it("includes trigger: always_on frontmatter", () => {
    const result = windsurfTranslator.translate(testPlaybook)

    expect(result.artifacts[0].content).toContain("trigger: always_on")
  })

  it("includes provenance and canonical source warning in the artifact", () => {
    const result = windsurfTranslator.translate(testPlaybook)

    expect(result.artifacts[0].content).toContain(
      "Generated from .agent-studio/playbook.yaml"
    )
    expect(result.artifacts[0].content).toContain("generated output")
    expect(result.artifacts[0].content).toContain("Agent Playbook is canonical")
  })

  it("renders representative Windsurf content and all current rule text", () => {
    const result = windsurfTranslator.translate(testPlaybook)
    const content = result.artifacts[0].content

    for (const rule of testPlaybook.rules) {
      expect(content).toContain(rule.text)
    }
  })

  it("calling translate twice with the same playbook returns identical output", () => {
    const result1 = windsurfTranslator.translate(testPlaybook)
    const result2 = windsurfTranslator.translate(testPlaybook)

    expect(result1).toEqual(result2)
  })

  it("renders explicit empty state text when no rules exist", () => {
    const result = windsurfTranslator.translate(withPlaybook({ rules: [] }))

    expect(result.artifacts[0].content).toContain(
      "No Playbook rules are currently defined."
    )
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

    const result = windsurfTranslator.translate(unsafePlaybook)
    const content = result.artifacts[0].content

    expect(content).not.toContain("\nInjected Name")
    expect(content).not.toContain("\nInjected Description")
    expect(content).not.toContain("\nInjected Repo")
    expect(content).not.toContain("\nInjected Rule")
    expect(content).toContain("First line Injected Rule")
  })

  it("reflects rule changes from the current playbook input", () => {
    const changedRuleText =
      "Prefer Windsurf rules that keep generated behavior reviewable."
    const changedPlaybook = {
      ...testPlaybook,
      rules: [
        ...testPlaybook.rules,
        {
          id: "rule-user-windsurf-review",
          origin: "edited" as const,
          text: changedRuleText,
        },
      ],
    }

    const original = windsurfTranslator.translate(testPlaybook)
    const changed = windsurfTranslator.translate(changedPlaybook)

    expect(changed.artifacts[0].content).toContain(changedRuleText)
    expect(changed).not.toEqual(original)
  })

  it("returns empty compatibilityNotes array", () => {
    const result = windsurfTranslator.translate(testPlaybook)

    expect(result.compatibilityNotes).toEqual([])
  })
})
