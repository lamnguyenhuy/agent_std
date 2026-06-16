import { FolderGit2 } from "lucide-react"

import { DetectedFileRow } from "@/components/workbench/detected-file-row"
import { playbookSectionStatusUi } from "@/components/workbench/playbook-status"
import type { SampleRepoWorkspace } from "@/lib/sample-repo/fixtures"

const sections = [
  { href: "#workspace", label: "Workspace" },
  { href: "#detected-files", label: "Detected files" },
  { href: "#playbook-status", label: "Playbook status" },
  { href: "#preview", label: "Preview" },
]

export function RepoRail({ workspace }: { workspace: SampleRepoWorkspace }) {
  return (
    <aside
      aria-label="Sample Repo rail"
      className="min-h-[240px] rounded-lg border border-border bg-card"
    >
      <div className="border-b border-border px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <FolderGit2
            aria-hidden="true"
            className="size-4 shrink-0 text-primary"
          />
          <div className="min-w-0">
            <h2 className="truncate text-sm leading-tight font-semibold">
              {workspace.name}
            </h2>
            <p className="mt-1 text-xs leading-tight text-muted-foreground">
              Sample Repo
            </p>
          </div>
        </div>
      </div>

      <nav className="border-b border-border p-2" aria-label="Sample Repo">
        <div className="grid gap-1">
          {sections.map((section) => (
            <a
              className="rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              href={section.href}
              key={section.href}
            >
              {section.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="grid gap-3 p-3">
        <section aria-label="Playbook sections">
          <div className="text-xs leading-tight font-semibold text-muted-foreground">
            Playbook sections
          </div>
          <p className="mt-1 px-2 text-[11px] leading-snug text-muted-foreground">
            {workspace.importStatus}
          </p>
          <ul className="mt-2 grid gap-1">
            {workspace.playbookSections.map((section) => (
              <li
                className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm"
                key={section.name}
              >
                <span>{section.name}</span>
                <span className="text-[11px] text-muted-foreground">
                  {playbookSectionStatusUi[section.status].label}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div>
          <div className="text-xs leading-tight font-semibold text-muted-foreground">
            Detected files
          </div>
          <div className="mt-2 grid gap-3">
            {workspace.detectedFileGroups.map((group) => (
              <section key={group.id} aria-label={group.label}>
                <h3 className="px-2 text-[11px] leading-tight font-semibold text-muted-foreground uppercase">
                  {group.label}
                </h3>
                <ul className="mt-1 grid gap-1">
                  {group.files.map((file) => (
                    <DetectedFileRow file={file} key={file.path} />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
