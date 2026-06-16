"use client"

import { useState } from "react"
import { Copy } from "lucide-react"

import { cn } from "@/lib/utils"

type CodePanelProps = {
  content: string
  label: string
  className?: string
}

export async function copyTextToClipboard(content: string): Promise<boolean> {
  if (
    typeof navigator === "undefined" ||
    navigator.clipboard?.writeText == null
  ) {
    return false
  }

  try {
    await navigator.clipboard.writeText(content)
    return true
  } catch {
    return false
  }
}

export function CodePanel({ content, label, className }: CodePanelProps) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">(
    "idle"
  )

  const handleCopy = async () => {
    const copied = await copyTextToClipboard(content)
    setCopyStatus(copied ? "copied" : "failed")
    setTimeout(() => setCopyStatus("idle"), 1500)
  }

  return (
    <div
      aria-label={label}
      className={cn(
        "relative min-w-0 overflow-hidden rounded-md bg-[var(--surface-code)] text-[var(--foreground-code)]",
        className
      )}
      role="region"
    >
      <button
        aria-label="Copy to clipboard"
        className="absolute top-2 right-2 flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
        onClick={handleCopy}
        type="button"
      >
        <Copy aria-hidden="true" className="size-3" />
        {copyStatus === "copied"
          ? "Copied!"
          : copyStatus === "failed"
            ? "Copy failed"
            : "Copy"}
      </button>
      <pre className="overflow-x-auto p-3 font-mono text-xs leading-[1.55]">
        {content}
      </pre>
    </div>
  )
}
