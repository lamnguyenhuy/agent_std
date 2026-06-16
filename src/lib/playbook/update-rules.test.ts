import { describe, expect, it } from "vitest"

import { validateRuleText } from "@/lib/playbook/update-rules"

describe("validateRuleText", () => {
  it("returns ok:false for empty string", () => {
    const result = validateRuleText("")
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe("rule-empty")
    }
  })

  it("returns ok:false for whitespace-only string (spaces)", () => {
    const result = validateRuleText("   ")
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe("rule-empty")
    }
  })

  it("returns ok:false for whitespace-only string (newline)", () => {
    const result = validateRuleText("\n")
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe("rule-empty")
    }
  })

  it("returns ok:false for whitespace-only string (tab)", () => {
    const result = validateRuleText("\t")
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe("rule-empty")
    }
  })

  it("returns ok:true with trimmed text for valid input", () => {
    const result = validateRuleText("  valid rule  ")
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data).toBe("valid rule")
    }
  })

  it("returns ok:true with unchanged text when no leading/trailing whitespace", () => {
    const result = validateRuleText("All components must have tests.")
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data).toBe("All components must have tests.")
    }
  })
})
