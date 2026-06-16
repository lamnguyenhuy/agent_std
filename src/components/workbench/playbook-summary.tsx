import type { AgentPlaybook } from "@/lib/playbook/schema"
import { canonicalPlaybookStatusUi } from "@/components/workbench/playbook-status"
import { StatusBadge } from "@/components/workbench/status-badge"

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
        <StatusBadge
          label={canonicalPlaybookStatusUi.label}
          variant={canonicalPlaybookStatusUi.variant}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-md border border-border bg-card px-3 py-2 text-sm">
          <div className="text-xs leading-tight text-muted-foreground">Name</div>
          <div className="mt-1 font-medium">{playbook.name}</div>
        </div>
        <div className="rounded-md border border-border bg-card px-3 py-2 text-sm">
          <div className="text-xs leading-tight text-muted-foreground">
            Version
          </div>
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
