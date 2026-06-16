// @vitest-environment jsdom
import { describe, expect, it } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useExportFeedback } from "./use-export-feedback"

describe("useExportFeedback", () => {
  it("starts with null type and empty message", () => {
    const { result } = renderHook(() => useExportFeedback())
    expect(result.current.feedback.type).toBeNull()
    expect(result.current.feedback.message).toBe("")
  })

  it("showSuccess sets type to success with message", () => {
    const { result } = renderHook(() => useExportFeedback())
    act(() => result.current.showSuccess("Patch ready."))
    expect(result.current.feedback.type).toBe("success")
    expect(result.current.feedback.message).toBe("Patch ready.")
  })

  it("showError sets type to error with message", () => {
    const { result } = renderHook(() => useExportFeedback())
    act(() => result.current.showError("Export failed."))
    expect(result.current.feedback.type).toBe("error")
    expect(result.current.feedback.message).toBe("Export failed.")
  })

  it("showError accepts retry callback", () => {
    const { result } = renderHook(() => useExportFeedback())
    const retryFn = () => {}
    act(() => result.current.showError("Failed.", retryFn))
    expect(result.current.feedback.retry).toBe(retryFn)
  })

  it("dismiss clears feedback", () => {
    const { result } = renderHook(() => useExportFeedback())
    act(() => result.current.showSuccess("Done."))
    expect(result.current.feedback.type).toBe("success")
    act(() => result.current.dismiss())
    expect(result.current.feedback.type).toBeNull()
    expect(result.current.feedback.message).toBe("")
  })
})
