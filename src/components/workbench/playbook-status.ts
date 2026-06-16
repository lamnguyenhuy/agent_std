import type { PlaybookSectionStatus } from "@/lib/sample-repo/fixtures"

export type StatusBadgeVariant = "accent" | "subtle"

export type StatusUi = {
  label: string
  variant: StatusBadgeVariant
}

export const playbookSectionStatusUi: Record<PlaybookSectionStatus, StatusUi> =
  {
    pending: {
      label: "Pending",
      variant: "subtle",
    },
    imported: {
      label: "Imported/read-only",
      variant: "accent",
    },
    "read-only": {
      label: "Read-only",
      variant: "subtle",
    },
    editable: {
      label: "Editable",
      variant: "accent",
    },
    enabled: {
      label: "Enabled",
      variant: "accent",
    },
  }

export const canonicalPlaybookStatusUi: StatusUi = {
  label: "Generated",
  variant: "accent",
}
