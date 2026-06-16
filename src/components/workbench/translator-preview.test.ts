import { readFileSync } from "node:fs"

import { describe, expect, it } from "vitest"

const source = readFileSync(
  "src/components/workbench/translator-preview.tsx",
  "utf8"
)

describe("TranslatorPreview compatibility note rendering contracts", () => {
  it("references compatibilityNotes in rendering logic", () => {
    expect(source).toContain("compatibilityNotes")
  })

  it("uses role='note' for compatibility note elements", () => {
    expect(source).toContain('role="note"')
  })

  it("applies warning-surface background styling", () => {
    expect(source).toContain("warning-surface")
  })

  it("applies warning color styling", () => {
    expect(source).toContain("--warning")
  })

  it("uses TriangleAlert as non-color visual indicator", () => {
    expect(source).toContain("TriangleAlert")
  })

  it("guards note rendering with compatibilityNotes.length check", () => {
    expect(source).toContain("compatibilityNotes.length")
  })
})
