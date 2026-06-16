import { CheckCircle2, FileText } from "lucide-react"

import type { DetectedFile } from "@/lib/sample-repo/fixtures"

const statusLabel: Record<DetectedFile["status"], string> = {
  detected: "Detected",
  imported: "Imported",
  ready: "Ready",
}

export function DetectedFileRow({ file }: { file: DetectedFile }) {
  return (
    <li className="flex min-w-0 items-start gap-2 rounded-md px-2 py-1.5">
      <FileText
        aria-hidden="true"
        className="mt-0.5 size-3.5 shrink-0 text-muted-foreground"
      />
      <div className="min-w-0 flex-1">
        <div className="font-mono text-[12px] leading-snug break-all text-foreground">
          {file.path}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-tight text-muted-foreground">
          <span>{file.type}</span>
          <span className="inline-flex items-center gap-1 text-primary">
            <CheckCircle2 aria-hidden="true" className="size-3" />
            {statusLabel[file.status]}
          </span>
        </div>
      </div>
    </li>
  )
}
