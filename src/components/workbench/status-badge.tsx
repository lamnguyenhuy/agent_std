import type { StatusBadgeVariant } from "@/components/workbench/playbook-status"

const statusBadgeClassName = {
  accent:
    "inline-flex rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary",
  subtle:
    "inline-flex rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground",
} as const

export function StatusBadge({
  label,
  variant = "accent",
}: {
  label: string
  variant?: StatusBadgeVariant
}) {
  return <span className={statusBadgeClassName[variant]}>{label}</span>
}
