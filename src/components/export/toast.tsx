"use client"

import { useEffect } from "react"
import type { ExportFeedback } from "./use-export-feedback"

type ToastProps = {
  feedback: ExportFeedback
  onDismiss: () => void
}

export function ExportToast({ feedback, onDismiss }: ToastProps) {
  const { type, message, retry } = feedback

  // Auto-dismiss success after 5 seconds
  useEffect(() => {
    if (type !== "success") return
    const timer = setTimeout(onDismiss, 5000)
    return () => clearTimeout(timer)
  }, [type, onDismiss])

  if (type == null) return null

  const isError = type === "error"

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`fixed right-4 top-4 z-50 max-w-sm rounded-lg border px-4 py-3 shadow-lg transition-all duration-300 break-words ${
        isError
          ? "border-red-300 bg-red-50 text-red-800"
          : "border-green-300 bg-green-50 text-green-800"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={onDismiss}
          className={`shrink-0 rounded p-0.5 ${
            isError
              ? "text-red-500 hover:text-red-700"
              : "text-green-500 hover:text-green-700"
          }`}
          aria-label="Dismiss notification"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      {isError && retry && (
        <button
          onClick={retry}
          aria-label="Retry export"
          className="mt-2 text-sm font-medium text-red-700 underline hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
        >
          Retry export
        </button>
      )}
    </div>
  )
}
