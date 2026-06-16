import { describe, expect, it } from "vitest"

import { generatePlaybookDraft } from "@/lib/playbook/generate"
import type { AgentPlaybook } from "@/lib/playbook/schema"
import { sampleRepoFiles } from "@/lib/sample-repo/fixtures"
import { scanSampleRepoFiles } from "@/lib/sample-repo/scanner"
import { claudeCodeTranslator } from "@/lib/translators/claude-code"

const detectedFiles = scanSampleRepoFiles(sampleRepoFiles)
const testPlaybook = generatePlaybookDraft(detectedFiles, sampleRepoFiles)

function withPlaybook(overrides: Partial<AgentPlaybook>): AgentPlaybook {
  return {
    ...testPlaybook,
    ...overrides,
  }
}

describe("claudeCodeTranslator", () => {
  it("returns one artifact with path CLAUDE.md", () => {
    const result = claudeCodeTranslator.translate(testPlaybook)
    expect(result.artifacts).toHaveLength(1)
    expect(result.artifacts[0].path).toBe("CLAUDE.md")
    expect(result.artifacts[0].kind).toBe("modified")
  })

  it("artifact content includes the playbook name", () => {
    const result = claudeCodeTranslator.translate(testPlaybook)
    expect(result.artifacts[0].content).toContain(testPlaybook.name)
  })

  it("artifact content includes provenance reference to .agent-studio/playbook.yaml", () => {
    const result = claudeCodeTranslator.translate(testPlaybook)
    expect(result.artifacts[0].content).toContain(".agent-studio/playbook.yaml")
  })

  it("artifact content warns that CLAUDE.md is generated output", () => {
    const result = claudeCodeTranslator.translate(testPlaybook)
    expect(result.artifacts[0].content).toContain("generated output")
    expect(result.artifacts[0].content).toContain("Agent Playbook is canonical")
  })

  it("artifact content references imported skills by name and source path", () => {
    const result = claudeCodeTranslator.translate(testPlaybook)
    for (const skill of testPlaybook.skills) {
      expect(result.artifacts[0].content).toContain(skill.name)
      expect(result.artifacts[0].content).toContain(skill.sourcePath)
    }
  })

  it("artifact content includes each rule text", () => {
    const result = claudeCodeTranslator.translate(testPlaybook)
    for (const rule of testPlaybook.rules) {
      expect(result.artifacts[0].content).toContain(rule.text)
    }
  })

  it("compatibilityNotes is an empty array", () => {
    const result = claudeCodeTranslator.translate(testPlaybook)
    expect(result.compatibilityNotes).toEqual([])
  })

  it("calling translate twice with the same playbook returns identical output", () => {
    const result1 = claudeCodeTranslator.translate(testPlaybook)
    const result2 = claudeCodeTranslator.translate(testPlaybook)
    expect(result1).toEqual(result2)
  })

  it("reflects rule changes from the current playbook input", () => {
    const changedRuleText =
      "Prefer loading, error, and empty states in every UI flow."
    const changedPlaybook = {
      ...testPlaybook,
      rules: [
        ...testPlaybook.rules,
        {
          id: "rule-user-ui-states",
          origin: "edited" as const,
          text: changedRuleText,
        },
      ],
    }

    const original = claudeCodeTranslator.translate(testPlaybook)
    const changed = claudeCodeTranslator.translate(changedPlaybook)

    expect(changed.artifacts[0].content).toContain(changedRuleText)
    expect(changed.artifacts[0].content).not.toBe(original.artifacts[0].content)
  })

  it("normalizes playbook-provided text that could alter markdown structure", () => {
    const unsafePlaybook = withPlaybook({
      name: "Unsafe\n## Injected Name",
      repo: "sample\n- injected repo item",
      rules: [
        {
          id: "rule-unsafe",
          origin: "edited",
          text: "First line\n## Injected Rule",
        },
      ],
      skills: [
        {
          id: "skill-unsafe",
          name: "review\n## Injected Skill",
          instructions: "Review carefully.",
          origin: "imported",
          sourcePath: ".claude/skills/review.md\n## Injected Path",
        },
      ],
    })

    const result = claudeCodeTranslator.translate(unsafePlaybook)

    expect(result.artifacts[0].content).not.toContain("\n## Injected Name")
    expect(result.artifacts[0].content).not.toContain("\n- injected repo item")
    expect(result.artifacts[0].content).not.toContain("\n## Injected Rule")
    expect(result.artifacts[0].content).not.toContain("\n## Injected Skill")
    expect(result.artifacts[0].content).not.toContain("\n## Injected Path")
    expect(result.artifacts[0].content).toContain("First line ## Injected Rule")
  })

  it("renders explicit empty state text when no rules exist", () => {
    const result = claudeCodeTranslator.translate(withPlaybook({ rules: [] }))

    expect(result.artifacts[0].content).toContain(
      "No Playbook rules are currently defined."
    )
  })

  it("renders explicit empty state text when no imported skills exist", () => {
    const result = claudeCodeTranslator.translate(withPlaybook({ skills: [] }))

    expect(result.artifacts[0].content).toContain(
      "No imported Claude skills are referenced by this Playbook."
    )
  })
})
