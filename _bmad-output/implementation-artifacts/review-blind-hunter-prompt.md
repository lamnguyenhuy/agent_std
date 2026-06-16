# Blind Hunter Code Review — Story 4.2

You are an adversarial code reviewer. You receive ONLY the diff below. No project context, no spec, no acceptance criteria. Find bugs, security issues, logic errors, race conditions, and correctness problems. Be harsh. Output findings as a Markdown list with file/line references.

```
diff --git a/tests/e2e/sample-flow.spec.ts b/tests/e2e/sample-flow.spec.ts
index 26d00d7..d772cb5 100644
--- a/tests/e2e/sample-flow.spec.ts
+++ b/tests/e2e/sample-flow.spec.ts
@@ -309,6 +309,103 @@ test("renders the Sample Repo as the primary workspace", async ({ page }) => {
+  // ── Behavior Diff assertions (Story 4.2, Task 6) ──────────────────
+
+  // Empty state: all temp rules from preview sections were removed
+  await expect(
+    inspector.getByRole("heading", { name: "Behavior Diff", exact: true })
+  ).toBeVisible()
+  await expect(
+    inspector.getByText("No Rule behavior changes yet.", { exact: true })
+  ).toBeVisible()
+  await expect(
+    inspector.getByText(/AI semantic analysis|semantic analysis/i)
+  ).toHaveCount(0)
+
+  // Add a new rule via editor while Review tab is active
+  await rulesSection.getByLabel("New rule").fill("All edge cases must be tested.")
+  await rulesSection.getByRole("button", { name: "Add Rule", exact: true }).click()
+  await expect(rulesSection.getByRole("article")).toHaveCount(3)
+
+  // Behavior Diff shows added rule
+  await expect(
+    inspector.getByText("No Rule behavior changes yet.", { exact: true })
+  ).toHaveCount(0)
+  await expect(inspector.getByText("+", { exact: true })).toBeVisible()
+  await expect(inspector.getByText("Added", { exact: true })).toBeVisible()
+  await expect(
+    inspector.getByText('Agents must follow: "All edge cases must be tested."')
+  ).toBeVisible()
+  await expect(
+    inspector.getByRole("list", { name: "Behavior Diff" })
+  ).toBeVisible()
+
+  // Edit imported Rule 1
+  const rule1Input = rulesSection.getByLabel("Rule 1")
+  await rule1Input.fill(
+    "Use the project standards before editing code. Keep commits small."
+  )
+
+  // Behavior Diff shows edited rule
+  await expect(inspector.getByText("~", { exact: true })).toBeVisible()
+  await expect(inspector.getByText("Edited", { exact: true })).toBeVisible()
+  await expect(
+    inspector.getByText("Agents must follow updated Rule text.")
+  ).toBeVisible()
+  await expect(
+    inspector.getByText("Use the project standards before editing code.", {
+      exact: true,
+    })
+  ).toBeVisible()
+  await expect(
+    inspector.getByText(
+      "Use the project standards before editing code. Keep commits small.",
+      { exact: true }
+    )
+  ).toBeVisible()
+
+  // Remove edited imported Rule 1 — remaining: Rule 1 (was Rule 2), Rule 2 (added rule)
+  await rulesSection
+    .getByRole("button", { name: "Remove rule 1", exact: true })
+    .click()
+  await expect(rulesSection.getByRole("article")).toHaveCount(2)
+
+  // Behavior Diff shows removed rule (with original text from initialRules baseline)
+  await expect(inspector.getByText("-", { exact: true })).toBeVisible()
+  await expect(inspector.getByText("Removed", { exact: true })).toBeVisible()
+  await expect(
+    inspector.getByText(
+      'Agents no longer must follow: "Use the project standards before editing code."'
+    )
+  ).toBeVisible()
+  // Added rule entry still present
+  await expect(
+    inspector.getByText(/All edge cases must be tested/)
+  ).toBeVisible()
+
+  // Remove the added rule (now at Rule 2 after reindexing)
+  await rulesSection
+    .getByRole("button", { name: "Remove rule 2", exact: true })
+    .click()
+  await expect(rulesSection.getByRole("article")).toHaveCount(1)
+
+  // Re-add original Rule 1 text to restore baseline
+  await rulesSection
+    .getByLabel("New rule")
+    .fill("Use the project standards before editing code.")
+  await rulesSection
+    .getByRole("button", { name: "Add Rule", exact: true })
+    .click()
+  await expect(rulesSection.getByRole("article")).toHaveCount(2)
+
+  // No AI semantic analysis text in inspector
+  await expect(
+    inspector.getByText(/AI semantic analysis|semantic analysis/i)
+  ).toHaveCount(0)
+
+  // Switch to Preview tab
+  await inspector.getByRole("tab", { name: "Preview", exact: true }).click()
+
     // Rules editor (center panel) still visible after tab switch
     await expect(
       editor.getByRole("heading", { name: "Rules", exact: true })
```
