"use client"

import type { BehaviorDiffItem } from "@/lib/review/behavior-diff"
import { cn } from "@/lib/utils"

const markerClassName: Record<BehaviorDiffItem["kind"], string> = {
  added: "text-primary",
  removed: "text-destructive",
  edited: "text-[var(--warning)]",
}

const explicitLabel: Record<
  BehaviorDiffItem["label"],
  BehaviorDiffItem["label"]
> = {
  Added: "Added",
  Removed: "Removed",
  Edited: "Edited",
}

export function BehaviorDiff({ items }: { items: BehaviorDiffItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-md border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
        No Rule behavior changes yet.
      </div>
    )
  }

  return (
    <ul aria-label="Behavior Diff" className="grid gap-2">
      {items.map((item) => (
        <li
          key={item.id}
          className="grid gap-2 rounded-md border border-border bg-background px-3 py-2"
        >
          <div className="flex min-w-0 items-start gap-2">
            <span
              className={cn(
                "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border border-current font-mono text-xs font-semibold",
                markerClassName[item.kind]
              )}
            >
              {item.marker}
            </span>
            <span
              className={cn(
                "shrink-0 text-xs font-semibold",
                markerClassName[item.kind]
              )}
            >
              {explicitLabel[item.label]}
            </span>
            <span className="min-w-0 flex-1 break-words text-sm text-foreground">
              {item.summary}
            </span>
          </div>
          {item.kind === "edited" ? (
            <dl className="grid gap-1 pl-7 text-xs text-muted-foreground">
              <div className="grid gap-1 sm:grid-cols-[4rem_1fr]">
                <dt className="font-medium text-foreground">Before</dt>
                <dd className="break-words">{item.before}</dd>
              </div>
              <div className="grid gap-1 sm:grid-cols-[4rem_1fr]">
                <dt className="font-medium text-foreground">After</dt>
                <dd className="break-words">{item.after}</dd>
              </div>
            </dl>
          ) : null}
        </li>
      ))}
    </ul>
  )
}
