import { describe, expect, it } from "vitest"

import {
  getImportedSectionAffordance,
  getImportedSectionEmptyState,
} from "@/components/workbench/imported-section-state"

describe("imported section state copy", () => {
  it("uses read-only copy for populated imported sections", () => {
    expect(getImportedSectionAffordance("Skills", 2)).toBe(
      "Imported from the Sample Repo. Rules are the only editable section in this MVP."
    )
  })

  it("does not claim imported content exists for empty imported sections", () => {
    expect(getImportedSectionAffordance("Skills", 0)).toBe(
      "No imported Skills were found in the Sample Repo."
    )
    expect(getImportedSectionEmptyState("Agents")).toBe(
      "No imported Agents were generated from the Sample Repo."
    )
    expect(getImportedSectionEmptyState("Context")).toBe(
      "No imported Context references were found in the Sample Repo."
    )
  })
})
