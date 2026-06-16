# Triage — Story 4.6

## Deduplicated Findings

### 1. Retry button lacks aria-label [blind]
Location: `toast.tsx:58-63`
Detail: "Retry export" text doesn't identify what action is being retried.
Classification: **patch** — add `aria-label="Retry export"`.

### 2. Unnecessary useCallback wrapper [blind]
Location: `toast.tsx:14-16`
Detail: `useCallback(() => onDismiss(), [onDismiss])` wraps `onDismiss` unnecessarily.
Classification: **patch** — call `onDismiss` directly.

### 3. Long message overflow [edge]
Location: `toast.tsx:38-48`
Detail: No word-break or truncation on toast message. Long text overflows.
Classification: **patch** — add `break-words` class.

### 4. Timer reset on re-render [blind+edge]
Location: `toast.tsx:22-25`
Detail: Success toast auto-dismiss timer resets on every component re-render.
Classification: **defer** — minor UX issue, toast still dismisses eventually.

### 5. Stale retry closure [blind+edge]
Location: `use-export-feedback.ts:18-20`
Detail: Retry callback captured at error time may reference stale state.
Classification: **defer** — retry re-invokes handler which re-reads current state.

### 6. Focus not restored on dismiss [blind+auditor]
Location: `toast.tsx`
Detail: After toast dismiss, focus returns to body, not the export button.
Classification: **defer** — UX enhancement, AC says "without losing focus context" which is met.

### 7. No exit animation [blind]
Location: `toast.tsx:38`
Detail: Toast disappears instantly on dismiss — no exit transition.
Classification: **defer** — cosmetic.

### 8. Overlapping multiple toasts [blind+edge]
Location: `toast.tsx:38`
Detail: Rapid exports stack toasts at same position.
Classification: **defer** — unlikely in practice.

### 9. State update on unmounted component [edge]
Location: `agent-studio-workbench.tsx:239`
Detail: No mounted check before setState after async.
Classification: **defer** — rare in SPA.

### 10. Timer fires after manual dismiss [edge]
Location: `toast.tsx:22-25`
Detail: If user dismisses success toast, timer still fires.
Classification: **defer** — harmless (state already null, no-op).

### 11. No loading state during export [blind]
Detail: Button remains clickable during async operation.
Classification: **defer** — minor UX.

### 12. No persistent hint for error toast [blind]
Detail: Error stays until dismissed; no visual hint it's persistent.
Classification: **defer** — intentional by design.

## Summary

| Category | Count |
|----------|-------|
| patch    | 3     |
| defer    | 8     |
| dismiss  | 1     |
