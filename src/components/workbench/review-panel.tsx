"use client"

import { BehaviorDiff } from "@/components/workbench/behavior-diff"
import { PlanList } from "@/components/workbench/plan-list"
import type { BehaviorDiffItem } from "@/lib/review/behavior-diff"
import type { PlanChange } from "@/lib/review/plan"

type ReviewPanelProps = {
  plan: PlanChange[] | null
  behaviorDiff: BehaviorDiffItem[] | null
}

export function ReviewPanel({ plan, behaviorDiff }: ReviewPanelProps) {
  if (plan == null || behaviorDiff == null) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Create an Agent Playbook to see the Plan.
      </div>
    )
  }
  return (
    <div className="grid gap-5 p-4">
      <section>
        <h3 className="mb-3 text-sm font-semibold">Plan</h3>
        <PlanList plan={plan} />
      </section>
      <section>
        <div className="mb-3 flex flex-col gap-1">
          <h3 className="text-sm font-semibold">Behavior Diff</h3>
          <p className="text-xs text-muted-foreground">
            Template-based summary from Rule text.
          </p>
        </div>
        <BehaviorDiff items={behaviorDiff} />
      </section>
    </div>
  )
}
