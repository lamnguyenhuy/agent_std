import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const source = readFileSync("src/components/workbench/plan-list.tsx", "utf8")

describe("PlanList rendering contracts", () => {
  it("imports StatusBadge", () => {
    expect(source).toContain("StatusBadge")
  })
  it("imports PlanChange type", () => {
    expect(source).toContain("PlanChange")
  })
  it("uses aria-label on the list", () => {
    expect(source).toContain("aria-label")
  })
  it("renders path with font-mono styling", () => {
    expect(source).toContain("font-mono")
  })
  it("uses change.kind for badge variant logic", () => {
    expect(source).toContain("change.kind")
  })
  it("renders change.label", () => {
    expect(source).toContain("change.label")
  })
})
