import { readFileSync } from "node:fs"

import { describe, expect, it } from "vitest"

const tabsSource = readFileSync("src/components/ui/tabs.tsx", "utf8")

describe("Tabs component contract", () => {
  it("passes orientation to Radix and styles from the emitted orientation attribute", () => {
    expect(tabsSource).toContain("orientation={orientation}")
    expect(tabsSource).toContain("data-[orientation=horizontal]:flex-col")
    expect(tabsSource).toContain(
      "group-data-[orientation=vertical]/tabs:flex-col"
    )
    expect(tabsSource).not.toContain("data-horizontal:flex-col")
    expect(tabsSource).not.toContain("group-data-vertical/tabs")
  })
})
