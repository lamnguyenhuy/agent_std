"use client"

import { TriangleAlert } from "lucide-react"
import { useMemo } from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodePanel } from "@/components/workbench/code-panel"
import type { AgentPlaybook, ToolId } from "@/lib/playbook/schema"
import { TRANSLATORS } from "@/lib/translators/index"

type TranslatorPreviewProps = {
  playbook: AgentPlaybook | null
  defaultTranslatorId?: ToolId
}

export function TranslatorPreview({
  playbook,
  defaultTranslatorId = "claude-code",
}: TranslatorPreviewProps) {
  const results = useMemo(() => {
    if (playbook == null) return null
    return TRANSLATORS.map((t) => ({
      translator: t,
      result: t.translate(playbook),
    }))
  }, [playbook])

  if (playbook == null || results == null) {
    return (
      <div className="min-w-0 overflow-hidden p-4">
        <Tabs defaultValue={defaultTranslatorId}>
          <TabsList aria-label="Tool Translator tabs">
            {TRANSLATORS.map((t) => (
              <TabsTrigger disabled key={t.id} value={t.id}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="mt-3 rounded-md bg-[var(--surface-code)] p-3 font-mono text-xs leading-[1.55] text-[var(--foreground-code)]">
            Create an Agent Playbook to see previews.
          </div>
        </Tabs>
      </div>
    )
  }

  return (
    <div className="min-w-0 overflow-hidden p-4">
      <Tabs defaultValue={defaultTranslatorId}>
        <TabsList aria-label="Tool Translator tabs">
          {TRANSLATORS.map((t) => (
            <TabsTrigger key={t.id} value={t.id}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {results.map(({ translator, result }) => (
          <TabsContent key={translator.id} value={translator.id}>
            {result.artifacts.length > 0 ? (
              <div className="mt-3 grid gap-3">
                {result.artifacts.map((artifact) => (
                  <div className="grid gap-1" key={artifact.path}>
                    <p className="px-1 font-mono text-xs text-muted-foreground">
                      {artifact.path}
                    </p>
                    <CodePanel
                      content={artifact.content}
                      label={`${translator.label} generated output: ${artifact.path}`}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-3 rounded-md bg-[var(--surface-code)] p-3 font-mono text-xs leading-[1.55] text-[var(--foreground-code)]">
                No artifacts generated.
              </div>
            )}
            {result.compatibilityNotes.length > 0 && (
              <div className="mt-3 grid gap-2">
                {result.compatibilityNotes.map((note) => (
                  <div
                    key={note.id}
                    role="note"
                    className="flex items-start gap-2 rounded-md border border-[var(--warning)] bg-[var(--warning-surface)] px-3 py-2 text-xs text-[var(--warning)]"
                  >
                    <TriangleAlert
                      aria-hidden="true"
                      className="mt-0.5 h-3.5 w-3.5 shrink-0"
                    />
                    <p>{note.message}</p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
