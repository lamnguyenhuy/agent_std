export type AppError = { code: string; message: string; details?: Record<string, unknown> }
import type { AppError } from "@/lib/errors"

export type Result<T, E = AppError> = { ok: true; data: T } | { ok: false; error: E }
import type { AppError } from "@/lib/errors"
import type { Result } from "@/lib/result"

export function validateRuleText(text: string): Result<string, AppError> {
  const trimmed = text.trim()
  if (trimmed.length === 0) {
    return { ok: false, error: { code: "rule-empty", message: "Rule cannot be empty." } }
  }
  return { ok: true, data: trimmed }
}
import { describe, expect, it } from "vitest"

import { validateRuleText } from "@/lib/playbook/update-rules"

describe("validateRuleText", () => {
  it("returns ok:false for empty string", () => {
    const result = validateRuleText("")
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe("rule-empty")
    }
  })

  it("returns ok:false for whitespace-only string (spaces)", () => {
    const result = validateRuleText("   ")
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe("rule-empty")
    }
  })

  it("returns ok:false for whitespace-only string (newline)", () => {
    const result = validateRuleText("\n")
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe("rule-empty")
    }
  })

  it("returns ok:false for whitespace-only string (tab)", () => {
    const result = validateRuleText("\t")
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe("rule-empty")
    }
  })

  it("returns ok:true with trimmed text for valid input", () => {
    const result = validateRuleText("  valid rule  ")
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data).toBe("valid rule")
    }
  })

  it("returns ok:true with unchanged text when no leading/trailing whitespace", () => {
    const result = validateRuleText("All components must have tests.")
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data).toBe("All components must have tests.")
    }
  })
})
"use client"

import { useMemo, useState } from "react"
import { Download } from "lucide-react"

import { ImportedSection } from "@/components/workbench/imported-section"
import {
  getImportedSectionAffordance,
  getImportedSectionEmptyState,
} from "@/components/workbench/imported-section-state"
import { RulesEditor } from "@/components/workbench/rules-editor"
import { playbookSectionStatusUi } from "@/components/workbench/playbook-status"
import { PlaybookSectionList } from "@/components/workbench/playbook-section-list"
import {
  derivePlaybookSections,
  getPlaybookSectionStatus,
} from "@/components/workbench/playbook-sections"
import { PlaybookSummary } from "@/components/workbench/playbook-summary"
import { RepoRail } from "@/components/workbench/repo-rail"
import { StatusBadge } from "@/components/workbench/status-badge"
import { Button } from "@/components/ui/button"
import { generatePlaybookDraft } from "@/lib/playbook/generate"
import { validateRuleText } from "@/lib/playbook/update-rules"
import type { AgentPlaybook } from "@/lib/playbook/schema"
import {
  sampleRepoFiles,
  sampleRepoWorkspace,
  type SampleRepoWorkspace,
} from "@/lib/sample-repo/fixtures"

function toImportedWorkspace(
  workspace: SampleRepoWorkspace,
  playbook: AgentPlaybook
): SampleRepoWorkspace {
  return {
    ...workspace,
    importStatus: "Imported items are now traced to the canonical Playbook",
    playbookReadiness:
      "Canonical Playbook is ready for review in this workspace",
    playbookSections: derivePlaybookSections(playbook),
    playbookStatus: "Draft Playbook ready",
    detectedFileGroups: workspace.detectedFileGroups.map((group) => ({
      ...group,
      files: group.files.map((file) => ({ ...file, status: "imported" })),
    })),
  }
}

export function AgentStudioWorkbench() {
  const [playbook, setPlaybook] = useState<AgentPlaybook | null>(null)
  const [playbookError, setPlaybookError] = useState<string | null>(null)
  const [newRuleText, setNewRuleText] = useState("")
  const [ruleTextDrafts, setRuleTextDrafts] = useState<Record<string, string>>({})
  const baseWorkspace = sampleRepoWorkspace
  const workspace = useMemo(
    () =>
      playbook == null
        ? baseWorkspace
        : toImportedWorkspace(baseWorkspace, playbook),
    [baseWorkspace, playbook]
  )
  const detectedFileCount = useMemo(
    () =>
      workspace.detectedFileGroups.reduce(
        (total, group) => total + (group.files?.length || 0),
        0
      ),
    [workspace.detectedFileGroups]
  )
  const translatorSection = useMemo(
    () =>
      workspace.playbookSections.find(
        (section) => section.name === "Tool Translators"
      ),
    [workspace.playbookSections]
  )
  const sectionStatus = (name: Parameters<typeof getPlaybookSectionStatus>[1]) =>
    getPlaybookSectionStatus(workspace.playbookSections, name)
  const applyPlaybookUpdate = (
    updater: (current: AgentPlaybook) => AgentPlaybook
  ) => {
    setPlaybook((current) => (current == null ? current : updater(current)))
  }
  const handleAddRule = () => {
    const trimmedRuleText = newRuleText.trim()

    if (trimmedRuleText.length === 0) {
      return
    }

    const ruleId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? `rule-user-${crypto.randomUUID()}`
        : `rule-user-${Date.now()}`

    applyPlaybookUpdate((current) => ({
      ...current,
      rules: [
        ...current.rules,
        {
          id: ruleId,
          origin: "edited",
          text: trimmedRuleText,
        },
      ],
    }))
    setNewRuleText("")
  }
  const getRuleDisplayText = (ruleId: string, ruleText: string): string =>
    ruleTextDrafts[ruleId] !== undefined ? ruleTextDrafts[ruleId] : ruleText
  const getRuleError = (ruleId: string): string | undefined => {
    const draft = ruleTextDrafts[ruleId]
    if (draft !== undefined && draft.trim().length === 0) return "Rule cannot be empty."
    return undefined
  }
  const handleRuleTextChange = (ruleId: string, nextText: string) => {
    const result = validateRuleText(nextText)
    if (!result.ok) {
      setRuleTextDrafts((prev) => ({ ...prev, [ruleId]: nextText }))
      return
    }
    setRuleTextDrafts((prev) => {
      const next = { ...prev }
      delete next[ruleId]
      return next
    })
    applyPlaybookUpdate((current) => ({
      ...current,
      rules: current.rules.map((rule) =>
        rule.id === ruleId
          ? {
              ...rule,
              origin: "edited",
              text: result.data,
            }
          : rule
      ),
    }))
  }
  const handleRemoveRule = (ruleId: string) => {
    setRuleTextDrafts((prev) => {
      const next = { ...prev }
      delete next[ruleId]
      return next
    })
    applyPlaybookUpdate((current) => ({
      ...current,
      rules: current.rules.filter((rule) => rule.id !== ruleId),
    }))
  }
  const handleCreatePlaybook = () => {
    try {
      const nextPlaybook = generatePlaybookDraft(
        baseWorkspace.detectedFileGroups.flatMap((group) => group.files || []),
        sampleRepoFiles,
        baseWorkspace.name
      )

      setPlaybook(nextPlaybook)
      setPlaybookError(null)
      setNewRuleText("")
    } catch (error) {
      setPlaybook(null)
      setPlaybookError(
        error instanceof Error
          ? error.message
          : "Agent Playbook generation failed."
      )
    }
  }

  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="flex min-h-svh flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4">
          <div className="flex min-w-0 items-center gap-3">
            <h1 className="text-[18px] leading-tight font-semibold">
              Agent Studio
            </h1>
            <span className="h-4 w-px bg-border" aria-hidden="true" />
            <span className="truncate text-sm text-muted-foreground">
              {workspace.name}
            </span>
          </div>
          <Button
            disabled
            title="Create an Agent Playbook before downloading a patch"
          >
            <Download aria-hidden="true" />
            Download Patch
          </Button>
        </header>

        <div className="grid flex-1 gap-4 p-4 lg:grid-cols-[280px_minmax(0,1fr)_420px]">
          <RepoRail workspace={workspace} />

          <section
            aria-label="Playbook editor"
            className="min-h-[420px] rounded-lg border border-border bg-card"
            id="playbook-status"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
              <div className="min-w-0">
                <h2 className="text-[18px] leading-tight font-semibold">
                  {playbook == null
                    ? "This repo is ready for a Playbook"
                    : "Canonical Playbook"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {playbook == null
                    ? workspace.description
                    : "Generated from detected files and owned by this repo."}
                </p>
              </div>
              <Button
                className="shrink-0"
                disabled={playbook != null || detectedFileCount === 0}
                onClick={handleCreatePlaybook}
                title={
                  playbook == null
                    ? "Create the canonical Playbook from detected files"
                    : "Draft Playbook already created for this workspace"
                }
              >
                {playbook == null
                  ? "Create Agent Playbook"
                  : "Playbook created"}
              </Button>
            </div>
            <div className="grid gap-3 p-4">
              {playbookError != null ? (
                <div
                  className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                  role="alert"
                >
                  {playbookError}
                </div>
              ) : null}

              <section
                className="grid gap-4 rounded-md border border-border bg-background p-4"
                id="workspace"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-muted-foreground">
                      Current workspace
                    </div>
                    <h3 className="mt-1 font-mono text-base leading-tight font-semibold break-all">
                      {workspace.name}
                    </h3>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="rounded-md border border-border bg-card px-3 py-2 text-sm">
                      <div className="text-xs leading-tight text-muted-foreground">
                        Repo status
                      </div>
                      <div className="mt-1 font-medium">
                        {workspace.repoStatus}
                      </div>
                    </div>
                    <div className="rounded-md border border-border bg-card px-3 py-2 text-sm">
                      <div className="text-xs leading-tight text-muted-foreground">
                        Playbook status
                      </div>
                      <div className="mt-1 font-medium">
                        {workspace.playbookStatus}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid gap-2 text-sm">
                  <p>
                    Agent Studio will turn the detected repo instructions into
                    one Git-native Playbook for this workspace.
                  </p>
                  <p className="font-medium text-primary">
                    {workspace.playbookReadiness}
                  </p>
                </div>
              </section>

              {playbook != null ? (
                <section
                  className="grid gap-4 rounded-md border border-border bg-background p-4"
                  id="playbook-sections"
                >
                  <PlaybookSummary playbook={playbook} />

                  <PlaybookSectionList sections={workspace.playbookSections} />

                  <div className="grid gap-3 lg:grid-cols-2">
                    <ImportedSection
                      readOnlyAffordance={getImportedSectionAffordance(
                        "Skills",
                        playbook.skills.length
                      )}
                      status={sectionStatus("Skills")}
                      title="Skills"
                    >
                      {playbook.skills.length > 0 ? (
                        <ul className="grid gap-2">
                          {playbook.skills.map((skill) => (
                            <li
                              className="rounded-md border border-border bg-background px-3 py-2"
                              key={skill.id}
                            >
                              <div className="text-sm font-medium">
                                {skill.name}
                              </div>
                              <div className="mt-1 font-mono text-[11px] break-all text-muted-foreground">
                                {skill.sourcePath}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {getImportedSectionEmptyState("Skills")}
                        </p>
                      )}
                    </ImportedSection>

                    <ImportedSection
                      readOnlyAffordance={getImportedSectionAffordance(
                        "Agents",
                        playbook.agents.length
                      )}
                      status={sectionStatus("Agents")}
                      title="Agents"
                    >
                      {playbook.agents.length > 0 ? (
                        <ul className="grid gap-2">
                          {playbook.agents.map((agent) => (
                            <li
                              className="rounded-md border border-border bg-background px-3 py-2"
                              key={agent.id}
                            >
                              <div className="text-sm font-medium">
                                {agent.name}
                              </div>
                              <div className="mt-1 text-[12px] text-muted-foreground">
                                {agent.role}
                              </div>
                              <ul className="mt-1 grid gap-1">
                                {agent.sourcePaths.map((sourcePath) => (
                                  <li
                                    className="font-mono text-[11px] break-all text-muted-foreground"
                                    key={sourcePath}
                                  >
                                    {sourcePath}
                                  </li>
                                ))}
                              </ul>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {getImportedSectionEmptyState("Agents")}
                        </p>
                      )}
                    </ImportedSection>

                    <ImportedSection status="editable" title="Rules">
                      <RulesEditor
                        getDisplayText={getRuleDisplayText}
                        getError={getRuleError}
                        newRuleText={newRuleText}
                        onAddRule={handleAddRule}
                        onNewRuleTextChange={setNewRuleText}
                        onRemoveRule={handleRemoveRule}
                        onRuleTextChange={handleRuleTextChange}
                        rules={playbook.rules}
                      />
                    </ImportedSection>

                    <ImportedSection
                      readOnlyAffordance={getImportedSectionAffordance(
                        "Context",
                        playbook.context.length
                      )}
                      status={sectionStatus("Context")}
                      title="Context"
                    >
                      {playbook.context.length > 0 ? (
                        <ul className="grid gap-2">
                          {playbook.context.map((contextItem) => (
                            <li
                              className="rounded-md border border-border bg-background px-3 py-2"
                              key={contextItem.id}
                            >
                              <div className="text-sm font-medium">
                                {contextItem.label}
                              </div>
                              <div className="mt-1 font-mono text-[11px] break-all text-muted-foreground">
                                {contextItem.sourcePath}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {getImportedSectionEmptyState("Context")}
                        </p>
                      )}
                    </ImportedSection>
                  </div>

                  <section className="rounded-md border border-border bg-card p-3">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold">
                        Tool Translators
                      </h3>
                      <StatusBadge
                        label={
                          playbookSectionStatusUi[
                            translatorSection?.status ?? "pending"
                          ].label
                        }
                        variant={
                          playbookSectionStatusUi[
                            translatorSection?.status ?? "pending"
                          ].variant
                        }
                      />
                    </div>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {playbook.translators.map((translator) => (
                        <li
                          className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                          key={translator.tool}
                        >
                          {translator.tool}
                        </li>
                      ))}
                    </ul>
                  </section>
                </section>
              ) : null}

              <section
                className="rounded-md border border-border bg-background p-4"
                id="detected-files"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold">
                      Detected file areas
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Detected {detectedFileCount} agent instruction files and
                      docs in controlled demo data.
                    </p>
                  </div>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {workspace.detectedFileGroups.map((group) => (
                    <div
                      className="rounded-md border border-border bg-card p-3"
                      key={group.id}
                    >
                      <div className="text-xs font-semibold text-muted-foreground">
                        {group.label}
                      </div>
                      <div className="mt-2 text-sm font-medium">
                        {group.files.length} ready
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </section>

          <aside
            aria-label="Preview and Review inspector"
            className="min-h-[420px] rounded-lg border border-border bg-card"
            id="preview"
          >
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <Button
                disabled
                size="sm"
                title="Preview is available after Playbook creation"
                variant="secondary"
              >
                Preview
              </Button>
              <Button
                disabled
                size="sm"
                title="Review is available after Playbook creation"
                variant="ghost"
              >
                Review
              </Button>
            </div>
            <div className="p-4">
              <div className="rounded-md bg-[var(--surface-code)] p-3 font-mono text-xs leading-[1.55] text-[var(--foreground-code)]">
                {playbook == null
                  ? "Preview"
                  : "Generated native tool files remain outputs, not the source of truth."}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/workbench/status-badge"
import type { PlaybookRule } from "@/lib/playbook/schema"

const ruleOriginUi = {
  edited: {
    label: "Edited",
    variant: "accent",
  },
  imported: {
    label: "Imported",
    variant: "subtle",
  },
} as const

type RulesEditorProps = {
  getDisplayText: (ruleId: string, ruleText: string) => string
  getError: (ruleId: string) => string | undefined
  newRuleText: string
  onAddRule: () => void
  onNewRuleTextChange: (value: string) => void
  onRemoveRule: (ruleId: string) => void
  onRuleTextChange: (ruleId: string, value: string) => void
  rules: PlaybookRule[]
}

export function RulesEditor({
  getDisplayText,
  getError,
  newRuleText,
  onAddRule,
  onNewRuleTextChange,
  onRemoveRule,
  onRuleTextChange,
  rules,
}: RulesEditorProps) {
  return (
    <div className="grid gap-4">
      <form
        className="grid gap-3 rounded-md border border-border bg-card p-3"
        onSubmit={(event) => {
          event.preventDefault()
          onAddRule()
        }}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs font-semibold text-muted-foreground">
              Add rule
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              New rules are stored as user-edited Playbook content.
            </p>
          </div>
          <Button className="shrink-0" type="submit" variant="secondary">
            Add Rule
          </Button>
        </div>
        <textarea
          aria-label="New rule"
          className="min-h-[96px] w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          onChange={(event) => onNewRuleTextChange(event.target.value)}
          placeholder="Add a new Playbook rule"
          value={newRuleText}
        />
      </form>

      <div className="grid gap-3">
        {rules.map((rule, index) => {
          const originUi = ruleOriginUi[rule.origin] ?? ruleOriginUi.edited
          const errorMessage = getError(rule.id)
          const inputId = `rule-input-${rule.id}`
          const errorId = `rule-error-${rule.id}`

          return (
            <article
              className="grid gap-3 rounded-md border border-border bg-background p-3"
              key={rule.id}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs font-semibold text-muted-foreground">
                  Rule {index + 1}
                </div>
                <StatusBadge
                  label={originUi.label}
                  variant={originUi.variant}
                />
              </div>
              <textarea
                aria-describedby={errorMessage ? errorId : undefined}
                aria-invalid={!!errorMessage}
                aria-label={`Rule ${index + 1}`}
                className="min-h-[112px] w-full resize-none rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                id={inputId}
                onChange={(event) =>
                  onRuleTextChange(rule.id, event.target.value)
                }
                value={getDisplayText(rule.id, rule.text)}
              />
              {errorMessage ? (
                <p
                  className="text-sm text-destructive"
                  id={errorId}
                  role="alert"
                >
                  {errorMessage}
                </p>
              ) : null}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0 font-mono text-[11px] break-all text-muted-foreground">
                  {rule.sourcePath ?? "Added in this Playbook"}
                </div>
                <Button
                  className="shrink-0"
                  onClick={() => onRemoveRule(rule.id)}
                  size="sm"
                  type="button"
                  variant="destructive"
                >
                  Remove rule {index + 1}
                </Button>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
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
  await expect(rulesSection.getByRole("button", { name: "Add Rule" })).toBeVisible()
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
    await expect(
      importedSection.getByRole("textbox")
    ).toHaveCount(0)
    await expect(
      importedSection.getByRole("combobox")
    ).toHaveCount(0)
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
  await expect(
    editor.getByText("Tool adapters", { exact: true })
  ).toHaveCount(0)
  await expect(page.getByText("Exporter", { exact: true })).toHaveCount(0)
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
  await expect(rulesSection.getByText("Imported", { exact: true })).toHaveCount(initialRuleCount)

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

  await rulesSection.getByRole("button", { name: `Remove rule ${newRuleIndex}` }).click()
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
