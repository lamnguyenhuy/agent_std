import type { ReactNode } from "react"

import { playbookSectionStatusUi } from "@/components/workbench/playbook-status"
import { StatusBadge } from "@/components/workbench/status-badge"
import type { PlaybookSectionStatus } from "@/lib/sample-repo/fixtures"

export function ImportedSection({
  title,
  children,
  readOnlyAffordance,
  status = "read-only",
}: {
  title: string
  children: ReactNode
  readOnlyAffordance?: string
  status?: PlaybookSectionStatus
}) {
  const statusUi = playbookSectionStatusUi[status]

  return (
    <section
      aria-label={`${title} section`}
      className="rounded-md border border-border bg-card p-3"
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">{title}</h3>
        <StatusBadge label={statusUi.label} variant={statusUi.variant} />
      </div>
      {readOnlyAffordance != null ? (
        <p className="mt-2 text-[12px] leading-snug text-muted-foreground">
          <span className="font-medium text-foreground">MVP read-only</span>
          <span> - {readOnlyAffordance}</span>
        </p>
      ) : null}
      <div className="mt-3">{children}</div>
    </section>
  )
}
