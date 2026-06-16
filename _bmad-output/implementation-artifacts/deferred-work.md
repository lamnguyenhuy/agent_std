## Deferred from: code review of 1-5-generate-draft-agent-playbook-from-detected-files (2026-06-10)

- Imported vs edited visual distinction scope — deferred to Story 2.3 because edited-state visual distinction only becomes meaningful once the Rules editor is active and user-edited Rule styling exists.

## Deferred from: code review of 2-1-display-agent-playbook-sections-in-the-workbench (2026-06-15)

- Preview and Review controls remain disabled after Playbook creation — `src/components/workbench/agent-studio-workbench.tsx:380`; outside Story 2.1 section viewer scope.
- Detected file group summary still says files are ready after import — `src/components/workbench/agent-studio-workbench.tsx:364`; outside Story 2.1 acceptance criteria.
- Disabled tool translators would render without disabled state — `src/components/workbench/agent-studio-workbench.tsx:327`; current generator emits enabled translators only, but schema allows disabled translators.

## Deferred from: code review of 2-3-add-edit-and-remove-playbook-rules (2026-06-15)

- `createAgents` can produce empty `sourcePaths` array if all rules are `edited` with no `sourcePath`, violating `PlaybookAgentSchema.min(1)` — `src/lib/playbook/generate.ts:128`
- `createId` hash collision for paths differing only in non-alphanumeric characters (e.g., `my-rules.md` vs `my_rules.md`) — `src/lib/playbook/generate.ts:35`
- `createRuleId` reserved IDs (`rule-claude-md`, `rule-cursorrules`) can collide with general `createId` output for unusual repo paths — `src/lib/playbook/generate.ts:43`
- `getFileContent` conflates missing file with whitespace-only content via `|| fallback` idiom — `src/lib/playbook/generate.ts:27`
- `assertNoCaseVariantConflicts` does not catch exact duplicate paths, allowing two rules with identical IDs to be generated silently — `src/lib/playbook/generate.ts:169`
- `detectedFileGroups` getter re-executes on every `useMemo` recompute triggered by playbook state changes — `src/components/workbench/agent-studio-workbench.tsx:53`
- `PlaybookContextSchema` has redundant `path` and `sourcePath` fields that can diverge without schema enforcement — `src/lib/playbook/schema.ts:50`
- `sectionStatus` inline function recreated on every render without `useCallback` — `src/components/workbench/agent-studio-workbench.tsx:75`
- Aria-labels for rule textareas shift by index after deletion (e.g., "Rule 3" becomes "Rule 2"), making screen reader navigation unreliable after removes — `src/components/workbench/rules-editor.tsx:83`

## Deferred from: code review of 2-2-show-imported-skills-agents-and-context-as-read-only (2026-06-15)

- Rules is labeled editable before Rules editing controls exist — `src/components/workbench/agent-studio-workbench.tsx:271`; deferred to Story 2.3, which owns add/edit/remove Rules behavior.
- Sprint status has stale header metadata comment — `_bmad-output/implementation-artifacts/sprint-status.yaml:2`; pre-existing tracking metadata inconsistency, outside Story 2.2 UI scope.

## Deferred from: code review of 2-4-validate-rule-editing-and-preserve-accessible-interaction (2026-06-15)

- Không giới hạn độ dài input — rule text có thể quá dài `[update-rules.ts:4]`
- Magic strings bị hardcode — tên section dễ vỡ `[agent-studio-workbench.tsx:73]`
- Button disabled không truy cập được title bằng screen reader `[agent-studio-workbench.tsx:186]`
- Xử lý lỗi hời hợt — không có telemetry/log khi catch error `[agent-studio-workbench.tsx:163]`
- Unit test coverage chưa bao phủ các edge cases phức tạp `[update-rules.test.ts]`
- Mảng `playbook.translators` rỗng không có empty state `[agent-studio-workbench.tsx:429]`

## Deferred from: code review of 3-3-render-cursor-preview (2026-06-15)

- `kind: "modified"` hardcoded for both newly-generated artifacts — same pattern as Story 3.2 Claude Code translator; net-new files that have never existed on disk are semantically `"created"`, not `"modified"` [`src/lib/translators/cursor.ts:62-68`]
- `compatibilityNotes` produced by `cursorTranslator` is not rendered in `TranslatorPreview` — Story 3.5 owns compatibility-note UI; AC 5 satisfied via compatibility text embedded directly in `.cursorrules` artifact content [`src/components/workbench/translator-preview.tsx` — no `compatibilityNotes` rendering path]
- `playbook.rules` null/undefined guard absent in `renderRulesSection` — schema validation enforces array type; no defensive guard in translator [`src/lib/translators/cursor.ts:11-13`]
- `normalizeMarkdownText` collapses all whitespace including intentional inline formatting — deliberate design decision established in Story 3.2; applies to all translators [`src/lib/translators/cursor.ts:7-9`]
- Test assertion `toContain(rule.text)` uses raw fixture text but renderer normalizes it — low risk with controlled sample fixture; normalization behavior covered separately by the normalization test [`src/lib/translators/cursor.test.ts:51-54`]
- `translate()` exceptions propagate uncaught to `useMemo`, crashing the whole preview panel — pre-existing component pattern; no per-translator error boundary in `TranslatorPreview` [`src/components/workbench/translator-preview.tsx:19-25`]
- `compatibilityNotes` message string duplicated in artifact content with no shared constant — Story 3.5 will own note rendering and may consolidate [`src/lib/translators/cursor.ts:50,74-79`]
- E2E rule index `rulesSection.getByLabel(\`Rule ${count + 1}\`)` off-by-one-prone — pre-existing approach from Story 3.2; assumes 1-based label indexing and append-at-end behavior [`tests/e2e/sample-flow.spec.ts:229-231`]

## Deferred from: code review of 3-5-show-compatibility-notes-for-adapted-output (2026-06-15)

- Dark mode: `--warning` and `--warning-surface` only defined in `:root`, not overridden in `.dark` — light-mode amber values render in dark mode (off-palette but visible); acknowledged MVP scope [`src/app/globals.css:71-72`]
- No null/undefined guard on `result.compatibilityNotes` before `.length` — same unguarded pattern as `result.artifacts`; TypeScript type enforces field presence [`src/components/workbench/translator-preview.tsx:78`]
- E2E `toHaveCount(2)` for note message text coupled to cursor.ts artifact content — intentional; fragile if note message and `.cursorrules` artifact text ever diverge [`tests/e2e/sample-flow.spec.ts:217-221`]
- Source-string test `"--warning"` check coincidentally matches `"--warning-surface"` substring — minor limitation of `readFileSync` pattern; consistent with established `agent-studio-workbench.test.ts` approach [`src/components/workbench/translator-preview.test.ts:23`]
- `note.id` React key stability not enforced — current translators use stable hardcoded IDs; future translators to be reviewed on merge [`src/components/workbench/translator-preview.tsx:81`]
- No visible text label "Compatibility note:" — `TriangleAlert` icon satisfies AC4 "without relying on color alone"; `role="note"` provides AT semantic framing [`src/components/workbench/translator-preview.tsx:86-89`]
- Zero-artifact + non-empty notes state untested — no current translator hits this case [`src/components/workbench/translator-preview.tsx:73-93`]
- Claude Code tab note-absence only asserted before Cursor switch, not after returning — coverage gap, not a regression [`tests/e2e/sample-flow.spec.ts:194`]
- No DOM order test for notes after artifacts — implementation correct; positional DOM tests not established pattern [`src/components/workbench/translator-preview.tsx:78`]
- Note container has no `aria-label` — `role="note"` + visible text content sufficient for MVP AT [`src/components/workbench/translator-preview.tsx:82-93`]

## Deferred from: code review of 3-4-render-windsurf-preview (2026-06-15)

- `kind: "modified"` hardcoded for newly-generated artifact — same pre-existing pattern as Claude Code and Cursor translators; `.windsurf/rules/playbook.md` is a net-new file on first generation [`src/lib/translators/windsurf.ts:48`]
- `playbook.repo` containing `—` (em-dash) produces double-separator in the heading `# name — repo` — cosmetic issue in MVP preview; normalizeMarkdownText does not strip em-dashes [`src/lib/translators/windsurf.ts:32`]
- Test `toContain(rule.text)` uses raw fixture text after normalization — pre-existing pattern from Stories 3.2/3.3; low risk with controlled sample fixture data [`src/lib/translators/windsurf.test.ts:50`]
- `playbook.rules` null/undefined guard absent in `renderRulesSection` — schema validation enforces array type; same pre-existing concern as Claude Code and Cursor translators [`src/lib/translators/windsurf.ts:11`]
- `compatibilityNotes` invariant only tested on default playbook, not on empty-rules or normalization branches — function returns `[]` unconditionally so branch coverage adds no value here
- `normalizeMarkdownText` collapses intentional whitespace/formatting — deliberate design decision from Story 3.2; applies to all translators [`src/lib/translators/windsurf.ts:8`]

## Deferred from: code review of 4-3-keep-review-surfaces-synchronized-with-rule-edits (2026-06-16)

- isDraftInvalid zero-width gap — `export-readiness.ts:9`; pre-existing divergence between trim-based and regex-based validation.
- Single generic error message for invalid drafts — `export-readiness.ts:20`; UX enhancement, not a bug.
- Stale draft entries on remove error — `agent-studio-workbench.tsx:174-184`; unlikely in React 18 concurrent mode.
- No committed rules check in export readiness — `export-readiness.ts:14-24`; defensive only.
- Button title swaps semantic role — `agent-studio-workbench.tsx:221-222`; UX pattern.
- useMemo re-derives on every render — `agent-studio-workbench.tsx:105-108`; minor perf, existing pattern.
- No runtime guard on playbook.rules — `export-readiness.ts`; TypeScript sufficient.
- Export readiness ignores initialRules baseline — `export-readiness.ts`; out of scope for ACs 4-5.
- AC 6 500 ms target unverifiable — no benchmark in diff.

## Deferred from: code review of 4-4-export-generated-files-bundle (2026-06-16)

- downloadBlob 100 ms timeout brittle — `download-blob.ts:18-20`; cleanup race in slow browsers.
- Path traversal in archive filename — `generate-bundle.ts:31-32`; playbook.name not sanitized for path chars.
- Silent catch swallows all errors — `agent-studio-workbench.tsx:220-222`; deferred to Story 4.6.
- Re-translates on every click — `agent-studio-workbench.tsx:214-215`; minor perf.
- Race condition bypasses export readiness check — `agent-studio-workbench.tsx:211`; theoretical.
- No loading state during async generation — `agent-studio-workbench.tsx:210-223`; deferred to Story 4.6.
- Date.now() in filename violates NFR-6 determinism — `generate-bundle.ts:32`; cosmetic.
- No guard against rapid multiple clicks — `agent-studio-workbench.tsx:210-223`; low likelihood.
- Duplicate artifact paths overwrite silently — `generate-bundle.ts:28-30`; unlikely.
- Object URL memory leak on rapid calls — `download-blob.ts:8,20`; corner case.

## Deferred from: code review of 4-5-export-reviewable-patch (2026-06-16)

- Hunk boundary trimming edge case — `generate-patch.ts:118`; theoretical.
- LCS DP table O(m×n) memory — `generate-patch.ts:22`; fine for small files.
- Trailing newline / \r\n endings — `generate-patch.ts:17-18`; generated files use LF.
- Archive out of sync with diff — `generate-patch-archive.ts:18-24`; unlikely.
- File paths not escaped — `generate-patch.ts:139-140`; internal paths safe.
- Three-loop pair building fragile — `agent-studio-workbench.tsx:252-266`; functional.
- Archive filename hardcoded — `generate-patch-archive.ts:28`; acceptable for MVP.
