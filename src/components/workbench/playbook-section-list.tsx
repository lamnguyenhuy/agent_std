import { playbookSectionStatusUi } from "@/components/workbench/playbook-status"
import { StatusBadge } from "@/components/workbench/status-badge"
import type { PlaybookSection } from "@/lib/sample-repo/fixtures"

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
        {sections.map((section) => {
          const statusUi = playbookSectionStatusUi[section.status]

          return (
            <li
              className="flex items-center justify-between gap-3 rounded-md border border-border bg-background px-3 py-2"
              key={section.name}
            >
              <span className="text-sm font-medium">{section.name}</span>
              <StatusBadge
                label={statusUi.label}
                variant={statusUi.variant}
              />
            </li>
          )
        })}
      </ul>
    </section>
  )
}
