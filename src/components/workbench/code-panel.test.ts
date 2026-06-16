import { describe, expect, it, vi } from "vitest"

import { copyTextToClipboard } from "@/components/workbench/code-panel"

describe("copyTextToClipboard", () => {
  it("returns false when the Clipboard API is unavailable", async () => {
    const navigatorSpy = vi
      .spyOn(globalThis, "navigator", "get")
      .mockReturnValue({} as Navigator)

    await expect(copyTextToClipboard("content")).resolves.toBe(false)

    navigatorSpy.mockRestore()
  })

  it("returns false when clipboard writes reject", async () => {
    const navigatorSpy = vi
      .spyOn(globalThis, "navigator", "get")
      .mockReturnValue({
        clipboard: {
          writeText: vi.fn().mockRejectedValue(new Error("denied")),
        },
      } as unknown as Navigator)

    await expect(copyTextToClipboard("content")).resolves.toBe(false)

    navigatorSpy.mockRestore()
  })
})
