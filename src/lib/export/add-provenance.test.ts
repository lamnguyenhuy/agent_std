import { describe, expect, it } from "vitest"
import { addProvenance } from "./add-provenance"

describe("addProvenance", () => {
  it("prepends YAML-style comment for .yaml files", () => {
    const result = addProvenance("playbook.yaml", "content: true")
    expect(result).toContain("# Generated from")
    expect(result).toContain("# Generated from `.agent-studio/playbook.yaml`.")
    expect(result).toContain("content: true")
  })

  it("uses HTML comment style for .md files", () => {
    const result = addProvenance("README.md", "# Project Title")
    expect(result).toContain("<!-- Generated from")
    expect(result).toContain("-->")
    expect(result).toContain("# Project Title")
  })

  it("uses HTML comment style for .html files", () => {
    const result = addProvenance("index.html", "<body></body>")
    expect(result).toContain("<!-- Generated from")
    expect(result).toContain("-->")
  })

  it("uses // comment style for .ts and .js files", () => {
    const tsResult = addProvenance("agent.ts", "export const x = 1")
    expect(tsResult).toContain("// Generated from")
    const jsResult = addProvenance("agent.js", "const x = 1")
    expect(jsResult).toContain("// Generated from")
  })

  it("uses # comment for .py and .sh files", () => {
    const pyResult = addProvenance("agent.py", "def main(): pass")
    expect(pyResult).toContain("# Generated from")
    const shResult = addProvenance("run.sh", "echo hello")
    expect(shResult).toContain("# Generated from")
  })

  it("does not duplicate provenance when already present", () => {
    const first = addProvenance("test.yaml", "key: value")
    const second = addProvenance("test.yaml", first)
    const count = (second.match(/Generated from/g) || []).length
    expect(count).toBe(1)
  })

  it("returns only provenance for empty content", () => {
    const result = addProvenance("empty.yaml", "")
    expect(result).toBe("# Generated from `.agent-studio/playbook.yaml`. Do not edit directly.")
  })

  it("defaults to # style for unknown extensions", () => {
    const result = addProvenance("file.unknown", "some content")
    expect(result).toContain("# Generated from")
    expect(result).toContain("some content")
  })
})
