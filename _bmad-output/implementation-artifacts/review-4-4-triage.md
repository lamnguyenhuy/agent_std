# Triage — Story 4.4

## Normalized + Deduplicated Findings

### 1. Silent catch swallows all errors [blind+auditor]
Location: `agent-studio-workbench.tsx:220-222`
Detail: `catch { // Silently fail }` discards any bundle generation error. User gets no feedback. Deferred to Story 4.6.
Classification: **defer** — intentionally deferred to Story 4.6.

### 2. Re-translates on every click [blind+auditor]
Location: `agent-studio-workbench.tsx:214-215`
Detail: Calls `TRANSLATORS.map(t => t.translate(playbook))` each click. The `plan` useMemo already does this work.
Classification: **defer** — minor perf, acceptable for click-triggered action.

### 3. Race condition bypasses export readiness check [blind+edge]
Location: `agent-studio-workbench.tsx:211`
Detail: Handler only guards `playbook == null`, not `exportReadiness.canExport`. Button's `disabled` prop prevents in practice.
Classification: **defer** — theoretical, prop gates it.

### 4. No loading state during async generation [blind]
Location: `agent-studio-workbench.tsx:210-223`
Detail: No spinner, no button state change during async ZIP generation. Deferred to Story 4.6.
Classification: **defer** — Story 4.6 owns export feedback UX.

### 5. `downloadBlob` 100 ms timeout brittle [blind+edge]
Location: `download-blob.ts:18-20`
Detail: Anchor removed from DOM after 100 ms. Some browsers need anchor to remain for download to start.
Classification: **patch** — increase timeout to 5000 ms or use click-event-driven cleanup.

### 6. `Date.now()` in filename violates NFR-6 determinism [blind+auditor]
Location: `generate-bundle.ts:32`
Detail: `Date.now()` in archive name means same state produces different filenames. PRD requires deterministic generation.
Classification: **defer** — content is deterministic; filename variation is minor. Requires architectural decision on naming convention.

### 7. No guard against rapid multiple clicks [blind]
Location: `agent-studio-workbench.tsx:210-223`
Detail: Async handler doesn't debounce or disable itself. Rapid clicks queue multiple ZIP generations.
Classification: **defer** — low likelihood, acceptable for demo.

### 8. Duplicate artifact paths overwrite silently [edge]
Location: `generate-bundle.ts:28-30`
Detail: If two translators produce artifacts with the same `path`, the second overwrites the first in the ZIP without warning.
Classification: **defer** — unlikely with Claude/Cursor/Windsurf producing different paths.

### 9. Path traversal in archive filename [edge]
Location: `generate-bundle.ts:31-32`
Detail: `playbook.name` only sanitized via `replace(/\s+/g, '-').toLowerCase()`. Special chars like `/`, `..`, `\0` not filtered.
Classification: **patch** — add regex to strip non-alphanumeric chars beyond hyphens/underscores.

### 10. Object URL memory leak on rapid calls [edge]
Location: `download-blob.ts:8,20`
Detail: `URL.revokeObjectURL` delayed by 100 ms timeout. Repeated calls within window leak object URLs.
Classification: **defer** — corner case requiring many rapid calls.

### 11. No `useCallback` wrapper [blind]
Detail: Handler recreated on every render.
Classification: **dismiss** — follows existing component pattern.

### 12. js-yaml quoting [blind]
Detail: `version: '1.0'` quoted due to YAML 1.1 float parsing.
Classification: **dismiss** — correct YAML 1.1 behavior.

### 13. Provenance exact-match dedup [edge]
Detail: `content.includes(PROVENANCE_LINE)` for dedup.
Classification: **dismiss** — theoretical only.

## Summary

| Category | Count |
|----------|-------|
| patch    | 2     |
| defer    | 8     |
| dismiss  | 3     |
