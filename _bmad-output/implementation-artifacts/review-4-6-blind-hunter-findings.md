# Blind Hunter — Story 4.6 Findings

## 1. Success toast blocks auto-dismiss timer reset on re-render
`toast.tsx:22-25`: `useEffect` with `[type, dismiss]` deps. If component re-renders while success toast is visible (e.g., playbook state changes), the timer resets — extends visible duration past 5 seconds per re-render.

## 2. `retry` callback captures stale closure
`use-export-feedback.ts:19`: `showError(message, retry)` stores the retry callback in state. If the component re-renders and the handler closes over stale state (e.g., old `playbook` reference), retry uses stale data.

## 3. Error toast retry button lacks `aria-label`
`toast.tsx:58-63`: Retry button has no `aria-label`. Assistive tech users hear only "Retry export" with no context of what failed.

## 4. Success toast disappears without focus management
After 5 seconds the toast auto-dismisses. If keyboard focus was on the dismiss button, focus is lost — returns to `document.body`. AC 4 requires preserving keyboard context after error; same issue applies to auto-dismiss.

## 5. Both success and error toasts lack animation exit
`toast.tsx:39`: `transition-all duration-300` applies only to enter animation. On dismiss, the element is immediately removed from DOM — no exit animation.

## 6. `dismiss` useCallback wraps `onDismiss` unnecessarily
`toast.tsx:14-16`: `useCallback(() => onDismiss(), [onDismiss])` creates an extra wrapper. `onDismiss` can be called directly as the `onClick` handler.

## 7. Error toast persists indefinitely
`toast.tsx:22`: `if (type !== "success") return` — only success auto-dismisses. Error toast stays until manually dismissed. Acceptable per AC ("persistent until dismissed for error") but no visual hint that it's persistent vs auto-dismissing.

## 8. `handleDownloadGeneratedFiles` retry captures the function reference correctly
`agent-studio-workbench.tsx:241`: `showError(..., handleDownloadGeneratedFiles)` — passes the handler reference. Since it's recreated each render (not `useCallback`), the retry captures the current closure. Works but inconsistent with `useExportFeedback`'s `useCallback` patterns.

## 9. No loading/disabled state on buttons during async export
If user clicks Download Patch, toast appears briefly on success, but the button is immediately clickable again even before the download completes. Could queue multiple downloads.

## 10. `ExportToast` always renders at fixed position `right-4 top-4`
Overlapping toasts are not handled. If user triggers export twice rapidly (before first dismiss), both toasts stack at the same position, overlapping.
