import { describe, expect, it } from "vitest"
import JSZip from "jszip"
import { generatePatchArchive } from "./generate-patch-archive"
import type { AgentPlaybook } from "@/lib/playbook/schema"
import type { GeneratedArtifact } from "@/lib/translators/types"
import type { ArtifactPair } from "./generate-patch"

const testPlaybook: AgentPlaybook = {
  name: "test",
  version: "1.0",
  repo: "test",
  description: "test",
  skills: [],
  agents: [],
  rules: [],
  context: [],
  translators: [{ tool: "claude-code", enabled: true }],
}

const pairs: ArtifactPair[] = [
  {
    path: ".claude/CLAUDE.md",
    before: "Old content",
    after: "New content",
  },
]

const translatorResults: Array<{ label: string; artifacts: GeneratedArtifact[] }> = [
  {
    label: "Claude Code",
    artifacts: [
      { path: ".claude/CLAUDE.md", content: "New content", kind: "modified" },
    ],
  },
]

describe("generatePatchArchive", () => {
  it("returns an ArrayBuffer", async () => {
    const result = await generatePatchArchive(testPlaybook, pairs, translatorResults)
    expect(result.buffer).toBeInstanceOf(ArrayBuffer)
  })

  it("includes agent-studio.patch in the archive", async () => {
    const result = await generatePatchArchive(testPlaybook, pairs, translatorResults)
    const zip = await JSZip.loadAsync(result.buffer)
    expect(Object.keys(zip.files)).toContain("agent-studio.patch")
  })

  it("includes .agent-studio/playbook.yaml in the archive", async () => {
    const result = await generatePatchArchive(testPlaybook, pairs, translatorResults)
    const zip = await JSZip.loadAsync(result.buffer)
    expect(Object.keys(zip.files)).toContain(".agent-studio/playbook.yaml")
  })

  it("includes translator artifacts in the archive", async () => {
    const result = await generatePatchArchive(testPlaybook, pairs, translatorResults)
    const zip = await JSZip.loadAsync(result.buffer)
    expect(Object.keys(zip.files)).toContain(".claude/CLAUDE.md")
  })

  it("patch content contains diff", async () => {
    const result = await generatePatchArchive(testPlaybook, pairs, translatorResults)
    const zip = await JSZip.loadAsync(result.buffer)
    const content = await zip.file("agent-studio.patch")!.async("string")
    expect(content).toContain("a/.claude/CLAUDE.md")  // diff path referencerence
    expect(content).toContain("-Old content")
    expect(content).toContain("+New content")
  })
})
