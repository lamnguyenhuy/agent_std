import { expect, test } from "@playwright/test"

test("renders the Sample Repo as the primary workspace", async ({ page }) => {
  await page.goto("/")

  const repoRail = page.getByRole("complementary", { name: "Sample Repo rail" })
  const editor = page.getByRole("region", { name: "Playbook editor" })

  await expect(
    page.getByRole("heading", { name: "Agent Studio", exact: true })
  ).toBeVisible()
  await expect(
    repoRail.getByRole("heading", {
      name: "sample-nextjs-repo",
      exact: true,
    })
  ).toBeVisible()
  await expect(
    editor.getByRole("heading", {
      name: "This repo is ready for a Playbook",
      exact: true,
    })
  ).toBeVisible()
  const createPlaybook = editor.getByRole("button", {
    name: "Create Agent Playbook",
    exact: true,
  })
  await expect(createPlaybook).toBeVisible()
  await expect(createPlaybook).toBeEnabled()
  await createPlaybook.click()
  await expect(
    editor.getByText(".agent-studio/playbook.yaml", { exact: true })
  ).toBeVisible()
  await expect(
    editor.getByRole("heading", { name: "Tool Translators", exact: true })
  ).toBeVisible()
  await expect(
    editor.getByRole("heading", { name: "Skills", exact: true })
  ).toBeVisible()
  await expect(
    editor.getByRole("heading", { name: "Agents", exact: true })
  ).toBeVisible()
  await expect(
    editor.getByRole("heading", { name: "Rules", exact: true })
  ).toBeVisible()
  await expect(
    editor.getByRole("heading", { name: "Context", exact: true })
  ).toBeVisible()
  const sectionCard = (name: "Skills" | "Agents" | "Rules" | "Context") =>
    editor.getByRole("region", { name: `${name} section`, exact: true })

  const rulesSection = sectionCard("Rules")
  const skillsSection = sectionCard("Skills")
  const agentsSection = sectionCard("Agents")
  const contextSection = sectionCard("Context")
  await expect(
    rulesSection.getByText("Editable", { exact: true })
  ).toBeVisible()
  await expect(
    skillsSection.getByText("Imported/read-only", { exact: true })
  ).toBeVisible()
  await expect(
    agentsSection.getByText("Imported/read-only", { exact: true })
  ).toBeVisible()
  await expect(
    contextSection.getByText("Imported/read-only", { exact: true })
  ).toBeVisible()
  await expect(
    rulesSection.getByRole("button", { name: "Add Rule" })
  ).toBeVisible()
  await expect(rulesSection.getByLabel("New rule")).toBeVisible()
  await expect(rulesSection.getByLabel("Rule 1")).toBeVisible()
  await expect(rulesSection.getByLabel("Rule 2")).toBeVisible()
  for (const importedSection of [
    skillsSection,
    agentsSection,
    contextSection,
  ]) {
    await expect(
      importedSection.getByText("MVP read-only", { exact: true })
    ).toBeVisible()
    await expect(
      importedSection.getByRole("button", {
        name: /add|edit|delete|remove|manage|configure/i,
      })
    ).toHaveCount(0)
    await expect(
      importedSection.getByRole("link", {
        name: /add|edit|delete|remove|manage|configure|marketplace|workflow|governance/i,
      })
    ).toHaveCount(0)
    await expect(importedSection.getByRole("textbox")).toHaveCount(0)
    await expect(importedSection.getByRole("combobox")).toHaveCount(0)
    await expect(
      importedSection.getByRole("menuitem", {
        name: /add|edit|delete|remove|manage|configure/i,
      })
    ).toHaveCount(0)
    await expect(
      importedSection.getByText(
        /drag|lifecycle|manage|configure|marketplace|workflow|governance/i
      )
    ).toHaveCount(0)
  }
  await expect(
    skillsSection.getByText("code-review", { exact: true })
  ).toBeVisible()
  await expect(
    skillsSection.getByText("test-writer", { exact: true })
  ).toBeVisible()
  await expect(
    skillsSection.getByText(".claude/skills/code-review.md")
  ).toBeVisible()
  await expect(
    skillsSection.getByText(".claude/skills/test-writer.md")
  ).toBeVisible()
  await expect(
    agentsSection.getByText("workspace-default", { exact: true })
  ).toBeVisible()
  await expect(
    agentsSection.getByText("Repository coding assistant")
  ).toBeVisible()
  await expect(agentsSection.getByText(/CLAUDE\.md/)).toBeVisible()
  await expect(agentsSection.getByText(/\.cursorrules/)).toBeVisible()
  await expect(
    contextSection.getByText("architecture", { exact: true })
  ).toBeVisible()
  await expect(
    contextSection.getByText("conventions", { exact: true })
  ).toBeVisible()
  await expect(
    contextSection.getByText("glossary", { exact: true })
  ).toBeVisible()
  await expect(contextSection.getByText("docs/architecture.md")).toBeVisible()
  await expect(contextSection.getByText("docs/conventions.md")).toBeVisible()
  await expect(contextSection.getByText("docs/glossary.md")).toBeVisible()
  await expect(
    repoRail.getByText("Tool Translators", { exact: true })
  ).toBeVisible()
  await expect(
    repoRail.getByText("Tool adapters", { exact: true })
  ).toHaveCount(0)
  await expect(editor.getByText("Tool adapters", { exact: true })).toHaveCount(
    0
  )
  await expect(page.getByText("Exporter", { exact: true })).toHaveCount(0)

  // Preview Inspector: Tool Translator tabs
  const inspector = page.getByRole("complementary", {
    name: "Preview and Review inspector",
  })
  const claudeCodeTab = inspector.getByRole("tab", { name: "Claude Code" })
  await expect(claudeCodeTab).toBeVisible()
  await expect(claudeCodeTab).toHaveAttribute("aria-selected", "true")
  await expect(inspector.getByRole("tab", { name: "Cursor" })).toBeVisible()
  await expect(inspector.getByRole("tab", { name: "Windsurf" })).toBeVisible()
  await expect(inspector.getByText("CLAUDE.md", { exact: true })).toBeVisible()
  await expect(inspector.getByText(".agent-studio/playbook.yaml")).toBeVisible()
  await expect(inspector.getByText("Agent Playbook is canonical")).toBeVisible()
  await expect(
    inspector.getByText("code-review (.claude/skills/code-review.md)")
  ).toBeVisible()
  await expect(
    inspector.getByText("Use the project standards before editing code.")
  ).toBeVisible()
  const copyGeneratedOutput = inspector.getByRole("button", {
    name: "Copy to clipboard",
  })
  await expect(copyGeneratedOutput).toBeVisible()
  await expect(copyGeneratedOutput).toBeEnabled()

  const previewRule =
    "All UI components must include loading, error, and empty states when applicable."
  const editedPreviewRule =
    "All UI components must include loading, error, and empty states when applicable. Keep the copy terse."
  const initialRuleCount = await rulesSection.getByRole("article").count()
  await rulesSection.getByLabel("New rule").fill(previewRule)
  await rulesSection.getByRole("button", { name: "Add Rule" }).click()
  const addedRuleIndex = initialRuleCount + 1
  const addedRuleInput = rulesSection.getByLabel(`Rule ${addedRuleIndex}`)
  await expect(inspector.getByText(previewRule)).toBeVisible()
  await addedRuleInput.fill(editedPreviewRule)
  await expect(inspector.getByText(editedPreviewRule)).toBeVisible()
  await expect(inspector.getByText(previewRule, { exact: true })).toHaveCount(0)
  await rulesSection
    .getByRole("button", { name: `Remove rule ${addedRuleIndex}` })
    .click()
  await expect(inspector.getByText(editedPreviewRule)).toHaveCount(0)
  await expect(inspector.getByText("CLAUDE.md", { exact: true })).toBeVisible()
  await expect(inspector.getByText(".agent-studio/playbook.yaml")).toBeVisible()
  await expect(
    inspector.getByText("Use the project standards before editing code.")
  ).toBeVisible()
  await expect(inspector.getByRole("note")).toHaveCount(0)

  // Switch to Cursor tab and assert content
  const cursorTab = inspector.getByRole("tab", { name: "Cursor" })
  await cursorTab.click()
  await expect(cursorTab).toHaveAttribute("aria-selected", "true")
  const modernCursorPath = inspector.getByText(".cursor/rules/playbook.mdc", {
    exact: true,
  })
  const legacyCursorPath = inspector.getByText(".cursorrules", {
    exact: true,
  })
  await expect(modernCursorPath).toBeVisible()
  await expect(legacyCursorPath).toBeVisible()
  const modernCursorPathBox = await modernCursorPath.boundingBox()
  const legacyCursorPathBox = await legacyCursorPath.boundingBox()
  expect(modernCursorPathBox).not.toBeNull()
  expect(legacyCursorPathBox).not.toBeNull()
  expect(modernCursorPathBox!.y).toBeLessThan(legacyCursorPathBox!.y)
  await expect(
    inspector.getByText("Generated from .agent-studio/playbook.yaml")
  ).toHaveCount(2)
  await expect(inspector.getByRole("note")).toHaveCount(1)
  await expect(
    inspector.getByText(
      ".cursor/rules is the primary Cursor target. .cursorrules is included as legacy compatibility for the sample."
    )
  ).toHaveCount(2)
  await expect(
    inspector.getByRole("button", { name: "Copy to clipboard" })
  ).toHaveCount(2)

  const cursorPreviewRule =
    "Cursor preview must reflect current Playbook rules immediately."
  const editedCursorPreviewRule =
    "Cursor preview must reflect current Playbook rules immediately. Keep legacy output aligned."
  const cursorRuleCount = await rulesSection.getByRole("article").count()
  await rulesSection.getByLabel("New rule").fill(cursorPreviewRule)
  await rulesSection.getByRole("button", { name: "Add Rule" }).click()
  const cursorRuleIndex = cursorRuleCount + 1
  const cursorRuleInput = rulesSection.getByLabel(`Rule ${cursorRuleIndex}`)
  await expect(inspector.getByText(cursorPreviewRule)).toHaveCount(2)
  await cursorRuleInput.fill(editedCursorPreviewRule)
  await expect(inspector.getByText(editedCursorPreviewRule)).toHaveCount(2)
  await expect(
    inspector.getByText(cursorPreviewRule, { exact: true })
  ).toHaveCount(0)
  await rulesSection
    .getByRole("button", { name: `Remove rule ${cursorRuleIndex}` })
    .click()
  await expect(inspector.getByText(editedCursorPreviewRule)).toHaveCount(0)

  // Switch to Windsurf tab and assert content
  const windsurfTab = inspector.getByRole("tab", { name: "Windsurf" })
  await windsurfTab.click()
  await expect(windsurfTab).toHaveAttribute("aria-selected", "true")
  const windsurfPath = inspector.getByText(".windsurf/rules/playbook.md", {
    exact: true,
  })
  await expect(windsurfPath).toBeVisible()
  await expect(
    inspector.getByText("Generated from .agent-studio/playbook.yaml")
  ).toHaveCount(1)
  await expect(
    inspector.getByRole("button", { name: "Copy to clipboard" })
  ).toHaveCount(1)
  await expect(inspector.getByRole("note")).toHaveCount(0)

  const windsurfPreviewRule =
    "Windsurf preview must reflect current Playbook rules immediately."
  const editedWindsurfPreviewRule =
    "Windsurf preview must reflect current Playbook rules immediately. Keep output deterministic."
  const windsurfRuleCount = await rulesSection.getByRole("article").count()
  await rulesSection.getByLabel("New rule").fill(windsurfPreviewRule)
  await rulesSection.getByRole("button", { name: "Add Rule" }).click()
  const windsurfRuleIndex = windsurfRuleCount + 1
  const windsurfRuleInput = rulesSection.getByLabel(`Rule ${windsurfRuleIndex}`)
  await expect(inspector.getByText(windsurfPreviewRule)).toHaveCount(1)
  await windsurfRuleInput.fill(editedWindsurfPreviewRule)
  await expect(inspector.getByText(editedWindsurfPreviewRule)).toHaveCount(1)
  await expect(
    inspector.getByText(windsurfPreviewRule, { exact: true })
  ).toHaveCount(0)
  await rulesSection
    .getByRole("button", { name: `Remove rule ${windsurfRuleIndex}` })
    .click()
  await expect(inspector.getByText(editedWindsurfPreviewRule)).toHaveCount(0)

  // Switch to Review tab and assert Plan
  const reviewTab = inspector.getByRole("tab", { name: "Review", exact: true })
  await reviewTab.click()
  await expect(reviewTab).toHaveAttribute("aria-selected", "true")
  await expect(
    inspector.getByRole("heading", { name: "Plan", exact: true })
  ).toBeVisible()
  // Plan row 1: canonical playbook
  await expect(
    inspector.getByText(".agent-studio/playbook.yaml", { exact: true })
  ).toBeVisible()
  await expect(
    inspector.getByText("Canonical Playbook", { exact: true })
  ).toBeVisible()
  // Plan row 2: Claude Code
  await expect(inspector.getByText("CLAUDE.md", { exact: true })).toBeVisible()
  // Plan row 3–4: Cursor
  await expect(
    inspector.getByText(".cursor/rules/playbook.mdc", { exact: true })
  ).toBeVisible()
  await expect(
    inspector.getByText(".cursorrules", { exact: true })
  ).toBeVisible()
  // Plan row 5: Windsurf
  await expect(
    inspector.getByText(".windsurf/rules/playbook.md", { exact: true })
  ).toBeVisible()
  // All 5 entries show Modified badge (current translators hardcode kind: "modified")
  await expect(inspector.getByText("Modified")).toHaveCount(5)

  // Rules editor (center panel) still visible after tab switch
  await expect(
    editor.getByRole("heading", { name: "Rules", exact: true })
  ).toBeVisible()
})

test("lets the tech lead add, edit, and remove playbook rules", async ({
  page,
}) => {
  await page.goto("/")

  const editor = page.getByRole("region", { name: "Playbook editor" })
  await editor
    .getByRole("button", {
      name: "Create Agent Playbook",
      exact: true,
    })
    .click()

  const rulesSection = editor.getByRole("region", {
    name: "Rules section",
    exact: true,
  })
  const newRuleInput = rulesSection.getByLabel("New rule")
  const addRule = rulesSection.getByRole("button", { name: "Add Rule" })
  const demoRule =
    "All UI components must include loading, error, and empty states when applicable."
  const editedRule =
    "All UI components must include loading, error, and empty states when applicable. Keep the copy terse."

  const initialRuleCount = await rulesSection.getByRole("article").count()

  await newRuleInput.fill(demoRule)
  await addRule.click()

  const newRuleIndex = initialRuleCount + 1
  const addedRuleInput = rulesSection.getByLabel(`Rule ${newRuleIndex}`)
  await expect(addedRuleInput).toHaveValue(demoRule)
  await expect(rulesSection.getByText("Edited", { exact: true })).toBeVisible()
  await expect(rulesSection.getByText("Imported", { exact: true })).toHaveCount(
    initialRuleCount
  )

  await addedRuleInput.fill(editedRule)
  await expect(addedRuleInput).toHaveValue(editedRule)

  // Validation: clear the added rule and assert inline error appears
  await addedRuleInput.fill("")
  await expect(rulesSection.getByText("Rule cannot be empty.")).toBeVisible()
  // Canonical rule count (articles) stays the same — invalid rule is still in the list
  await expect(rulesSection.getByRole("article")).toHaveCount(newRuleIndex)
  // Type valid text back — error should disappear
  await addedRuleInput.fill(demoRule)
  await expect(rulesSection.getByText("Rule cannot be empty.")).toHaveCount(0)

  await rulesSection
    .getByRole("button", { name: `Remove rule ${newRuleIndex}` })
    .click()
  await expect(rulesSection.getByLabel(`Rule ${newRuleIndex}`)).toHaveCount(0)
})

test("keeps the Sample Repo workspace readable on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/")

  const editor = page.getByRole("region", { name: "Playbook editor" })

  await expect(
    page.getByRole("complementary", { name: "Sample Repo rail" })
  ).toBeVisible()
  await expect(editor).toBeVisible()
  await expect(
    page.getByRole("complementary", {
      name: "Preview and Review inspector",
    })
  ).toBeVisible()
  await expect(
    editor.getByRole("button", {
      name: "Create Agent Playbook",
      exact: true,
    })
  ).toBeVisible()
  await editor
    .getByRole("button", {
      name: "Create Agent Playbook",
      exact: true,
    })
    .click()
  const skillsSection = editor.getByRole("region", {
    name: "Skills section",
    exact: true,
  })
  await expect(
    skillsSection.getByText("MVP read-only", { exact: true })
  ).toBeVisible()
  await expect(
    skillsSection.getByText(".claude/skills/code-review.md")
  ).toBeVisible()

  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth
      )
    )
    .toBe(true)
})
