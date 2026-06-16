# Acceptance Auditor — Story 4.3

You are an Acceptance Auditor. Review this diff against the spec and context docs. Check for: violations of acceptance criteria, deviations from spec intent, missing implementation of specified behavior, contradictions between spec constraints and actual code. Output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.

## Spec File: `_bmad-output/implementation-artifacts/4-3-keep-review-surfaces-synchronized-with-rule-edits.md`

### Acceptance Criteria
1. Given the user adds, edits, removes, or invalidates a Rule, when the Playbook state changes, then Tool Translator previews update from the current Playbook.
2. Given the user adds, edits, removes, or invalidates a Rule, when the Playbook state changes, then the Plan updates from the current Playbook and generated artifacts.
3. Given the user adds, edits, removes, or invalidates a Rule, when the Playbook state changes, then the Behavior Diff updates from previous versus current Rules.
4. Given the current Playbook state has invalid Rule text (empty/whitespace-only drafts), when the UI checks export readiness, then the Download Patch button is disabled.
5. Given the current Playbook state is valid (no invalid Rule drafts), when the UI checks export readiness, then the Download Patch button is enabled.
6. Given a valid Playbook state, when the user triggers an export, then updates complete within the 500 ms target for the bundled Sample Repo.

### Key Architecture Constraints
- Derive review state with `useMemo`; do not create duplicate mutable state.
- Keep pure domain modules under `src/lib/review/`.
- Use source-string tests for workbench component contracts.
- Do not implement actual export/patch generation in this story (Stories 4.4, 4.5).
- Do not add backend, API routes, auth, filesystem, or GitHub integration.

## Diff (code changes only)
```
diff --git a/src/lib/review/export-readiness.ts b/src/lib/review/export-readiness.ts
new file mode 100644
--- /dev/null
+++ b/src/lib/review/export-readiness.ts
@@ -0,0 +1,31 @@
+import type { AgentPlaybook } from "@/lib/playbook/schema"
+
+export type ExportReadiness = {
+  canExport: boolean
+  reason?: string
+}
+
+function isDraftInvalid(text: string): boolean {
+  return text.trim().length === 0
+}
+
+export function computeExportReadiness(
+  playbook: AgentPlaybook | null,
+  ruleTextDrafts: Record<string, string>
+): ExportReadiness {
+  if (playbook == null) {
+    return { canExport: false, reason: "Create an Agent Playbook before exporting." }
+  }
+
+  const draftValues = Object.values(ruleTextDrafts)
+  if (draftValues.length > 0 && draftValues.some(isDraftInvalid)) {
+    return { canExport: false, reason: "Fix invalid Rule text before exporting." }
+  }
+
+  return { canExport: true }
+}

diff --git a/src/components/workbench/agent-studio-workbench.tsx b/src/components/workbench/agent-studio-workbench.tsx
--- a/src/components/workbench/agent-studio-workbench.tsx
+++ b/src/components/workbench/agent-studio-workbench.tsx
@@ -26,6 +26,7 @@
+import { computeExportReadiness } from "@/lib/review/export-readiness"
@@ -101,6 +102,10 @@
+  const exportReadiness = useMemo(
+    () => computeExportReadiness(playbook, ruleTextDrafts),
+    [playbook, ruleTextDrafts]
+  )
@@ -213,9 +218,8 @@
-          <Button
-            disabled
-            title="Create an Agent Playbook before downloading a patch"
+          <Button disabled={!exportReadiness.canExport}
+            title={exportReadiness.reason ?? "Download the reviewable patch for this Playbook"}
```

### E2E diff (export readiness portion):
```
+  // ── Export readiness assertions (Story 4.3, Task 4) ─────────────────
+  const downloadPatch = page.getByRole("button", { name: /download/i })
+  await expect(downloadPatch).toBeEnabled()
+  // Edit Rule 1 to empty string → button disabled
+  await rulesSection.getByLabel("Rule 1").fill("")
+  await expect(downloadPatch).toBeDisabled()
+  // Restore valid text → button enabled again
+  await rulesSection.getByLabel("Rule 1").fill("Use the project standards before editing code.")
+  await expect(downloadPatch).toBeEnabled()
```

### Context Docs
- PRD FR-15: "Agent Studio keeps Plan and Behavior Diff synchronized with Rule changes so previews, Plan, Behavior Diff, and export readiness update immediately for the bundled Sample Repo."
- Architecture: "Derive all review state with useMemo; do not store Behavior Diff rows as mutable state."
- Previous Story 4.2 established: BehaviorDiff derivation pattern, initialRules baseline, source-string test pattern.
