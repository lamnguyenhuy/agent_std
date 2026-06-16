# Blind Hunter Code Review — Story 4.3

You are an adversarial code reviewer. You receive ONLY the diff below. No project context, no spec, no acceptance criteria. Find bugs, security issues, logic errors, race conditions, and correctness problems. Be harsh. Output findings as a Markdown list with file/line references.

```
diff --git a/src/lib/review/export-readiness.ts b/src/lib/review/export-readiness.ts
new file mode 100644
index 0000000..e69de29
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
+    return {
+      canExport: false,
+      reason: "Create an Agent Playbook before exporting.",
+    }
+  }
+
+  const draftValues = Object.values(ruleTextDrafts)
+  if (draftValues.length > 0 && draftValues.some(isDraftInvalid)) {
+    return {
+      canExport: false,
+      reason: "Fix invalid Rule text before exporting.",
+    }
+  }
+
+  return { canExport: true }
+}

diff --git a/src/lib/review/export-readiness.test.ts b/src/lib/review/export-readiness.test.ts
new file mode 100644
index 0000000..e69de29
--- /dev/null
+++ b/src/lib/review/export-readiness.test.ts
@@ -0,0 +1,73 @@
+import { describe, expect, it } from "vitest"
+import { computeExportReadiness } from "./export-readiness"
+import type { AgentPlaybook } from "@/lib/playbook/schema"
+
+const validPlaybook = {
+  name: "test",
+  version: "1.0",
+  repo: "test",
+  description: "test",
+  skills: [],
+  agents: [],
+  rules: [],
+  context: [],
+  translators: [],
+} satisfies AgentPlaybook
+
+describe("computeExportReadiness", () => {
+  it("returns canExport=false when playbook is null", () => {
+    const result = computeExportReadiness(null, {})
+    expect(result.canExport).toBe(false)
+    expect(result.reason).toBeDefined()
+  })
+
+  it("returns canExport=true when playbook exists and no drafts", () => {
+    const result = computeExportReadiness(validPlaybook, {})
+    expect(result.canExport).toBe(true)
+    expect(result.reason).toBeUndefined()
+  })
+
+  it("returns canExport=false when a draft has empty text", () => {
+    const result = computeExportReadiness(validPlaybook, { "rule-1": "" })
+    expect(result.canExport).toBe(false)
+    expect(result.reason).toBeDefined()
+  })
+
+  it("returns canExport=false when a draft has whitespace-only text", () => {
+    const result = computeExportReadiness(validPlaybook, { "rule-1": "   " })
+    expect(result.canExport).toBe(false)
+    expect(result.reason).toBeDefined()
+  })
+
+  it("returns canExport=true when drafts have non-empty text", () => {
+    const result = computeExportReadiness(validPlaybook, { "rule-1": "some valid text" })
+    expect(result.canExport).toBe(true)
+    expect(result.reason).toBeUndefined()
+  })
+
+  it("returns canExport=false when any one of multiple drafts is invalid", () => {
+    const result = computeExportReadiness(validPlaybook, {
+      "rule-1": "valid text",
+      "rule-2": "",
+      "rule-3": "  ",
+    })
+    expect(result.canExport).toBe(false)
+    expect(result.reason).toBeDefined()
+  })
+
+  it("returns canExport=true when all drafts have non-empty text", () => {
+    const result = computeExportReadiness(validPlaybook, {
+      "rule-1": "valid text",
+      "rule-2": "more valid text",
+    })
+    expect(result.canExport).toBe(true)
+    expect(result.reason).toBeUndefined()
+  })
+})

diff --git a/tests/e2e/sample-flow.spec.ts b/tests/e2e/sample-flow.spec.ts
index 26d00d7..d772cb5 100644
--- a/tests/e2e/sample-flow.spec.ts
+++ b/tests/e2e/sample-flow.spec.ts
@@ -418,3 +418,14 @@ test("renders the Sample Repo as the primary workspace", async ({ page }) => {
+  // ── Export readiness assertions (Story 4.3, Task 4) ─────────────────
+  const downloadPatch = page.getByRole("button", { name: /download/i })
+  await expect(downloadPatch).toBeEnabled()
+
+  // Edit Rule 1 to empty string → button disabled
+  await rulesSection.getByLabel("Rule 1").fill("")
+  await expect(downloadPatch).toBeDisabled()
+
+  // Restore valid text → button enabled again
+  await rulesSection.getByLabel("Rule 1").fill("Use the project standards before editing code.")
+  await expect(downloadPatch).toBeEnabled()
```
