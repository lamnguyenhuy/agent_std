# Triage — Story 4.5

## Deduplicated Findings

### 1. Three translation calls per click [blind+auditor]
Location: `agent-studio-workbench.tsx:244-270`
Detail: `TRANSLATORS.map(t => t.translate(playbook))` called 2-3 times per handler invocation.
Classification: **patch** — compute once and reuse.

### 2. Empty patch when no changes [blind]
Location: `generate-patch.ts:75-77`
Detail: `generatePatchBundle` returns `""` when no diffs. ZIP contains empty `agent-studio.patch`.
Classification: **patch** — add check: skip patch file if empty, or write "(no changes)" message.

### 3. bundleToBlob not reused [blind]
Location: `agent-studio-workbench.tsx:275-276`
Detail: `new Blob([buffer], ...)` inline instead of calling `bundleToBlob` from generate-bundle.
Classification: **patch** — trivial consistency fix.

### 4. Zip slip via artifact paths [edge]
Location: `generate-patch-archive.ts:22`
Detail: `zip.file(artifact.path, ...)` — paths with `../` could write outside intended directory on extraction.
Classification: **patch** — sanitize artifact paths before adding to ZIP.

### 5. Hunk boundary trimming [blind+edge]
Location: `generate-patch.ts:118`
Detail: `hunkEnd -= (unchangedAfter - 3)` — edge case could produce malformed hunks.
Classification: **defer** — theoretical, generated files are small and predictable.

### 6. LCS DP table O(m×n) memory [blind]
Location: `generate-patch.ts:22`
Detail: `(m+1)×(n+1)` integer array for each diff. Fine for small files.
Classification: **defer** — generated artifacts are small (<100 lines).

### 7. Trailing newline / `\r\n` endings [blind+edge]
Location: `generate-patch.ts:17-18`
Detail: `split("\n")` loses trailing newline semantics and leaves `\r` from CRLF.
Classification: **defer** — generated files use consistent LF endings.

### 8. Archive could be out of sync with diff [blind]
Location: `generate-patch-archive.ts:18-24`
Detail: Archive re-serializes current state after diff was computed from previous state.
Classification: **defer** — unlikely race in synchronous event handler.

### 9. File paths not escaped for diff format [blind]
Location: `generate-patch.ts:139-140`
Detail: `a/${filePath}` not escaped. Internal artifact paths are clean.
Classification: **defer** — artifact paths are known safe.

### 10. Three-loop pair building fragile [edge+auditor]
Location: `agent-studio-workbench.tsx:252-266`
Detail: Three separate loops can produce duplicate entries for same path.
Classification: **defer** — functional edge case, unlikely in practice.

### 11. Archive filename hardcoded [blind]
Location: `generate-patch-archive.ts:28`
Detail: `"agent-studio-patch-review.zip"` — no timestamp or version.
Classification: **defer** — acceptable for MVP.

### 12. Translation failure during init [edge]
Location: `agent-studio-workbench.tsx`
Detail: If t.translate throws, `initialGeneratedArtifacts` stays null.
Classification: **dismiss** — caught by try/catch.

## Summary

| Category | Count |
|----------|-------|
| patch    | 4     |
| defer    | 7     |
| dismiss  | 1     |
