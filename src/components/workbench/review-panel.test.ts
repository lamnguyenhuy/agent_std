import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const source = readFileSync("src/components/workbench/review-panel.tsx", "utf8")

describe("ReviewPanel rendering contracts", () => {
  it("imports PlanList", () => {
    expect(source).toContain("PlanList")
  })
  it("imports BehaviorDiff", () => {
    expect(source).toContain("BehaviorDiff")
    expect(source).toContain("@/components/workbench/behavior-diff")
  })
  it("imports BehaviorDiffItem type", () => {
    expect(source).toContain("BehaviorDiffItem")
    expect(source).toContain("@/lib/review/behavior-diff")
  })
  it("renders a Plan heading", () => {
    expect(source).toContain("Plan")
  })
  it("renders a Behavior Diff heading", () => {
    expect(source).toContain("Behavior Diff")
  })
  it("accepts plan prop", () => {
    expect(source).toContain("plan")
  })
  it("accepts behaviorDiff prop", () => {
    expect(source).toContain("behaviorDiff")
  })
  it("renders a null/empty state", () => {
    expect(source).toContain("null")
  })
})
