import { describe, expect, it } from "vitest"
import JSZip from "jszip"
import { generateExportBundle } from "./generate-bundle"
import type { AgentPlaybook } from "@/lib/playbook/schema"
import type { GeneratedArtifact } from "@/lib/translators/types"

const testPlaybook: AgentPlaybook = {
  name: "test-playbook",
  version: "1.0",
  repo: "test-repo",
  description: "A test playbook",
  skills: [],
  agents: [],
  rules: [],
  context: [],
  translators: [{ tool: "claude-code", enabled: true }],
}

const claudeArtifacts: GeneratedArtifact[] = [
  {
    path: ".claude/CLAUDE.md",
    content: "# Claude Code output\n\nFollow the rules.",
    kind: "modified",
  },
]

const cursorArtifacts: GeneratedArtifact[] = [
  {
    path: ".cursorrules",
    content: "Cursor rules here.",
    kind: "modified",
  },
]

describe("generateExportBundle", () => {
  it("returns an ArrayBuffer", async () => {
    const result = await generateExportBundle(testPlaybook, [
      { label: "Claude Code", artifacts: claudeArtifacts },
    ])
    expect(result.buffer).toBeInstanceOf(ArrayBuffer)
  })

  it("includes .agent-studio/playbook.yaml in the archive", async () => {
    const result = await generateExportBundle(testPlaybook, [
      { label: "Claude Code", artifacts: claudeArtifacts },
    ])
    const zip = await JSZip.loadAsync(result.buffer)
    expect(Object.keys(zip.files)).toContain(".agent-studio/playbook.yaml")
  })

  it("includes translator artifacts in the archive", async () => {
    const result = await generateExportBundle(testPlaybook, [
      { label: "Claude Code", artifacts: claudeArtifacts },
      { label: "Cursor", artifacts: cursorArtifacts },
    ])
    const zip = await JSZip.loadAsync(result.buffer)
    expect(Object.keys(zip.files)).toContain(".claude/CLAUDE.md")
    expect(Object.keys(zip.files)).toContain(".cursorrules")
  })

  it("playbook.yaml content is valid YAML with playbook name", async () => {
    const result = await generateExportBundle(testPlaybook, [
      { label: "Claude Code", artifacts: claudeArtifacts },
    ])
    const zip = await JSZip.loadAsync(result.buffer)
    const content = await zip.file(".agent-studio/playbook.yaml")!.async("string")
    expect(content).toContain("test-playbook")
  })

  it("artifact content includes provenance text", async () => {
    const result = await generateExportBundle(testPlaybook, [
      { label: "Claude Code", artifacts: claudeArtifacts },
    ])
    const zip = await JSZip.loadAsync(result.buffer)
    const content = await zip.file(".claude/CLAUDE.md")!.async("string")
    expect(content).toContain("Generated from `.agent-studio/playbook.yaml`.")
    expect(content).toContain("<!--")
    expect(content).toContain("-->")
  })

  it("archive filename matches expected pattern", async () => {
    const result = await generateExportBundle(testPlaybook, [
      { label: "Claude Code", artifacts: claudeArtifacts },
    ])
    expect(result.filename).toMatch(/^test-playbook-generated-files-\d+\.zip$/)
  })
})
