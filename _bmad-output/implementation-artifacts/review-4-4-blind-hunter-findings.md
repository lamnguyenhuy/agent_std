# Blind Hunter — Story 4.4 Findings

## 1. Silent catch swallows all errors
`agent-studio-workbench.tsx:220-222`: `catch { // Silently fail }` — any error during bundle generation (zip creation, translator failure, download trigger) is silently swallowed. User gets zero feedback on failure. Story 4.6 owns the feedback UX, but a silent fail baseline means the app is broken-open during 4.4 → 4.6 gap.

## 2. `handleDownloadGeneratedFiles` re-translates on every click
`agent-studio-workbench.tsx:214-215`: calls `TRANSLATORS.map(t => t.translate(playbook))` on each click. The `plan` useMemo at line 92-100 already computes the same translator results. Duplicate work, though acceptable for click-triggered action.

## 3. Handler doesn't re-check export readiness at invocation time
`agent-studio-workbench.tsx:211`: only guards `playbook == null`. If `exportReadiness.canExport` becomes false between render and click (e.g., race with rule edit), the handler proceeds regardless. The `disabled` prop on the button prevents this in practice, but not programmatically.

## 4. No loading state during async generation
`agent-studio-workbench.tsx:210-223`: the handler is async but provides no visual feedback (spinner, disabled state, etc.). If generation takes noticeable time, app appears unresponsive to the click.

## 5. `bundleToBlob` creates Blob before environment check
`generate-bundle.ts:36-38`: `new Blob([buffer], ...)` can be called in both Node and browser, but `downloadBlob` is the only consumer and it guards `window`. If someone calls `bundleToBlob` outside the download flow (e.g., in a test), there's no issue, but the Blob constructor may fail in some server-side runtimes.

## 6. `Date.now()` in filename breaks deterministic generation (NFR-6)
`generate-bundle.ts:32`: `${Date.now()}.zip` — same playbook state produces different filenames on every export. PRD NFR-6 requires deterministic generation for the same Sample Repo and Rule set.

## 7. `serializePlaybookToYaml` uses default js-yaml quoting
YAML 1.1 treats unquoted `1.0` as a float, so js-yaml quotes `version: "1.0"` as `version: '1.0'`. This is correct behavior but the single-quoted version string may be unexpected. No functional impact but worth noting.

## 8. `downloadBlob` timeout cleanup is brittle
`download-blob.ts:18-20`: removes the anchor from DOM after 100 ms. Some browsers require the anchor to remain in DOM for the download to initiate. If the browser's download start is slower than 100 ms, the anchor is removed before the click completes, and the download never starts.

## 9. No guard against rapid multiple clicks
`handleDownloadGeneratedFiles` is async but doesn't debounce or disable itself during generation. Rapid clicks queue multiple calls, each generating a separate ZIP and triggering multiple downloads.

## 10. `handleDownloadGeneratedFiles` not wrapped in `useCallback`
Recreated on every render. Inconsistent with the overall pattern in the component (e.g., `handleCreatePlaybook` is also not wrapped, so this follows existing style, but it's a general perf concern shared across the component).
