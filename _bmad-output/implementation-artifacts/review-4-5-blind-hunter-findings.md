# Blind Hunter — Story 4.5 Findings

## 1. `handleDownloadPatch` translates playbook three times on each click
`agent-studio-workbench.tsx:244-247` builds `currentArtifacts` via `TRANSLATORS.map(t => t.translate(playbook))`, and `:268-270` builds `translatorResults` via the same call. Additionally, `initialGeneratedArtifacts` captured translation at creation. Three translations per click.

## 2. Empty patch when no Rule changes exist
`generatePatchBundle` returns `""` when no diffs are found. The ZIP still includes an empty `agent-studio.patch` file. A reviewer downloading the patch gets a zero-byte file with no indication that nothing changed.

## 3. Archive filename not deterministic
`generate-patch-archive.ts:28`: hardcoded `"agent-studio-patch-review.zip"` (no timestamp unlike 4.4). Different issue: same playbook state always produces same filename, but rapid exports overwrite each other in browser download history.

## 4. Hunk boundary trimming can produce incorrect line counts
`generate-patch.ts:118`: `hunkEnd -= (unchangedAfter - 3)`. If `unchangedAfter - 3` is negative (shouldn't happen given the loop guard, but edge case), `hunkEnd` wraps or goes below `hunkBegin`, producing malformed hunks. Old/new line counts in `@@` lines may also be wrong at boundary conditions.

## 5. LCS DP table O(m×n) memory for large files
`generate-patch.ts:22`: allocates `(m+1)×(n+1)` integer array. For small generated files (<100 lines) this is fine, but a large generated artifact could cause memory pressure since this runs client-side.

## 6. `split("\n")` loses trailing newline semantics
`generate-patch.ts:17-18`: `"content\n".split("\n")` → `["content", ""]`. Files ending with `\n` produce an extra trailing empty-line token. A file with trailing newline vs without will show a spurious diff on the empty last line.

## 7. No handling for Windows `\r\n` line endings
`generate-patch.ts:17-18`: `split("\n")` leaves trailing `\r` on each line. Two files with identical content but different line endings (`\n` vs `\r\n`) produce a full diff on every line.

## 8. `generatePatchArchive` receives `playbook` and `translatorResults` separately but re-serializes both
`generate-patch-archive.ts:18-24`: serializes playbook.yaml and all translator artifacts from the provided `playbook` and `translatorResults`. These represent the *current* state, not the diff baseline. The diff itself was computed before calling this function. If state changes between diff computation and archive creation (unlikely but possible in React), the patch and the archived files are out of sync.

## 9. `downloadBlob` still used directly with `new Blob([buffer], ...)`
`agent-studio-workbench.tsx:275-276`: creates Blob from buffer in the handler rather than using `bundleToBlob` from `generate-bundle.ts`. Minor inconsistency — the helper exists but isn't reused.

## 10. Patch file paths not escaped for spaces/special chars
`generate-patch.ts:139-140`: `a/${filePath}` and `b/${filePath}`. If a file path contains spaces or shell-special characters, the unified diff format won't parse correctly with standard `patch` tool without quoting.
