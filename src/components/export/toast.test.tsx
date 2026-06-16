// @vitest-environment jsdom
import { describe, expect, it, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, cleanup } from "@testing-library/react"
import { ExportToast } from "./toast"
import type { ExportFeedback } from "./use-export-feedback"

beforeEach(() => {
  cleanup()
})

describe("ExportToast", () => {
  it("renders nothing when type is null", () => {
    const feedback: ExportFeedback = { type: null, message: "" }
    const { container } = render(<ExportToast feedback={feedback} onDismiss={() => {}} />)
    expect(container.innerHTML).toBe("")
  })

  it("renders success message", () => {
    const feedback: ExportFeedback = { type: "success", message: "Patch ready." }
    render(<ExportToast feedback={feedback} onDismiss={() => {}} />)
    expect(screen.getByText("Patch ready.")).toBeTruthy()
  })

  it("renders error message", () => {
    const feedback: ExportFeedback = { type: "error", message: "Export failed." }
    render(<ExportToast feedback={feedback} onDismiss={() => {}} />)
    expect(screen.getByText("Export failed.")).toBeTruthy()
  })

  it("has aria-live='polite' on the toast container", () => {
    const feedback: ExportFeedback = { type: "success", message: "Done." }
    const { container } = render(<ExportToast feedback={feedback} onDismiss={() => {}} />)
    const toastEl = container.querySelector('[role="status"]')
    expect(toastEl).toBeTruthy()
    expect(toastEl).toHaveAttribute("aria-live", "polite")
  })

  it("shows retry button for error with retry callback", () => {
    const retry = vi.fn()
    const feedback: ExportFeedback = { type: "error", message: "Failed.", retry }
    render(<ExportToast feedback={feedback} onDismiss={() => {}} />)
    const retryBtn = screen.getByText("Retry export")
    expect(retryBtn).toBeTruthy()
    fireEvent.click(retryBtn)
    expect(retry).toHaveBeenCalledOnce()
  })

  it("calls onDismiss when dismiss button clicked", () => {
    const onDismiss = vi.fn()
    const feedback: ExportFeedback = { type: "error", message: "Failed." }
    const { container } = render(<ExportToast feedback={feedback} onDismiss={onDismiss} />)
    const dismissBtn = container.querySelector('button[aria-label="Dismiss notification"]')
    expect(dismissBtn).toBeTruthy()
    fireEvent.click(dismissBtn!)
    expect(onDismiss).toHaveBeenCalledOnce()
  })
})
