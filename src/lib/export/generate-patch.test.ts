import { describe, expect, it } from "vitest"
import { generateUnifiedDiff, generatePatchBundle, computeLineDiff } from "./generate-patch"

describe("computeLineDiff", () => {
  it("returns empty array for identical content", () => {
    const result = computeLineDiff("line1\nline2", "line1\nline2")
    expect(result.every((d) => d.type === "unchanged")).toBe(true)
  })

  it("detects additions", () => {
    const result = computeLineDiff("line1", "line1\nline2")
    const additions = result.filter((d) => d.type === "added")
    expect(additions).toHaveLength(1)
    expect(additions[0].line).toBe("line2")
  })

  it("detects removals", () => {
    const result = computeLineDiff("line1\nline2", "line1")
    const removals = result.filter((d) => d.type === "removed")
    expect(removals).toHaveLength(1)
    expect(removals[0].line).toBe("line2")
  })

  it("handles empty before string", () => {
    const result = computeLineDiff("", "line1\nline2")
    expect(result.every((d) => d.type === "added")).toBe(true)
    expect(result).toHaveLength(2)
  })

  it("handles empty after string", () => {
    const result = computeLineDiff("line1\nline2", "")
    expect(result.every((d) => d.type === "removed")).toBe(true)
    expect(result).toHaveLength(2)
  })
})

describe("generateUnifiedDiff", () => {
  it("returns empty string for identical files", () => {
    const result = generateUnifiedDiff("line1\nline2", "line1\nline2", "file.txt")
    expect(result).toBe("")
  })

  it("produces unified diff for added lines", () => {
    const result = generateUnifiedDiff("line1", "line1\nline2", "file.txt")
    expect(result).toContain("--- a/file.txt")
    expect(result).toContain("+++ b/file.txt")
    expect(result).toContain("+line2")
    expect(result).toContain("@@")
  })

  it("produces unified diff for removed lines", () => {
    const result = generateUnifiedDiff("line1\nline2", "line1", "file.txt")
    expect(result).toContain("-line2")
  })

  it("marks new files with /dev/null as source", () => {
    const result = generateUnifiedDiff("", "new content", "new-file.md")
    expect(result).toContain("--- /dev/null")
    expect(result).toContain("+++ b/new-file.md")
    expect(result).toContain("+new content")
  })

  it("marks deleted files with /dev/null as target", () => {
    const result = generateUnifiedDiff("old content", "", "deleted-file.md")
    expect(result).toContain("--- a/deleted-file.md")
    expect(result).toContain("+++ /dev/null")
    expect(result).toContain("-old content")
  })
})

describe("generatePatchBundle", () => {
  it("returns empty string for no changes", () => {
    const result = generatePatchBundle([
      { path: "file.txt", before: "same", after: "same" },
    ])
    expect(result).toBe("")
  })

  it("combines diffs from multiple files", () => {
    const result = generatePatchBundle([
      { path: "file1.txt", before: "old", after: "new" },
      { path: "file2.txt", before: "", after: "added" },
    ])
    expect(result).toContain("file1.txt")
    expect(result).toContain("file2.txt")
    expect(result).toContain("-old")
    expect(result).toContain("+new")
    expect(result).toContain("+added")
  })
})
