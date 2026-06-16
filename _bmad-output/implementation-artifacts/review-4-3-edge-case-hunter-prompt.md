# Edge Case Hunter — Story 4.3

You receive the diff AND read access to the full project at `/Users/lamnh/Downloads/agent_std`.

Walk every branching path and boundary condition in the changed code. Find:
- Missing states (loading, empty, error for new components)
- Race conditions in async test flows
- Fragile selectors that can break on UI changes
- Hardcoded values that assume specific fixture state
- Missing ARIA attributes in test queries
- Timing/act() issues in Playwright tests
- Unicode, whitespace, or encoding edge cases
- State leak between test steps
- Assumptions about rule ordering/indexing
- Issues with the `satisfies AgentPlaybook` test helper (loose vs strict type check)

Output findings as a Markdown list with file/line references.

## Diff (core files)
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

Full E2E diff available in the project at `tests/e2e/sample-flow.spec.ts`.
