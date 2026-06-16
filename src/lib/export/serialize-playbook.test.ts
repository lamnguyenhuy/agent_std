import { describe, expect, it } from "vitest"
import yaml from "js-yaml"
import { serializePlaybookToYaml } from "./serialize-playbook"
import type { AgentPlaybook } from "@/lib/playbook/schema"

const fullPlaybook: AgentPlaybook = {
  name: "test-playbook",
  version: "1.0",
  repo: "test-repo",
  description: "A test playbook",
  skills: [
    {
      id: "skill-1",
      name: "Code Review",
      instructions: "Review all code changes.",
      origin: "imported",
      sourcePath: ".claude/skills/code-review.md",
    },
  ],
  agents: [
    {
      id: "agent-1",
      name: "Reviewer",
      role: "Code reviewer",
      instructions: ["Check for bugs.", "Verify tests."],
      origin: "imported",
      sourcePaths: [".claude/agents/reviewer.md"],
    },
  ],
  rules: [
    {
      id: "rule-1",
      text: "Use project standards.",
      origin: "imported",
      sourcePath: "CLAUDE.md",
    },
    {
      id: "rule-2",
      text: "Keep commits small.",
      origin: "edited",
    },
  ],
  context: [
    {
      id: "ctx-1",
      label: "Project docs",
      path: "docs/",
      origin: "imported",
      sourcePath: "docs/README.md",
    },
  ],
  translators: [
    { tool: "claude-code", enabled: true },
    { tool: "cursor", enabled: true },
    { tool: "windsurf", enabled: false },
  ],
}

const minimalPlaybook: AgentPlaybook = {
  name: "minimal",
  version: "0.1",
  repo: "mini",
  description: "Minimal playbook",
  skills: [],
  agents: [],
  rules: [],
  context: [],
  translators: [{ tool: "claude-code", enabled: true }],
}

describe("serializePlaybookToYaml", () => {
  it("returns a non-empty string for a full playbook", () => {
    const result = serializePlaybookToYaml(fullPlaybook)
    expect(result).toBeTruthy()
    expect(typeof result).toBe("string")
  })

  it("includes the playbook name in the output", () => {
    const result = serializePlaybookToYaml(fullPlaybook)
    expect(result).toContain("test-playbook")
  })

  it("output is valid YAML that can be parsed back", () => {
    const result = serializePlaybookToYaml(fullPlaybook)
    const parsed = yaml.load(result)
    expect(parsed).toBeTruthy()
    expect(typeof parsed).toBe("object")
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      expect((parsed as Record<string, unknown>).name).toBe("test-playbook")
    }
  })

  it("parsed YAML preserves skills array", () => {
    const result = serializePlaybookToYaml(fullPlaybook)
    const parsed = yaml.load(result) as Record<string, unknown>
    const skills = parsed.skills as Array<Record<string, unknown>>
    expect(skills).toHaveLength(1)
    expect(skills[0].name).toBe("Code Review")
  })

  it("parsed YAML preserves agents with instructions array", () => {
    const result = serializePlaybookToYaml(fullPlaybook)
    const parsed = yaml.load(result) as Record<string, unknown>
    const agents = parsed.agents as Array<Record<string, unknown>>
    expect(agents).toHaveLength(1)
    expect(agents[0].instructions).toEqual(["Check for bugs.", "Verify tests."])
  })

  it("parsed YAML handles multi-line rule text", () => {
    const playbookWithMultiLine: AgentPlaybook = {
      ...fullPlaybook,
      rules: [
        {
          id: "rule-ml",
          text: "Line one.\nLine two.\nLine three.",
          origin: "imported",
          sourcePath: "CLAUDE.md",
        },
      ],
    }
    const result = serializePlaybookToYaml(playbookWithMultiLine)
    const parsed = yaml.load(result) as Record<string, unknown>
    const rules = parsed.rules as Array<Record<string, unknown>>
    expect(rules[0].text).toBe("Line one.\nLine two.\nLine three.")
  })

  it("handles empty collections for skills/agents/rules/context", () => {
    const result = serializePlaybookToYaml(minimalPlaybook)
    const parsed = yaml.load(result) as Record<string, unknown>
    expect(parsed.skills).toEqual([])
    expect(parsed.agents).toEqual([])
    expect(parsed.rules).toEqual([])
    expect(parsed.context).toEqual([])
  })

  it("includes translators array", () => {
    const result = serializePlaybookToYaml(fullPlaybook)
    const parsed = yaml.load(result) as Record<string, unknown>
    const translators = parsed.translators as Array<Record<string, unknown>>
    expect(translators).toHaveLength(3)
    expect(translators[0].tool).toBe("claude-code")
    expect(translators[0].enabled).toBe(true)
  })

  it("serializes edited rule without sourcePath field", () => {
    const result = serializePlaybookToYaml(fullPlaybook)
    const parsed = yaml.load(result) as Record<string, unknown>
    const rules = parsed.rules as Array<Record<string, unknown>>
    const editedRule = rules.find((r) => r.origin === "edited")
    expect(editedRule).toBeDefined()
    expect(editedRule?.sourcePath).toBeUndefined()
    const importedRule = rules.find((r) => r.origin === "imported")
    expect(importedRule?.sourcePath).toBe("CLAUDE.md")
  })
})
