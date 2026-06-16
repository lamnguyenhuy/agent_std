import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const source = readFileSync("src/components/workbench/behavior-diff.tsx", "utf8")

describe("BehaviorDiff rendering contracts", () => {
  it("imports BehaviorDiffItem type", () => {
    expect(source).toContain("BehaviorDiffItem")
    expect(source).toContain("@/lib/review/behavior-diff")
  })

  it("uses aria-label on the list", () => {
    expect(source).toContain('aria-label="Behavior Diff"')
  })

  it("renders explicit row marker, label, and summary", () => {
    expect(source).toContain("item.marker")
    expect(source).toContain("item.label")
    expect(source).toContain("item.summary")
  })

  it("contains explicit text labels for diff kinds", () => {
    expect(source).toContain("Added")
    expect(source).toContain("Removed")
    expect(source).toContain("Edited")
  })

  it("includes color support for addition, removal, and edit states", () => {
    expect(source).toContain("text-primary")
    expect(source).toContain("text-destructive")
    expect(source).toContain("--warning")
  })

  it("contains the deterministic empty state", () => {
    expect(source).toContain("No Rule behavior changes yet.")
  })
})
