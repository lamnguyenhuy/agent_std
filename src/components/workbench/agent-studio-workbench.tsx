"use client"

import { useMemo, useState } from "react"
import { Download } from "lucide-react"

import { ReviewPanel } from "@/components/workbench/review-panel"
import { TranslatorPreview } from "@/components/workbench/translator-preview"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { generateBehaviorDiff } from "@/lib/review/behavior-diff"
import { generatePlan } from "@/lib/review/plan"
import { validateRuleText } from "@/lib/playbook/update-rules"
import { TRANSLATORS } from "@/lib/translators/index"
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
      files: (group.files ?? []).map((file) => ({
        ...file,
        status: "imported",
      })),
    })),
  }
}

export function AgentStudioWorkbench() {
  const [playbook, setPlaybook] = useState<AgentPlaybook | null>(null)
  const [initialRules, setInitialRules] = useState<
    AgentPlaybook["rules"] | null
  >(null)
  const [playbookError, setPlaybookError] = useState<string | null>(null)
  const [newRuleText, setNewRuleText] = useState("")
  const [ruleTextDrafts, setRuleTextDrafts] = useState<Record<string, string>>(
    {}
  )
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
  const plan = useMemo(() => {
    if (playbook == null) return null
    return generatePlan(
      TRANSLATORS.map((t) => ({
        label: t.label,
        artifacts: t.translate(playbook).artifacts,
      }))
    )
  }, [playbook])
  const behaviorDiff = useMemo(() => {
    if (playbook == null || initialRules == null) return null
    return generateBehaviorDiff(initialRules, playbook.rules)
  }, [initialRules, playbook])
  const sectionStatus = (
    name: Parameters<typeof getPlaybookSectionStatus>[1]
  ) => getPlaybookSectionStatus(workspace.playbookSections, name)
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
        : `rule-user-${Date.now()}-${Math.random().toString(36).slice(2)}`

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
    if (draft !== undefined && draft.trim().length === 0)
      return "Rule cannot be empty."
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
      setInitialRules(nextPlaybook.rules)
      setPlaybookError(null)
      setNewRuleText("")
    } catch (error) {
      setPlaybook(null)
      setInitialRules(null)
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
            {playbook == null ? (
              <TranslatorPreview playbook={null} />
            ) : (
              <Tabs defaultValue="preview">
                <div className="border-b border-border px-4 py-3">
                  <TabsList>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="review">Review</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="preview">
                  <TranslatorPreview playbook={playbook} />
                </TabsContent>
                <TabsContent value="review">
                  <ReviewPanel behaviorDiff={behaviorDiff} plan={plan} />
                </TabsContent>
              </Tabs>
            )}
          </aside>
        </div>
      </div>
    </main>
  )
}
