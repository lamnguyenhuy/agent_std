import { readFileSync } from "node:fs"

import { describe, expect, it } from "vitest"

const workbenchSource = readFileSync(
  "src/components/workbench/agent-studio-workbench.tsx",
  "utf8"
)

describe("AgentStudioWorkbench story contracts", () => {
  it("keeps the preview aside wrapper class unchanged", () => {
    expect(workbenchSource).toContain(
      'className="min-h-[420px] rounded-lg border border-border bg-card"'
    )
    expect(workbenchSource).not.toContain(
      'className="min-h-[420px] min-w-0 overflow-hidden rounded-lg border border-border bg-card"'
    )
  })
  it("imports ReviewPanel for the review tab", () => {
    expect(workbenchSource).toContain("ReviewPanel")
  })
  it("imports generatePlan for plan derivation", () => {
    expect(workbenchSource).toContain("generatePlan")
  })
  it("imports generateBehaviorDiff for behavior diff derivation", () => {
    expect(workbenchSource).toContain("generateBehaviorDiff")
    expect(workbenchSource).toContain("@/lib/review/behavior-diff")
  })
  it("computes plan with generatePlan call", () => {
    expect(workbenchSource).toContain("generatePlan(")
  })
  it("keeps an initialRules baseline for behavior diff comparison", () => {
    expect(workbenchSource).toContain("initialRules")
  })
  it("computes behavior diff with generateBehaviorDiff call", () => {
    expect(workbenchSource).toContain("generateBehaviorDiff(")
  })
  it("passes behaviorDiff to ReviewPanel", () => {
    expect(workbenchSource).toContain("behaviorDiff={behaviorDiff}")
  })
  it("does not contain the Epic 4 placeholder text", () => {
    expect(workbenchSource).not.toContain("Review — coming in Epic 4")
  })
})

  it("imports computeExportReadiness from review/export-readiness", () => {
    expect(workbenchSource).toContain("computeExportReadiness")
    expect(workbenchSource).toContain("@/lib/review/export-readiness")
  })
  it("computes exportReadiness with computeExportReadiness call", () => {
    expect(workbenchSource).toContain("computeExportReadiness(")
  })
  it("derives exportReadiness variable", () => {
    expect(workbenchSource).toContain("exportReadiness")
  })
  it("uses exportReadiness.canExport for Download Patch disabled state", () => {
    expect(workbenchSource).toContain("exportReadiness.canExport")
  })
  it("shows export readiness reason in button title", () => {
    expect(workbenchSource).toContain("exportReadiness.reason")
  })

  it("imports generateExportBundle from export/generate-bundle", () => {
    expect(workbenchSource).toContain("generateExportBundle")
    expect(workbenchSource).toContain("@/lib/export/generate-bundle")
  })
  it("imports downloadBlob from export/download-blob", () => {
    expect(workbenchSource).toContain("downloadBlob")
    expect(workbenchSource).toContain("@/lib/export/download-blob")
  })
  it("renders a Download Generated Files button", () => {
    expect(workbenchSource).toContain("Download Generated Files")
  })
  it("applies variant='outline' to Download Generated Files", () => {
    expect(workbenchSource).toContain('variant="outline"')
  })
  it("disables Download Generated Files when export is not ready", () => {
    expect(workbenchSource).toContain("disabled={!exportReadiness.canExport}")
  })
  it("calls handleDownloadGeneratedFiles on click", () => {
    expect(workbenchSource).toContain("handleDownloadGeneratedFiles")
  })
