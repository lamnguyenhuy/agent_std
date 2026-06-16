import { useState, useCallback } from "react"

export type FeedbackType = "success" | "error" | null

export type ExportFeedback = {
  type: FeedbackType
  message: string
  retry?: () => void
}

export function useExportFeedback() {
  const [feedback, setFeedback] = useState<ExportFeedback>({
    type: null,
    message: "",
  })

  const showSuccess = useCallback((message: string) => {
    setFeedback({ type: "success", message })
  }, [])

  const showError = useCallback((message: string, retry?: () => void) => {
    setFeedback({ type: "error", message, retry })
  }, [])

  const dismiss = useCallback(() => {
    setFeedback({ type: null, message: "" })
  }, [])

  return { feedback, showSuccess, showError, dismiss }
}
