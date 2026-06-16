import { describe, expect, it } from "vitest"
import { computeExportReadiness } from "./export-readiness"
import type { AgentPlaybook } from "@/lib/playbook/schema"

const validPlaybook = {
  name: "test",
  version: "1.0",
  repo: "test",
  description: "test",
  skills: [],
  agents: [],
  rules: [],
  context: [],
  translators: [],
} satisfies AgentPlaybook

describe("computeExportReadiness", () => {
  it("returns canExport=false when playbook is null", () => {
    const result = computeExportReadiness(null, {})
    expect(result.canExport).toBe(false)
    expect(result.reason).toBeDefined()
  })

  it("returns canExport=true when playbook exists and no drafts", () => {
    const result = computeExportReadiness(validPlaybook, {})
    expect(result.canExport).toBe(true)
    expect(result.reason).toBeUndefined()
  })

  it("returns canExport=false when a draft has empty text", () => {
    const result = computeExportReadiness(validPlaybook, {
      "rule-1": "",
    })
    expect(result.canExport).toBe(false)
    expect(result.reason).toBeDefined()
  })

  it("returns canExport=false when a draft has whitespace-only text", () => {
    const result = computeExportReadiness(validPlaybook, {
      "rule-1": "   ",
    })
    expect(result.canExport).toBe(false)
    expect(result.reason).toBeDefined()
  })

  it("returns canExport=true when drafts have non-empty text", () => {
    const result = computeExportReadiness(validPlaybook, {
      "rule-1": "some valid text",
    })
    expect(result.canExport).toBe(true)
    expect(result.reason).toBeUndefined()
  })

  it("returns canExport=false when any one of multiple drafts is invalid", () => {
    const result = computeExportReadiness(validPlaybook, {
      "rule-1": "valid text",
      "rule-2": "",
      "rule-3": "  ",
    })
    expect(result.canExport).toBe(false)
    expect(result.reason).toBeDefined()
  })

  it("returns canExport=true when all drafts have non-empty text", () => {
    const result = computeExportReadiness(validPlaybook, {
      "rule-1": "valid text",
      "rule-2": "more valid text",
    })
    expect(result.canExport).toBe(true)
    expect(result.reason).toBeUndefined()
  })
})
