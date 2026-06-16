"use client"

import { StatusBadge } from "@/components/workbench/status-badge"
import type { PlanChange } from "@/lib/review/plan"

export function PlanList({ plan }: { plan: PlanChange[] }) {
  return (
    <ul aria-label="Plan" className="grid gap-2">
      {plan.map((change) => (
        <li
          key={change.path}
          className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2"
        >
          <StatusBadge
            label={change.kind === "added" ? "Added" : "Modified"}
            variant={change.kind === "added" ? "accent" : "subtle"}
          />
          <span className="min-w-0 flex-1 break-all font-mono text-xs text-foreground">
            {change.path}
          </span>
          <span className="shrink-0 text-xs text-muted-foreground">
            {change.label}
          </span>
        </li>
      ))}
    </ul>
  )
}
