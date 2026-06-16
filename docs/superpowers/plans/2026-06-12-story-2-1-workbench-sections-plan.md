# Story 2.1 Workbench Sections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the Agent Studio workbench so the generated Playbook renders as explicit glossary-correct sections with `Rules` marked editable and `Skills`, `Agents`, and `Context` marked imported/read-only.

**Architecture:** Keep `AgentStudioWorkbench` as the single client-side state owner, move repeated Playbook presentation into focused workbench components, and derive section metadata from the canonical `playbook` plus fixture-backed workspace data. Use the existing Playwright smoke test as the primary behavior harness, extending it first so the implementation is driven by failing acceptance checks.

**Tech Stack:** Next.js App Router 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui button, Playwright, Vitest

---

**Workspace note:** `/Users/lamnh/Downloads/agent_std` is not currently a git repository, so commit steps are intentionally omitted from this plan.

## File Map

- Modify: `src/lib/sample-repo/fixtures.ts`
  - Rename `Tool adapters` to `Tool Translators`
  - Extend section status typing to support Story 2.1 affordances
- Create: `src/components/workbench/playbook-summary.tsx`
  - Own the canonical `.agent-studio/playbook.yaml` summary card
- Create: `src/components/workbench/playbook-section-list.tsx`
  - Render the glossary-correct section rows and status badges
- Create: `src/components/workbench/imported-section.tsx`
  - Render repeated imported/read-only sections for `Skills`, `Agents`, and `Context`
- Modify: `src/components/workbench/repo-rail.tsx`
  - Show updated section labels and section statuses
- Modify: `src/components/workbench/agent-studio-workbench.tsx`
  - Replace inline Playbook rendering with extracted presentation components
  - Mark `Rules` editable without adding CRUD
- Modify: `tests/e2e/sample-flow.spec.ts`
  - Drive the Story 2.1 acceptance criteria

## Task 1: Lock the Story 2.1 Acceptance Criteria in Playwright

**Files:**
- Modify: `tests/e2e/sample-flow.spec.ts`
- Test: `tests/e2e/sample-flow.spec.ts`

- [ ] **Step 1: Write the failing Playwright assertions for the new section viewer**

Update the existing post-creation assertions so they require the new glossary and affordances:

```ts
  await expect(
    editor.getByRole("heading", { name: "Tool Translators", exact: true })
  ).toBeVisible()
  await expect(
    editor.getByText("Editable", { exact: true }).first()
  ).toBeVisible()
  await expect(
    editor.getByText("Read-only", { exact: true }).first()
  ).toBeVisible()
  await expect(
    repoRail.getByText("Tool Translators", { exact: true })
  ).toBeVisible()
  await expect(page.getByText("Tool adapters", { exact: true })).toHaveCount(0)
```

- [ ] **Step 2: Run the targeted E2E test to verify it fails**

Run:

```bash
pnpm test:e2e tests/e2e/sample-flow.spec.ts --grep "renders the Sample Repo as the primary workspace"
```

Expected:

```text
FAIL ... expected "Tool Translators" or "Editable"/"Read-only" to be visible, but it was not found
```

- [ ] **Step 3: Tighten the assertions for section-level labels instead of generic imported text**

Replace the current generic imported assertion:

```ts
  await expect(
    editor.getByText("Imported", { exact: true }).first()
  ).toBeVisible()
```

with section-focused checks:

```ts
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
```

- [ ] **Step 4: Re-run the targeted E2E test and confirm it is still red for the expected reason**

Run:

```bash
pnpm test:e2e tests/e2e/sample-flow.spec.ts --grep "renders the Sample Repo as the primary workspace"
```

Expected:

```text
FAIL ... expected new section viewer content to be visible
```

## Task 2: Update Section Metadata and Create Presentation Components

**Files:**
- Modify: `src/lib/sample-repo/fixtures.ts`
- Create: `src/components/workbench/playbook-summary.tsx`
- Create: `src/components/workbench/playbook-section-list.tsx`
- Create: `src/components/workbench/imported-section.tsx`
- Test: `tests/e2e/sample-flow.spec.ts`

- [ ] **Step 1: Update the fixture type so the workbench can express Story 2.1 statuses**

Change the section typing in `src/lib/sample-repo/fixtures.ts` to:

```ts
export type PlaybookSectionStatus =
  | "pending"
  | "imported"
  | "read-only"
  | "editable"
  | "enabled"

export type PlaybookSection = {
  name:
    | "Skills"
    | "Agents"
    | "Rules"
    | "Context"
    | "Tool Translators"
  status: PlaybookSectionStatus
}
```

And update the default workspace section list to:

```ts
  playbookSections: [
    { name: "Skills", status: "pending" },
    { name: "Agents", status: "pending" },
    { name: "Rules", status: "pending" },
    { name: "Context", status: "pending" },
    { name: "Tool Translators", status: "pending" },
  ],
```

- [ ] **Step 2: Create the canonical Playbook summary component**

Create `src/components/workbench/playbook-summary.tsx` with:

```tsx
import type { AgentPlaybook } from "@/lib/playbook/schema"

function StatusBadge({
  label,
  tone = "primary",
}: {
  label: string
  tone?: "primary" | "muted"
}) {
  return (
    <span
      className={
        tone === "primary"
          ? "inline-flex rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary"
          : "inline-flex rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
      }
    >
      {label}
    </span>
  )
}

export function PlaybookSummary({ playbook }: { playbook: AgentPlaybook }) {
  return (
    <section
      className="grid gap-4 rounded-md border border-border bg-background p-4"
      id="playbook-summary"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-semibold text-muted-foreground">
            Canonical Playbook
          </div>
          <div className="mt-1 font-mono text-sm font-semibold break-all">
            .agent-studio/playbook.yaml
          </div>
        </div>
        <StatusBadge label="Imported" />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-md border border-border bg-card px-3 py-2 text-sm">
          <div className="text-xs leading-tight text-muted-foreground">Name</div>
          <div className="mt-1 font-medium">{playbook.name}</div>
        </div>
        <div className="rounded-md border border-border bg-card px-3 py-2 text-sm">
          <div className="text-xs leading-tight text-muted-foreground">Version</div>
          <div className="mt-1 font-medium">{playbook.version}</div>
        </div>
        <div className="rounded-md border border-border bg-card px-3 py-2 text-sm">
          <div className="text-xs leading-tight text-muted-foreground">Repo</div>
          <div className="mt-1 font-medium">{playbook.repo}</div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{playbook.description}</p>
      <p className="text-sm text-muted-foreground">
        Native tool files will be generated from this Playbook.
      </p>
    </section>
  )
}
```

- [ ] **Step 3: Create the section status list component**

Create `src/components/workbench/playbook-section-list.tsx` with:

```tsx
import type { PlaybookSection } from "@/lib/sample-repo/fixtures"

const sectionTone = {
  pending: "Pending",
  imported: "Imported",
  "read-only": "Read-only",
  editable: "Editable",
  enabled: "Enabled",
} as const

export function PlaybookSectionList({
  sections,
}: {
  sections: PlaybookSection[]
}) {
  return (
    <section className="rounded-md border border-border bg-card p-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">Agent Playbook sections</h3>
        <span className="text-[11px] text-muted-foreground">
          Glossary-aligned
        </span>
      </div>
      <ul className="mt-3 grid gap-2">
        {sections.map((section) => (
          <li
            className="flex items-center justify-between gap-3 rounded-md border border-border bg-background px-3 py-2"
            key={section.name}
          >
            <span className="text-sm font-medium">{section.name}</span>
            <span className="text-[11px] text-muted-foreground">
              {sectionTone[section.status]}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
```

- [ ] **Step 4: Create the reusable imported/read-only section component**

Create `src/components/workbench/imported-section.tsx` with:

```tsx
import { type ReactNode } from "react"

export function ImportedSection({
  title,
  children,
}: {
  title: "Skills" | "Agents" | "Context"
  children: ReactNode
}) {
  return (
    <section className="rounded-md border border-border bg-card p-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className="inline-flex rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
          Read-only
        </span>
      </div>
      <div className="mt-3">{children}</div>
    </section>
  )
}
```

- [ ] **Step 5: Run TypeScript first-pass validation on the new files**

Run:

```bash
pnpm typecheck
```

Expected:

```text
FAIL with missing imports/usages in agent-studio-workbench.tsx or repo-rail.tsx
```

## Task 3: Rewire the Workbench to Use the Extracted Components

**Files:**
- Modify: `src/components/workbench/agent-studio-workbench.tsx`
- Test: `tests/e2e/sample-flow.spec.ts`

- [ ] **Step 1: Update section derivation so Story 2.1 statuses match the spec**

Replace `derivePlaybookSections` with:

```ts
function derivePlaybookSections(playbook: AgentPlaybook): PlaybookSection[] {
  return [
    {
      name: "Skills",
      status: playbook.skills.length > 0 ? "read-only" : "pending",
    },
    {
      name: "Agents",
      status: playbook.agents.length > 0 ? "read-only" : "pending",
    },
    {
      name: "Rules",
      status: "editable",
    },
    {
      name: "Context",
      status: playbook.context.length > 0 ? "read-only" : "pending",
    },
    {
      name: "Tool Translators",
      status: playbook.translators.some((translator) => translator.enabled)
        ? "enabled"
        : "pending",
    },
  ]
}
```

- [ ] **Step 2: Import and render the new summary and section components**

Add imports:

```tsx
import { ImportedSection } from "@/components/workbench/imported-section"
import { PlaybookSectionList } from "@/components/workbench/playbook-section-list"
import { PlaybookSummary } from "@/components/workbench/playbook-summary"
```

Then replace the current inline `playbook-summary` block with:

```tsx
              {playbook != null ? (
                <div className="grid gap-4">
                  <PlaybookSummary playbook={playbook} />

                  <PlaybookSectionList sections={workspace.playbookSections} />

                  <div className="grid gap-3 lg:grid-cols-2">
                    <ImportedSection title="Skills">
                      <ul className="grid gap-2">
                        {playbook.skills.map((skill) => (
                          <li
                            className="rounded-md border border-border bg-background px-3 py-2"
                            key={skill.id}
                          >
                            <div className="text-sm font-medium">{skill.name}</div>
                            <div className="mt-1 font-mono text-[11px] break-all text-muted-foreground">
                              {skill.sourcePath}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </ImportedSection>

                    <ImportedSection title="Agents">
                      <ul className="grid gap-2">
                        {playbook.agents.map((agent) => (
                          <li
                            className="rounded-md border border-border bg-background px-3 py-2"
                            key={agent.id}
                          >
                            <div className="text-sm font-medium">{agent.name}</div>
                            <div className="mt-1 text-[12px] text-muted-foreground">
                              {agent.role}
                            </div>
                            <div className="mt-1 font-mono text-[11px] break-all text-muted-foreground">
                              {agent.sourcePaths.join(", ")}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </ImportedSection>

                    <section className="rounded-md border border-border bg-card p-3">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold">Rules</h3>
                        <span className="inline-flex rounded-full border border-accent/20 bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent">
                          Editable
                        </span>
                      </div>
                      <ul className="mt-3 grid gap-2">
                        {playbook.rules.map((rule) => (
                          <li
                            className="rounded-md border border-border bg-background px-3 py-2"
                            key={rule.id}
                          >
                            <div className="text-sm">{rule.text}</div>
                            <div className="mt-1 font-mono text-[11px] break-all text-muted-foreground">
                              {"sourcePath" in rule ? rule.sourcePath : ""}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </section>

                    <ImportedSection title="Context">
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
                              {contextItem.path}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </ImportedSection>
                  </div>

                  <section className="rounded-md border border-border bg-card p-3">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold">Tool Translators</h3>
                      <span className="inline-flex rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
                        Enabled
                      </span>
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
                </div>
              ) : null}
```

- [ ] **Step 3: Run the targeted E2E test to verify the implementation turns green**

Run:

```bash
pnpm test:e2e tests/e2e/sample-flow.spec.ts --grep "renders the Sample Repo as the primary workspace"
```

Expected:

```text
PASS
```

- [ ] **Step 4: Refactor any repeated badge markup only if the targeted E2E stays green**

If a tiny local helper is useful, keep it inside `agent-studio-workbench.tsx` or one of the new presentation files. Do not introduce a new domain module for styling only.

Run:

```bash
pnpm test:e2e tests/e2e/sample-flow.spec.ts --grep "renders the Sample Repo as the primary workspace"
```

Expected:

```text
PASS
```

## Task 4: Update the Repo Rail and Finish Regression Coverage

**Files:**
- Modify: `src/components/workbench/repo-rail.tsx`
- Modify: `tests/e2e/sample-flow.spec.ts`
- Test: `tests/e2e/sample-flow.spec.ts`

- [ ] **Step 1: Teach the repo rail about the new section statuses**

Replace the status label map in `src/components/workbench/repo-rail.tsx` with:

```ts
const playbookSectionStatus = {
  enabled: "Enabled",
  imported: "Imported",
  "read-only": "Read-only",
  editable: "Editable",
  pending: "Pending",
} as const
```

- [ ] **Step 2: Verify the repo rail consumes the renamed section value**

Keep the existing section row rendering, but ensure it now receives `Tool Translators` from `workspace.playbookSections` and does not special-case the old string.

The relevant render block should still look like:

```tsx
          <ul className="mt-2 grid gap-1">
            {workspace.playbookSections.map((section) => (
              <li
                className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm"
                key={section.name}
              >
                <span>{section.name}</span>
                <span className="text-[11px] text-muted-foreground">
                  {playbookSectionStatus[section.status]}
                </span>
              </li>
            ))}
          </ul>
```

- [ ] **Step 3: Run the full Playwright file to keep mobile coverage green**

Run:

```bash
pnpm test:e2e tests/e2e/sample-flow.spec.ts
```

Expected:

```text
PASS 2 tests
```

## Task 5: Run Full Verification for Story 2.1

**Files:**
- Verify: `src/components/workbench/agent-studio-workbench.tsx`
- Verify: `src/components/workbench/repo-rail.tsx`
- Verify: `src/components/workbench/playbook-summary.tsx`
- Verify: `src/components/workbench/playbook-section-list.tsx`
- Verify: `src/components/workbench/imported-section.tsx`
- Verify: `src/lib/sample-repo/fixtures.ts`
- Verify: `tests/e2e/sample-flow.spec.ts`

- [ ] **Step 1: Run typecheck**

Run:

```bash
pnpm typecheck
```

Expected:

```text
exit 0
```

- [ ] **Step 2: Run lint**

Run:

```bash
pnpm lint
```

Expected:

```text
exit 0
```

- [ ] **Step 3: Run unit tests**

Run:

```bash
pnpm test
```

Expected:

```text
all vitest suites pass
```

- [ ] **Step 4: Run E2E tests**

Run:

```bash
pnpm test:e2e
```

Expected:

```text
Playwright suite passes
```

- [ ] **Step 5: Run production build**

Run:

```bash
pnpm build
```

Expected:

```text
Next.js production build completes successfully
```

## Spec Coverage Check

- Explicit section viewer for `Skills`, `Agents`, `Rules`, `Context`, `Tool Translators`: covered by Tasks 1-4
- Exact glossary wording: covered by Tasks 1-4
- `Rules` marked editable without CRUD: covered by Task 3
- `Skills`, `Agents`, `Context` marked imported/read-only: covered by Tasks 2-3
- Preserve canonical `.agent-studio/playbook.yaml` flow: covered by Task 3
- Extend Playwright smoke without over-scoping into Story 2.2/2.3: covered by Tasks 1 and 4

## Self-Review

- Placeholder scan: no `TODO`/`TBD` markers remain
- Type consistency: section names and statuses are consistent across fixtures, workbench, rail, and tests
- Scope check: plan stays inside Story 2.1 and does not add rule editing controls or new domain behavior
